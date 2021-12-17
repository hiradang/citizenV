import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';

import { makeStyles } from '@mui/styles';
var isVietnamese = require('../../constants/utils/CheckText').isVietnamese;

const useStyles = makeStyles({
  textField: {
    marginBottom: '40px',
  },
  warning: {
    color: 'red',
  },
});

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [cityName, setCityName] = React.useState('');
  const [cityCode, setCityCode] = React.useState('');
  const [notification, setNotification] = React.useState('');

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    // Kiểm tra hợp thức dữ liệu đầu vào
    if (cityName && cityCode) {
      if (isVietnamese(cityName) && cityName.length > 1 && cityName.length < 200) {
        props.handler(cityName, cityCode);
        // Đóng modal lại
        setOpen(false);
      } else {
      }
    } else {
      setNotification('Bạn phải nhập đầy đủ thông tin');
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} startIcon={<AddIcon />}>
        {props.title}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Điền các thông tin cần sau. Các thông tin có dấu * là bắt buộc.
          </DialogContentText>
          <DialogContentText className={classes.warning}>{notification}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="cityName"
            label="Tên thành phố (*)"
            type="text"
            fullWidth
            variant="standard"
            className={classes.textField}
            onChange={(e) => setCityName(e.target.value)}
          />

          <TextField
            margin="dense"
            id="cityCode"
            label="Mã thành phố (*)"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setCityCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit}>Thêm mới</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
