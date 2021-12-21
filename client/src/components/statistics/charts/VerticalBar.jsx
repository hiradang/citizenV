import React from 'react';
import { Chart } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';

const getTopN = require('../utils').getTopN;
var convertFromCriteriaToName = require('../utils').convertFromCriteriaToName;

export default function VerticalBar(props) {
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

  if (props.input.length > 5 && props.criteria !== 'age') {
    var input = getTopN(props.input, 5);
    // Khong lay con lai
    input = input.slice(0, 5);
  } else input = props.input;

  var labels = input.map((ele) => ele.name);
  const data = {
    labels,
    datasets: [
      {
        label: convertFromCriteriaToName(props.criteria),
        data: input.map((ele) => ele.quantity),
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
