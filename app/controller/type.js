"use strict"

const Controller = require('egg').Controller;

class TypeController extends Controller {
    async list() {
        const { ctx, app } = this;
        let user_id
        // 通过 token 解析，拿到user_id
        const decode = ctx.state.decode;
        if (!decode) return;
        user_id = decode.id
        const list = await ctx.service.type.list(user_id)
        ctx.body = {
            code: 200,
            msg: '请求成功',
            data: {
                list
            }
        }
    }
}
module.exports = TypeController