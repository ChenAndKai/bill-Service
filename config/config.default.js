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
  config.keys = appInfo.name + '_1681735600555_2331';

  // add your middleware config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*'], // 配置白名单
  }

  config.view = {
    mapping: { ".html": "ejs" },
  }
    
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: "localhost",
      // 端口号
      port: '3306',
      // 用户名
      user: "root",
      // 密码
      password: "Ck1078410321",
      // 数据库名
      database: "juejue-cost",
    },
    // 是否加载到app上,默认开启
    app: true,
    // 是否加载到agent上,默认关闭
    agent: false
  };

  config.jwt = {
    secret: 'Nick'
  }

  config.multipart = {
    mode: 'file'
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: 'app/public/upload'
  };

  config.cors = {
    origin: '*', // 允许所有跨域访问
    credentials: true, //允许cookie跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  return {
    ...config,
    ...userConfig,
  };
};