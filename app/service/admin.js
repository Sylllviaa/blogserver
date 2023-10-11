const Service = require('egg').Service;


class AdminService extends Service {

    //登录
    async adminLogin(params) {
        const { ctx, app } = this;

        const oldUser = await ctx.model.Admin.findOne(
            { userName: params.userName }
        )
        
        if (!oldUser) {
            return {
                msg: '用户不存在！',
                code: 1,
            }
        }
        else {
            //TODO：登录用户存在，校验密码
            const isMatch = await ctx.helper.checkPassword(params.password, oldUser.password)
            if (!isMatch) {
                return {
                    msg: '用户名或密码错误！',
                    code: 1,
                }
            }
            else {
                const token = app.jwt.sign({ ...oldUser }, app.config.jwt.secret, { expiresIn: '24h' });
                ctx.cookies.set('token', token, {
                    maxAge: 86400000,
                    httpOnly: true,
                });
                return {
                    data: {
                        token,
                        userName: oldUser.userName,
                    },
                    msg: '登录成功',
                    code: 0,
                }
            }
        }
        // const res = await ctx.model.Admin.create(params)
        // return res
    }

    async adminLogout() {
        const { ctx } = this;
        ctx.cookies.set('token', '', {
            maxAge: 0
        });
        return {
            msg: '退出登录成功',
            code: 0,
        }
    }
}

module.exports = AdminService;