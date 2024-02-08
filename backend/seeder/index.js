var MongoClient = require('mongodb').MongoClient;
var CategorySeeder = require('./CategorySeeder');
var UserSeeder = require('./UserSeeder');
var envVariables = require('../../variables.json');
const TemplateSeeder = require('./TemplateSeeder');

const arguments = process.argv.slice(2) || [];
const [param1 = ""] = arguments;
const refresh = param1 == "refresh" ? true : false;

const MONGODB_URI = envVariables.MONGODB_URI || "mongodb://127.0.0.1:27017";
const MONGODB_NAME = envVariables.MONGODB_NAME || "enter-the-queue";

let seeders = [
    CategorySeeder,
    UserSeeder,
    TemplateSeeder
];
if (!refresh) {
    const [slug = "", collection = ""] = param1?.trim()?.split(":") || [];
    if(slug?.trim() == "only") {
        if(collection.trim() == "categories") {
            seeders = [CategorySeeder];
        } else if(collection.trim() == "users") {
            seeders = [UserSeeder];
        } else if(collection.trim() == "templates") {
            seeders = [TemplateSeeder];
        }
    }
}

async function runSeeders() {
    let DB_URI = MONGODB_URI.slice(-1) === "/" ? MONGODB_URI.slice(0, -1) : MONGODB_URI;
    DB_URI = MONGODB_NAME.slice(0) == "/" ? `${DB_URI.trim()}/${MONGODB_NAME.slice(1)}` : `${DB_URI}/${MONGODB_NAME}`;
    const client = await MongoClient.connect(DB_URI, {});
    const db = client.db(MONGODB_NAME);
    if (refresh) {
        await db.dropDatabase();
    }
    for (let index = 0; index < seeders.length; index++) {
        await seeders[index](db);
    }
    await client.close();
}

runSeeders();
