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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTables = getTables;
exports.generateResources = generateResources;
const child_process_1 = require("child_process");
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
        });
    });
}
