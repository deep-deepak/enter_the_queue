const users = require('../database/users.json')
const Hash = require('../hash')

const UserSeeder = async (database) => {
    try {
        const collection = database.collection('users');
        const usersData = [];
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const hashPassword = await Hash.make(user.password);
            usersData.push({
                ...user,
                password: hashPassword,
                status: true,
                createdAt: new Date(),
                updateAt: new Date()
            });
        }
        await refreshAndInsertUsers(collection, usersData);  
    } catch (e) {
        console.log(e);
    }
}

const refreshAndInsertUsers = async (collection, insertedData) => {
    if(insertedData.length) {
        await collection.deleteMany({});
        return await collection.insertMany(insertedData); 
    }
    return false;
}

module.exports = UserSeeder;