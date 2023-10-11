const moment = require('moment');

const bcrypt = require('bcrypt');



module.exports = {
    moment,

    //密码加密
    genSaltPassword(password) {
        const saltRounds = 10;
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    // Store hash in your password DB.
                    if (!err) {
                        //如果没错，把加密盐生成的hashresolve出去
                        resolve(hash)
                    }
                    else {
                        reject(err)
                    }
                });
            });
        })
    },

    //解密
    /**
     * 
     * @param {未加密的密码} _password 
     * @param {数据库保存的加密后的密码} password
     * @return {boolean} result
     */
    checkPassword(_password, password) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, (err, result) => {
                // result == true
                if (!err) {
                    //返回校验结果，true Or false
                    resolve(result);
                }
                else {
                    reject(err);
                }
            });
        })
    },

    //成功返回
    success({ ctx, res = null }) {
        ctx.status = res.status ? res.status : 200;
        if (res.status) {
            delete res.status;
        }
        ctx.body = {
            ...res,
            data: res.data ? res.data : null,
            code: res.code ? res.code : 0,
            msg: res.msg ? res.msg : '请求成功',
        }
    },

    //去掉空的参数
    filterEmptyField(obj) {
        let newObj = {}
        for (let o in obj) {
            if (obj[o].toString().trim() !== '') {
                newObj[o] = obj[o]
            }
        }
        return newObj
    },

    getTimeQueryCon(params) {
        let timeQuery = {}
        if (params.createStartTime && params.createStartTime !== 0) {
            timeQuery.createTime = { $gte: params.createStartTime }
        }
        if (params.createEndTime && params.createEndTime !== 0) {
            timeQuery.createTime = { $lte: params.createEndTime }
        }
        if (params.createStartTime && params.createStartTime !== 0 && params.createEndTime && params.createEndTime !== 0) {
            timeQuery.createTime = {
                $gte: params.createStartTime,
                $lte: params.createEndTime,
            }
        }

        if (params.updateStartTime && params.updateStartTime !== 0) {
            timeQuery.updateTime = { $gte: params.updateStartTime }
        }
        if (params.updateEndTime && params.updateEndTime !== 0) {
            timeQuery.updateTime = { $lte: params.updateEndTime }
        }
        if (params.updateStartTime && params.updateStartTime !== 0 && params.updateEndTime && params.updateEndTime !== 0) {
            timeQuery.updateTime = {
                $gte: params.updateStartTime,
                $lte: params.updateEndTime,
            }
        }

        return timeQuery
    },

    //将查询参数中字符串形式的时间改为数字形式
    stringTimeToNum(obj) {
        const newObj = {}
        for (let item in obj) {
            if (item === 'createStartTime' || item === 'createEndTime' || item === 'updateStartTime' || item === 'updateEndTime') {
                newObj[item] = Number(obj[item])
            }
            else {
                newObj[item] = obj[item]
            }
        }
        return newObj
    }

}

