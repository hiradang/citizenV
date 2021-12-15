import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';

import { makeStyles } from '@mui/styles';
var isVietnamese = require('../../constants/utils/CheckText').isVietnamese;

const useStyles = makeStyles({
  fileInput: {
    marginTop: '20px',
  },
  warning: {
    color: 'red',
  },
});

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(false);
  const [notification, setNotification] = React.useState('');

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    props.handler(file);
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} startIcon={<AddIcon />}>
        {props.title}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Trước tiên hãy xuất file Excel và nhập thông tin theo đúng định dạng đã được quy định
            trong file. <br />
            Đăng tải file đó lên để tiến hành khai báo và cấp mã.
          </DialogContentText>
          <DialogContentText className={classes.warning}>{notification}</DialogContentText>
          <input
            autoFocus
            margin="dense"
            id="cityName"
            label="File excel đầu vào (*)"
            type="file"
            fullWidth
            variant="standard"
            className={classes.fileInput}
            onChange={(e) => setFile(e.target.files[0])}
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
