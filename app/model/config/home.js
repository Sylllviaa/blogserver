// 关于管理

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const HomeSchema = new Schema({
        introduction: {
            type: 'string',
            min: 1,
            max: 150,
        },
        effects: {
            type: 'boolean',
            default: false,
        },
        homeBgImg: {
            type: 'array',
            itemType: 'object',
        },
        archiveBgImg: {
            type: 'array',
            itemType: 'object',
        },
        categoriesBgImg: {
            type: 'array',
            itemType: 'object',
        },
        categoriesDetailBgImg: {
            type: 'array',
            itemType: 'object',
        },
        tagsBgImg: {
            type: 'array',
            itemType: 'object',
        },
        tagsDetailBgImg: {
            type: 'array',
            itemType: 'object',
        },
        aboutBgImg: {
            type: 'array',
            itemType: 'object',
        },
        articlesBgImg: {
            type: 'array',
            itemType: 'object',
        },
        createTime: {
            type: 'number',
            default: 0,
        },
        updateTime: {
            type: 'number',
            default: 0,
        },
    }, {
        collection: "home",
        versionKey: false,
    });

    return mongoose.model('Home', HomeSchema);
}