<template>
  <h2>拟合正弦函数 (y = 5 * sin(x) + 1）</h2>
  <button style="margin-bottom: 10px" @click="initTrain">开始训练</button>
  <div v-if="showLoss">
    <h3>1）损失程度 - 当前训练进度 {{ lossProcess }}</h3>
    <div id="loss-chart" style="width: 75vw; height: 400px"></div>
  </div>
  <div v-if="showPredict">
    <h3>2）预测多项式的值</h3>
    <button style="margin-bottom: 10px" @click="initPredict">开始预测</button>
    <div id="predict-chart" style="width: 75vw; height: 400px"></div>
  </div>
</template>

<script>
// 随机定义（初始化）方程的常量
const a = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));

import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as echarts from "echarts";
import echartOption from '../../utils/genLineChart';
import genData from '../../utils/genData';
export default {
  data() {
    return {
      showLoss: false,
      showPredict: false,
      lossProcess: "0%",
      lossData: [],
      config: {
        learnRate: 0.3, // 学习率，太高容易错过极值点，太低学的慢，效率低
        numIterations: 500, // 迭代次数
        a: 5,
        b: 1,
      },
    };
  },
  mounted() {},

  methods: {
    initTrain() {
      // 初始化用于训练的数据
      let data = genData.genSinData(180, {
        a: this.config.a,
        b: this.config.b,
        interval: 5,
        noise: true,
        noiseLevel: 0.1
      });
      let xs = data[0];
      let ys = data[1];

      // 可视化训练过程
      tfvis.render.scatterplot(
        { name: "三次函数训练集" },
        { values: xs.map((x, i) => ({ x, y: ys[i] })) }
      );

      this.showLoss = true;
      this.$nextTick(() => {
        this.startTrain(xs, ys);
      });
    },

    startTrain(xs, ys) {
      const xst = tf.tensor(xs, [xs.length, 1]);
      const yst = tf.tensor(ys, [ys.length, 1]);

      const numIterations = this.config.numIterations;
      const learnRate = this.config.learnRate;
      this.optimizer = tf.train.adam(learnRate);
      this.train(xst, yst, numIterations);
    },

    equation(x) {
      // 定义方程
      return tf.tidy(() => {
        return a
          .mul(x.mul(0.017453293).sin())
          .add(b)
      });
    },

    loss(prediction, labels) {
      // 通过均方误差计算损失值
      const error = prediction.sub(labels).square().mean();
      return error;
    },

    async train(xst, yst, numIterations) {
      let lossX = Array.from(Array(numIterations), (v, k) => k);
      this.initLossChart(lossX, 0);

      for (let i = 0; i < numIterations; i++) {
        // 进行迭代训练
        this.optimizer.minimize(() => {
          // 通过优化器减少均方误差，即loss
          const predsYs = this.equation(xst);
          this.lossData[i] = this.loss(predsYs, yst).dataSync()[0];
          this.lossProcess = ((i / numIterations) * 100).toFixed(2) + "%";
          // 更新损失图表
          this.initLossChart(lossX, 1);
          return this.loss(predsYs, yst);
        });
        await tf.nextFrame(); // 不加这句会导致页面阻塞
      }
      this.showPredict = true;
    },

    initPredict() {
      let oxs = Array.from(Array(501), (v, k) => k);
      let xs = [];
      oxs.map((item) => {
        xs.unshift(0 - item);
      });
      oxs.shift();
      // 生成一个带有对应负值的数组
      xs = [...xs, ...oxs];
      let ys = Array.from(Array(xs.length), (v, k) => this.config.a * Math.sin((k -500) * 0.017453293) + this.config.b);
      let res = this.equation(tf.tensor(xs, [xs.length, 1])).dataSync();
      this.initPredictChart(xs, res, ys);
    },

    initLossChart(lossX, isUpdate) {
      let myChart = echarts.init(document.getElementById("loss-chart"));
      if (isUpdate) {
        myChart.setOption({
          series: { data: [...this.lossData] },
        });
        return;
      }
      // 绘制图表
      let option = echartOption.initSingleLineChart(lossX, this.lossData, '损失 ')
      myChart.setOption(option);
    },

    initPredictChart(xs, res, ys) {
      let myChart = echarts.init(document.getElementById("predict-chart"));

      // 绘制图表
      let option = echartOption.initDuoLineChart(xs, ys, res, {
        line_1: '预测值 ',
        line_2: '实际值 ',
      })
      myChart.setOption(option);
    },
  },
};
</script>