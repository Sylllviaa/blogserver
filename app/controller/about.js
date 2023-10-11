'use strict';

const { Controller } = require('egg');

const createRule = {
    imgs: {
        type: 'array',
        itemType: 'object',
        min: 1,
        max: 3,
        rule: {
            imgUrl: 'url',
        }
    },
    desc: {
        type: 'string',
        min: 1,
        max: 150,
    },
    tags: {
        type: 'array',
        itemType: 'string',
        min: 1,
        max: 20,
    },
    showResume: {
        type: 'boolean',
        required: false,
        default: false,
    }
}

class AboutController extends Controller {

    //查询关于信息
    async index() {
        const { ctx, service } = this;
        const res = await service.about.index();
        ctx.helper.success({ ctx, res })
    }

    //新增关于信息
    async create() {
        const { ctx, app, service } = this;
        const body = ctx.request.body;
        ctx.validate(createRule, body);
        const res = await service.about.create(body)
        ctx.helper.success({ ctx, res })
    }

    //修改关于信息
    async update() {
        const { ctx, service } = this;
        const body = ctx.request.body;  //要修改成的内容
        const id = ctx.params.id  //目标的id
        ctx.validate(createRule, body)
        const res = await service.about.update({ id, body })
        ctx.helper.success({ ctx, res })
    }


}

module.exports = AboutController;
