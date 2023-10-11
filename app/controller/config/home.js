'use strict';

const { Controller } = require('egg');

const createRule = {
    introduction: {
        type: 'string',
        min: 1,
        max: 150,
    },
    effects: {
        type: 'boolean',
        required: false,
        default: false,
    },
    homeBgImg: {
        type: 'array',
        itemType: 'object',
        required: false,
        rule: {
            imgUrl: 'url',
        }
    },
    archiveBgImg: {
        type: 'array',
        itemType: 'object',
        max: 1,
        rule: {
            imgUrl: 'url',
        }
    },
    categoriesBgImg: {
        type: 'array',
        itemType: 'object',
        max: 1,
        rule: {
            imgUrl: 'url',
        }
    },
    categoriesDetailBgImg: {
        type: 'array',
        itemType: 'object',
        max: 1,
        required: false,
        rule: {
            imgUrl: 'url',
        }
    },
    tagsBgImg: {
        type: 'array',
        itemType: 'object',
        max: 1,
        rule: {
            imgUrl: 'url',
        }
    },
    tagsDetailBgImg: {
        type: 'array',
        itemType: 'object',
        max: 1,
        required: false,
        rule: {
            imgUrl: 'url',
        }
    },
    aboutBgImg: {
        type: 'array',
        itemType: 'object',
        required: false,
        rule: {
            imgUrl: 'url',
        }
    },
    articlesBgImg: {
        type: 'array',
        itemType: 'object',
        max: 1,
        rule: {
            imgUrl: 'url',
        }
    },
}

class HomeController extends Controller {

    //查询主页设置
    async index() {
        const { ctx, service } = this;
        const res = await service.config.home.index();
        ctx.helper.success({ ctx, res })
    }

    //新增主页设置
    async create() {
        const { ctx, app, service } = this;
        const body = ctx.request.body;
        ctx.validate(createRule, body);
        const res = await service.config.home.create(body)
        ctx.helper.success({ ctx, res })
    }

    //修改主页设置
    async update() {
        const { ctx, service } = this;
        const body = ctx.request.body;  //要修改成的内容
        const id = ctx.params.id  //目标的id
        ctx.validate(createRule, body)
        const res = await service.config.home.update({ id, body })
        ctx.helper.success({ ctx, res })
    }


}

module.exports = HomeController;
