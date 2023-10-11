
module.exports = (options) => {
    return async function auth(ctx, next) {
        const currentUrl = ctx.request.url

        if (currentUrl.indexOf('/web') !== -1) {
            //带有web的是前台接口，过滤掉
            return await next()
        }

        //后台校验用户访问权限
        const urlWhiteList = ['/admin/logout', '/admin/login'];
        const whiteList = ctx.app.config.whiteList;  //['admin']
        const secret = ctx.app.config.jwt.secret;

        let isNoValidate = urlWhiteList.some((item) => {
            //如果当前请求url在URL白名单中（属于登录登出URL）
            return currentUrl.indexOf(item) !== -1
        });

        if (isNoValidate) {
            return await next()
        }
        else {
            //校验登陆者是管理员还是普通用户

            const authorization = ctx.request.header.authorization;
            console.log(authorization);

            if (authorization) {
                try {
                    const token = authorization.replace('Bearer ', '');
                    const decoded = ctx.app.jwt.verify(token, secret);

                    const userName = decoded._doc.userName;
                    if (whiteList.includes(userName)) {
                        //如果用户白名单中包含当前登录用户
                        await next()
                    }
                    else {
                        //否则就无权访问
                        ctx.helper.success({
                            ctx,
                            res: {
                                msg: '无访问权限！',
                                code: 1,
                                status: 403,
                            }
                        })
                    }
                } catch (error) {
                    console.log(error, '^^^^^^^^^');
                    ctx.helper.success({
                        ctx,
                        res: {
                            msg: '登录失败，请重新登陆！',
                            code: 1,
                            status: 401,
                        }
                    })
                }
            }
            else {
                ctx.helper.success({
                    ctx,
                    res: {
                        msg: '登录已过期，请重新登陆！',
                        code: 1,
                        status: 401,
                    }
                })
            }
        }
    };
};