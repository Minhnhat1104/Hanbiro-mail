// @ts-nocheck
import React from "react"
import { Doughnut } from "react-chartjs-2"
import HanIcon from "../HanIcon"
import "./styles.scss"

function index({ progress = 100 }) {
  if (progress == 100) {
    return (
      <div className="new-mail-han-progress">
        <HanIcon name="Check" color="#43A047" />
      </div>
    )
  }

  return (
    <div className="new-mail-han-progress">
      <div className="progress-container">
        <Doughnut
          width={40}
          height={40}
          data={{
            radius: "60%",
            datasets: [
              {
                data: [progress, 100 - progress],
                backgroundColor: ["#43A047", "#E1E5ED"],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: false,
            maintainAspectRatio: false,
            cutoutPercentage: 80,
            legend: {
              display: false,
            },
            tooltips: {
              enabled: false,
            },
          }}
        />
        <div className="progress">
          <span className="text-progress">{`${progress}%`}</span>
        </div>
      </div>
    </div>
  )
}

export default index
