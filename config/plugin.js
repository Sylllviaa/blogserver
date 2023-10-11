'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  //校验
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  //数据库
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  //jwt——生成token
  jwt: {
    enable: true,
    package: "egg-jwt"
  },


};
