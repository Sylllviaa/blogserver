'use strict';

const { Controller } = require('egg');

const createRule = {
    name: {
        type: 'string',
        min: 2,
        max: 20,
        format: /^[\u4e00-\u9fa5A-Za-z0-9_]{2,20}$/,
    },
}
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
    name: {
        type: 'string',
        min: 2,
        max: 20,
        required: false,
        allowEmpty: true,
        format: /^[\u4e00-\u9fa5A-Za-z0-9_]{2,20}$/,
    },
}

class CategoriesController extends Controller {

    //查询分类
    async index() {
        const { ctx, service } = this;
        const body = ctx.query;
        const newBody = ctx.helper.filterEmptyField(body)

        ctx.validate(queryListParamsRule, newBody);
        const res = await service.categories.index(newBody);
        ctx.helper.success({ ctx, res })
    }

    //新增分类
    async create() {
        const { ctx, app, service } = this;
        const body = ctx.request.body;
        ctx.validate(createRule, body);
        const res = await service.categories.create(body)
        ctx.helper.success({ ctx, res })
    }

    //修改分类
    async update() {
        const { ctx, service } = this;
        const body = ctx.request.body;  //要修改成的内容
        const id = ctx.params.id  //目标tag的id
        ctx.validate(createRule, body)
        const res = await service.categories.update({ id, body })
        ctx.helper.success({ ctx, res })
    }

    //删除分类
    async destroy() {
        const { ctx, service } = this;
        const id = ctx.params.id;
        const res = await service.categories.destroy(id)
        ctx.helper.success({ ctx, res })
    }

}

module.exports = CategoriesController;
