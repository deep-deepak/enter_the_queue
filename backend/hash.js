
const bcrypt = require("bcrypt")

class Hash {
    static encryption = bcrypt;

    static make = async (text, salt = 10) => {
        return await bcrypt.hash(text, salt);
    }

    static check = async (text, hash) => {
        return await bcrypt.compare(text, hash)
    }

    static getRandomPassword = (count = 16) => {
        const letter = "0123456789ABCDEFGHIJabcdefghijklmnopqrstuvwxyzKLMNOPQRSTUVWXYZ0123456789abcdefghiABCDEFGHIJKLMNOPQRST0123456789jklmnopqrstuvwxyz";
        let randomString = "";
        for (let i = 0; i < count; i++) {
            const randomStringNumber = Math.floor(1 + Math.random() * (letter.length - 1));
            randomString += letter.substring(randomStringNumber, randomStringNumber + 1);
        }
        return randomString
    }
}
module.exports = Hash;