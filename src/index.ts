import { getTables, generateResources } from "./db";

async function main() {
  console.log("🔍 Détection des tables...");
  
  const tables = await getTables();
  
  if (tables.length > 0) {
    console.log("📌 Tables détectées :", tables);
    generateResources(tables);
  } else {
    console.log("⚠️ Aucune table trouvée.");
  }
}

main();
