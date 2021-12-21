import React from 'react';
import { Chart } from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

var getTopN = require('../utils').getTopN;
var convertToPercent = require('../utils').convertToPercent;
var convertFromCriteriaToName = require('../utils').convertFromCriteriaToName;

export default function PieChart(props) {
  let input = [];
  if (props.input.length > 6) {
    input = getTopN(props.input, 6);
  } else input = props.input;

  input = convertToPercent(input);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: `Biểu đồ thể hiện tỉ lệ ${convertFromCriteriaToName(props.criteria)} (đơn vị: %)`,
      },
    },
  };

  const data = {
    labels: input.map((ele) => ele.name),
    datasets: [
      {
        label: '# of Votes',
        data: input.map((ele) => ele.quantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(48, 47, 48, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(48, 47, 48, 0.2)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} options={options} />;
}
