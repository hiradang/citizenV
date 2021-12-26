// import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';
// import './styles.scss';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import '@trendmicro/react-paginations/dist/react-paginations.css';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import Dialog from '@mui/material/Dialog';
import CensusForm from '../census/censusForm/editForm';
import { useSnackbar } from 'notistack';
import axios from 'axios';

function descendingComparator(a, b, orderBy) {
  if (orderBy === 'date_of_birth') {
    let yearA = a[orderBy].slice(0, 4);
    let yearB = b[orderBy].slice(0, 4);
    let monthA = a[orderBy].slice(5, 7);
    let monthB = b[orderBy].slice(5, 7);
    let dayA = a[orderBy].slice(8, 10);
    let dayB = b[orderBy].slice(8, 10);
    if (yearA > yearB) return -1;
    if (yearA < yearB) return 1;
    if (monthA > monthB) return -1;
    if (monthA < monthB) return 1;
    if (dayA > dayB) return -1;
    if (dayA < dayB) return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id_citizen',
    numeric: false,
    label: 'CCCD/CMND',
  },
  {
    id: 'citizen_name',
    numeric: false,
    label: 'Họ và tên',
  },
  {
    id: 'date_of_birth',
    numeric: false,
    label: 'Ngày sinh',
  },
  {
    id: 'gender',
    numeric: false,
    label: 'Giới tính',
  },
  {
    id: 'id_hamlet',
    numeric: false,
    label: 'Quê quán',
  },
  {
    id: 'address1',
    numeric: false,
    label: 'Địa chỉ thường trú',
  },
  {
    id: 'address2',
    numeric: false,
    label: 'Địa chỉ tạm trú',
  },
  {
    id: 'nation',
    numeric: false,
    label: 'Dân tộc',
  },
  {
    id: 'religion',
    numeric: false,
    label: 'Tôn giáo',
  },
  {
    id: 'level',
    numeric: false,
    label: 'Trình độ',
  },
  {
    id: 'job',
    numeric: false,
    label: 'Nghề nghiệp',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === 'date_of_birth' && (
              <>
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </>
            )}
            {headCell.id !== 'date_of_birth' && `${headCell.label}`}
          </TableCell>
        ))}
        <TableCell></TableCell>
        {/* <TableCell></TableCell> */}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function TableCitizen(props) {
  const [openD, setOpenD] = React.useState(false);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id_citizen');
  const [infoCitizenEdit, setInfoCitizenEdit] = React.useState()
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClose = () => {
    setOpenD(false);
  };

  const handleClickOpen = () => {
    setOpenD(true);
  };
  function handleDelete(id_citizen) {
    Swal.fire({
      title: 'Xác nhận xóa?',
      icon: 'question',
      confirmButtonText: 'OK',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        props.handleDelete(id_citizen);
      }
    });
  }
  function handleEdit(citizen) {
    console.log(citizen);
    setInfoCitizenEdit(citizen)
    handleClickOpen()
  }
  const { enqueueSnackbar } = useSnackbar();

  const showNoti = () => {
    enqueueSnackbar('Sửa dữ liệu thành công', { variant: 'success' });
  };
  const showNotiError = () => {
    enqueueSnackbar('Dữ liệu đã tồn tại', { variant: 'error' });
  };
  const handleSubmit = (id, values, information, address, address1, address2) => {
    const date =
       information.dateOfBirth.getFullYear().toString() +
       '-' +
       (information.dateOfBirth.getMonth() + 1).toString() +
       '-' +
       information.dateOfBirth.getDate().toString();
     const data = {
       id_citizen: values.citizenID,
       citizen_name: values.name,
       date_of_birth: date,
       gender: information.gender,
       hometown: address,
       tempAddress: address2,
       address: address1,
       ethnic: information.ethnic,
       religion: information.religion,
       level: information.level,
       job: information.career,
     };
     axios.put(`http://localhost:3001/citizen/${id}`, data).then((response) => {
       console.log(response.data)
       if (response.data.error) showNotiError()
       else {
         showNoti();
         setOpenD(false);
         props.editRow()
        }
     });
   };
  return (
    <TableContainer>
      <Dialog open={openD}  fullScreen>
        <CensusForm data = {infoCitizenEdit} handleClose={()=> setOpenD(false)} onSubmit={handleSubmit}/>
      </Dialog>
      <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          rowCount={props.rows.length}
        />
        <TableBody>
          {stableSort(props.rows, getComparator(order, orderBy))
            .slice((props.page - 1) * props.rowsPerPage, props.page * props.rowsPerPage)
            .map((row, index) => {
              return (
                <TableRow hover key={row.id_citizen}>
                  <TableCell align="center">{row.id_citizen}</TableCell>
                  <TableCell align="center">{row.citizen_name}</TableCell>
                  <TableCell align="center">
                    {row.date_of_birth.substr(8, 10)}/{row.date_of_birth.substr(5, 2)}/
                    {row.date_of_birth.substr(0, 4)}
                  </TableCell>
                  <TableCell align="center">{row.gender}</TableCell>
                  <TableCell align="center">
                    {row.homeHamlet_name}, {row.homeWard_name}, {row.homeDistrict_name},{' '}
                    {row.homeCity_name}
                  </TableCell>
                  <TableCell align="center">
                    {row.addHamlet_name}, {row.addWard_name}, {row.addDistrict_name},{' '}
                    {row.addCity_name}
                  </TableCell>
                  <TableCell align="center">
                    {row.tempHamlet_name}, {row.tempWard_name}, {row.tempDistrict_name},{' '}
                    {row.tempCity_name}
                  </TableCell>
                  <TableCell align="center">{row.ethnic}</TableCell>
                  <TableCell align="center">{row.religion}</TableCell>
                  <TableCell align="center">{row.level}</TableCell>
                  <TableCell align="center">{row.job}</TableCell>
                  <TableCell align="left">
                    <EditIcon
                      color="primary"
                      className="iconEdit"
                      onClick={() => handleEdit(row)}
                    />
                    <DeleteIcon
                      color="error"
                      sx={{ ml: 2 }}
                      className="iconEdit"
                      onClick={() => handleDelete(row.id_citizen)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
