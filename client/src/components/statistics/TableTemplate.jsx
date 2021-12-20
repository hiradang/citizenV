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
  if (orderBy === 'id_hamlet' || orderBy === 'address1' || orderBy === 'address2') {
    if (a.id_city > b.id_city) return -1;
    if (a.id_city < b.id_city) return 1;
    if (a.id_district > b.id_district) return -1;
    if (a.id_district < b.id_district) return 1;
    if (a.id_ward > b.id_ward) return -1;
    if (a.id_ward < b.id_ward) return 1;
    if (a.id_hamlet > b.id_hamlet) return -1;
    if (a.id_hamlet < b.id_hamlet) return 1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
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
    id: 'key',
    numeric: false,
    label: 'STT',
  },
  {
    id: 'name',
    numeric: false,
    label: 'Tên',
  },
  {
    id: 'quantity',
    numeric: false,
    label: 'Số lượng',
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
            align="left"
            sortDirection={orderBy === headCell.id ? order : false}
          >
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
          </TableCell>
        ))}
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
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id_citizen');
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <TableContainer>
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
                  <TableCell align="left">{index}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.quantity}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
