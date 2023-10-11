const Service = require('egg').Service;


class HomeService extends Service {

    async index() {
        const { ctx } = this;
        const res = await ctx.model.Config.Home.findOne()
        console.log('res-----------', res);
        return {
            data: res,
            msg: '主页设置获取成功',
            code: 0,
        }
    }

    async create(params) {
        const { ctx } = this;
        const oldHomeCount = await ctx.model.Config.Home.find().count()
        console.log('%%%%%%%%', oldHomeCount);
        if (oldHomeCount === 0) {
            //新增
            const data = {
                ...params,
                createTime: ctx.helper.moment().unix(),
            };
            const res = await ctx.model.Config.Home.create(data)
            console.log('res#####', res);
            return {
                msg: '首页信息设置成功！',
                data: res,
                code: 0,
            }
        }
        else {
            return {
                msg: '首页设置信息已存在！',
                code: 1,
            }
        }
    }

    async update(params) {
        const { ctx } = this;
        const { id, body } = params;
        const oldHome = await ctx.model.Config.Home.findOne({
            _id: id,
        })
        if (oldHome) {
            const updateData = {
                ...body,
                updateTime: ctx.helper.moment().unix(),
            };
            const res = await ctx.model.Config.Home.findByIdAndUpdate(
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
                msg: '首页设置信息不存在！',
                code: 1,
            }
        }
    }

}

module.exports = HomeService;