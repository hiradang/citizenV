import Table from './Table';
import * as React from 'react';
import { useEffect } from 'react';
import { convertAgeToArray } from '../utils';

// Images
import MaleImage from '../../../constants/images/statistics/male.svg';
import FemaleImage from '../../../constants/images/statistics/female.svg';
import Religion from '../../../constants/images/statistics/religion.jpg';
import Ethnic from '../../../constants/images/statistics/ethnic.jpg';

// Utils fucntions
var convertToCountArray = require('../utils').convertToCountArray;
var convertToPercent = require('../utils').convertToPercent;
var getTopN = require('../utils').getTopN;

export default function General(props) {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataTable, setDataTable] = React.useState([]);
  const [citizens, setCitizens] = React.useState([]);

  useEffect(() => {
    setCitizens(props.citizens);
  }, []);

  let genderArray = convertToCountArray(citizens, 'gender');
  genderArray = convertToPercent(genderArray);

  let religionArray = convertToCountArray(citizens, 'religion');
  let mostPopularReligion = getTopN(religionArray, 2);

  let ethnicArray = convertToCountArray(citizens, 'ethnic');
  let mostPopularEthinc = getTopN(ethnicArray, 1);

  return (
    <div className="general-container">
      <div className="population">
        <h2 className="header center">
          Tổng dân số: <span className="figure">{citizens.length}</span>
        </h2>

        <div className="detail">
          <div>
            <img src={MaleImage} className="gender-icon" alt="male" />
            <h3>
              {genderArray[0].name === 'Nam' ? genderArray[0].quantity : genderArray[1].quantity}%
            </h3>
          </div>
          <div>
            <img src={FemaleImage} className="gender-icon" alt="female" />
            <h3>
              {genderArray[0].name === 'Nữ' ? genderArray[0].quantity : genderArray[1].quantity}%
            </h3>
          </div>
        </div>
      </div>

      <div className="religion">
        <h2 className="header">
          Tôn giáo phổ biến nhất: <span className="figure">{mostPopularReligion[1].name}</span>
        </h2>
        <div className="religion-img">
          <img src={Religion} alt="religion" />
        </div>
      </div>

      <div className="ethnic">
        <h2 className="header">
          {`Dân tộc phổ biến nhất là: `} <span className="figure">{mostPopularEthinc[0].name}</span>
        </h2>
        <div className="ethnic-img">
          <img src={Ethnic} alt="ethnic" />
        </div>
      </div>

      {/* Tỉnh thành đông dân nhất, ít dân nhất
      tỉ lệ người trong độ tuổi lao động
      tỉ lệt thất nghiệp trong độ tuổi lao động
      tỉ lệ Nam - nữ khi sinh (tính với tuổi = 0)
       */}
      {/* Check nếu khi mới vào sẽ dùng dữ liệu có sẵn */}
      <Table rows={genderArray} page={page} rowsPerPage={rowsPerPage} />
    </div>
  );
}
