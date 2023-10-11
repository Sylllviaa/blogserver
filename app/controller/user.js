'use strict';

const { Controller } = require('egg');

const queryListParamsRule = {
    page: {
        type: 'string',
        required: false,
        allowEmpty: true,
        default: 1,
    },
    pageSize: {
        type: 'string',
        required: false,
        allowEmpty: true,
        default: 20,
    },
    nickName: {
        type: 'string',
        max: 20,
        required: false,
        allowEmpty: true,
    },
}

class UserController extends Controller {

    //查询用户列表
    async index() {
        const { ctx, service } = this;
        const body = ctx.query;
        const newBody = ctx.helper.filterEmptyField(body)

        ctx.validate(queryListParamsRule, newBody);
        const res = await service.user.index(newBody);
        ctx.helper.success({ ctx, res })
    }

    //删除用户
    async destroy() {
        const { ctx, service } = this;
        const id = ctx.params.id;
        const res = await service.user.destroy(id)
        ctx.helper.success({ ctx, res })
    }

}

module.exports = UserController;
