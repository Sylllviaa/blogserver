const Service = require('egg').Service;


class CategoriesService extends Service {

    async index(body) {
        const { ctx } = this;
        const page = body.page * 1
        const pageSize = body.pageSize * 1

        //TODO：name是模糊匹配
        const queryCondition = body.name ? {
            name: {
                $regex: new RegExp(body.name, 'i')
            }
        } : {};

        const data = await ctx.model.Categories.
            find(queryCondition).
            skip(pageSize * (page - 1)).
            limit(pageSize).
            sort(
                { _id: '1' }
            );

        const totalCount = await ctx.model.Categories.
            find(queryCondition).
            sort(
                { _id: '1' }
            ).
            count();

        return {
            data: {
                page,
                pageSize,
                totalCount,
                list: data,
            },
            msg: '分类列表获取成功',
            code: 0,
        }
    }

    async create(params) {
        const { ctx } = this;
        const oldCategories = await ctx.model.Categories.findOne(
            { name: params.name }
        )
        console.log('oldCategories', oldCategories);
        if (oldCategories) {
            return {
                msg: '分类已存在！',
                code: 1,
            }
        }
        else {
            const data = {
                ...params,
                createTime: ctx.helper.moment().unix(),
            };
            const res = await ctx.model.Categories.create(data)
            console.log('res#####', res);
            return {
                data: res,
                msg: '分类创建成功！',
                code: 0,
            }
        }
    }

    async update(params) {
        const { ctx } = this;
        const { id, body } = params;
        const oldCategories = await ctx.model.Categories.findOne({
            ...body,
        })
        if (oldCategories) {
            //数据库中已有该名称的标签
            return {
                msg: '分类已存在！',
                code: 1,
            }
        }
        const updateData = {
            ...body,
            updateTime: ctx.helper.moment().unix(),
        };
        const res = await ctx.model.Categories.updateOne({
            _id: id,
        }, updateData)
        return {
            msg: '修改成功！',
            code: 0,
        }
    }

    async destroy(id) {
        const { ctx } = this;
        const oldCategories = await ctx.model.Categories.findById(id)
        if (!oldCategories) {
            return {
                msg: '分类不存在！',
                code: 1,
            }
        }
        const res = await ctx.model.Categories.remove({
            _id: id,
        });
        return {
            msg: '删除成功！',
            code: 0,
        }
    }

}

module.exports = CategoriesService;