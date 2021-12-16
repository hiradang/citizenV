import React from 'react';
// import PropTypes from 'prop-types';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
import './styles.scss';
import Picker from './components/picker/picker';
import clsx from 'clsx';
// Tasks.propTypes = {};
import { useEffect, useState } from "react";
import axios from "axios";

const initialRows = [
  {
    id: 1,
    cityName: 'Hà Nội',
    startDate: '2020-11-15', // year / month 0 - 11 / day 1 - 31
    endDate: '2020-11-16',
    progress: 5000,
    status: 'Chưa hoàn thành',
  },
  // {
  //   id: 2,
  //   cityName: 'Thanh Hóa',
  //   startDate: new Date(2021, 0, 1), // year / month 0 - 11 / day 1 - 31
  //   endDate: new Date(2021, 1, 1),
  //   progress: 3000,
  //   status: 'Chưa hoàn thành',
  // },
];

const cities = ['Hà Nội', 'Thanh Hóa'];

function Tasks() {
  const [rows, setRows] = React.useState([]);
  const [listCityName, setListCityName] = useState([])
  var tempListCityName = []
  useEffect(()=> {
    axios.get("http://localhost:3001/city").then((response) =>{
      for (let i = 0; i < response.data.length; i++) {
        tempListCityName[i] = response.data[i].city_name
      }
      setListCityName(tempListCityName)
    });
    axios.get("http://localhost:3001/task/city").then((response) =>{
        setRows(response.data)
    });
  }, [])
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
            // status: 'Chưa hoàn thành',
          };
          
        var timeStart = start.getFullYear().toString() + '-' + (start.getMonth() + 1).toString() + '-' + start.getDate().toString()
        var timeEnd = end.getFullYear().toString() + '-' + (end.getMonth() + 1).toString() + '-' + end.getDate().toString()
        axios.put(`http://localhost:3001/task/city/${id}`, {startDate: timeStart, endDate: timeEnd}).then((response) =>{
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
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'cityName',
      headerName: 'Tỉnh / Thành phố',
      type: 'string',
      sortable: false,
      flex: 1.2,
    },
    {
      field: 'startDate',
      headerName: 'Ngày bắt đầu',
      type: 'date',
      sortable: false,
      editable: true,
      flex: 1,
    },
    {
      field: 'endDate',
      headerName: 'Ngày kết thúc',
      type: 'date',
      sortable: false,
      editable: true,
      flex: 1,
    },
    {
      field: 'progress',
      headerName: 'Tiến độ',
      type: 'number',
      sortable: true,
      disableColumnMenu: true,
      flex: 0.6,
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
      cellClassName: (params) =>
        clsx('status', {
          negative: params.value === 'Chưa hoàn thành',
          positive: params.value === 'Hoàn thành',
        }),
    },
    {
      field: 'actions',
      type: 'actions',
      flex: 0.1,
      getActions: (params) => [
        <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={updateTask(params.row)} />,
      ],
    },
  ];

  const updateBySelect = (select, start, end) => {
    if (select.length === 0) {
      showNoti('Vui lòng chọn Tỉnh / Thành phố', 'error');
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
        // row.status = 0;
        var timeStart = start.getFullYear().toString() + '-' + (start.getMonth() + 1).toString() + '-' + start.getDate().toString()
        var timeEnd = end.getFullYear().toString() + '-' + (end.getMonth() + 1).toString() + '-' + end.getDate().toString()
        axios.put(`http://localhost:3001/task/city/${row.id}`, {startDate: timeStart, endDate: timeEnd}, {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        }).then((response) =>{
          // setRows(response.data)
          console.log(response.data)
      });
        index++;
      }
    });
    setRows(newRows);
    showNoti('Thay đổi thành công', 'success');
  };

  return (
    <div className="wrapper">
      <div style={{ height: '82%', width: '100%', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
          <div style={{ flexGrow: 0, padding: '20px 20px 0 20px' }}>
            <Picker listCity={listCityName} toggleApplyButton={updateBySelect} />
          </div>
          <div style={{ flexGrow: 1, padding: '20px' }}>
            <DataGrid rows={rows.map((row) => {
                if (row.startDate) {
                  row = {
                    ...row,
                    startDate: new Date(row.startDate),
                    endDate: new Date(row.endDate),
                    status: row.status === 0 ? 'Chưa hoàn thành' : 'Hoàn thành',
                    
                  };
                } else {
                  row = {
                    ...row,
                    startDate: '',
                    endDate: '',
                    status: 'Chưa bắt đầu',
                  };
                }
                return row;
              })} columns={columns} pageSize={7} disableSelectionOnClick />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tasks;