"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTables = getTables;
exports.generateResources = generateResources;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Fonction pour récupérer les tables
function getTables(AppDataSource) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield AppDataSource.initialize();
            console.log("✅ Connecté à la base de données.");
            const tables = yield AppDataSource.query("SHOW TABLES");
            return tables.map((row) => Object.values(row)[0]);
        }
        catch (error) {
            console.error("❌ Erreur de connexion:", error);
            return [];
        }
        finally {
            yield AppDataSource.destroy();
        }
    });
}
// Fonction pour générer les ressources NestJS
function generateResources(tables) {
    tables.forEach((table) => {
        const command = `nest g resource ${table} --no-spec`;
        console.log(`🚀 Génération de la ressource pour ${table}...`);
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
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
function updateServiceFile(table) {
    const className = table.charAt(0).toUpperCase() + table.slice(1); // Ex: users -> User
    const projectRoot = process.cwd();
    const serviceDirPath = path_1.default.join(projectRoot, 'src', table);
    const serviceFilePath = path_1.default.join(serviceDirPath, `${table}.service.ts`);
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
        fs_1.default.writeFileSync(serviceFilePath, content);
        console.log(`✅ ${table}.service.ts mis à jour avec TypeORM`);
    }, 3000);
}
