import * as React from 'react';
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItem: 'baseline',
  },
  searchIcon: {
    height: 48,
    paddingTop: '20px',
    marginRight: '10px',
    color: 'rgb(72, 70, 165)',
  },
});

export default function Search(props) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <SearchIcon className={classes.searchIcon} />
      <TextField
        className={classes.textField}
        id="standard-basic"
        label="Tìm kiếm"
        variant="standard"
        onChange={props.handler}
      />
    </div>
  );
}
