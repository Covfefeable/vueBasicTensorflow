<template>
<div class="main">
<li>拟合一次函数图像
  <ul>
    <li @click="redirect('mathPredictLinear')">Layers API</li>
  </ul>
</li>
<li>拟合三次函数图像
  <ul>
    <li @click="redirect('mathPredictAbs')">Core API</li>
    <li @click="redirect('mathPredictAbs_Layers')">Layers API</li>
  </ul>
</li>
<li>拟合三角函数图像
  <ul>
    <li @click="redirect('mathPredictSin')">正弦 Core API</li>
    <li @click="redirect('mathPredictCos')">余弦 Layers API</li>
  </ul>
</li>
<li>拟合<h3 style="display: inline">类</h3>贝塞尔函数
  <ul>
    <li @click="redirect('mathPredictSinAbs')">Core API</li>
  </ul>
</li>
<li>RNN时间序列处理（股票预测）
  <ul>
    <li @click="redirect('PredictStockCurve')">Layers API</li>
  </ul>
</li>
</div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    redirect(page) {
      this.$router.push({
        name: page,
      });
    },
  },
};
</script>

<style scoped>
.main {
  padding-left: 20px;
}
ul {
  cursor: pointer;
}
</style>