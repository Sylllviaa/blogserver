module.exports = {
    schedule: {
        interval: '5s', // 1 分钟间隔
        type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        // console.log('执行定时任务');
    },
};