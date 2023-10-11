// 标签管理
const helper = require('../extend/helper')

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        uid: {
            type: 'string',  //GitHub登录会产生uid
            required: false,
        },
        provider: {
            type: 'string',
            required: false,
            default: 'local',
        },
        email: {
            type: 'string',
            required: true,
            match: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
        password: {
            type: 'string',
            required: true,
        },
        nickName: {
            type: 'string',
            required: false,
            max: 20,
        },
        avatar: {
            type: 'string',
            required: false,
        },
        introduction: {
            type: 'string',
            required: false,
            max: 1200,
        },
        loginTime: {
            type: 'number',
            default: 0,
        },
        registerTime: {
            type: 'number',
            default: 0,
        },
        articleIds: {
            type: 'array',
        },
        github: {
            type: 'string',
            required: false,
        },
        gitee: {
            type: 'string',
            required: false,
        }
    }, {
        collection: "user",
        versionKey: false,
    });

    return mongoose.model('User', UserSchema);
}