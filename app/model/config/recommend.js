// 关于管理

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const RecommendSchema = new Schema({
        project: {
            type: String,  // 1=电影，2=电视剧，3=音乐，4=网站
        },
        name: {
            type: String,
            min: 1,
            max: 50,
        },
        link: {
            type: String,
        },
        platform: {
            type: String,
            min: 1,
            max: 20,
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
        collection: "recommend",
        versionKey: false,
    });

    return mongoose.model('Recommend', RecommendSchema);
}