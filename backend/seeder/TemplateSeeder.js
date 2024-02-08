const templates = require('../database/templates.json')

const TemplateSeeder = async (database) => {
    try {
        const collection = database.collection('templates');
        const templatesData = [];
        for (let i = 0; i < templates.length; i++) {
            const template = templates[i];
            templatesData.push({
                ...template,
                status: "publish",
                createdAt: new Date(),
                updateAt: new Date()
            });
        }
        await refreshAndInsertTemplates(collection, templatesData);  
    } catch (e) {
        console.log(e);
    }
}

const refreshAndInsertTemplates = async (collection, insertedData) => {
    if(insertedData.length) {
        await collection.deleteMany({});
        return await collection.insertMany(insertedData); 
    }
    return false;
}

module.exports = TemplateSeeder;