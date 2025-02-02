import { exec } from "child_process";
import fs from 'fs';
import path from 'path';

// Fonction pour récupérer les tables
export async function getTables(AppDataSource: any): Promise<string[]> {
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
      // Modifier le service après la génération
      updateServiceFile(table);
    });
  });
}


// Fonction pour ajouter la logique crud de base dans chaque service
function updateServiceFile(table: string) {
  const className = table.charAt(0).toUpperCase() + table.slice(1); // Ex: users -> User
  const projectRoot = process.cwd();
  const serviceDirPath = path.join(projectRoot, 'src', table);
  const serviceFilePath = path.join(serviceDirPath, `${table}.service.ts`);
  const entityName = className;
  const dtoCreate = `Create${className}Dto`;
  const dtoUpdate = `Update${className}Dto`;

  const content = `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${entityName} } from './entities/${table}.entity';
import { ${dtoCreate} } from './dto/create-${table}.dto';
import { ${dtoUpdate} } from './dto/update-${table}.dto';

@Injectable()
export class ${className}Service {
  constructor(
    @InjectRepository(${entityName})
    private ${table}Repository: Repository<${entityName}>,
  ) {}

  create(create${className}Dto: ${dtoCreate}) {
    return this.${table}Repository.save(create${className}Dto);
  }

  findAll() {
    return this.${table}Repository.find();
  }

  findOne(id: number) {
    return this.${table}Repository.findOne({ where: { id } });
  }

  update(id: number, update${className}Dto: ${dtoUpdate}) {
    return this.${table}Repository.update(id, update${className}Dto);
  }

  remove(id: number) {
    return this.${table}Repository.delete(id);
  }
}`;

  // Remplacement du fichier
  setTimeout(() => {
    fs.writeFileSync(serviceFilePath, content);
    console.log(`✅ ${table}.service.ts mis à jour avec TypeORM`);
  }, 3000);
}

