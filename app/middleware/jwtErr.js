"use strict";

module.exports = (secret) => {
    return async function jwtErr(ctx, next) {
        const token = ctx.request.header.authorization; 
        let decode;
        if (token) {
            try {
                decode = ctx.app.jwt.verify(token, secret); //验证token
                ctx.state.decode = decode;
                await next();
            } catch (error) {
                console.log(error, 'error');
                ctx.status = 200;
                ctx.body = {
                    msg: "token过期，重新登录",
                    code: 401,
                }
                return;
            }
        } else {
            ctx.status = 200;
            ctx.body = {
                code: 401,
                msg: 'token不存在'
            };
            return;
        }
    }
}