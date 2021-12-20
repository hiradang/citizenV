import React from 'react';
import { Chart } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';

const getTopN = require('../utils').getTopN;

export default function VerticalBar(props) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  let input = [];

  if (props.input.length > 5) {
    input = getTopN(props.input, 5);
  } else input = props.input;

  // Khong lay con lai
  const newTop5 = input.slice(0, 5);
  const labels = newTop5.map((ele) => ele.name);

  const data = {
    labels,
    datasets: [
      {
        label: 'Giới tính',
        data: newTop5.map((ele) => ele.quantity),
        backgroundColor: 'rgba(144, 245, 186, 0.5)',
        borderColor: 'rgba(144, 245, 186, 1)',
      },
      // {
      //   label: 'Dataset 2',
      //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      // },
    ],
  };

  return <Bar options={options} data={data} />;
}
