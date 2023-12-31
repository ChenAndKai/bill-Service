'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret); //传入加密字符串
  // router.get('/', controller.home.index);
  // router.get('/user', controller.home.user);

  // router.post('/add', controller.home.add);
  // router.post('/add_user', controller.home.addUser);
  // router.post("/edit_user", controller.home.editUser);
  // router.post("/delete_user", controller.home.deleteUser);

  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/get_userinfo', _jwt, controller.user.getUserInfo);// 获取用户信息
  router.post('/api/user/edit_userinfo', _jwt, controller.user.editUserInfo);// 修改用户个性签名
  router.post('/api/user/modify_pass', _jwt, controller.user.modifyPassword);
  router.get('/api/user/test', _jwt, controller.user.test);
  router.post('/api/upload', _jwt, controller.upload.upload);
  router.post('/api/bill/add', _jwt, controller.bill.add);
  router.get('/api/bill/list', _jwt, controller.bill.list);
  router.get('/api/bill/detail', _jwt, controller.bill.detail);
  router.post('/api/bill/update', _jwt, controller.bill.update);
  router.post('/api/bill/delete', _jwt, controller.bill.delete);
  router.get('/api/bill/data', _jwt, controller.bill.data);
  router.get('/api/type/list', _jwt, controller.type.list);//账单列表
};
