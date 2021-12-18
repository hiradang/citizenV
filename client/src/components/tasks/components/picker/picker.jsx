// import Checkbox from '@material-ui/core/Checkbox';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import MenuItem from '@material-ui/core/MenuItem';
// import { makeStyles } from '@material-ui/core/styles';

import Checkbox from '@mui/material/Checkbox';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import DayPicker from './dayPicker';

const useStyles = makeStyles((theme) => ({
  formControl: {
    flex: 0.6,
    minWidth: 240,
  },
  indeterminateColor: {
    color: '#4b49ac',
  },
  selectAllText: {
    fontWeight: 500,
  },
  selectedAll: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  button: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '16px 20px',
    marginLeft: '10px',

    display: 'flex',
    flexGrow: 0.2,
    maxWidth: '144px',

    cursor: 'pointer',
    borderRadius: '4px',

    '& > p': {
      fontWeight: 500,
      fontSize: '14px',
      margin: 0,
    },

    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
  variant: 'menu',
};

Picker.propTypes = {
  listCity: PropTypes.array,
  toggleApplyButton: PropTypes.func.isRequired,
};

Picker.defaultProps = {
  listCity: [],
};

function Picker({ listCity, toggleApplyButton }) {
  const classes = useStyles();

  const [selected, setSelected] = useState([]);
  const isAllSelected = listCity.length > 0 && selected.length === listCity.length;

  const select = (event) => {
    if (listCity.length < 1) return;
    const value = event.target.value;
    if (value[value.length - 1] === 'all') {
      setSelected(selected.length === listCity.length ? [] : listCity);
      return;
    }
    setSelected(value);
  };

  const [start, setStart] = useState(new Date(Date.now()));
  const [end, setEnd] = useState(new Date(Date.now()));

  const handleStartDate = (newDate) => setStart(newDate);
  const handleEndDate = (newDate) => setEnd(newDate);

  const handleApplyButton = () => toggleApplyButton(selected, start, end);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <FormControl className={classes.formControl}>
        <InputLabel>Chọn Tỉnh / Thành phố</InputLabel>
        <Select
          multiple
          value={selected}
          onChange={select}
          renderValue={(selected) => selected.join(', ')}
          input={<OutlinedInput label="Chọn Tỉnh / Thành phố" />}
          MenuProps={MenuProps}
        >
          <MenuItem
            value="all"
            classes={{
              root: isAllSelected ? classes.selectedAll : '',
            }}
          >
            <ListItemIcon>
              <Checkbox
                color="primary"
                classes={{ indeterminate: classes.indeterminateColor }}
                checked={isAllSelected}
                indeterminate={selected.length > 0 && selected.length < listCity.length}
              />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.selectAllText }} primary="Chọn tất cả" />
          </MenuItem>
          {listCity.map((city) => (
            <MenuItem key={city} value={city}>
              <ListItemIcon>
                <Checkbox checked={selected.indexOf(city) > -1} color="primary" />
              </ListItemIcon>
              <ListItemText primary={city} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <DayPicker label="Chọn ngày bắt đầu" getData={handleStartDate} initialValue={start} />
      <DayPicker label="Chọn ngày kết thúc" getData={handleEndDate} initialValue={end} />

      <div className={classes.button} onClick={handleApplyButton}>
        <p>SAVE CHANGES</p>
      </div>
    </div>
  );
}

export default Picker;
