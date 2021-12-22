import '../style.scss';
import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import Box from '@mui/material/Box';
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

function Statistics() {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listCitizen, setListCitizen] = useState([]);
  const [listCityName, setListCityName] = useState([]);
  const [rows, setRows] = useState([]);
  const [listCity, setListCity] = useState([]);
  const [listDistrictName, setListDistrictName] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  // Xet tieu chi lua chon khi thong ke
  const [criteria, setCriteria] = useState('');
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
  const [idCity, setIdCity] = useState('');
  const [idDistrict, setIdDistrict] = useState('');
  const [idWard, setIdWard] = useState('');
  const [listWardName, setListWardName] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [listHamletName, setListHamletName] = useState([]);
  const [listHamlet, setListHamlet] = useState([]);
  var tempListCityName = [];
  var tempListDistrictName = [];
  var tempListWardName = [];
  var tempListHamletName = [];
  useEffect(() => {
    axios.get('http://localhost:3001/city').then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        tempListCityName[i] = response.data[i].city_name;
      }
      setListCityName(tempListCityName);
      setListCity(response.data);
    });
    axios.get('http://localhost:3001/citizen').then((response) => {
      setRows(response.data);
      setListCitizen(response.data);
    });
  }, []);
  useEffect(() => {
    if (idCity !== '') {
      axios.get(`http://localhost:3001/district/${idCity}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (tempListDistrictName.indexOf(response.data[i].district_name) === -1) {
            tempListDistrictName[tempListDistrictName.length] = response.data[i].district_name;
          }
        }
        setListDistrictName(tempListDistrictName);
        setListDistrict(response.data);
      });
    }
  }, [idCity]);
  useEffect(() => {
    if (idDistrict !== '') {
      axios.get(`http://localhost:3001/ward/${idDistrict}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (tempListWardName.indexOf(response.data[i].ward_name) === -1) {
            tempListWardName[tempListWardName.length] = response.data[i].ward_name;
          }
        }
        setListWardName(tempListWardName);
        setListWard(response.data);
      });
    }
  }, [idDistrict]);
  useEffect(() => {
    if (idWard !== '') {
      axios.get(`http://localhost:3001/hamlet/${idWard}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (tempListHamletName.indexOf(response.data[i].hamlet_name) === -1) {
            tempListHamletName[tempListHamletName.length] = response.data[i].hamlet_name;
          }
        }
        setListHamletName(tempListHamletName);
        setListHamlet(response.data);
      });
    }
  }, [idWard]);

  function changeRows(item, name) {
    filter[name] = item;

    if (name === 'id_city') {
      filter.id_district = [];
      filter.id_ward = [];
      filter.id_hamlet = [];
      if (filter.id_city.length > 1) setListDistrictName([]);
      setListWardName([]);
      setListHamletName([]);
    } else if (name === 'id_district') {
      filter.id_ward = [];
      filter.id_hamlet = [];
      if (filter.id_district.length > 1) setListWardName([]);
      setListHamletName([]);
    } else if (name === 'id_ward') {
      if (filter.id_ward.length > 1) setListHamletName([]);
    }
    // if (item.length > 0) {
    var tempCitizens = rows.filter((row) => {
      return (
        (filter.id_district.indexOf(row[addName.district_name]) !== -1 ||
          filter.id_district.length === 0) &&
        (filter.id_city.indexOf(row[addName.city_name]) !== -1 || filter.id_city.length === 0) &&
        (filter.id_ward.indexOf(row[addName.ward_name]) !== -1 || filter.id_ward.length === 0) &&
        (filter.id_hamlet.indexOf(row[addName.hamlet_name]) !== -1 || filter.id_hamlet.length === 0)
      );
    });
    setListCitizen(tempCitizens);
    // }
    if (item.length === 1) {
      if (name === 'id_city') {
        let index = listCity.findIndex((x) => x.city_name === item[0]);
        setIdCity(listCity[index].id_city);
      } else if (name === 'id_district') {
        let index = listDistrict.findIndex((x) => x.district_name === item[0]);
        setIdDistrict(listDistrict[index].id_district);
      } else if (name === 'id_ward') {
        let index = listWard.findIndex((x) => x.ward_name === item[0]);
        setIdWard(listWard[index].id_ward);
      }
    }

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
        setDataTable(tempCitizens);
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
      return <General citizens={dataTable} />;
      // return 'running';
    } else if (criteria === '') {
      return (
        <div className="statistic-img">
          <img src={Statistic} alt="statistic" />
        </div>
      );
    } else if (criteria === 'age') {
      return (
        <div>
          <div className="graph verticalBar center">
            <VerticalBar input={dataTable} criteria={criteria} />
          </div>

          <div className="graph lineChart center">
            <LineChart input={dataTable} criteria={criteria} />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="graph-container">
            <div className="graph pieChart">
              <PieChart input={dataTable} criteria={criteria} />
            </div>
            <div className="graph verticalBar">
              <VerticalBar input={dataTable} criteria={criteria} width={500} />
            </div>
          </div>

          <div>
            <Pagination
              page={page}
              rowsPerPage={rowsPerPage}
              totalRecords={dataTable.length}
              changePage={(page) => setPage(page)}
              changeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
            />
            <TableTemplate rows={dataTable} page={page} rowsPerPage={rowsPerPage} />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container">
      <h2>Kết quả điều tra dân số </h2>
      <Box sx={{ maxWidth: 1200, flexGrow: 1 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Select
            names={listCityName}
            label="Tỉnh/Thành phố"
            item="id_city"
            changeItem={(item, name) => changeRows(item, name)}
          />
          <Select
            names={listDistrictName}
            label="Quận/Huyện"
            item="id_district"
            changeItem={(item, name) => changeRows(item, name)}
          />
          <Select
            names={listWardName}
            label="Phường/Xã"
            item="id_ward"
            changeItem={(item, name) => changeRows(item, name)}
          />
          <Select
            names={listHamletName}
            label="Thôn/Xóm"
            item="id_hamlet"
            changeItem={(item, name) => changeRows(item, name)}
          />

          <SelectOption
            label="Tiêu chí"
            item="id_criteria"
            changeItem={(item, name) => changeRows(item, name)}
            names={selectOptionNames}
          ></SelectOption>

          {chooseDisplayInfo()}
        </Paper>
      </Box>
    </div>
  );
}

export default Statistics;
