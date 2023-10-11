const path = require("path");
const qiniu = require("qiniu");
const md5 = require("md5");
const fs = require('fs');
const awaitWriteStream = require("await-stream-ready").write;
const sendToWormhole = require("stream-wormhole");
const Service = require("egg").Service;

class UtilsService extends Service {
    constructor(ctx) {
        super(ctx);
    }
    async uploadFiles() {
        const { ctx, app } = this;

        const stream = await ctx.getFileStream()
        const filename = md5(stream.filename) + path.extname(stream.filename).toLowerCase()
        //对上传文件名进行md5加密，然后拼接上文件的扩展名（小写）组合成新的文件名

        const localFilePath = path.join(__dirname, '../public/upload', filename)  //本地文件存储路径
        const writeStream = fs.createWriteStream(localFilePath) //将文件写入本地路径保存
        const mac = new qiniu.auth.digest.Mac(
            app.config.accessKey,
            app.config.secretKey
        )  //定义鉴权对象

        //定义上传凭证操作
        const options = {
            scope: app.config.bucket, //存储空间
            expires: 7200,  //定义上传凭证有效期--2小时
            force: true,  //强制覆盖已有的同名文件
            callbackBodyType: 'application/json',  //使用了上传回调的情况下，客户端收到的回复就是业务服务器响应存储服务的JSON格式内容
        }
        //定义config对象
        const config = new qiniu.conf.Config();
        // 空间对应的机房
        config.zone = qiniu.zone.Zone_na0;

        const putPolicy = new qiniu.rs.PutPolicy(options);
        const uploadToken = putPolicy.uploadToken(mac);

        //上传至云端
        try {
            const files = []  //保存最终文件结果
            await awaitWriteStream(stream.pipe(writeStream))  //创建管道流将文件写入本地（public/upload）
            const formUploader = new qiniu.form_up.FormUploader(config);
            const putExtra = new qiniu.form_up.PutExtra();
            const result = await new Promise((resolve, reject) => {
                //上传本地文件（因为之前已经通过stream将文件保存在了本地，所以直接上传本地文件即可，不同通过流式上传）
                formUploader.putFile(
                    uploadToken, //上传凭证
                    filename,  //目标文件名
                    localFilePath,  //本地文件路径
                    putExtra,  //额外选项
                    (respErr, respBody, respInfo) => {
                        //上传完成的回调函数
                        if (respErr) {
                            throw respErr;
                        }
                        if (respInfo.statusCode === 200) {
                            resolve(respBody);  //{"key":"qiniu.jpg","hash":"Ftgm-CkWePC9fzMBTRNmPMhGBcSV","bucket":"if-bc","fsize":39335,"name":"qiniu"}
                        }
                        else {
                            reject(respBody);
                        }
                        // 上传之后删除本地文件
                        fs.unlinkSync(localFilePath);
                    }
                )
            })
            if (result !== '') {
                const data = {
                    ...result,
                    url: app.config.cdn + result.key,
                };
                files.push(data);
                return files;
            }
            else {
                return false;
            }
        } catch (error) {
            //如果出现错误，关闭管道
            await sendToWormhole(stream);
            return false;
        }

        // const mac = new qiniu.auth.digest.Mac(
        //     app.config.accessKey,
        //     app.config.secretKey
        // );
        // const config = new qiniu.conf.Config();
        // config.zone = qiniu.zone.Zone_z1;
        // const options = {
        //     scope: app.config.bucket,
        //     expires: 7200,
        //     force: true,
        //     callbackBodyType: "application/json",
        // };

        // const putPolicy = new qiniu.rs.PutPolicy(options);
        // const uploadToken = putPolicy.uploadToken(mac);
        // const timestamp = new Date().getTime(); // 当前时间戳
        // const randomNum = Math.ceil(Math.random() * 1000); // 取1000以下的随机数

        // try {
        //     // const stream = await ctx.getFileStream(); // 上传单个文件 文件不存在将响应400错误
        //     const parts = this.ctx.multipart({ autoFields: true });
        //     let stream;
        //     const files = [];
        //     while ((stream = await parts()) != null) {
        //         const extname = path.extname(stream.filename).toLocaleLowerCase();
        //         const filename =
        //             md5(path.basename(stream.filename, extname) + timestamp + randomNum) +
        //             extname;
        //         const formUploader = new qiniu.form_up.FormUploader(config);
        //         const putExtra = new qiniu.form_up.PutExtra();

        //         const result = await new Promise((resolve, reject) => {
        //             formUploader.putStream(
        //                 uploadToken,
        //                 filename,
        //                 stream,
        //                 putExtra,
        //                 (respErr, respBody, respInfo) => {
        //                     if (respErr) {
        //                         throw respErr;
        //                     }
        //                     if (respInfo.statusCode == 200) {
        //                         resolve(respBody);
        //                     } else {
        //                         reject(respBody);
        //                     }
        //                 }
        //             );
        //         });
        //         if (result !== "") {
        //             const data = {
        //                 ...result,
        //                 url: app.config.cdn + result.key,
        //             };
        //             files.push(data);
        //         }
        //     }
        //     return files;
        // } catch (err) {
        //     return false;
        // }
    }
}

module.exports = UtilsService;
