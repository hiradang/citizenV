import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
  const [defaultPassword, setDefaultPassword] = React.useState('password');
  const [notification, setNotification] = React.useState('');

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);

    // Gọi hàm xử lý của cha (thêm MK vào db)
    props.handler(defaultPassword);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        {props.title}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tên đăng nhập sẽ được cấp giống với mã tỉnh/thành phố. <br />
            Hãy cấp một mật khẩu mặc định.
          </DialogContentText>
          <DialogContentText className={classes.warning}>{notification}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="cityName"
            label="Mật khẩu mặc định (*)"
            type="text"
            fullWidth
            variant="standard"
            className={classes.textField}
            onChange={(e) => setDefaultPassword(e.target.value)}
            value={defaultPassword}
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
