const Service = require('egg').Service;


class ArticlesService extends Service {
    async updateCategoriesArticleNum() {
        //TODO：联表操作--
        const { ctx } = this;
        const categories = await ctx.model.Categories.find()
        if (categories && categories.length > 0) {
            categories.forEach(async (item) => {
                const articleNum = await ctx.model.Articles.find({
                    categories: item.name,
                    status: '1',
                    publishStatus: '1',
                }).count();
                await ctx.model.Categories.updateOne({
                    name: item.name
                }, {
                    articleNum,
                })
            })
        }
    }

    async updateTagsArticleNum() {
        //TODO：联表操作--
        const { ctx } = this;
        const tags = await ctx.model.Tags.find()
        if (tags && tags.length > 0) {
            tags.forEach(async (item) => {
                const articleNum = await ctx.model.Articles.find({
                    tags: { $elemMatch: { $eq: item.name } },
                    status: '1',
                    publishStatus: '1',
                }).count();
                await ctx.model.Tags.updateOne({
                    name: item.name
                }, {
                    articleNum,
                })
            })
        }
    }

    async index(body) {
        const { ctx } = this;
        const page = body.page * 1
        const pageSize = body.pageSize * 1

        console.log('body----------------', body);

        let mustCon = {};
        if (body.categories) {
            mustCon.categories = body.categories;
        }
        if (body.tags) {
            const tagsArr = body.tags.split(',')
            mustCon.tags = tagsArr;
        }
        if (body.status !== '0') {
            mustCon.status = body.status;
        }
        if (body.publishStatus !== '0') {
            mustCon.publishStatus = body.publishStatus;
        }
        let timeQuery = ctx.helper.getTimeQueryCon(body)


        //TODO：name是模糊匹配
        const queryCondition = {
            $and: [
                mustCon,
                timeQuery,
                body.title ? {
                    title: {
                        $regex: new RegExp(body.title, 'i')
                    }
                } : {},
            ]
        }

        const data = await ctx.model.Articles.
            find(queryCondition).
            skip(pageSize * (page - 1)).
            limit(pageSize).
            sort(
                { createTime: '-1' }
            );

        const totalCount = await ctx.model.Articles.
            find(queryCondition).
            sort(
                { createTime: '-1' }
            ).
            count();

        return {
            data: {
                page,
                pageSize,
                totalCount,
                list: data,
            },
            msg: '文章列表获取成功',
            code: 0,
        }
    }

    async create(params) {
        const { ctx } = this;

        const data = {
            ...params,
            createTime: ctx.helper.moment().unix(),
        };
        const res = await ctx.model.Articles.create(data);
        //TODO:更新分类管理和标签管理中的文章数量
        await this.updateCategoriesArticleNum()
        await this.updateTagsArticleNum()

        console.log('res#####', res);
        return {
            data: res,
            msg: '文章创建成功！',
            code: 0,
        }
    }

    async update(params) {
        const { ctx } = this;
        const { id, body } = params;
        const oldArticles = await ctx.model.Articles.findOne({
            _id: id,
        })
        if (!oldArticles) {
            return {
                msg: '文章不存在！',
                code: 1,
            }
        }
        else {
            const updateData = {
                ...body,
                updateTime: ctx.helper.moment().unix(),
            };
            const res = await ctx.model.Articles.updateOne(
                { _id: id, },
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );
            //TODO:更新分类管理和标签管理中的文章数量
            await this.updateCategoriesArticleNum()
            await this.updateTagsArticleNum()

            return {
                msg: '修改成功！',
                data: res,
                code: 0,
            }
        }
    }

    async destroy(id) {
        const { ctx } = this;
        const oldArticles = await ctx.model.Articles.findById(id)
        if (!oldArticles) {
            return {
                msg: '文章不存在！',
                code: 1,
            }
        }
        const res = await ctx.model.Articles.remove({
            _id: id,
        });
        //TODO:更新分类管理和标签管理中的文章数量
        await this.updateCategoriesArticleNum()
        await this.updateTagsArticleNum()

        return {
            msg: '删除成功！',
            code: 0,
        }
    }

    async status(params) {
        const { ctx } = this;
        const { id, targetStatus } = params;
        const oldArticles = await ctx.model.Articles.findById(id);
        if (!oldArticles) {
            return {
                msg: '文章不存在！',
                code: 1,
            }
        }
        const res = await ctx.model.Articles.updateOne({
            _id: id,
        }, {
            status: targetStatus.status,
        });
        return {
            msg: `文章${targetStatus.status == '1' ? '启用' : '停用'}成功`,
            code: 0,
        }
    }

    async publishStatus(params) {
        const { ctx } = this;
        const { id, targetStatus } = params;
        const oldArticles = await ctx.model.Articles.findById(id);
        if (!oldArticles) {
            return {
                msg: '文章不存在！',
                code: 1,
            }
        }
        const res = await ctx.model.Articles.updateOne({
            _id: id,
        }, {
            publishStatus: targetStatus.publishStatus,
        });
        return {
            msg: `文章${targetStatus.publishStatus == '1' ? '发布' : '下线'}成功`,
            code: 0,
        }
    }

    async collectStatus(targetStatus) {
        const { ctx } = this;

        const res = await ctx.model.Articles.updateMany({
            isCollect: targetStatus,
        });
        return {
            msg: `一键${targetStatus ? '开启' : '关闭'}收藏成功`,
            code: 0,
        }
    }

    async edit(id) {
        const { ctx } = this;
        if (id === '0') {
            //新添加页面
            return {
                code: 1,
                data: null,
                msg: '新建文章',
            }
        }
        const oldArticles = await ctx.model.Articles.findById(id);
        if (!oldArticles) {
            return {
                msg: '文章不存在！',
                code: 1,
            }
        }
        else {
            return {
                msg: '获取文章详情成功！',
                data: oldArticles,
                code: 0,
            }
        }
    }
}

module.exports = ArticlesService;