<template>
  <ul @click="redirect('mathPredictLinear')">
    1.Layers API - 拟合一次函数图像
  </ul>
  <ul>
    <span>2.拟合三次函数图像</span>
    <li @click="redirect('mathPredictAbs')">Core API</li>
    <li @click="redirect('mathPredictAbs_Layers')">Layers API</li>
  </ul>
  <ul @click="redirect('mathPredictSin')">
    3.Core API - 拟合正弦函数图像
  </ul>
  <ul @click="redirect('mathPredictSinAbs')">
    4.Core API - <h3 style="display: inline">类</h3> 贝塞尔函数
  </ul>
  <ul @click="redirect('PredictStockCurve')">
    5.Layers API - RNN时间序列处理（股票预测）
  </ul>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    redirect(page){
      this.$router.push({
        name: page
      })
    }
  }
};
</script>

<style scoped>
ul {
  cursor: pointer;
}
</style>