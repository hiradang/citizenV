// import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';
import axios from 'axios';
// import './styles.scss';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Pagination from '../Pagination';
import Select from '../select';
import TableCitizen from '../TableCitizen';
import Search from '../searchCitizen';
import SelectOption from '../selectOption';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function Citizen() {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listCitizen, setListCitizen] = useState([]);
  const [rows, setRows] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [filter, setFilter] = useState({
    id_ward: [],
    id_hamlet: [],
  });
  var addName = {
    city_name: 'addCity_name',
    district_name: 'addDistrict_name',
    ward_name: 'addWard_name',
    hamlet_name: 'addHamlet_name',
  };
  const selectOptionName = ['Quê quán', 'Địa chỉ thường trú', 'Địa chỉ tạm trú'];
  const [districtName, setDistrictName] = useState('');
  const [cityName, setCityName] = useState('');
  const [wardName, setWardName] = useState('');
  const idWard = Cookies.get('user');
  var idCity = idWard.toString().substr(0,2);
  var idDistrict = idWard.toString().substr(0,4);
  console.log(idDistrict)
  const [listHamletName, setListHamletName] = useState([]);
  const [listHamlet, setListHamlet] = useState([]);
  
  var tempListWardName = [];
  var tempListHamletName = [];

  useEffect(() => {
    axios.get(`http://localhost:3001/ward/id?id=${idWard}`).then((response) => {
        setWardName(response.data.ward_name);
      });
    axios.get(`http://localhost:3001/district/id?id=${idDistrict}`).then((response) => {
      setDistrictName(response.data.district_name);
    });
    axios.get(`http://localhost:3001/city/${idCity}`).then((response) => {
      setCityName(response.data.city_name);
    });
    axios.get(`http://localhost:3001/citizen/`).then((response) => {
      setRows(response.data);
      var temp = response.data.filter((row) => {
        return row.address.indexOf(idCity) === 0;
      });
      setListCitizen(temp);
    });
    axios.get(`http://localhost:3001/hamlet/${idWard}`).then((response) => {
      let tempListHamletName = [];
      for (let i = 0; i < response.data.length; i++) {
        tempListHamletName[tempListHamletName.length] = response.data[i].hamlet_name;
      }
      setListHamletName(tempListHamletName);
      setListHamlet(response.data);
    });
  }, []);

  useEffect(() => {
    if (searchId != '') {
      axios.get(`http://localhost:3001/citizen/${searchId}`).then((response) => {
        setListCitizen(response.data);
      });
    }
  }, [searchId]);

  function changeRows(item, name) {
    if (name === 'id_add') {
      if (item === 'Địa chỉ tạm trú') {
        addName.city_name = 'tempCity_name';
        addName.district_name = 'tempDistrict_name';
        addName.ward_name = 'tempWard_name';
        addName.hamlet_name = 'tempHamlet_name';
      } else if (item === 'Địa chỉ thường trú') {
        addName.city_name = 'addCity_name';
        addName.district_name = 'addDistrict_name';
        addName.ward_name = 'addWard_name';
        addName.hamlet_name = 'addHamlet_name';
      } else {
        addName.city_name = 'homeCity_name';
        addName.district_name = 'homeDistrict_name';
        addName.ward_name = 'homeWard_name';
        addName.hamlet_name = 'homeHamlet_name';
      }
    } else filter[name] = item;
    // if (item.length > 0) {
    var temp = rows.filter((row) => {
      return (
        row[addName.district_name] === districtName && row[addName.city_name] === cityName &&
        row[addName.ward_name] === wardName &&
        (filter.id_hamlet.indexOf(row[addName.hamlet_name]) !== -1 || filter.id_hamlet.length === 0)
      );
    });
    setListCitizen(temp);
    
  }
  return (
    <div className="container">
      <h2>Danh sách dân số {wardName}, {districtName}, {cityName}</h2>
      <Box sx={{ maxWidth: 1300, flexGrow: 1 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <SelectOption
            label="Địa điểm"
            item="id_add"
            changeItem={(item, name) => changeRows(item, name)}
            names={selectOptionName}
          ></SelectOption>
          <Select
            names={listHamletName}
            label="Thôn/Xóm"
            item="id_hamlet"
            changeItem={(item, name) => changeRows(item, name)}
          />
          <Search search={(idCitizen) => setSearchId(idCitizen)} change={listCitizen} />
          <Pagination
            page={page}
            rowsPerPage={rowsPerPage}
            totalRecords={listCitizen.length}
            changePage={(page) => setPage(page)}
            changeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
          />
          <TableCitizen rows={listCitizen} page={page} rowsPerPage={rowsPerPage} />
        </Paper>
      </Box>
    </div>
  );
}
