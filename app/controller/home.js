'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // const { id } = ctx.query;
    // ctx.body = id;

    // ctx.render 默认会去view 文件夹中寻找index.html 这是Egg约定好的
    await ctx.render("index.html", {
      title: "zed 真帅",
    });
  }

  //获取用户信息
  async user() {
    const { ctx } = this;
    // const { id } = ctx.params; //通过params获取申明参数
    // ctx.body = id;

    // const { name, slogen } = await ctx.service.home.user();
    // ctx.body = {
    //   name,
    //   slogen,
    // };

    const result = await ctx.service.home.user();
    ctx.body = result;
  }

  async addUser() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    try {
      await ctx.service.home.addUser(name);
      ctx.body = {
        code: 200,
        msg: "添加成功",
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "添加失败",
        data: null,
      };
    }
  }

  async editUser() {
    const { ctx } = this;
    const { id, name } = ctx.request.body;
    try {
      await ctx.service.home.editUser(id, name);
      ctx.body = {
        code: 200,
        msg: "编辑成功",
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "编辑失败",
        data: null,
      };
    }
  }

  async deleteUser() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      await ctx.service.home.deleteUser(id);
      ctx.body = {
        code: 200,
        msg: "删除成功",
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "删除失败",
        data: null,
      };
    }
  }

  // post 请求方法
  async add() {
    const { ctx } = this;
    const { title } = ctx.request.body;
    //Egg 内置 bodyParser 中间件来对 POST 请求 body 解析成 object 挂载到ctx.request.body 上
    ctx.body = {
      title,
    };
  }
}

module.exports = HomeController;
