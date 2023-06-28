'use strict';

const { Controller } = require('egg');

const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';
class UserController extends Controller {
    async register() {
        const { ctx } = this;
        const { username, password } = ctx.request.body; // 获取注册需要的参数
        
        if (!username || !password) {
            ctx.body = {
                code: 500,
                msg: "账号密码不能为空",
                data: null
            }
            return
        }

        //验证数据库内是否已经有该账户名
        const userInfo = await ctx.service.user.getUserByName(username) // 用户信息

        //判断是否已经存在
        if (userInfo && userInfo.id) {
            ctx.body = {
                code: 500,
                msg: '账户名已被注册，请重新输入',
                data: null
            }
            return
        }

        // 调用service 方法，将数据存入数据库
        const result = await ctx.service.user.register({
            username,
            password,
            signature: "世界和平",
            avatar: defaultAvatar
        });
        
        if (result) {
            ctx.body = {
                code: 200,
                msg: '注册成功',
                data: null
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '注册失败',
                data: null
            }
        }
    }

    async login() {
        const { ctx, app } = this;
        const { username, password } = ctx.request.body;
        //根据用户名，在数据库查找对应的id操作
        const userInfo = await ctx.service.user.getUserByName(username);
        //该用户不存在
        if (!userInfo || !userInfo.id) {
            ctx.body = {
                code: 500,
                msg: '账号不存在',
                data: null
            }
            return
        }
        //找到该用户，并且判断输入密码与数据库中的用户密码
        if (userInfo && password !== userInfo.password) {
            ctx.body = {
                code: 500,
                msg: '账号密码错误',
                data: null
            }
            return
        }

        // 生成 token 加盐
        // app.jwt.sign 方法接收两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串
        const token = app.jwt.sign({
            id: userInfo.id,
            username: userInfo.username,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        }, app.config.jwt.secret);

        ctx.body = {
            code: 200,
            message: '登录成功',
            data: {
                token
            }
        }
    }

    // 获取用户信息
    async getUserInfo() {
        const { ctx, app } = this;
        const token = ctx.request.header.authorization;
        // 通过 app.jwt.verify 方法，解析出 token 内的用户信息
        // const decode = await app.jwt.verify(token, app.config.jwt.secret);
        const decode = ctx.state.decode;
        // 通过 getUserByName 方法， 以用户名 decode.username 为参数，从数据库获取到该用户名下的相关信息
        const userInfo = await ctx.service.user.getUserByName(decode.username);
        // userInfo 中应该有密码信息，所以我们指定下面四项返回给客户端
        ctx.body = {
            code: 200,
            msg: '请求成功',
            data: {
                id: userInfo.id,
                username: userInfo.username,
                signature: userInfo.signature || '',
                avatar: userInfo.avatar || defaultAvatar
            }
        }
    }

    // 修改用户信息
    async editUserInfo() {
        const { ctx, app } = this;
        // 通过 post 请求，在请求体中获取签名字段 signature
        const { signature = '', avatar = '' } = ctx.request.body
        
        try {
            const token = ctx.request.header.authorization;
            // 解析 token 获取用户名
            // const decode = await app.jwt.verify(token, app.config.jwt.secret)
            const decode = ctx.state.decode;
            if (!decode) return
            // 通过 username 查找 userInfo 完整信息
            const userInfo = await ctx.service.user.getUserByName(decode.username)
            // 通过 service 方法 editUserInfo 修改 signature 信息
            const result = await ctx.service.user.editUserInfo({
                ...userInfo,
                signature,
                avatar
            });
            
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: {
                    id: userInfo.id,
                    signature,
                    username: userInfo.username,
                    avatar
                }
            }
        } catch (error) {
            console.log(error, 'error')
        }
    }

    //修改密码
    async modifyPassword() {
        const { ctx, app } = this;
        // 通过 post 请求，在请求体中获取签名字段 signature
        const { old_pass, new_pass } = ctx.request.body

        try {
            const decode = ctx.state.decode;
            if (!decode) return
            const userInfo = await ctx.service.user.getUserByName(decode.username);
            if (old_pass !== userInfo.password) {
                ctx.body = {
                    code: 400,
                    msg: '原密码错误',
                    data: null
                }
                return;
            }

            await ctx.service.user.modifyPassword({
                ...userInfo,
                password: new_pass
            })

            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: null
            }
        } catch (error) {
            console.log(error, 'error')
        }
    }

    async test() {
        const { ctx, app } = this;
        //通过token 解析，拿到user_id
        const token = ctx.request.header.authorization; // 请求头获取 authorization 属性，值为token
        // const decode = await app.jwt.verify(token, app.config.jwt.secret);
        const decode = ctx.state.decode;
        //响应接口
        ctx.body = {
            code: 200,
            message: '获取成功',
            data: {
                ...decode
            }
        }
    }
}


module.exports = UserController;