import React from 'react';
import { Chart } from 'chart.js/auto';

import { Line } from 'react-chartjs-2';

var convertFromCriteriaToName = require('../utils').convertFromCriteriaToName;

export default function LineChart(props) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Biểu đồ thể hiện số lượng theo ${convertFromCriteriaToName(props.criteria)}`,
      },
    },
  };

  const labels = props.input.map((ele) => ele.name);

  const data = {
    labels,
    datasets: [
      {
        label: `${convertFromCriteriaToName(props.criteria)}`,
        data: props.input.map((ele) => ele.quantity),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return <Line options={options} data={data} />;
}
