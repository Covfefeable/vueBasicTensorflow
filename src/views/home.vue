<template>
  <ul @click="redirect('mathPredict')">
    1.线性回归 - 通过高级API拟合一次函数图像
  </ul>
  <ul @click="redirect('mathPredictAbs')">
    2.多项式回归 - 通过ops拟合三次函数图像
  </ul>
  <ul @click="redirect('stockPredict')">
    3.RNN时间序列处理 - 股票预测
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