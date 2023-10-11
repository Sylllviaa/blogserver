/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1681293949272_859';

  // add your middleware config here
  config.middleware = ['errorHandler', 'auth'];

  // add your user config here
  const userConfig = {
    baseRouter: '/api/v1',
    whiteList: ['admin'],   //登录用户白名单
    webBaseRouter: '/web/api/v1',

    //七牛云空间参数
    bucket: 'xuanyiblog',
    cdn: 'http://changxia.top/',
    accessKey: 'u7mLhOlXhScVNVas-TOZobvJxse6dh5mL-XuSTq-',
    secretKey: 'ZXNU0iM_QWAKy_LncjXnveQlOwK1Ue1J-3sYoEYa',
  };

  //csrf安全
  config.security = {
    csrf: false
  };

  //文件
  config.multipart = {
    whitelist: ['.png', '.jpg', '.jpeg', '.gif'],
    mode: 'stream',
  };

  //数据库
  config.mongoose = {
    url: 'mongodb://127.0.0.1/blog',
    options: {},
    // mongoose global plugins, expected a function or an array of function and options
    // plugins: [createdPlugin, [updatedPlugin, pluginOptions]],
  };

  //jwt
  config.jwt = {
    secret: "slyviabloggggggg",  //加密密钥
  };


  return {
    ...config,
    ...userConfig,
  };
};
