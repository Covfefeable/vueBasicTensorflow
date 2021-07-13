<template>
  <h2>多项式回归 - 三次函数 ( y = 5x^3 + 4x^2 + 3*x + 2）</h2>
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
const c = tf.variable(tf.scalar(Math.random()));
const d = tf.variable(tf.scalar(Math.random()));

import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as echarts from "echarts";
export default {
  data() {
    return {
      showLoss: false,
      showPredict: false,
      lossProcess: "0%",
      lossData: [],
      config: {
        learnRate: 0.3, // 学习率，太高容易错过极值点，太低学的慢，效率低
        nEpochs: 500, // 迭代次数
      },
    };
  },
  mounted() {},

  methods: {
    initTrain() {
      let xs = [];
      let ys = [];

      // 初始化用于训练的数据
      for (let i = 0; i < 30; i++) {
        xs.push(i);
        ys.push(5 * i ** 3 + 4 * (i * i) + 3 * i + 2);
      }

      this.showLoss = true;
      this.$nextTick(() => {
        this.startTrain(xs, ys);
      });
    },

    startTrain(xs, ys) {
      // 可视化训练过程
      tfvis.render.scatterplot(
        { name: "多项式回归训练集" },
        { values: xs.map((x, i) => ({ x, y: ys[i] })) }
        // { xAxisDomain: [0, 10], yAxisDomain: [0, 10] }
      );

      const xst = tf.tensor(xs, [xs.length, 1]);
      const yst = tf.tensor(ys, [ys.length, 1]);

      const numIterations = this.config.nEpochs;
      const learnRate = this.config.learnRate;
      this.optimizer = tf.train.adam(learnRate);
      this.train(xst, yst, numIterations);
    },

    equation(x) {
      // 定义方程
      return tf.tidy(() => {
        return a
          .mul(x.pow(tf.scalar(3)))
          .add(b.mul(x.square()))
          .add(c.mul(x))
          .add(d);
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
      let oxs = Array.from(Array(51), (v, k) => k);
      let xs = [];
      oxs.map((item) => {
        xs.unshift(0 - item);
      });
      oxs.shift();
      // 生成一个带有负值的数组
      xs = [...xs, ...oxs];
      let ys = [];
      for (let i = 0; i < xs.length; i++) {
        ys.push(5 * xs[i] ** 3 + 4 * (xs[i] * xs[i]) + 3 * xs[i] + 2);
      }
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
      let colors = ["#5470C6", "#EE6666"];
      myChart.setOption({
        color: colors,

        tooltip: {
          trigger: "none",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: ["损失"],
        },
        grid: {
          top: 50,
          bottom: 40,
          left: 60,
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[1],
              },
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return (
                    "损失  " +
                    params.value +
                    (params.seriesData.length
                      ? "：" + params.seriesData[0].data
                      : "")
                  );
                },
              },
            },
            data: [...lossX],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "损失",
            type: "line",
            xAxisIndex: 0,
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: [...this.lossData],
          },
        ],
      });
    },

    initPredictChart(xs, res, ys) {
      let myChart = echarts.init(document.getElementById("predict-chart"));
      // 绘制图表
      let colors = ["#5470C6", "#EE6666"];
      myChart.setOption({
        color: colors,

        tooltip: {
          trigger: "none",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: ["实际值", "预测值"],
        },
        grid: {
          top: 50,
          bottom: 40,
          left: 60,
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[1],
              },
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return (
                    "预测值  " +
                    params.value +
                    (params.seriesData.length
                      ? "：" + params.seriesData[0].data
                      : "")
                  );
                },
              },
            },
            data: [...xs],
          },
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[0],
              },
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return (
                    "实际值  " +
                    params.value +
                    (params.seriesData.length
                      ? "：" + params.seriesData[0].data
                      : "")
                  );
                },
              },
            },
            data: [...xs],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "实际值",
            type: "line",
            xAxisIndex: 1,
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: [...ys],
          },
          {
            name: "预测值",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: [...res],
          },
        ],
      });
    },
  },
};
</script>
<style scoped>
.loading {
  width: 75vw;
  height: 400px;
  overflow-y: hidden;
  text-align: center;
  background: linear-gradient(
    -45deg,
    #6cbaa1,
    #697eff,
    #00b4db,
    #0083b0,
    #3e5ade
  );
  background-size: 400%;
  animation: Gradient 10s ease infinite;
  -webkit-animation: Gradient 10s ease infinite;
}

@keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>