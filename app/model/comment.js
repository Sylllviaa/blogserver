// 评论管理

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const CommentSchema = new Schema({
        nickName: {
            type: 'string',
            required: false,
            max: 20,
        },
        email: {
            type: 'string',
            required: true,
            match: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
        avatar: {
            type: 'string',
            required: false,
        },
        articleId: {
            type: 'ObjectId',
        },
        articleTitle: {
            type: 'string',
            min: 2,
            max: 100,
        },
        targetReplayId: {
            type: 'string',
            required: false,
        },
        targetReplayContent: {
            type: 'string',
            required: false,
            max: 200,
        },
        currentReplayContent: {
            type: 'string',
            required: false,
            max: 200,
        },
        commentTime: {
            type: 'number',
            default: 0
        },
        auditTime: {
            type: 'number',
            default: 0,
        },
        auditStatus: {
            type: 'string',
            default: 3,   //1=通过，2=驳回，3=未审核
        }
    }, {
        collection: "comment",
        versionKey: false,
    });

    return mongoose.model('Comment', CommentSchema);
}