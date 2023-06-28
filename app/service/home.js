'use strict'

const Service = require('egg').Service;

class HomeService extends Service {
    //查询
    async user() {
        // //假设从数据库获取用户信息
        // return {
        //     name: '小兵张嘎',
        //     slogen: '网络的世界太虚拟，你把握不住'
        // }
        const { ctx, app } = this;
        const QUERTY_STR = 'id, name';
        let sql = `select ${QUERTY_STR} from list`; // 获取id的sql语句
        try {
            const result = await app.mysql.query(sql); //mysql 实例已经挂载到app对象下，可以通过app.mysql 获取到
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    //新增
    async addUser(name) {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.insert('list', { name });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    //编辑
    async editUser(id, name) {
        const { ctx, app } = this;
        try {
            let result = await app.mysql.update('list', { name }, {
                where: {
                    id
                }
            });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    //删除
    async deleteUser(id) {
        const { ctx, app } = this;
        try {
            let result = await app.mysql.delete('list', {id});
          return result;
        } catch (error) {
          console.log(error);
          return null;
        }
    }
}

module.exports = HomeService;