import './style.scss';

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
import RevertIcon from '@mui/icons-material/NotInterestedOutlined';
import AddIcon from '@mui/icons-material/Add';

import { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import Search from './Search';
import CustomTableCell from './EditableCell';
import removeVietnameseTones from '../../constants/utils/RemoveVietnameseTone';

function Manage() {
  const [cities, setCities] = useState([]);
  const [isSetNewCode, setIsSetNewCode] = useState(false);
  const [isAccountPanel, setisAccountPanel] = useState(false);

  // Kiểm tra đã tiến hành cấp tài khoản hay chưa
  const [hasSuppliedAccount, setHasSuppliedAccount] = useState(false);
  const [defaultPassword, setDefaultPassword] = useState('password');

  const [excelTextWarning, setExcelTextWarning] = useState();
  const [file, setFile] = useState();
  const [previous, setPrevious] = React.useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Control disablitiy of buttons
  const [allowSupplyCode, setAllowSupplyCode] = useState();
  const [allowSupplyAuto, setAllowSupplyAuto] = useState();
  const [allowSupplyAccount, setAllowSupplyAccount] = useState();

  useEffect(() => {
    axios.get(`http://localhost:3001/city`).then((response) => {
      setCities(
        response.data.map((element) => {
          return {
            id: element.id_city,
            city_name: element.city_name,
            city_code: element.city_code,
            isEditMode: false,
          };
        })
      );

      // Kiểm tra xem lần trước đây đã tiến hành cấp mã hay chưa
      axios.get(`http://localhost:3001/login/${response.data[0].city_code}`).then((res) => {
        if (res.data === 'SUCCESS') {
          setHasSuppliedAccount(true);
          setAllowSupplyCode(false);
          setAllowSupplyAuto(false);
          setAllowSupplyAccount(false);
        } else {
          setHasSuppliedAccount(false);
          setAllowSupplyCode(true);
          setAllowSupplyAuto(true);
          setAllowSupplyAccount(true);
        }
      });
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

  const onChange = (e, city) => {
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

    // Update username of that city
    axios
      .post(`http://localhost:3001/login/updateUsername/${id}`, { newName: value })
      .then((res) => {});
  };

  const onRevert = (id) => {
    const newCities = cities.map((city) => {
      if (city.id === id) {
        return previous[id] ? previous[id] : city;
      }
      return city;
    });
    setCities(newCities);
    setPrevious((state) => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  // Supply Code auto
  const supplyCodeAuto = () => {
    setIsSetNewCode(false);
    setisAccountPanel(false);

    const newCities = cities.map((city) => {
      axios.post(`http://localhost:3001/city/${city.id}`, { newCode: city.id }).then((res) => {});
      return {
        id: city.id,
        city_name: city.city_name,
        city_code: city.id,
        isEditMode: false,
      };
    });

    setCities(newCities);
  };

  // Supply new code
  const supplyNewCode = () => {
    setIsSetNewCode(!isSetNewCode);
    setisAccountPanel(false);
    setExcelTextWarning('');
  };

  const saveNewCodeExcel = () => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        // Check xem các hàng đã đủ dữ liệu chưa
        const isFullData = (city) => {
          return city['ID City'] && city['City Name'] && city['City Code'];
        };
        if (data.length === 63) {
          if (data.every(isFullData)) {
            resolve(data);
          } else {
            setExcelTextWarning('Bạn chưa nhập đủ thông tin của các tỉnh/thành!');
          }
        } else {
          setExcelTextWarning('Bạn chưa nhập đủ số tỉnh/thành');
        }
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      const newCities = data.map((row) => {
        axios
          .post(`http://localhost:3001/city/${row['ID City']}`, { newCode: row['City Code'] })
          .then((res) => {});
        return {
          id: row['ID City'],
          city_name: row['City Name'],
          city_code: row['City Code'],
          isEditMode: false,
        };
      });
      setCities(newCities);
      setIsSetNewCode(false);
    });
  };

  // Export File to Excel
  const exportExcel = () => {
    var wb = XLSX.utils.book_new();
    wb.SheetNames.push('Sheet 1');
    var ws = XLSX.utils.json_to_sheet(
      cities.map((city, key) => {
        return {
          'ID City': city.id,
          'City Name': city.city_name,
          'City Code': city.city_code,
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
  const supplyAccount = () => {
    setisAccountPanel(!isAccountPanel);
    setIsSetNewCode(false);
  };

  const saveSupplyAccount = (e) => {
    setHasSuppliedAccount(true);
    setisAccountPanel(false);
    setAllowSupplyAccount(false);
    setAllowSupplyCode(false);
    setAllowSupplyAuto(false);
    cities.forEach((city) => {
      axios
        .post(`http://localhost:3001/login`, {
          id_account: city.id,
          username: city.city_code,
          password: defaultPassword,
        })
        .then(() => {});
    });
  };

  // Reset all code
  const resetCode = () => {
    setIsSetNewCode(false);
    setisAccountPanel(false);
    setAllowSupplyCode(true);
    setAllowSupplyAuto(true);
    setAllowSupplyAccount(true);

    // Xóa các tài khoản đăng nhập và set lại trạng thái chưa cập nhật tài khoản
    setHasSuppliedAccount(false);
    cities.forEach((city) => {
      axios.delete(`http://localhost:3001/login/${city.city_code}`).then((res) => {});
    });

    // Xóa code của các tỉnh thành
    const newCities = cities.map((city) => {
      axios.post(`http://localhost:3001/city/${city.id}`, { newCode: null }).then((res) => {});
      return {
        id: city.id,
        city_name: city.city_name,
        city_code: null,
        isEditMode: false,
      };
    });
    setCities(newCities);
  };

  const handleSearch = (e) => {
    axios.get(`http://localhost:3001/city`).then((response) => {
      const listCities = response.data.map((element) => {
        return {
          id: element.id_city,
          city_name: element.city_name,
          city_code: element.city_code,
          isEditMode: false,
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

  return (
    <div className="page-container">
      <div className="actions">
        <div className="navigation">
          <div className="buttons">
            <Button
              variant="contained"
              className="supplyCode button"
              onClick={supplyCodeAuto}
              disabled={!allowSupplyCode}
            >
              Cấp mã tự động
            </Button>

            <Button
              variant="contained"
              className="supplyCode button"
              onClick={supplyNewCode}
              disabled={!allowSupplyAuto}
            >
              Cấp mã tùy chỉnh
            </Button>

            <Button
              variant="contained"
              className="supplyCode button"
              onClick={supplyAccount}
              disabled={!allowSupplyAccount}
            >
              Cấp tài khoản
            </Button>

            <Button variant="contained" className="supplyCode button" onClick={exportExcel}>
              Xuất file Excel
            </Button>

            <Button variant="contained" className="supplyCode button" onClick={resetCode}>
              Reset
            </Button>
          </div>

          <Search className="searchBar" handler={handleSearch} />
        </div>

        {/* Import new code from excel */}
        {isSetNewCode ? (
          <>
            <p>Xuất file excel về và tùy chỉnh điền mã. Sử dụng file excel đó để cập nhật mã.</p>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                setFile(file);
              }}
              className="inputExcel"
            />
            <br />
            <p className="infoText">{excelTextWarning}</p>
            <Button variant="contained" onClick={saveNewCodeExcel}>
              Lưu
            </Button>
          </>
        ) : null}

        {/* Supply account*/}
        {isAccountPanel ? (
          <div>
            <p>Tên đăng nhập trùng với mã tỉnh/thành phố.</p>
            <label for="password">Mật khẩu mặc định: </label>
            <input
              type="text"
              id="password"
              name=""
              value={defaultPassword}
              onChange={(e) => setDefaultPassword(e.target.value)}
            />
            <br />
            <p className="infoText">
              {cities[0].city_code ? null : 'Bạn phải cấp mã tỉnh/thành trước khi cấp tài khoản.'}
            </p>
            <Button variant="contained" onClick={saveSupplyAccount} disabled={!cities[0].city_code}>
              Lưu
            </Button>
          </div>
        ) : null}
      </div>

      <div className="addCity">
        <Button variant="outlined" startIcon={<AddIcon />}>
          Thêm mới tỉnh/thành
        </Button>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {cities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((city, key) => (
              <TableRow key={city.id}>
                <TableCell>{key + 1}</TableCell>
                <TableCell>{city.city_name}</TableCell>
                <CustomTableCell source={city} name="city_code" handleOnChange={onChange} />
                <TableCell>{hasSuppliedAccount ? 'Đang hoạt động' : 'Chưa được cấp'}</TableCell>
                <TableCell>
                  {city.isEditMode ? (
                    <>
                      <IconButton aria-label="done" onClick={() => onToggleEditMode(city.id)}>
                        <DoneIcon />
                      </IconButton>
                      <IconButton aria-label="revert" onClick={() => onRevert(city.id)}>
                        <RevertIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton aria-label="delete" onClick={() => onToggleEditMode(city.id)}>
                      <EditIcon />
                    </IconButton>
                  )}
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
