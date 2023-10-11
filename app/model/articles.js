// 文章管理

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const ArticlesSchema = new Schema({
        title: {
            type: 'string',
            min: 2,
            max: 100,
        },
        cover: {
            type: 'string',
        },
        introduction: {
            type: 'string',
            min: 10,
            max: 500,
        },
        categories: {
            type: 'string',
        },
        tags: {
            type: 'array',
            itemType: 'string',
        },
        content: {
            type: 'string',
        },
        views: {
            type: 'number',
            default: 0,
        },
        comment: {
            type: 'number',
            default: 0,
        },
        like: {
            type: 'number',
            default: 0,
        },
        collect: {
            type: 'number',
            default: 0,
        },
        isComment: {
            //是否开启评论
            type: 'boolean',
            default: true,
        },
        isLike: {
            //是否开启点赞
            type: 'boolean',
            default: true,
        },
        isCollect: {
            //是否开启收藏
            type: 'boolean',
            default: true,
        },
        isReward: {
            //是否开启打赏
            type: 'boolean',
            default: true,
        },
        status: {
            type: 'string',
            default: '1',   //1=启用，2=停用
        },
        publishStatus: {
            type: 'string',
            default: '2',   //1=已发布，2=未发布
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
        collection: "articles",
        versionKey: false,
    });

    return mongoose.model('Articles', ArticlesSchema);
}