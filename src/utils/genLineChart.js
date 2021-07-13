let colors = ["#5470C6", "#EE6666"];

export default {
    initSingleLineChart(xs, ys, label) {
        return {
            color: colors,
    
            tooltip: {
              trigger: "none",
              axisPointer: {
                type: "cross",
              },
            },
            legend: {
              data: [label],
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
                        '第 ' + params.value + ' 次迭代的'+ label +
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
                name: label,
                type: "line",
                xAxisIndex: 0,
                smooth: true,
                emphasis: {
                  focus: "series",
                },
                data: [...ys],
              },
            ],
          }
    },
    initDuoLineChart(xs, ys, oys, config) {
        return {
            color: colors,

            tooltip: {
                trigger: "none",
                axisPointer: {
                    type: "cross",
                },
            },
            legend: {
                data: [config.line_1, config.line_2],
            },
            grid: {
                top: 50,
                bottom: 40,
                left: 30,
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
                                    config.line_1 +
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
                                    config.line_2 +
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
                    name: config.line_2,
                    type: "line",
                    xAxisIndex: 1,
                    smooth: true,
                    emphasis: {
                        focus: "series",
                    },
                    data: [...ys],
                },
                {
                    name: config.line_1,
                    type: "line",
                    smooth: true,
                    emphasis: {
                        focus: "series",
                    },
                    data: [...oys],
                },
            ],
        }
    },
}