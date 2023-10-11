'use strict';

const { Controller } = require('egg');

const createRule = {
    project: {
        type: 'string',  // 1=电影，2=电视剧，3=音乐，4=网站
    },
    name: {
        type: 'string',
        min: 1,
        max: 50,
    },
    link: {
        type: 'url',
    },
    platform: {
        type: 'string',
        required: false,
        max: 20,
    },
}

const queryListParamsRule = {
    project: {
        type: 'string',  // 1=电影，2=电视剧，3=音乐，4=网站
        required: false,
        allowEmpty: true,
    },
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
}


class RecommendController extends Controller {

    //查询推荐
    async index() {
        const { ctx, service } = this;
        const body = ctx.query;
        const newBody = ctx.helper.filterEmptyField(body)
        ctx.validate(queryListParamsRule, newBody)

        const res = await service.config.recommend.index(newBody);
        ctx.helper.success({ ctx, res })
    }

    //新增推荐
    async create() {
        const { ctx, app, service } = this;
        const body = ctx.request.body;
        ctx.validate(createRule, body);
        const res = await service.config.recommend.create(body)
        ctx.helper.success({ ctx, res })
    }

    //修改推荐
    async update() {
        const { ctx, service } = this;
        const body = ctx.request.body;  //要修改成的内容
        const id = ctx.params.id  //目标的id
        ctx.validate(createRule, body)
        const res = await service.config.recommend.update({ id, body })
        ctx.helper.success({ ctx, res })
    }

    //删除推荐
    async destroy() {
        const { ctx, service } = this;
        const id = ctx.params.id;
        const res = await service.config.recommend.destroy(id)
        ctx.helper.success({ ctx, res })
    }

}

module.exports = RecommendController;
