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
    articleTitle: {
        type: 'string',
        required: false,
        max: 100,
    },
    auditStatus: {
        type: 'string',
        required: false,
        default: '0',
    }
}
const updateAuditstatusRule = {
    auditStatus: {
        type: 'string',
    }
}

class CommentController extends Controller {

    //查询评论
    async index() {
        const { ctx, service } = this;
        const body = ctx.query;
        const newBody = ctx.helper.filterEmptyField(body)

        ctx.validate(queryListParamsRule, newBody);
        const res = await service.comment.index(newBody);
        ctx.helper.success({ ctx, res })
    }

    //新增评论
    async create() {
        const { ctx, app, service } = this;
        const body = ctx.request.body;
        // ctx.validate(createRule, body);
        const res = await service.comment.create(body)
        ctx.helper.success({ ctx, res })
    }

    //更新审核状态
    async update() {
        const { ctx, service } = this;
        const body = ctx.request.body;  //要修改成的内容
        const id = ctx.params.id  //目标tag的id
        ctx.validate(updateAuditstatusRule, body)
        const res = await service.comment.update({ id, body })
        ctx.helper.success({ ctx, res })
    }

    //删除评论
    async destroy() {
        const { ctx, service } = this;
        const id = ctx.params.id;
        const res = await service.comment.destroy(id)
        ctx.helper.success({ ctx, res })
    }


}

module.exports = CommentController;
