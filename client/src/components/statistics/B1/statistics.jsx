import '../style.scss';
import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import Paper from '@mui/material/Paper';
import Pagination from '../../all-citizen/Pagination';
import Select from '../../all-citizen/select';
import TableTemplate from '../TableTemplate';
import SelectOption from '../../all-citizen/selectOption';

// Charts
import PieChart from '../charts/PieChart';
import VerticalBar from '../charts/VerticalBar';
import HorizontalBar from '../charts/HorizontalBar';
import LineChart from '../charts/LineChart';

import General from '../general-page/General';
import Statistic from '../../../constants/images/statistics/statistic.svg';

var convertToCountArray = require('../utils').convertToCountArray;
var convertAgeToArray = require('../utils').convertAgeToArray;
var convertAgeJump10 = require('../utils').convertAgeJump10;
var convertToPercent = require('../utils').convertToPercent;
var getTopN = require('../utils').getTopN;
var countNumberOverAge = require('../utils').countNumberOverAge;
var calculateBoyGirlRatio = require('../utils').calculateBoyGirlRatio;

function Statistics() {
  const userId = Cookies.get('user');

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listCitizen, setListCitizen] = useState([]);
  const [rows, setRows] = useState([]);
  const [listDistrictName, setListDistrictName] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  // Xet tieu chi lua chon khi thong ke
  const [criteria, setCriteria] = useState('');
  // Data general statistic
  const [generalStatistic, setGeneralStatistic] = useState({});
  const [listLocal, setListLocal] = useState([]);
  // Các tiêu chí khi thống kê
  const selectOptionNames = [
    'Chung',
    'Độ tuổi',
    'Giới tính',
    'Dân tộc',
    'Tôn giáo',
    'Nghề nghiệp',
    'Trình độ văn hóa',
  ];
  const [filter, setFilter] = useState({
    id_city: [],
    id_district: [],
    id_ward: [],
    id_hamlet: [],
  });
  var addName = {
    city_name: 'addCity_name',
    district_name: 'addDistrict_name',
    ward_name: 'addWard_name',
    hamlet_name: 'addHamlet_name',
  };

  const [listWard, setListWard] = useState([]);
  const [listHamletName, setListHamletName] = useState([]);
  const [listHamlet, setListHamlet] = useState([]);
  var tempListHamletName = [];
  useEffect(() => {
    axios.get(`http://localhost:3001/hamlet/${userId}`).then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        tempListHamletName[i] = response.data[i].hamlet_name;
      }
      setListHamletName(tempListHamletName);
      setListHamlet(response.data);
    });
    axios.get('http://localhost:3001/citizen').then((response) => {
      setRows(response.data);
      setListCitizen(response.data);
      console.log(response.data);
    });
  }, []);

  function changeRows(item, name) {
    // Send list selected id to general statistic
    if (name === 'id_hamlet') {
      let listLocal = item.map((local) => {
        let index = listHamlet.findIndex((x) => x.hamlet_name === local);
        return {
          name: listHamlet[index].hamlet_name,
          quantity: listHamlet[index].quantity_hamlet,
        };
      });
      setListLocal(listLocal);
    }

    // Set filter
    filter[name] = item;

    if (name === 'id_ward') {
      if (filter.id_ward.length > 1) setListHamletName([]);
    }
    // if (item.length > 0) {
    var tempCitizens = rows.filter((row) => {
      return (
        filter.id_hamlet.indexOf(row[addName.hamlet_name]) !== -1 || filter.id_hamlet.length === 0
      );
    });
    setListCitizen(tempCitizens);

    // Xét thông tin cho thống kê chung
    var tempGenderArray = convertToCountArray(tempCitizens, 'gender');
    tempGenderArray = convertToPercent(tempGenderArray);
    let tempReligionArray = convertToCountArray(tempCitizens, 'religion');
    let tempEthnicArray = convertToCountArray(tempCitizens, 'ethnic');
    // age >= 15, trong độ tuổi lao động
    let over15 = countNumberOverAge(tempCitizens, 15);
    let countBoyGirl = calculateBoyGirlRatio(tempCitizens);

    setGeneralStatistic({
      totalPopulation: tempCitizens.length,
      genderArray: tempGenderArray,
      mostPopularEthnic: getTopN(tempEthnicArray, 1),
      mostPopularReligion: getTopN(tempReligionArray, 2),
      laborCount: over15,
      countBoyGirl: countBoyGirl,
    });

    if (name === 'id_criteria') {
      var tempCriteria = '';
      if (item === 'Tôn giáo') {
        setCriteria('religion');
        tempCriteria = 'religion';
        setDataTable(convertToCountArray(tempCitizens, tempCriteria));
      } else if (item === 'Nghề nghiệp') {
        setCriteria('job');
        tempCriteria = 'job';
        setDataTable(convertToCountArray(tempCitizens, tempCriteria));
      } else if (item === 'Trình độ văn hóa') {
        setCriteria('level');
        tempCriteria = 'level';
        setDataTable(convertToCountArray(tempCitizens, tempCriteria));
      } else if (item === 'Giới tính') {
        setCriteria('gender');
        tempCriteria = 'gender';
        setDataTable(convertToCountArray(tempCitizens, tempCriteria));
      } else if (item === 'Dân tộc') {
        setCriteria('ethnic');
        tempCriteria = 'ethnic';
        setDataTable(convertToCountArray(tempCitizens, tempCriteria));
      } else if (item === 'Chung') {
        setCriteria('general');
        tempCriteria = 'general';
      } else if (item === 'Độ tuổi') {
        setCriteria('age');
        tempCriteria = 'age';
        let countArray = convertAgeToArray(tempCitizens);
        setDataTable(convertAgeJump10(countArray));
      }
    } else {
      if (criteria === 'age') {
        let countArray = convertAgeToArray(tempCitizens);
        setDataTable(convertAgeJump10(countArray));
      } else setDataTable(convertToCountArray(tempCitizens, criteria));
    }
  }

  // Chèn loại biểu đồ tùy thuộc vào từng loại tiêu chí
  const chooseDisplayInfo = function () {
    if (criteria === 'general') {
      return <General statisticData={generalStatistic} listLocal={listLocal} />;
      // return 'running';
    } else if (criteria === '') {
      return (
        <div className="statistic-img">
          <img src={Statistic} alt="statistic" />
        </div>
      );
    } else if (criteria === 'age') {
      return (
        <div className="grid container-age-chart">
          <div className="row age-chart">
            <div className="col l-8 l-o-2 m-8 m-o-2 c-11 c-o-0-5 ">
              <VerticalBar input={dataTable} criteria={criteria} />
            </div>

            <div className="col l-8 l-o-2 m-8 m-o-2 c-11 c-o-0-5">
              <LineChart input={dataTable} criteria={criteria} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="grid graph-container">
            <div className="row">
              <div className="col l-6 l-o-3 m-5 m-o-1 c-11 c-o-0-5">
                <PieChart input={dataTable} criteria={criteria} />
              </div>
            </div>

            <div className="col l-6 l-o-3 m-5 m-o-0 c-11 c-o-0-5" style={{ paddingTop: '40px' }}>
              <VerticalBar input={dataTable} criteria={criteria} width={500} />
            </div>
          </div>

          <div className="row">
            <div className="col l-12 m-12 c-12">
              <Pagination
                page={page}
                rowsPerPage={rowsPerPage}
                totalRecords={dataTable.length}
                changePage={(page) => setPage(page)}
                changeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col l-12 m-12 c-12">
              <TableTemplate rows={dataTable} page={page} rowsPerPage={rowsPerPage} />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="grid container-statistic">
      <div className="row">
        <div className="col l-12 m-12 c-12">
          <h2>Kết quả điều tra dân số </h2>
        </div>
      </div>

      <div className="row">
        <div className="col l-12 m-12 c-12">
          <Paper>
            <div className="row first">
              <div className="col l-5 m-5 c-12">
                <Select
                  names={listHamletName}
                  label="Thôn/Xóm"
                  item="id_hamlet"
                  changeItem={(item, name) => changeRows(item, name)}
                />
              </div>
              <div className="col l-5 m-5 c-12">
                <SelectOption
                  label="Tiêu chí"
                  item="id_criteria"
                  changeItem={(item, name) => changeRows(item, name)}
                  names={selectOptionNames}
                ></SelectOption>
              </div>
            </div>

            <div className="row container-chart">
              <div className="col l-12 m-12 c-12">{chooseDisplayInfo()}</div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
