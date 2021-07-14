export default {
    /**
     * 
     * @param {*} length 生成的数据长度
     * @param {*} config 
     *      {
     *          ...一些方程常量
     *          interval: Number, 正弦/余弦函数的输入为角度，设置跳过多少度生成一个坐标
     *          noise: boolean, 是否启用噪点
     *          noiseLevel: Number, 噪点强度
     *      }
     * @returns 
     */
    genLinearData(length, config) {
        if(!length) {
            length = 50;
        }

        let x = Array.from(Array(length), (v, k) => k);
        let y = Array.from(Array(length), (v, k) => k * config.a + config.b + (config.noise ? Math.floor(Math.random() * (2 * config.noiseLevel) + 1 - config.noiseLevel) : 0));
        return [[...x], [...y]];
    },

    genPow3Data(length, config) {
        if(!length) {
            length = 50;
        }

        let x = Array.from(Array(length), (v, k) => k);
        let y = Array.from(Array(length), (v, k) => config.a * k ** 3 + config.b * (k * k) + config.c * k + config.d + (config.noise ? Math.floor(Math.random() * (2 * config.noiseLevel) + 1 - config.noiseLevel) : 0));
        return [[...x], [...y]];
    },

    genSinData(length, config) {
        if(!length) {
            length = 50;
        }

        let x = Array.from(Array(length), (v, k) => k * config.interval);
        let y = Array.from(Array(length), (v, k) => config.a * Math.sin(k * config.interval * (2 * Math.PI / 360)) + config.b + (config.noise ? Math.floor(Math.random() * (2 * config.noiseLevel) + 1 - config.noiseLevel) : 0));
        return [[...x], [...y]];
    }
}