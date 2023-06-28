"use strict"

const Service = require('egg').Service;

class TypeService extends Service {

    //获取标签列表
    async list(id) {
        const { ctx, app } = this;
        const QUERY_STR = 'id, name, type, user_id';
        let sql = `select ${QUERY_STR} from type where user_id = 0 or user_id = ${id}`;
        const result = await app.mysql.query(sql);
        return result;
    }
}
module.exports = TypeService