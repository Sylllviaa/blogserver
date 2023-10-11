const Service = require('egg').Service;


class AboutService extends Service {

    async index() {
        const { ctx } = this;
        const res = await ctx.model.About.findOne()
        console.log('res-----------', res);
        return {
            data: res,
            msg: '关于信息获取成功',
            code: 0,
        }
    }

    async create(params) {
        const { ctx } = this;
        const oldAboutCount = await ctx.model.About.find().count()
        console.log('%%%%%%%%', oldAboutCount);
        if (oldAboutCount === 0) {
            //新增
            const data = {
                ...params,
                createTime: ctx.helper.moment().unix(),
            };
            const res = await ctx.model.About.create(data)
            console.log('res#####', res);
            return {
                msg: '关于信息添加成功！',
                data: res,
                code: 0,
            }
        }
        else {
            return {
                msg: '关于信息已存在！',
                code: 1,
            }
        }
    }

    async update(params) {
        const { ctx } = this;
        const { id, body } = params;
        const oldAbout = await ctx.model.About.findOne({
            _id: id,
        })
        if (oldAbout) {
            const updateData = {
                ...body,
                updateTime: ctx.helper.moment().unix(),
            };
            const res = await ctx.model.About.findByIdAndUpdate(
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
                msg: '关于信息不存在！',
                code: 1,
            }
        }
    }

}

module.exports = AboutService;