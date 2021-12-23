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
import Cookies from 'js-cookie';

// Components
import Search from '../components/search/Search';
import CustomTableCell from '../EditableCell';
import AddCityDialog from '../AddCityDialog';
import AddAccountDialog from '../AddAccountDialog';
import ConfirmDialog from '../ConfirmDeleteOne';
import ConfirmDeleteSelected from '../ConfirmDeleteSelected';
import ConfirmResetAccount from '../ConfirmResetAccount';
import AddCodeExcel from '../AddCodeExcel';
var removeVietnameseTones = require('../../../constants/utils/CheckText').removeVietnameseTones;

function Manage() {
  const [hamlets, setHamlets] = useState([]);
  const [previous, setPrevious] = React.useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const idWard = Cookies.get('user');

  // Checkbox - Id của các thành phố khi được checkbox
  const [isAllChecked, setAllChecked] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3001/hamlet/${idWard}`).then((response) => {
      console.log(response.data);
      setHamlets(
        response.data.map((element) => {
          return {
            id: element.id_hamlet,
            hamlet_name: element.hamlet_name,
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
    setHamlets((state) => {
      return hamlets.map((hamlet) => {
        if (hamlet.id === id) {
          return { ...hamlet, isEditMode: !hamlet.isEditMode };
        }
        return hamlet;
      });
    });
  };

  const onChangehamletCode = (e, hamlet) => {
    if (!previous[hamlet.id]) {
      setPrevious((state) => ({ ...state, [hamlet.id]: hamlet }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = hamlet;
    const newHamlets = hamlets.map((hamlet) => {
      if (hamlet.id === id) {
        return { ...hamlet, [name]: value };
      }
      return hamlet;
    });
    setHamlets(newHamlets);

    // Update city code
    axios.post(`http://localhost:3001/hamlet/${id}`, { newCode: value }).then((res) => {});
  };

  const onChangehamletName = (e, hamlet) => {
    if (!previous[hamlet.id]) {
      setPrevious((state) => ({ ...state, [hamlet.id]: hamlet }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = hamlet;
    const newHamlets = hamlets.map((hamlet) => {
      if (hamlet.id === id) {
        return { ...hamlet, [name]: value };
      }
      return hamlet;
    });
    setHamlets(newHamlets);

    // Update city code
    axios.post(`http://localhost:3001/hamlet/${id}`, { newName: value }).then((res) => {});
  };

  // Supply new code from excel file
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
        console.log(data.slice(100).map((row) => row.job_name));
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      const newHamlets = data.map((row) => {
        return {
          id: row['Mã thôn/khu phố'],
          hamlet_name: row['Tên thôn/khu phố'],
          hasAccount: false,
          isEditMode: false,
          isChecked: false,
        };
      });

      data.forEach((row) => {
        axios
          .post(`http://localhost:3001/hamlet/`, {
            hamletCode: row['Mã thôn/khu phố'],
            hamletName: row['Tên thôn/khu phố'],
            idWard: idWard,
          })
          .then((res) => {});
      });
      setHamlets(newHamlets);
    });
  };

  // Export File to Excel
  const exportExcel = () => {
    var wb = XLSX.utils.book_new();
    wb.SheetNames.push('Sheet 1');
    var ws = XLSX.utils.json_to_sheet(
      hamlets.map((hamlet, key) => {
        return {
          STT: key + 1,
          'Tên xã/phường': hamlet.hamlet_name,
          'Mã xã/phường': hamlet.id,
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

    saveAs(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
      'Danh sách thôn/khu phố.xlsx'
    );
  };

  // Supply account
  const supplyAccount = (defaultPassword) => {
    hamlets.forEach((hamlet) => {
      Promise.all([
        axios.post(`http://localhost:3001/account`, {
          username: hamlet.id,
          password: defaultPassword,
        }),
        axios.post(`http://localhost:3001/hamlet/${hamlet.id}`, {
          hasAccount: true,
        }),
      ]);
    });

    const newhamlets = hamlets.map((hamlet) => {
      return {
        id: hamlet.id,
        hamlet_name: hamlet.hamlet_name,
        hasAccount: true,
        isEditMode: false,
        isChecked: hamlet.isChecked,
      };
    });
    setHamlets(newhamlets);
  };

  const supplyOneAccount = (cityId, defaultPassword) => {
    Promise.all([
      axios.post(`http://localhost:3001/account`, {
        username: cityId,
        password: defaultPassword,
      }),
      axios.post(`http://localhost:3001/hamlet/${cityId}`, {
        hasAccount: true,
      }),
    ]);

    const newCities = hamlets.map((city) => {
      return city.id === cityId
        ? {
            id: city.id,
            hamlet_name: city.hamlet_name,
            hasAccount: true,
            isEditMode: false,
            isChecked: city.isChecked,
          }
        : city;
    });
    setHamlets(newCities);
  };

  // Reset all account
  const resetAccount = () => {
    // Xóa các tài khoản đăng nhập và set lại trạng thái chưa cập nhật tài khoản
    hamlets.forEach((hamlet) => {
      Promise.all([
        axios.post(`http://localhost:3001/hamlet/${hamlet.id}`, {
          hasAccount: false,
        }),
        axios.delete(`http://localhost:3001/account/${hamlet.id}`),
      ]);
    });

    const newhamlets = hamlets.map((hamlet) => {
      return {
        id: hamlet.id,
        hamlet_name: hamlet.hamlet_name,
        hasAccount: false,
        isEditMode: false,
        isChecked: hamlet.isChecked,
      };
    });
    setHamlets(newhamlets);
  };

  // Reset one account
  const resetOneAccount = (hamletId) => {
    Promise.all([
      axios.post(`http://localhost:3001/hamlet/${hamletId}`, {
        hasAccount: false,
      }),
      axios.delete(`http://localhost:3001/account/${hamletId}`),
    ]);

    const newCities = hamlets.map((city) => {
      return city.id === hamletId
        ? {
            id: city.id,
            hamlet_name: city.hamlet_name,
            hasAccount: false,
            isEditMode: false,
            isChecked: city.isChecked,
          }
        : city;
    });
    setHamlets(newCities);
  };

  // Add new hamlet
  const handleAddNewhamlet = (hamletName, hamletCode) => {
    axios.post(`http://localhost:3001/hamlet/`, {
      hamletName: hamletName,
      hamletCode: hamletCode,
      idWard: idWard,
    });

    const newHamlet = {
      id: hamletCode,
      hamlet_name: hamletName,
      hasAccount: false,
      isEditMode: false,
      isChecked: false,
    };
    const newHamlets = [...hamlets, newHamlet];
    setHamlets(newHamlets);
  };

  // Delete hamlet
  const deletehamlet = (id) => {
    const newhamlets = [];
    hamlets.forEach((hamlet) => {
      if (hamlet.id !== id) {
        newhamlets.push(hamlet);
      }
    });
    setHamlets(newhamlets);
    Promise.all([
      axios.delete(`http://localhost:3001/hamlet/${id}`),
      axios.delete(`http://localhost:3001/account/${id}`),
    ]);
  };

  // Handle search
  const handleSearch = (e) => {
    axios.get(`http://localhost:3001/hamlet/${idWard}`).then((response) => {
      const hamlets = response.data.map((element) => {
        return {
          id: element.id_hamlet,
          hamlet_name: element.hamlet_name,
          hasAccount: element.hasAccount,
          isEditMode: false,
          isChecked: element.isChecked,
        };
      });

      let typed = removeVietnameseTones(e.target.value).toLowerCase();
      if (typed === '') {
        setHamlets(hamlets);
      } else {
        let newhamlet = hamlets.filter((city, index) => {
          return removeVietnameseTones(city.hamlet_name).toLowerCase().includes(typed);
        });
        setHamlets(newhamlet);
      }
    });
  };

  // Delete selected hamlet
  const deleteSelectedhamlet = () => {
    const newHamlets = [];
    hamlets.forEach((hamlet) => {
      if (!hamlet.isChecked) {
        newHamlets.push(hamlet);
      }
    });
    setHamlets(newHamlets);

    hamlets.forEach((hamlet) => {
      if (hamlet.isChecked) {
        Promise.all([
          axios.delete(`http://localhost:3001/hamlet/${hamlet.id}`),
          axios.delete(`http://localhost:3001/account/${hamlet.id}`),
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
    const newHamlets = hamlets.map((hamlet) => {
      return {
        id: hamlet.id,
        hamlet_name: hamlet.hamlet_name,
        hasAccount: hamlet.hasAccount,
        isEditMode: false,
        isChecked: e.target.checked,
      };
    });
    setHamlets(newHamlets);
  };

  // Handle onchange of the checkbox
  const onChangeCheckbox = (id, checked) => {
    const newhamlets = hamlets.map((hamlet) => {
      return hamlet.id === id
        ? {
            id: hamlet.id,
            hamlet_name: hamlet.hamlet_name,
            hasAccount: hamlet.hasAccount,
            isEditMode: false,
            isChecked: checked,
          }
        : hamlet;
    });
    setHamlets(newhamlets);

    // Kiểm tra nút check all
    const allChecked = newhamlets.every((hamlet) => hamlet.isChecked);
    setAllChecked(allChecked);
  };

  return (
    <div className="grid container-manage">
      <div className="row first">
        <div className="col l-2-4 m-5 c-12">
          <div className="actionButton">
            <AddCityDialog title="Thôn/khu phố" handler={handleAddNewhamlet} />
          </div>
        </div>
        <div className="col l-2 m-3 c-12">
          <div className="actionButton">
            <AddCodeExcel handler={supplyCodeExcel} title="Nhập từ Excel" />
          </div>
        </div>

        <div className="col l-1-8 m-3 c-12">
          <div className="actionButton">
            <AddAccountDialog
              title="Cấp tài khoản"
              variant="contained"
              handler={supplyAccount}
              name="thôn/khu phố"
            />
          </div>
        </div>

        <div className="col l-1-8 m-3 c-12">
          <div className="actionButton">
            <Button variant="contained" onClick={exportExcel}>
              Xuất ra Excel
            </Button>
          </div>
        </div>
        <div className="col l-1-92 m-4 c-12">
          <div className="actionButton">
            <ConfirmResetAccount handler={resetAccount} title="Reset lại tài khoản" />
          </div>
        </div>
      </div>

      <div className="row second">
        <div className="col l-2-4 m-4 c-12">
          <Search handler={handleSearch} />
        </div>
      </div>

      <div className="row container-table">
        <div className="col l-12 m-12 c-12">
          <Paper className="row container-table">
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={hamlets.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Table aria-label="table" className="table-manage">
              <TableHead>
                <TableRow>
                  <TableCell align="center">STT</TableCell>
                  <TableCell align="center">Tên</TableCell>
                  <TableCell align="center">Mã</TableCell>
                  <TableCell align="center">Tài khoản</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                  <TableCell align="right" className="last-column">
                    <ConfirmDeleteSelected
                      handler={deleteSelectedhamlet}
                      title="Xóa các thôn/khu phố đã chọn"
                    />
                    <input type="checkbox" checked={isAllChecked} onChange={handleCheckboxAll} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hamlets
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((city, key) => (
                    <TableRow key={city.key}>
                      <TableCell>{key + 1}</TableCell>
                      <CustomTableCell
                        source={city}
                        name="hamlet_name"
                        handleOnChange={onChangehamletName}
                      />
                      <CustomTableCell
                        source={city}
                        name="id"
                        handleOnChange={onChangehamletCode}
                      />
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
                            name="thôn/khu phố"
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
                            <IconButton
                              aria-label="delete"
                              onClick={() => onToggleEditMode(city.id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton>
                              <ConfirmDialog
                                title="xoá thôn/khu phố"
                                handler={deletehamlet}
                                id={city.id}
                              />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                      <TableCell className="row-right">
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
      </div>
    </div>
  );
}

export default Manage;
