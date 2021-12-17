import '../style.scss';

import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
// Icons
import EditIcon from '@mui/icons-material/EditOutlined';
import DoneIcon from '@mui/icons-material/DoneAllTwoTone';

import { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Components
import Search from '../Search';
import CustomTableCell from '../EditableCell';
import AddCityDialog from '../AddCityDialog';
import AddAccountDialog from '../AddAccountDialog';
import ConfirmDialog from '../ConfirmDeleteOne';
import ConfirmDeleteSelected from '../ConfirmDeleteSelected';
import ConfirmResetAccount from '../ConfirmResetAccount';
import AddCodeExcel from '../AddCodeExcel';
var removeVietnameseTones = require('../../../constants/utils/CheckText').removeVietnameseTones;

function Manage() {
  const [cities, setCities] = useState([]);
  const [previous, setPrevious] = React.useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Checkbox - Id của các thành phố khi được checkbox
  const [isAllChecked, setAllChecked] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3001/city`).then((response) => {
      setCities(
        response.data.map((element) => {
          return {
            id: element.id_city,
            city_name: element.city_name,
            hasAccount: element.hasAccount,
            isEditMode: false,
            isChecked: false,
          };
        })
      );
    });
  }, []);

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Custom table Cell
  const onToggleEditMode = (id) => {
    setCities((state) => {
      return cities.map((city) => {
        if (city.id === id) {
          return { ...city, isEditMode: !city.isEditMode };
        }
        return city;
      });
    });
  };

  const onChangeCityCode = (e, city) => {
    if (!previous[city.id]) {
      setPrevious((state) => ({ ...state, [city.id]: city }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = city;
    const newCities = cities.map((city) => {
      if (city.id === id) {
        return { ...city, [name]: value };
      }
      return city;
    });
    setCities(newCities);

    // Update city code
    axios.post(`http://localhost:3001/city/${id}`, { newCode: value }).then((res) => {});
  };

  const onChangeCityName = (e, city) => {
    if (!previous[city.id]) {
      setPrevious((state) => ({ ...state, [city.id]: city }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = city;
    const newCities = cities.map((city) => {
      if (city.id === id) {
        return { ...city, [name]: value };
      }
      return city;
    });
    setCities(newCities);

    // Update city code
    axios.post(`http://localhost:3001/city/${id}`, { newName: value }).then((res) => {});
  };

  // Supply new code
  const supplyCodeExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      const newCities = data.map((row) => {
        axios
          .post(`http://localhost:3001/city/`, {
            cityCode: row['Mã tỉnh/thành'],
            cityName: row['Tên tỉnh/thành'],
          })
          .then((res) => {});
        return {
          id: row['Mã tỉnh/thành'],
          city_name: row['Tên tỉnh/thành'],
          hasAccount: false,
          isEditMode: false,
          isChecked: false,
        };
      });
      setCities(newCities);
    });
  };

  // Export File to Excel
  const exportExcel = () => {
    var wb = XLSX.utils.book_new();
    wb.SheetNames.push('Sheet 1');
    var ws = XLSX.utils.json_to_sheet(
      cities.map((city, key) => {
        return {
          STT: key + 1,
          'Tên tỉnh/thành': city.city_name,
          'Mã tỉnh/thành': city.id,
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

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'test.xlsx');
  };

  // Supply account
  const supplyAccount = (defaultPassword) => {
    cities.forEach((city) => {
      Promise.all([
        axios.post(`http://localhost:3001/login`, {
          username: city.id,
          password: defaultPassword,
          role: 'A2',
        }),
        axios.post(`http://localhost:3001/city/${city.id}`, {
          hasAccount: true,
        }),
      ]);
    });

    const newCities = cities.map((city) => {
      return {
        id: city.id,
        city_name: city.city_name,
        hasAccount: true,
        isEditMode: false,
        isChecked: city.isChecked,
      };
    });
    setCities(newCities);
  };

  const supplyOneAccount = (cityId, defaultPassword) => {
    Promise.all([
      axios.post(`http://localhost:3001/login`, {
        username: cityId,
        password: defaultPassword,
        role: 'A2',
      }),
      axios.post(`http://localhost:3001/city/${cityId}`, {
        hasAccount: true,
      }),
    ]);

    const newCities = cities.map((city) => {
      return city.id === cityId
        ? {
            id: city.id,
            city_name: city.city_name,
            hasAccount: true,
            isEditMode: false,
            isChecked: city.isChecked,
          }
        : city;
    });
    setCities(newCities);
  };

  // Reset all account
  const resetAccount = () => {
    // Xóa các tài khoản đăng nhập và set lại trạng thái chưa cập nhật tài khoản
    cities.forEach((city) => {
      Promise.all([
        axios.post(`http://localhost:3001/city/${city.id}`, {
          hasAccount: false,
        }),
        axios.delete(`http://localhost:3001/login/${city.id}`),
      ]);
    });

    const newCities = cities.map((city) => {
      return {
        id: city.id,
        city_name: city.city_name,
        hasAccount: false,
        isEditMode: false,
        isChecked: city.isChecked,
      };
    });
    setCities(newCities);
  };

  // Reset one account
  const resetOneAccount = (cityId) => {
    Promise.all([
      axios.post(`http://localhost:3001/city/${cityId}`, {
        hasAccount: false,
      }),
      axios.delete(`http://localhost:3001/login/${cityId}`),
    ]);

    const newCities = cities.map((city) => {
      return city.id === cityId
        ? {
            id: city.id,
            city_name: city.city_name,
            hasAccount: false,
            isEditMode: false,
            isChecked: city.isChecked,
          }
        : city;
    });
    setCities(newCities);
  };

  // Add new city
  const handleAddNewCity = (cityName, cityCode) => {
    axios
      .post(`http://localhost:3001/city/`, { cityName: cityName, cityCode: cityCode })
      .then((res) => {});
    const newCity = {
      id: cityCode,
      city_name: cityName,
      hasAccount: false,
      isEditMode: false,
      isChecked: false,
    };
    const newCities = [...cities, newCity];
    setCities(newCities);
  };

  // Delete city
  const deleteCity = (id) => {
    const newCities = [];
    cities.forEach((city) => {
      if (city.id !== id) {
        newCities.push(city);
      }
    });
    setCities(newCities);
    Promise.all([
      axios.delete(`http://localhost:3001/city/${id}`),
      axios.delete(`http://localhost:3001/login/${id}`),
    ]);
  };

  // Handle search
  const handleSearch = (e) => {
    axios.get(`http://localhost:3001/city`).then((response) => {
      const listCities = response.data.map((element) => {
        return {
          id: element.id_city,
          city_name: element.city_name,
          hasAccount: element.hasAccount,
          isEditMode: false,
          isChecked: element.isChecked,
        };
      });

      let typed = removeVietnameseTones(e.target.value).toLowerCase();
      if (typed === '') {
        setCities(listCities);
      } else {
        let newCities = listCities.filter((city, index) => {
          return removeVietnameseTones(city.city_name).toLowerCase().includes(typed);
        });
        setCities(newCities);
      }
    });
  };

  // Delete selected City
  const deleteSelectedCity = () => {
    const newCities = [];
    cities.forEach((city) => {
      if (!city.isChecked) {
        newCities.push(city);
      }
    });
    setCities(newCities);

    cities.forEach((city) => {
      if (city.isChecked) {
        Promise.all([
          axios.delete(`http://localhost:3001/city/${city.id}`),
          axios.delete(`http://localhost:3001/login/${city.id}`),
        ]);
      }
    });

    // Reset lại danh sách các city đã được chọn
    setAllChecked(false);

    // Reset lại các checkbox
    // const listCheckbox = document.querySelectorAll('.checkbox');
    // for (let i = 0; i < listCheckbox.length; i++) {
    //   listCheckbox[i].checked = false;
    // }
  };

  const handleCheckboxAll = (e) => {
    setAllChecked(!isAllChecked);
    const newCities = cities.map((city) => {
      return {
        id: city.id,
        city_name: city.city_name,
        hasAccount: city.hasAccount,
        isEditMode: false,
        isChecked: e.target.checked,
      };
    });
    setCities(newCities);
  };

  // Handle onchange of the checkbox
  const onChangeCheckbox = (id, checked) => {
    const newCities = cities.map((city) => {
      return city.id === id
        ? {
            id: city.id,
            city_name: city.city_name,
            hasAccount: city.hasAccount,
            isEditMode: false,
            isChecked: checked,
          }
        : city;
    });
    setCities(newCities);

    // Kiểm tra nút check all
    const allChecked = newCities.every((city) => city.isChecked);
    setAllChecked(allChecked);
  };

  return (
    <div className="page-container">
      <div className="actions">
        <div className="navigation">
          <div className="buttons">
            <div className="button actionButton">
              <AddCodeExcel handler={supplyCodeExcel} title="Cấp mã từ file Excel" />
            </div>

            <AddAccountDialog
              title="Cấp tài khoản"
              className="actionButton button"
              variant="contained"
              handler={supplyAccount}
            />

            <Button
              variant="contained"
              className="actionButton button exportExcelBtn"
              onClick={exportExcel}
            >
              Xuất file Excel
            </Button>

            <div className="button actionButton">
              <ConfirmResetAccount handler={resetAccount} title="Reset lại tài khoản" />
            </div>
          </div>

          <Search className="searchBar" handler={handleSearch} />
        </div>
      </div>

      <div className="addCity">
        <AddCityDialog title="Thêm tỉnh/thành phố" handler={handleAddNewCity} />
      </div>

      <Paper>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={cities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Table aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell align="left">STT</TableCell>
              <TableCell align="left">Tên tỉnh/thành</TableCell>
              <TableCell align="left">Mã Tỉnh/thành</TableCell>
              <TableCell align="left">Tài khoản</TableCell>
              <TableCell align="left">Hành động</TableCell>
              <TableCell align="right">
                <input type="checkbox" checked={isAllChecked} onChange={handleCheckboxAll} />
              </TableCell>
              <TableCell align="left">
                <ConfirmDeleteSelected
                  handler={deleteSelectedCity}
                  title="Xóa các tỉnh thành đã chọn"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((city, key) => (
              <TableRow key={city.key}>
                <TableCell>{key + 1}</TableCell>
                <CustomTableCell source={city} name="city_name" handleOnChange={onChangeCityName} />
                <CustomTableCell source={city} name="id" handleOnChange={onChangeCityCode} />
                <TableCell>
                  {city.hasAccount ? (
                    <AddAccountDialog
                      title="Đang hoạt động"
                      className="actionButton button"
                      variant="outlined"
                      handler={resetOneAccount}
                      cityId={city.id}
                    />
                  ) : (
                    <AddAccountDialog
                      title="Chưa cấp"
                      className="actionButton button"
                      variant="outlined"
                      color="error"
                      cityId={city.id}
                      handler={supplyOneAccount}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {city.isEditMode ? (
                    <>
                      <IconButton aria-label="done" onClick={() => onToggleEditMode(city.id)}>
                        <DoneIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton aria-label="delete" onClick={() => onToggleEditMode(city.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton>
                        <ConfirmDialog
                          title="xoá tỉnh/thành phố"
                          handler={deleteCity}
                          id={city.id}
                        />
                      </IconButton>
                    </>
                  )}
                </TableCell>
                <TableCell align="right">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={city.isChecked}
                    onChange={(e) => onChangeCheckbox(city.id, e.target.checked)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default Manage;