import Table from './Table';
import * as React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Images
import MaleImage from '../../../constants/images/statistics/male.svg';
import FemaleImage from '../../../constants/images/statistics/female.svg';
import Religion from '../../../constants/images/statistics/religion.jpg';
import Ethnic from '../../../constants/images/statistics/ethnic.jpg';
import Population from '../../../constants/images/statistics/population.jpg';
import BoyGirl from '../../../constants/images/statistics/boyandgirl.svg';

import Pagination from '../../all-citizen/Pagination';
import { min } from 'moment';

var findLargertAndSmallest = require('../utils').findLargertAndSmallest;

export default function General(props) {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const data = props.statisticData;

  const printBoyAndGirl = () => {
    let ratio = props.statisticData.countBoyGirl;
    if (ratio) {
      return (
        <div>
          <h2 className="header">
            {`Tỉ lệ Nam : Nữ khi sinh là: `}
            <span className="figure">
              {ratio.countBoy} : {ratio.countGirl}
            </span>
          </h2>

          <div className="boygirl-img">
            <img src={BoyGirl} alt="boy and girl" />
          </div>
        </div>
      );
    } else return <></>;
  };

  const printMaxAndMin = () => {
    if (props.listLocal.length >= 3) {
      let minAndMax = findLargertAndSmallest(props.listLocal);
      let minLocal = minAndMax.minLocal;
      let maxLocal = minAndMax.maxLocal;
      return (
        <div>
          <div className="maxLocal">
            <h2 className="header">
              {`Địa phương có dân số đông nhất: `} <span className="figure">{maxLocal.name}</span>
              <p>
                Dân số: {maxLocal.quantity}, chiếm{' '}
                {((maxLocal.quantity / data.totalPopulation) * 100).toFixed(2)}%
              </p>
            </h2>
          </div>

          <div className="minLocal">
            <h2 className="header">
              {`Địa phương có dân số ít nhất: `} <span className="figure">{minLocal.name}</span>
              <p>
                Dân số: {minLocal.quantity}, chiếm{' '}
                {((minLocal.quantity / data.totalPopulation) * 100).toFixed(2)}%
              </p>
            </h2>
          </div>

          <div className="population-img">
            <img src={Population} alt="population" />
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const exportExcel = () => {
    var wb = XLSX.utils.book_new();
    wb.SheetNames.push('Sheet 1');
    var ws = XLSX.utils.json_to_sheet(
      props.listLocal.map((local, key) => {
        return {
          STT: key + 1,
          'Tên địa phương': local.name,
          'Số lượng': local.quantity,
        };
      })
    );
    wb.Sheets['Sheet 1'] = ws;

    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf); //create uint8array as viewer
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
      return buf;
    }

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'Thống kê dân số.xlsx');
  };

  return (
    <div className="general-container">
      <div className="population">
        <h2 className="header center">
          Tổng dân số: <span className="figure">{data.totalPopulation}</span>
        </h2>
        <div className="detail">
          <div>
            <img src={MaleImage} className="gender-icon" alt="male" />
            <h3>
              {data.genderArray[0].name === 'Nam'
                ? data.genderArray[0].quantity
                : data.genderArray[1].quantity}
              %
            </h3>
          </div>
          <div>
            <img src={FemaleImage} className="gender-icon" alt="female" />
            <h3>
              {data.genderArray[0].name === 'Nữ'
                ? data.genderArray[0].quantity
                : data.genderArray[1].quantity}
              %
            </h3>
          </div>
        </div>

        {printBoyAndGirl()}
        {printMaxAndMin()}
      </div>

      <div className="laborCount">
        <h2 className="header">
          {`Dân số trong độ tuổi lao động là: `} <span className="figure">{data.laborCount}</span>
          <p>Chiếm {((data.laborCount / data.totalPopulation) * 100).toFixed(2)}%</p>
        </h2>
      </div>

      <div className="religion">
        <h2 className="header">
          Tôn giáo phổ biến nhất: <span className="figure">{data.mostPopularReligion[1].name}</span>
        </h2>
        <div className="religion-img">
          <img src={Religion} alt="religion" />
        </div>
      </div>

      <div className="ethnic">
        <h2 className="header">
          {`Dân tộc phổ biến nhất là: `}{' '}
          <span className="figure">{data.mostPopularEthnic[0].name}</span>
          <p>
            Chiếm {((data.mostPopularEthnic[0].quantity / data.totalPopulation) * 100).toFixed(2)}%
          </p>
        </h2>
        <div className="ethnic-img">
          <img src={Ethnic} alt="ethnic" />
        </div>
      </div>

      {/* 
      tỉ lệt thất nghiệp trong độ tuổi lao động
      tỉ lệ Nam - nữ khi sinh (tính với tuổi = 0)
       */}

      <Button variant="outlined" className="printButton" onClick={exportExcel}>
        Xuất file Excel
      </Button>

      <Pagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalRecords={props.listLocal.length}
        changePage={(page) => setPage(page)}
        changeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
      />

      {props.listLocal ? (
        <Table rows={props.listLocal} page={page} rowsPerPage={rowsPerPage} />
      ) : (
        {}
      )}
    </div>
  );
}
