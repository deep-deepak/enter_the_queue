var MongoClient = require('mongodb').MongoClient;
const User = require('./User');
var envVariables = require('../../variables.json');

const arguments = process.argv?.slice(2) || [];
let [param1 = "", param2 = "", param3 = ""] = arguments;


const MONGODB_URI = envVariables.MONGODB_URI || "mongodb://127.0.0.1:27017";
const MONGODB_NAME = envVariables.MONGODB_NAME || "enter-the-queue";

async function runCommands() {
    let DB_URI = MONGODB_URI.slice(-1) === "/" ? MONGODB_URI.slice(0, -1) : MONGODB_URI;
    DB_URI = MONGODB_NAME.slice(0) == "/" ? `${DB_URI.trim()}/${MONGODB_NAME.slice(1)}` : `${DB_URI}/${MONGODB_NAME}`;
    const client = await MongoClient.connect(DB_URI, {});
    const db = client.db(MONGODB_NAME);

    const [command, value] = param1.split("=");
    const user = new User(db);
    switch (command) {
        case "set:role":
            await user.setRoleWithWalletAddress(param2, value, param3);
            break;
        case "create:user":
            await user.createOrUpdateUserByEmail(param2, value, param3);
            break;
        case "createOrUpdate:user":
            await user.createOrUpdateUserByEmail(param2, value, true);
            break;
    
        default:
            console.error('Command not found!');
            break;
    }
    await client.close();
}

runCommands();
