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
    title: {
        type: 'string',
        required: false,
        allowEmpty: true,
        max: 100,
    },
    categories: {
        type: 'string',
        required: false,
        allowEmpty: true,
        // default: '',
    },
    tags: {
        type: 'string',
        required: false,
        allowEmpty: true,
        // default: '',
    },
    status: {
        type: 'string',
        required: false,
        allowEmpty: true,
        default: '0',
    },
    publishStatus: {
        type: 'string',
        required: false,
        allowEmpty: true,
        default: '0',
    },
    createStartTime: {
        type: 'number',
        required: false,
        default: 0,
    },
    createEndTime: {
        type: 'number',
        required: false,
        default: 0,
    },
    updateStartTime: {
        type: 'number',
        required: false,
        default: 0,
    },
    updateEndTime: {
        type: 'number',
        required: false,
        default: 0,
    },
}

const createRule = {
    title: {
        type: 'string',
        min: 2,
        max: 100,
    },
    cover: {
        type: 'url',
    },
    introduction: {
        type: 'string',
        min: 10,
        max: 500,
    },
    categories: {
        type: 'string',
        min: 2,
        max: 20,
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
        required: false,
        default: 0,
    },
    comment: {
        type: 'number',
        required: false,
        default: 0,
    },
    like: {
        type: 'number',
        required: false,
        default: 0,
    },
    collect: {
        type: 'number',
        required: false,
        default: 0,
    },
    isComment: {
        //是否开启评论
        type: 'boolean',
        required: false,
        default: true,
    },
    isLike: {
        //是否开启点赞
        type: 'boolean',
        required: false,
        default: true,
    },
    isCollect: {
        //是否开启收藏
        type: 'boolean',
        required: false,
        default: false,
    },
    isReward: {
        //是否开启打赏
        type: 'boolean',
        required: false,
        default: false,
    },
    status: {
        type: 'string',
        default: '1',   //1=启用，2=停用
    },
    publishStatus: {
        type: 'string',
        default: '2',   //1=已发布，2=未发布
    },
}

const statusRule = {
    status: {
        type: 'string',
        // default: '1',
    }
}

const publishStatusRule = {
    publishStatus: {
        type: 'string',
        default: '2',   //1=已发布，2=未发布
    },
}

class ArticlesController extends Controller {

    //查询文章
    async index() {
        const { ctx, service } = this;
        const body = ctx.query;
        const newBody = ctx.helper.stringTimeToNum(ctx.helper.filterEmptyField(body))

        ctx.validate(queryListParamsRule, newBody);
        const res = await service.articles.index(newBody);
        ctx.helper.success({ ctx, res })
    }

    //新增文章
    async create() {
        const { ctx, app, service } = this;
        const body = ctx.request.body;
        ctx.validate(createRule, body);
        const res = await service.articles.create(body)
        ctx.helper.success({ ctx, res })
    }

    //修改文章
    async update() {
        const { ctx, service } = this;
        const body = ctx.request.body;  //要修改成的内容
        const id = ctx.params.id  //目标tag的id
        ctx.validate(createRule, body)
        const res = await service.articles.update({ id, body })
        ctx.helper.success({ ctx, res })
    }

    //删除文章
    async destroy() {
        const { ctx, service } = this;
        const id = ctx.params.id;
        const res = await service.articles.destroy(id)
        ctx.helper.success({ ctx, res })
    }

    //修改状态
    //启用或停用文章
    async status() {
        const { ctx, service } = this;
        const targetStatus = ctx.request.body;  //要修改成的内容
        const id = ctx.params.id  //目标tag的id
        ctx.validate(statusRule, targetStatus)
        const res = await service.articles.status({ id, targetStatus })
        ctx.helper.success({ ctx, res })
    }

    //修改发布状态
    //发布或下线
    async publishStatus() {
        const { ctx, service } = this;
        const targetStatus = ctx.request.body;  //要修改成的内容
        const id = ctx.params.id  //目标tag的id
        ctx.validate(publishStatusRule, targetStatus)
        const res = await service.articles.publishStatus({ id, targetStatus })
        ctx.helper.success({ ctx, res })
    }

    //一键开启或关闭收藏
    async collectStatus() {
        const { ctx, service } = this;
        const targetStatus = ctx.request.body.isCollect;  //要修改成的内容

        const res = await service.articles.collectStatus(targetStatus)
        ctx.helper.success({ ctx, res })
    }

    //获取文章详情
    async edit() {
        const { ctx, service } = this;
        const id = ctx.params.id;
        const res = await service.articles.edit(id)
        ctx.helper.success({ ctx, res })
    }
}

module.exports = ArticlesController;
