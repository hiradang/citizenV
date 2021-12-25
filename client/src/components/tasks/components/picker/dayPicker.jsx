import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import * as React from 'react';

DayPicker.propTypes = {
  label: PropTypes.string.isRequired,
  getData: PropTypes.func.isRequired,
  initialValue: PropTypes.object.isRequired,
};

function DayPicker({ label, getData, initialValue, initEnd }) {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (newValue) => {
    setValue(newValue);
    getData(newValue);
  };

  return (
    <div className="day-picker-form">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label={label}
          inputFormat="dd/MM/yyyy"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
          maxDate={initEnd}
          minDate={new Date(Date.now())}
        />
      </LocalizationProvider>
    </div>
  );
}

export default DayPicker;
