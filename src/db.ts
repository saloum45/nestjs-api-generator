import { DataSource } from "typeorm";
import { exec } from "child_process";

// Configuration de la base de données
const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "nestapp",
});

// Fonction pour récupérer les tables
export async function getTables(): Promise<string[]> {
  try {
    await AppDataSource.initialize();
    console.log("✅ Connecté à la base de données.");

    const tables = await AppDataSource.query("SHOW TABLES");

    return tables.map((row: any) => Object.values(row)[0]);
  } catch (error) {
    console.error("❌ Erreur de connexion:", error);
    return [];
  } finally {
    await AppDataSource.destroy();
  }
}

// Fonction pour générer les ressources NestJS
export function generateResources(tables: string[]) {
  tables.forEach((table) => {
    const command = `nest g resource ${table} --no-spec`;
    console.log(`🚀 Génération de la ressource pour ${table}...`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Erreur pour ${table}:`, error.message);
        return;
      }
      if (stderr) {
        console.error(`⚠️  Avertissement pour ${table}:`, stderr);
      }
      console.log(`✅ ${table} généré avec succès!\n${stdout}`);
    });
  });
}
