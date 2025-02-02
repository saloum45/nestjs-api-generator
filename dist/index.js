#!/usr/bin/env node
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
const typeorm_1 = require("typeorm");
const db_1 = require("./db");
// Configuration de la base de données
const AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "nestapp",
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🔍 Détection des tables...");
        const tables = yield (0, db_1.getTables)(AppDataSource);
        if (tables.length > 0) {
            console.log("📌 Tables détectées :", tables);
            (0, db_1.generateResources)(tables);
        }
        else {
            console.log("⚠️ Aucune table trouvée.");
        }
    });
}
main();
