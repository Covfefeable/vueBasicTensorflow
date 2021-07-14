<template>
  <h2>RNN时间序列处理 - 股票预测（Micresoft）</h2>
  <h3>1）实际收盘价 与 SMA收盘价</h3>
  <button style="margin-bottom: 10px" @click="getStockData()">获取数据</button>
  <div v-if="loading" class="loading"></div>
  <div v-show="!loading" id="math-chart" style="width: 75vw; height: 400px"></div>
  <div v-if="showSecond">
    <h3>2）通过SMA均线进行训练</h3>
    <button style="margin-bottom: 10px" @click="startTrain(closeData, smaDetail)">开始训练</button>
  </div>
</template>

<script>
// GC2VH1R4C2XEMVPA
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as echarts from "echarts";
import echartOption from '../../utils/genLineChart'
export default {
  data() {
    return {
      loading: false,
      showSecond: false,
      stockName: "MSFT",
      windowSize: 51, // xx日均线
      trainingSize: 80,
      nLayers: 4,
      nEpochs: 20, // 20
      learningRate: 0.01,

      closeData: [], // 收盘价数据
      smaDetail: [], // 均线数据
    };
  },
  methods: {
    getStockData() {
      this.loading = true;
      let stockName = this.stockName;
      if (sessionStorage.getItem("curStockName") === stockName) {
        let json = JSON.parse(sessionStorage.getItem("curStockData"));
        this.initChart(json);
      } else {
        fetch(
          "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
            stockName +
            "&outputsize=full&apikey=GC2VH1R4C2XEMVPA"
        )
          .then((res) => res.json())
          .then((json) => {
            sessionStorage.setItem("curStockName", stockName);
            sessionStorage.setItem("curStockData", JSON.stringify(json));
            this.initChart(json);
          });
      }
    },
    initChart(data) {
      let myChart = echarts.init(document.getElementById("math-chart"));
      let chartData = [];
      let timeLine = [];
      let smaData = [];
      this.closeData = [];
      this.smaDetail = [];
      // 数据规范化
      for (let [key, value] of Object.entries(data["Time Series (Daily)"])) {
        chartData.push({
          time: key,
          open: Number(value["1. open"]),
          close: Number(value["4. close"]),
          high: Number(value["2. high"]),
          low: Number(value["3. low"]),
          volume: Number(value["5. volume"]),
        });
      }
      chartData = chartData.reverse();

      // 计算SMA（简单移动平均）
      let windowSize = this.windowSize;
      let offset = (windowSize - 1) / 2;
      for (let i = 0; i < chartData.length; i++) {
        let sum = chartData[i].close;
        chartData[i].smaDetail = [];
        for (let j = 1; j < offset + 1; j++) {
          sum += chartData[i + j] ? chartData[i + j].close : chartData[i].close;
          sum += chartData[i - j] ? chartData[i - j].close : chartData[i].close;
        }
        for (let j = 0; j < windowSize; j++) {
          chartData[i].smaDetail.push(
            chartData[i - offset + j]
              ? chartData[i - offset + j].close
              : chartData[i].close
          );
        }
        chartData[i].SMA = sum / windowSize;
      }

      // 填充时间线和收盘价
      chartData.map((item, index) => {
        if (index > 31 && index < chartData.length - 30) {
          timeLine.push(item.time);
          smaData.push(item.SMA);
          this.smaDetail.push(item.smaDetail);
          this.closeData.push(item.close);
        }
      });

      // 绘制图表
      this.loading = false;
      this.showSecond = true;

      let option = echartOption.initDuoLineChart(timeLine, this.closeData, smaData, {
        line_1: 'SMA收盘价 ',
        line_2: '实际收盘价 ',
      })
      myChart.setOption(option);
    },

    startTrain(closeData, smaData) {
      const inputLayerShape = this.windowSize;
      const inputLayerNeurons = 50;

      const rnnInputLayerFeatures = 10;
      const rnnInputLayerTimesteps =
        inputLayerNeurons / rnnInputLayerFeatures;
      const rnnInputShape = [
        rnnInputLayerFeatures,
        rnnInputLayerTimesteps,
      ];
      const rnnOutputNeurons = 20;
      const rnnBatchSize = this.windowSize;
      const outputLayerShape = rnnOutputNeurons;
      const outputLayerNeurons = 1;

      let X = smaData.slice(
        0,
        Math.floor((this.trainingSize / 100) * smaData.length)
      );
      let Y = closeData.slice(
        0,
        Math.floor((this.trainingSize / 100) * closeData.length)
      );

      const xs = tf.tensor2d(X, [X.length, X[0].length]).div(tf.scalar(10));
      const ys = tf
        .tensor2d(Y, [Y.length, 1])
        .reshape([Y.length, 1])
        .div(tf.scalar(10));
      const model = tf.sequential();

      model.add(
        tf.layers.dense({
          units: inputLayerNeurons,
          inputShape: [inputLayerShape],
        })
      );
      model.add(tf.layers.reshape({ targetShape: rnnInputShape }));

      let lstm_cells = [];
      for (let index = 0; index < this.nLayers; index++) {
        lstm_cells.push(tf.layers.lstmCell({ units: rnnOutputNeurons }));
      }

      model.add(
        tf.layers.rnn({
          cell: lstm_cells,
          inputShape: rnnInputShape,
          returnSequences: false,
        })
      );

      model.add(
        tf.layers.dense({
          units: outputLayerNeurons,
          inputShape: [outputLayerShape],
        })
      );

      model.compile({
        optimizer: tf.train.adam(this.learningRate),
        loss: "meanSquaredError",
      });

      model
        .fit(xs, ys, {
          batchSize: rnnBatchSize,
          epochs: this.nEpochs,
          callbacks: tfvis.show.fitCallbacks({ name: "训练过程" }, ["loss"]),
        })
        .then(() => {
          let X = smaData.slice(
            closeData.length-1,
            closeData.length
          );
          console.log(X);
          const output = model
            .predict(tf.tensor2d(X, [X.length, X[0].length]))
            .mul(10);
          console.log("output", Array.from(output.dataSync()));
        });
    },
  },
};
</script>

<style scoped>
ul {
  cursor: pointer;
}

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
