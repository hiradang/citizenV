// import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Pagination from '../Pagination';
import Select from '../select';
import TableCitizen from '../TableCitizen_B';
import Search from '../searchCitizen';
import SelectOption from '../selectOption';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../styleCitizen.scss';


var addName = {
  city_name: 'addCity_name',
  district_name: 'addDistrict_name',
  ward_name: 'addWard_name',
  hamlet_name: 'addHamlet_name',
};
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
  const selectOptionName = ['Quê quán', 'Địa chỉ thường trú', 'Địa chỉ tạm trú'];
  const [districtName, setDistrictName] = useState('');
  const [cityName, setCityName] = useState('');
  const [wardName, setWardName] = useState('');
  const [hamletName, setHamletName] = useState('');
  const idHamlet = Cookies.get('user');
  var idCity = idHamlet.toString().substr(0, 2);
  var idDistrict = idHamlet.toString().substr(0, 4);
  var idWard = idHamlet.toString().substr(0, 6);


  useEffect(() => {
    axios.get(`http://localhost:3001/hamlet/id?id=${idHamlet}`).then((response) => {
        setHamletName(response.data.hamlet_name);
      });
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
    
  }, []);

  useEffect(() => {
    if (searchId.length === 9 || searchId.length === 12) {
      axios.get(`http://localhost:3001/citizen/${searchId}`).then((response) => {
        setListCitizen(response.data);
      });
    }
  }, [searchId]);

  function handleDelete (id_citizen) {
    console.log(id_citizen)
    axios.delete(`http://localhost:3001/citizen/${id_citizen}`).then((response) => {
      var temp = rows.filter((row) => {
        return (row.id_citizen !== id_citizen);
      });
      setRows(temp)
      setListCitizen(listCitizen.filter((row) => {
        return (row.id_citizen !== id_citizen);
      }))
    });
  }
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
        row[addName.district_name] === districtName &&
        row[addName.city_name] === cityName &&
        row[addName.ward_name] === wardName &&
        row[addName.hamlet_name] === hamletName
      );
    });
    
    setListCitizen(temp);
  }
  function editRow() {
    axios.get(`http://localhost:3001/citizen/`).then((response) => {
      setRows(response.data);
      var temp = response.data.filter((row) => {
        return row.address.indexOf(idCity) === 0;
      });
      setListCitizen(temp);
    });
  }
  return (        
    <div className="grid container-all-citizen">
      <div className="row">
        <div className="col l-12 m-12 c-12">
          <h2>
            Danh sách dân số {hamletName}, {wardName}, {districtName}, {cityName}
          </h2>
        </div>
      </div>
      <div className="row">
        <div className="col l-12 m-12 c-12">
          <Paper>
            <div className="row first">
              <div className="col l-3 m-5 c-12">
                <SelectOption
                  label="Địa điểm"
                  item="id_add"
                  changeItem={(item, name) => changeRows(item, name)}
                  names = {selectOptionName}
                ></SelectOption>
              </div>
            </div>

            <div className="row">
              <div className="col l-12 m-12 c-12">
                <Pagination
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalRecords={listCitizen.length}
                  changePage={(page) => setPage(page)}
                  changeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
                />
              </div>
            </div>

            <div className="row table-container">
              <div className="col l-12 m-12 c-12">
                <TableCitizen rows={listCitizen} page={page} rowsPerPage={rowsPerPage} 
                handleDelete = {(id_citizen) =>handleDelete(id_citizen)} editRow = {() => editRow()} />
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}
