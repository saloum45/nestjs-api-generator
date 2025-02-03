#!/usr/bin/env node
import { DataSource, DataSourceOptions } from "typeorm";
import { getTables, generateResources } from "./db";


// Configuration de la base de données
const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any, // Cast nécessaire pour TypeORM
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    synchronize: false,
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
