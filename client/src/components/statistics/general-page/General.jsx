import Table from './Table';
import * as React from 'react';
import { convertAgeToArray } from '../utils';

var convertToCountArray = require('../utils').convertToCountArray;
var convertToPercent = require('../utils').convertToPercent;
var getTopN = require('../utils').getTopN;

export default function General(props) {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataTable, setDataTable] = React.useState([]);

  let genderArray = convertToCountArray(props.citizens, 'gender');
  genderArray = convertToPercent(genderArray);

  let religionArray = convertToCountArray(props.citizens, 'religion');
  let mostPopularReligion = getTopN(religionArray, 1);
  mostPopularReligion = mostPopularReligion[0].name;

  return (
    <div>
      <h2>Tổng dân số: {props.citizens.length}</h2>
      <h2>Tôn giáo phổ biến nhất là: {mostPopularReligion}</h2>
      {genderArray.map((ele) => {
        return (
          <h1>
            {ele.name} : {ele.quantity}%
          </h1>
        );
      })}

      <Table rows={genderArray} page={page} rowsPerPage={rowsPerPage} />
    </div>
  );
}
