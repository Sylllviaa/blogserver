const Service = require('egg').Service;


class TagsService extends Service {

    async index(body) {
        const { ctx } = this;
        const page = body.page * 1
        const pageSize = body.pageSize * 1
        console.log(body)

        //TODO：name是模糊匹配
        const queryCondition = body.name ? {
            name: {
                $regex: new RegExp(body.name, 'i')
            }
        } : {};

        const data = await ctx.model.Tags.
            find(queryCondition).
            skip(pageSize * (page - 1)).
            limit(pageSize).
            sort(
                { _id: '1' }
            );

        const totalCount = await ctx.model.Tags.
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
            msg: '标签列表获取成功',
            code: 0,
        }
    }

    async create(params) {
        const { ctx } = this;
        const oldTags = await ctx.model.Tags.findOne(
            { name: params.name }
        )
        console.log('oldTags', oldTags);
        if (oldTags) {
            return {
                msg: '标签已存在！',
                code: 1,
            }
        }
        else {
            const data = {
                ...params,
                createTime: ctx.helper.moment().unix(),
            };
            const res = await ctx.model.Tags.create(data)
            console.log('res#####', res);
            return {
                data: res,
                msg: '标签创建成功！',
                code: 0,
            }
        }
    }

    async update(params) {
        const { ctx } = this;
        const { id, body } = params;
        const oldTags = await ctx.model.Tags.findOne({
            ...body,
        })
        if (oldTags) {
            //数据库中已有该名称的标签
            return {
                msg: '标签已存在！',
                code: 1,
            }
        }
        const updateData = {
            ...body,
            updateTime: ctx.helper.moment().unix(),
        };
        const res = await ctx.model.Tags.updateOne({
            _id: id,
        }, updateData)
        return {
            msg: '修改成功！',
            code: 0,
        }
    }

    async destroy(id) {
        const { ctx } = this;
        const oldTags = await ctx.model.Tags.findById(id)
        if (!oldTags) {
            return {
                msg: '标签不存在！',
                code: 1,
            }
        }
        const res = await ctx.model.Tags.remove({
            _id: id,
        });
        return {
            msg: '删除成功！',
            code: 0,
        }
    }

    async status(params) {
        const { ctx } = this;
        const { id, targetStatus } = params;
        const oldTags = await ctx.model.Tags.findById(id);
        if (!oldTags) {
            return {
                msg: '标签不存在！',
                code: 1,
            }
        }
        const res = await ctx.model.Tags.updateOne({
            _id: id,
        }, {
            status: targetStatus,
        });
        return {
            msg: `标签${targetStatus ? '启用' : '停用'}成功`,
            code: 0,
        }
    }
}

module.exports = TagsService;