'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt, middleware } = app;
  const baseRouter = app.config.baseRouter  //  api/v1
  const webBaseRouter = app.config.webBaseRouter   //  web/api/v1
  const auth = middleware.auth

  //登录接口
  router.post(baseRouter + '/admin/login', controller.admin.adminLogin);
  //退出登录
  router.post(baseRouter + '/admin/logout', controller.admin.adminLogout);

  //标签管理
  router.resources('tags', baseRouter + '/tags', controller.tags);
  router.put(baseRouter + '/tags/status/:id', controller.tags.status);

  //分类管理
  router.resources('categories', baseRouter + '/categories', controller.categories);

  //关于管理
  router.resources('about', baseRouter + '/about', controller.about);

  //用户管理
  router.resources('user', baseRouter + '/user', controller.user);

  //首页管理
  router.resources('home', baseRouter + '/config/home', controller.config.home);

  //侧边栏推荐管理
  router.resources('recommend', baseRouter + '/config/recommend', controller.config.recommend);

  //文章管理
  router.resources('articles', baseRouter + '/articles', controller.articles);
  router.put(baseRouter + '/articles/status/:id', controller.articles.status);
  router.put(baseRouter + '/articles/publishStatus/:id', controller.articles.publishStatus);
  router.post(baseRouter + '/articles/collectStatus', controller.articles.collectStatus);

  //评论管理
  router.resources('comment', baseRouter + '/comment', controller.comment);

  //上传文件
  router.post(baseRouter + '/upload', controller.utils.uploadFiles);

  //测试：获取userInfo
  router.get(baseRouter + '/user/userInfo', controller.userInfo.userInfo)


  //web静态页面请求数据接口
  //分类名称
  router.get(webBaseRouter + '/categories', controller.categories.index);

  //标签名称
  router.get(webBaseRouter + '/tags', controller.tags.index);

  //关于信息
  router.get(webBaseRouter + '/about', controller.about.index);

  //文章列表
  router.get(webBaseRouter + '/articles', controller.articles.index);

  //文章详情
  router.get(webBaseRouter + '/articles/:id/edit', controller.articles.edit);

  //推荐详情
  router.get(webBaseRouter + '/config/recommend', controller.config.recommend.index);

  //首页设置详情
  router.get(webBaseRouter + '/config/home', controller.config.home.index);

  //用户信息详情（管理员）
  router.get(webBaseRouter + '/user', controller.user.index);

};
