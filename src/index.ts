import { DataSource } from "typeorm";
import { getTables, generateResources } from "./db";


// Configuration de la base de données
const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "nestapp",
});


async function main() {
    console.log("🔍 Détection des tables...");

    const tables = await getTables(AppDataSource);

    if (tables.length > 0) {
        console.log("📌 Tables détectées :", tables);
        generateResources(tables);
    } else {
        console.log("⚠️ Aucune table trouvée.");
    }
}

main();
