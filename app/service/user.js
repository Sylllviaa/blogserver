const Service = require('egg').Service;


class UserService extends Service {

    async index(body) {
        const { ctx } = this;
        const page = body.page * 1
        const pageSize = body.pageSize * 1

        //TODO：name是模糊匹配
        const queryCondition = body.nickName ? {
            nickName: {
                $regex: new RegExp(body.nickName, 'i')
            }
        } : {};

        const data = await ctx.model.User.
            find(queryCondition).
            skip(pageSize * (page - 1)).
            limit(pageSize).
            sort(
                { _id: '1' }
            );

        const totalCount = await ctx.model.User.
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
            msg: '用户列表获取成功',
            code: 0,
        }
    }

    async destroy(id) {
        const { ctx } = this;
        const oldUser = await ctx.model.User.findById(id)
        if (!oldUser) {
            return {
                msg: '用户不存在！',
                code: 1,
            }
        }
        const res = await ctx.model.User.remove({
            _id: id,
        });
        return {
            msg: '删除成功！',
            code: 0,
        }
    }
}

module.exports = UserService;