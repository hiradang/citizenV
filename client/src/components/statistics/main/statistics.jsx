import '../style.scss';
import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

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

var convertToCountArray = require('../utils').convertToCountArray;

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
  const selectOptionNames = [
    'Chung',
    'Độ tuổi',
    'Giới tính',
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
    // Mặc định cho địa chỉ là địa chỉ thường trú
    // if (name === 'id_add') {
    //   if (item === 'Địa chỉ tạm trú') {
    //     addName.city_name = 'tempCity_name';
    //     addName.district_name = 'tempDistrict_name';
    //     addName.ward_name = 'tempWard_name';
    //     addName.hamlet_name = 'tempHamlet_name';
    //   } else if (item === 'Địa chỉ thường trú') {
    //     addName.city_name = 'addCity_name';
    //     addName.district_name = 'addDistrict_name';
    //     addName.ward_name = 'addWard_name';
    //     addName.hamlet_name = 'addHamlet_name';
    //   } else {
    //     addName.city_name = 'homeCity_name';
    //     addName.district_name = 'homeDistrict_name';
    //     addName.ward_name = 'homeWard_name';
    //     addName.hamlet_name = 'homeHamlet_name';
    //   }
    // } else filter[name] = item;

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
    var temp = rows.filter((row) => {
      return (
        (filter.id_district.indexOf(row[addName.district_name]) !== -1 ||
          filter.id_district.length === 0) &&
        (filter.id_city.indexOf(row[addName.city_name]) !== -1 || filter.id_city.length === 0) &&
        (filter.id_ward.indexOf(row[addName.ward_name]) !== -1 || filter.id_ward.length === 0) &&
        (filter.id_hamlet.indexOf(row[addName.hamlet_name]) !== -1 || filter.id_hamlet.length === 0)
      );
    });
    setListCitizen(temp);
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
      if (item === 'Tôn giáo') {
        setDataTable(convertToCountArray(listCitizen, 'religion'));
      } else if (item === 'Nghề nghiệp') {
        setDataTable(convertToCountArray(listCitizen, 'job'));
      } else if (item === 'Trình độ văn hóa') {
        setDataTable(convertToCountArray(listCitizen, 'level'));
      } else if (item === 'Giới tính') {
        setDataTable(convertToCountArray(listCitizen, 'gender'));
      }
    }
  }

  return (
    <div className="container">
      <h2>Kết quả điều tra dân số </h2>
      <Box sx={{ maxWidth: 1300, flexGrow: 1 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <SelectOption
            label="Tiêu chí"
            item="id_criteria"
            changeItem={(item, name) => changeRows(item, name)}
            names={selectOptionNames}
          ></SelectOption>
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
          <Pagination
            page={page}
            rowsPerPage={rowsPerPage}
            totalRecords={listCitizen.length}
            changePage={(page) => setPage(page)}
            changeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
          />
        </Paper>

        <TableTemplate rows={dataTable} page={page} rowsPerPage={rowsPerPage} />
      </Box>
    </div>
  );
}

export default Statistics;
