// @ts-nocheck
import React from "react"
import ReactEcharts from "echarts-for-react"
import { useTranslation } from "react-i18next"

const PieChart = props => {
  const { data, type, legend } = props
  const { t } = useTranslation()
  const options = {
    toolbox: {
      show: true,
      feature: {
        restore: { show: true, title: t("common.org_refresh") },
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: legend,
      textStyle: {
        color: ["#8791af"],
      },
    },
    color: ["#2ec7c9", "#B6A2DE", "#5AB1EF", "#FFB980", "#D87A80"],
    series: [
      {
        type: type,
        radius: "55%",
        center: ["50%", "60%"],
        data: data,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  }
  return (
    <>
      <ReactEcharts style={{ height: "200px" }} option={options} />
    </>
  )
}

export default PieChart
