const Service = require('egg').Service;


class CommentService extends Service {

    async index(body) {
        const { ctx } = this;
        const page = body.page * 1
        const pageSize = body.pageSize * 1

        let mustCon = {}
        if (body.auditStatus && body.auditStatus !== '0') {
            mustCon.auditStatus = body.auditStatus
        }

        //TODO：name是模糊匹配
        const queryCondition = {
            $and: [
                mustCon,
                body.articleTitle ? {
                    articleTitle: {
                        $regex: new RegExp(body.articleTitle, 'i')
                    }
                } : {}
            ]
        }

        const data = await ctx.model.Comment.
            find(queryCondition).
            skip(pageSize * (page - 1)).
            limit(pageSize).
            sort(
                { commentTime: '-1' }
            );

        const totalCount = await ctx.model.Comment.
            find(queryCondition).
            sort(
                { commentTime: '-1' }
            ).
            count();

        return {
            data: {
                page,
                pageSize,
                totalCount,
                list: data,
            },
            msg: '评论列表获取成功',
            code: 0,
        }
    }

    async create(params) {
        const { ctx } = this;

        const data = {
            ...params,
            createTime: ctx.helper.moment().unix(),
        };
        const res = await ctx.model.Comment.create(data)

        //TODO：修改文章评论数量
        await ctx.model.Articles.updateOne({
            _id: params.articleId
        }, {
            $inc: { comment: 1 }
        });

        console.log('res#####', res);
        return {
            data: res,
            msg: '评论添加成功！',
            code: 0,
        }
    }

    async update(params) {
        const { ctx } = this;
        const { id, body } = params;
        if (id == '0') {
            await ctx.model.Comment.updateMany({}, {
                auditStatus: body.auditStatus,
                auditTime: ctx.helper.moment().unix(),
            });
            return {
                msg: '评论一键审核成功',
                code: 0,
            }
        }

        const oldComment = await ctx.model.Comment.findOne({
            _id: id,
        })
        if (!oldComment) {
            return {
                msg: '评论不存在！',
                code: 1,
            }
        }
        const updateData = {
            ...body,
            auditTime: ctx.helper.moment().unix(),
        };
        const res = await ctx.model.Comment.updateOne({
            _id: id,
        }, updateData)
        return {
            msg: '评论审核成功！',
            code: 0,
        }
    }

    async destroy(id) {
        const { ctx } = this;
        const oldComment = await ctx.model.Comment.findById(id)
        if (!oldComment) {
            return {
                msg: '评论不存在！',
                code: 1,
            }
        }
        const res = await ctx.model.Comment.remove({
            _id: id,
        });

        //TODO:修改文章评论数量
        await ctx.model.Articles.updateOne({
            _id: oldComment.articleId,
        }, {
            $inc: { comment: -1 }
        });

        return {
            msg: '删除成功！',
            code: 0,
        }
    }
}

module.exports = CommentService;