<template>
  <h2>线性回归 - 一次函数 (y = 5x + 1)</h2>
  <button style="margin-bottom: 10px" @click="initTrain()">开始训练</button>
  <div v-if="loading" class="loading"></div>
  <div
    v-show="!loading"
    id="math-chart"
    style="width: 75vw; height: 400px"
  ></div>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as echarts from "echarts";
import echartOption from '../../utils/genLineChart';
import genData from '../../utils/genData';
export default {
  data() {
    return {
      loading: false,
      predictValue: "预测中",
      config: {
        sgd: 0.001, // 学习率
        batchSize: 50,
        epochs: 100,
      },
    };
  },
  mounted() {},

  methods: {
    initTrain() {
      this.loading = true;
      let data = genData.genLinearData(50, {
        a: 5,
        b: 1,
        noise: true,
        noiseLevel: 50
      });
      let xs = data[0];
      let ys = data[1];
      let pxs = Array.from(Array(50), (v, k) => k);

      this.startTrain(xs, ys, pxs);
    },
    startTrain(xs, ys, pxs) {
      // 可视化训练过程
      tfvis.render.scatterplot(
        { name: "线性回归训练集" },
        { values: xs.map((x, i) => ({ x, y: ys[i] })) }
        // { xAxisDomain: [0, 10], yAxisDomain: [0, 10] }
      );

      const model = tf.sequential();
      // 添加dense层
      model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
      model.compile({
        loss: tf.losses.meanSquaredError,
        optimizer: tf.train.sgd(this.config.sgd),
      });

      const inputs = tf.tensor(xs);
      const labels = tf.tensor(ys);
      // 拟合,包含超参数，需要自己调
      model
        .fit(inputs, labels, {
          batchSize: this.config.batchSize,
          epochs: this.config.epochs,
          callbacks: tfvis.show.fitCallbacks({ name: "训练过程" }, ["loss"]),
        })
        .then(() => {
          const output = model.predict(tf.tensor([...pxs]));
          this.predictValue = output.dataSync();
          this.initChart(pxs, ys, this.predictValue);
          model.save('localstorage://linear-function-model');
          this.loading = false;
        });
    },

    initChart(xs, ys, pys) {
      let myChart = echarts.init(document.getElementById("math-chart"));
      let oriData = [];
      let priData = [];
      for (let i = 0; i < xs.length; i++) {
        oriData.push([xs[i], ys[i]]);
        priData.push([xs[i], pys[i]]);
      }
      // 绘制图表
      let option = echartOption.initDuoLineChart(xs, ys, pys, {
        line_1: '预测值 ',
        line_2: '实际值 ',
      })
      myChart.setOption(option);
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