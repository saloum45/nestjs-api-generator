# Générer votre api nestjs avec ce package 🔥🚀🚀🚀: 
Il se base sur les tables de la base de données afin de générer une ressource (TDO,ENTITIES,SERVICE,CONTROLLER,MODULE) pour chaque table.

## comment ça marche : 

### Installation du package : 
```
npm i nestjs-generate-api
```
### Configuration de la base de données
##### Préparation du fichier .inv : 
```
npm install @nestjs/config
```
Créer un fichier .env dans la racine du projet, coller le code qui suit et adapter selon votre base de données: 
```
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=
```

### Lancer le générateur : 
```
npx nestjs-generate-api
```
