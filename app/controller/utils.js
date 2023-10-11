'use strict';

const { Controller } = require('egg');
const fs = require('fs');
// const path = require('path');
// const Pump = require('mz-modules/pump'); // 用来将文件存储在本地
// const sendToWormhole = require('stream-wormhole');


class UtilsController extends Controller {

    async uploadFiles() {
        const { ctx, service } = this;

        // 上传图片到指定的目录（放在public目录下）
        // const stream = await ctx.getFileStream();

        // const filename = `image_${Date.now()}.${stream.filename.split('.').pop()}`;
        // const target = path.join(__dirname, '../public', filename);
        // const writeStream = fs.createWriteStream(target);
        // try {
        //     await Pump(stream, writeStream);
        // } catch (err) {
        //     // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
        //     await sendToWormhole(stream);
        //     throw err;
        // }

        const data = await service.utils.uploadFiles();
        console.log(data);
        if (data) {
            ctx.body = {
                data,
                code: 0,
                msg: '上传成功！'
            }
        }
        else {
            ctx.body = {
                msg: '上传失败！',
                code: 1
            }
        }
    }

}

module.exports = UtilsController;
