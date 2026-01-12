// @ts-nocheck
import React from "react"
import ReactEcharts from "echarts-for-react"

const LineChart = props => {
  const { series, xaxis, legend } = props

  const options = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      zlevel: 0,
      x: 50,
      x2: 50,
      y: 40,
      y2: 40,
      borderWidth: 0,
    },
    xAxis: { ...xaxis, boundaryGap: false },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#8791af",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(166, 176, 207, 0.1)",
        },
      },
    },
    series: series,
    legend: {
      data: legend,
    },
    color: ["#2a91d8", "#59a84b", "#ca5952", "#f2bb46", "#6658ef"],
    textStyle: {
      color: ["#8791af"],
    },
  }

  return (
    <>
      <ReactEcharts
        series={series}
        style={{ height: "400px" }}
        option={options}
      />
    </>
  )
}

export default LineChart
