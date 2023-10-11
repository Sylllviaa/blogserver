const Service = require('egg').Service;


class RecommendService extends Service {

    async index(body) {
        const { ctx } = this;
        const page = body.page * 1
        const pageSize = body.pageSize * 1

        const queryCondition = body.project ? {
            project: body.project,
        } : {};
        const res = await ctx.model.Config.Recommend.
            find(queryCondition).
            skip(pageSize * (page - 1)).
            limit(pageSize).
            sort(
                { _id: '1' }
            );
        const totalCount = await ctx.model.Config.Recommend.
            find(queryCondition).
            sort(
                { _id: '1' }
            ).
            count();

        console.log('res-----------', res);
        return {
            data: {
                page,
                pageSize,
                totalCount,
                list: res,
            },
            msg: '推荐列表获取成功',
            code: 0,
        }
    }

    async create(params) {
        const { ctx } = this;
        const oldRecommend = await ctx.model.Config.Recommend.findOne(
            {
                name: params.name,
                project: params.project,
            }
        )
        if (oldRecommend) {
            return {
                msg: '推荐已存在！',
                code: 1,
            }
        }
        else {
            //新增
            const data = {
                ...params,
                createTime: ctx.helper.moment().unix(),
            };
            const res = await ctx.model.Config.Recommend.create(data)
            console.log('res#####', res);
            return {
                msg: '推荐创建成功！',
                data: res,
                code: 0,
            }
        }
    }

    async update(params) {
        const { ctx } = this;
        const { id, body } = params;
        const oldRecommend = await ctx.model.Config.Recommend.findOne({
            _id: id,
        })
        if (oldRecommend) {
            const updateData = {
                ...body,
                updateTime: ctx.helper.moment().unix(),
            };
            const res = await ctx.model.Config.Recommend.findByIdAndUpdate(
                {
                    _id: id,
                },
                updateData,
                {
                    new: true,  //返回修改后的数据
                    runValidators: true,  //对修改后的数据重新校验
                }
            )
            return {
                msg: '修改成功！',
                data: res,
                code: 0,
            }
        }
        else {
            return {
                msg: '推荐不存在！',
                code: 1,
            }
        }
    }

    async destroy(id) {
        const { ctx } = this;
        const oldRecommend = await ctx.model.Config.Recommend.findById(id)
        if (!oldRecommend) {
            return {
                msg: '推荐不存在！',
                code: 1,
            }
        }
        const res = await ctx.model.Config.Recommend.remove({
            _id: id,
        });
        return {
            msg: '删除成功！',
            code: 0,
        }
    }

}

module.exports = RecommendService;