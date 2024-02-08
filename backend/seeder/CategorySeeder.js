const categories = require('../database/categories.json')

const CategorySeeder = async (database) => {
    try {
        const collection = database.collection('categories');
        const categoriesData = categories.map((category) => {
            return {
                ...category,
                status: true,
                createdAt: new Date(),
                updateAt: new Date()
            }
        })
        await refreshAndInsertCollections(collection, categoriesData);  
    } catch (e) {
        console.log(e);
    }
}

const refreshAndInsertCollections = async (collection, insertedData) => {
    if(insertedData.length) {
        await collection.deleteMany({});
        return await collection.insertMany(insertedData); 
    }
    return false;
}

module.exports = CategorySeeder;