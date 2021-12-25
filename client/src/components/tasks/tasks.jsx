import SaveIcon from '@mui/icons-material/Save';
import Paper from '@mui/material/Paper';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import axios from 'axios';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import ImageNotDeclare from '../../constants/images/work/canNotDeclare.svg';
import Picker from './components/picker/picker';
import './styles.scss';

const role = Cookies.get('role');
const id = Cookies.get('user');
const nameTitle =
  role === 'A1'
    ? 'Tỉnh / Thành phố'
    : role === 'A2'
    ? 'Quận / Huyện'
    : role === 'A3'
    ? 'Xã / Phường'
    : 'Thôn / Xóm';
const nameData =
  role === 'A1' ? 'city' : role === 'A2' ? 'district' : role === 'A3' ? 'ward' : 'hamlet';
function Tasks() {
  const [declare, setDeclare] = useState(null);
  const [rows, setRows] = React.useState([]);
  const [initEnd, setInitEnd] = useState(new Date(Date.now() + 60 * 60 * 24 * 31 * 1000));
  const [listCityName, setListCityName] = useState([]);
  var tempListCityName = [];
  useEffect(() => {
    if (role === 'A1') setDeclare(true);
    if (nameData === 'city') {
      axios.get(`http://localhost:3001/${nameData}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          tempListCityName[i] = response.data[i].city_name;
        }
        setListCityName(tempListCityName);
      });
    } else {
      axios.get(`http://localhost:3001/task/${id}`).then((response) => {
        if (response.data) {
          setInitEnd(new Date(response.data.end_date));
          let endDate = new Date(response.data.end_date);
          let startDate = new Date(response.data.start_date);
          if (endDate >= new Date(Date.now()) && startDate <= new Date(Date.now()))
            setDeclare(true);
          else setDeclare(false);
        } else setDeclare(false);
      });
      axios.get(`http://localhost:3001/${nameData}/${Cookies.get('user')}`).then((response) => {
        let name = nameData + '_name';
        for (let i = 0; i < response.data.length; i++) {
          tempListCityName[i] = response.data[i][name];
        }
        setListCityName(tempListCityName);
      });
    }
    axios.get(`http://localhost:3001/task/${nameData}`).then((response) => {
      setRows(response.data);
    });
  }, []);
  const { enqueueSnackbar } = useSnackbar();
  const showNoti = (message, type) => {
    enqueueSnackbar(message, { variant: type });
  };

  const updateTask = React.useCallback(
    (params) => () => {
      const id = params.id;
      const start = new Date(
        params.startDate.getFullYear(),
        params.startDate.getMonth(),
        params.startDate.getDate()
      );

      const end = new Date(
        params.endDate.getFullYear(),
        params.endDate.getMonth(),
        params.endDate.getDate()
      );
      const now = new Date(Date.now());

      const check = end - start;
      const inYearEnd =
        end - new Date(now.getFullYear(), 0, 1) >= 0 && new Date(now.getFullYear(), 11, 31) - end;
      const inYearStart =
        start - new Date(now.getFullYear(), 0, 1) >= 0 &&
        new Date(now.getFullYear(), 11, 31) - start;

      if (check > 0 && inYearEnd && inYearStart) {
        setRows((prevRows) => {
          const indexOfTaskUpdate = prevRows.findIndex((row) => row.id === id);
          const rowToUpdate = prevRows.find((row) => row.id === id);
          const newRows = [...prevRows];
          newRows[indexOfTaskUpdate] = {
            ...rowToUpdate,
            startDate: start,
            endDate: end,
            canDeclare: true,
            // status: 'Chưa hoàn thành',
          };

          var timeStart =
            start.getFullYear().toString() +
            '-' +
            (start.getMonth() + 1).toString() +
            '-' +
            start.getDate().toString();
          var timeEnd =
            end.getFullYear().toString() +
            '-' +
            (end.getMonth() + 1).toString() +
            '-' +
            end.getDate().toString();
          axios
            .put(`http://localhost:3001/task/${id}`, {
              startDate: timeStart,
              endDate: timeEnd,
            })
            .then((response) => {
              // setRows(response.data)
            });
          showNoti('Thay đổi thành công', 'success');
          return newRows;
        });
      } else {
        showNoti('Ngày bắt đầu và Ngày kết thúc không hợp lệ', 'error');
      }
    },
    []
  );

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      type: 'number',
      flex: 0.2,
      minWidth: 100,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'cityName',
      headerName: nameTitle,
      type: 'string',
      sortable: false,
      flex: 1.2,
      minWidth: 180,
    },
    {
      field: 'startDate',
      headerName: 'Ngày bắt đầu',
      type: 'date',
      sortable: false,
      editable: true,
      flex: 1,
      minWidth: 190,
    },
    {
      field: 'endDate',
      headerName: 'Ngày kết thúc',
      type: 'date',
      sortable: false,
      editable: true,
      flex: 1,
      minWidth: 190,
    },
    {
      field: 'progress',
      headerName: 'Tiến độ',
      type: 'number',
      sortable: true,
      disableColumnMenu: true,
      flex: 0.6,
      minWidth: 120,

      valueFormatter: (params) => {
        const valueFormatted = params.value.toLocaleString();
        return `${valueFormatted} người`;
      },
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      type: 'number',
      sortable: false,
      flex: 1,
      minWidth: 160,

      cellClassName: (params) =>
        clsx('status', {
          lock: params.value === 'Đang khóa quyền',
          unfinished: params.value === 'Chưa hoàn thành',
          finished: params.value === 'Hoàn thành',
        }),
    },
    {
      field: 'actions',
      type: 'actions',
      flex: 0.1,
      minWidth: 60,
      getActions: (params) => [
        <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={updateTask(params.row)} />,
      ],
    },
  ];

  const updateBySelect = (select, start, end) => {
    if (select.length === 0) {
      showNoti(`Vui lòng chọn ${nameTitle}`, 'error');
      return;
    }
    if (start - end >= 0) {
      showNoti('Ngày bắt đầu và Ngày kết thúc không hợp lệ', 'error');
      return;
    }
    let index = 0;
    let newRows = [...rows];
    newRows.forEach((row) => {
      if (row.cityName === select[index]) {
        row.startDate = start;
        row.endDate = end;
        row.canDeclare = true;
        // row.status = 0;
        var timeStart =
          start.getFullYear().toString() +
          '-' +
          (start.getMonth() + 1).toString() +
          '-' +
          start.getDate().toString();
        var timeEnd =
          end.getFullYear().toString() +
          '-' +
          (end.getMonth() + 1).toString() +
          '-' +
          end.getDate().toString();
        axios
          .put(`http://localhost:3001/task/${row.id}`, { startDate: timeStart, endDate: timeEnd })
          .then((response) => {
            // setRows(response.data)
            console.log(response.data);
          });
        index++;
      }
    });
    setRows(newRows);
    showNoti('Thay đổi thành công', 'success');
  };

  return (
    <div className="grid">
      <div className="row">
        <div className="col l-12 m-12 c-12">
          <div className="container-task">
            {declare === false && (
              <>
                <div className="row">
                  <div className="col l-12 m-12 c-12">
                    <h2>Không có cuộc điều tra dân số nào đang diễn ra</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col l-4 l-o-4 m-6 m-o-3 c-6 c-o-3">
                    <img src={ImageNotDeclare} alt="notDeclare" style={{ width: '100%' }} />
                  </div>
                </div>
              </>
            )}
            {declare === true && (
              <>
                <div className="row">
                  <div className="col l-12 m-12 c-12">
                    <h2>Công việc</h2>
                  </div>
                </div>

                <div className="row">
                  <div className="col l-12 m-12 c-12">
                    <Paper>
                      <div className="row">
                        <Picker
                          listCity={listCityName}
                          nameTitle={nameTitle}
                          toggleApplyButton={updateBySelect}
                          initEnd={initEnd}
                        />
                      </div>

                      <div className="row container-datagrid">
                        <div className="col l-12 m-12 c-12">
                          <DataGrid
                            autoHeight
                            rows={rows.map((row) => {
                              if (row.startDate) {
                                row = {
                                  ...row,
                                  startDate: new Date(row.startDate),
                                  endDate: new Date(row.endDate),
                                  status: row.status == 0 ? 'Chưa hoàn thành' : 'Hoàn thành',
                                };
                              } else {
                                row = {
                                  ...row,
                                  startDate: '',
                                  endDate: '',
                                  status: 'Đang khóa quyền',
                                };
                              }
                              return row;
                            })}
                            columns={columns}
                            pageSize={7}
                            disableSelectionOnClick
                          />
                        </div>
                      </div>
                    </Paper>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
