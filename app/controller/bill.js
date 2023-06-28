'use strict';

const moment = require('moment');

const Controller = require('egg').Controller;

class BillController extends Controller {

    async add() {
        const { ctx, app } = this;
        //获取请求中携带的参数
        const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;

        //判空处理
        if (!amount || !type_id || !type_name || !date || !pay_type) {
            ctx.body = {
                code: 400,
                msg: '参数错误',
                data: null
            }
        }

        try {
            let user_id
            const decode = ctx.state.decode
            if (!decode) return
            user_id = decode.id
            //user_id 默认添加到每个账单，作为后续获取指定用户账单的标示
            const result = await ctx.service.bill.add({
                amount,
                type_id,
                type_name,
                date,
                pay_type,
                remark,
                user_id
            });
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: null
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    async list() {
        const { ctx, app } = this;
        const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.query;
        try {
            let user_id;
            const decode = ctx.state.decode;
            if (!decode) return;
            user_id = decode.id;
            //拿到当前用户的账单列表
            const list = await ctx.service.bill.list(user_id);
            //过滤出月份和类型所对应的账单列表
            const _list = list.filter(item => {
                if (type_id != 'all') {
                    return moment(Number(item.date)).format('YYYY-MM') == date && type_id == item.type_id
                }
                return moment(Number(item.date)).format('YYYY-MM') == date
            })
            //格式化数据，将其变成我们之前设置到的对象格式
            let listMap = _list.reduce((curr, item) => {
                const date = moment(Number(item.date)).format('YYYY-MM-DD')
                if (curr?.length && curr.findIndex(item => item.date == date) > -1) {
                    const index = curr.findIndex(item => item.date == date)
                    curr[index].bills.push(item)
                }
                if (!curr?.length || curr.findIndex(item => item.date == date) == -1) {
                    curr.push({
                        date,
                        bills: [item]
                    })
                }
                return curr
            }, []).sort((a, b) => moment(b.date) - moment(a.date))
            
            // 分页处理
            const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);

            //计算当月总收入和支出
            let __list = list.filter(item => moment(Number(item.date)).format('YYYY-MM') == date)
            //累加计算支出
            let totalExpense = __list.reduce((curr, item) => {
                if (item.pay_type === 1) {
                    curr += Number(item.amount)
                    return curr;
                }
                return curr;
            }, 0);

            //累加计算收入
            let totalIncome = __list.reduce((curr, item) => {
                if (item.pay_type == 2) {
                    curr += Number(item.amount)
                    return curr;
                }
                return curr
            }, 0)
            

            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: {
                    totalExpense,
                    totalIncome,
                    totalPage: Math.ceil(listMap.length / page_size),
                    list: filterListMap || []
                }
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    async detail() {
        const { ctx, app } = this;
        const { id = '' } = ctx.query;
        let user_id
        const decode = ctx.state.decode;
        if (!decode) return;
        user_id = decode.id;
        //判断是否传入账单id
        if (!id) {
            ctx.body = {
                code: 500,
                msg: '订单id不能为空',
                data: null
            }
            return;
        }

        try {
            //从数据库获取账单详情
            const detail = await ctx.service.bill.detail(id, user_id);
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: detail
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    async update() {
        const { ctx, app } = this;
        //账单的相关参数，id也要传进来
        const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
        if (!amount || !type_id || !type_name || !date || !pay_type) {
            ctx.body = {
                code: 400,
                msg: '参数错误',
                data: null
            }
        }

        try {
            let user_id
            const decode = ctx.state.decode;
            if (!decode) return;
            user_id = decode.id;
            const result = await ctx.service.bill.update({
                id,
                amount,
                type_id,
                type_name,
                date,
                pay_type,
                remark,
                user_id
            });
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: null
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    async delete() {
        const { ctx, app } = this;
        const { id } = ctx.request.body;

        if (!id) {
            ctx.body = {
                code: 400,
                msg: '参数错误',
                data: null
            }
        }

        try {
            let user_id
            const decode = ctx.state.decode
            if (!decode) return;
            user_id = decode.id
            const result = await ctx.service.bill.delete(id, user_id);
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: null
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    async data() {
        const { ctx, app } = this;
        const { date = '' } = ctx.query;
        let user_id
        const decode = ctx.state.decode;
        if (!decode) return;
        user_id = decode.id;
        try {
            const result = await ctx.service.bill.list(user_id);
            //根据时间参数，筛选出当月所有的账单数据
            const start = moment(date).startOf('month').unix() * 1000;
            const end = moment(date).endOf('month').unix() * 1000;
            const _data = result.filter(item => (Number(item.date) > start && Number(item.date) < end))

            //总支出
            const total_expense = _data.reduce((arr, cur) => {
                if (cur.pay_type == 1) {
                    arr += Number(cur.amount);
                }
                return arr
            }, 0)

            //总收入
            const total_income = _data.reduce((arr, cur) => {
                if (cur.pay_type == 2) {
                    arr += Number(cur.amount)
                }
                return arr
            }, 0)

            //获取收支构成
            let total_data = _data.reduce((arr, cur) => {
                const index = arr.findIndex(item => item.type_id == cur.type_id) 
                if (index == -1) {
                    arr.push({
                        type_id: cur.type_id,
                        type_name: cur.type_name,
                        pay_type: cur.pay_type,
                        number: Number(cur.amount)
                    })
                }
                if (index > -1) {
                    arr[index].number += Number(cur.amount);
                }
                return arr
            }, [])
            total_data = total_data.map(item => {
                item.number = Number(Number(item.number).toFixed(2))
                return item;
            })
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: {
                    total_expense: Number(total_expense).toFixed(2),
                    total_income: Number(total_income).toFixed(2),
                    total_data: total_data || []
                }
            }
        } catch (error) {
            
        }
    }
}

module.exports = BillController;