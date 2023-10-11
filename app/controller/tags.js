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
const statusRule = {
    status: {
        type: 'boolean',
    }
}

class TagsController extends Controller {

    //查询标签
    async index() {
        const { ctx, service } = this;
        const body = ctx.query;
        const newBody = ctx.helper.filterEmptyField(body)

        ctx.validate(queryListParamsRule, newBody);
        const res = await service.tags.index(newBody);
        ctx.helper.success({ ctx, res })
    }

    //新增标签
    async create() {
        const { ctx, app, service } = this;
        const body = ctx.request.body;
        ctx.validate(createRule, body);
        const res = await service.tags.create(body)
        ctx.helper.success({ ctx, res })
    }

    //修改标签
    async update() {
        const { ctx, service } = this;
        const body = ctx.request.body;  //要修改成的内容
        const id = ctx.params.id  //目标tag的id
        ctx.validate(createRule, body)
        const res = await service.tags.update({ id, body })
        ctx.helper.success({ ctx, res })
    }

    //删除标签
    async destroy() {
        const { ctx, service } = this;
        const id = ctx.params.id;
        const res = await service.tags.destroy(id)
        ctx.helper.success({ ctx, res })
    }

    //修改状态
    async status() {
        const { ctx, service } = this;
        const targetStatus = ctx.request.body.status;  //要修改成的内容
        const id = ctx.params.id  //目标tag的id
        ctx.validate(statusRule, targetStatus)
        const res = await service.tags.status({ id, targetStatus })
        ctx.helper.success({ ctx, res })
    }

}

module.exports = TagsController;
