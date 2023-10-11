'use strict';

const { Controller } = require('egg');

const createRule = {
    userName: {
        type: 'string',
        min: 5,
        max: 20,
        format: /^[\u4e00-\u9fa5A-Za-z0-9_]{5,20}$/,
    },
    password: {
        type: 'password',
        min: 6,
        max: 20,
        format: /^[A-Za-z0-9_]{6,20}$/,
    },
}

class AdminController extends Controller {
    //登录
    async adminLogin() {
        const { ctx, app, service } = this;
    
        const body = ctx.request.body;  //用户名、密码
        // 对输入的用户名和密码长度进行校验
        ctx.validate(createRule, body);

        const res = await service.admin.adminLogin(body);
        ctx.helper.success({ ctx, res });
    }

    //退出登录
    async adminLogout() {
        const { ctx, app, service } = this;
        const res = await service.admin.adminLogout();
        ctx.helper.success({ ctx, res });
    }
}

module.exports = AdminController;
