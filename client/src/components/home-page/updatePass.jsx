import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function UpdatePass(props) {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [cfPassword, setCfPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showCfPassword, setShowCfPassword] = useState(false);
    let {id} = useParams();
    let history = useHistory();
    const submit = (e) => {
        e.preventDefault();
        if (newPassword !== cfPassword) {
            Swal.fire({
                title: "Oops...",
                text: "Wrong New Password And Confirm Password Combination",
                icon: "question",
                button: "Done",
        
            })
        } else {
            props.handleClose()
            // const data = {password: password, newPass: newPass };
            // axios.put(`http://localhost:3001/account/update/${id}`, data).then((response) => {
            //     if (response.data.error) {
            //         // alert(response.data.error);
            //         Swal.fire({
            //             title: "Oops...",
            //             text: response.data.error,
            //             icon: "question",
            //             button: "Done",
                
            //         })
            //     } else {
            //         history.push("/")
            //         window.location.reload()
            //         // console.log(response.data)
            //         // localStorage.setItem("login", response.data.role);
            //         // localStorage.setItem("id", response.data.id_account.toString())
            //        // window.location.reload();
            //         // if (response.data.role === "teacher") history.push(`/teacher/${response.data.id_account}`);
            //         // else history.push(`/student/${response.data.id_account}`);
            //     }
            // });
        }
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowCfPassword = () => {
    setShowCfPassword(!showCfPassword);
  };

  const handleMouseDownCfPassword = (event) => {
    event.preventDefault();
  };
    return (
    <div class = "">
        {/* <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={props.handleClose}>Subscribe</Button>
        </DialogActions> */}
            <form method = "POST" action = "/" >
            {/* <h2>Thay đổi mật khẩu</h2> */}
            <DialogContent>
            <div class="input-box">
              <InputLabel htmlFor="outlined-adornment-password">Mật khẩu cũ</InputLabel>
              <OutlinedInput
              required = {true}
                fullWidth
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                // label="Password"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
            <div class="input-box">
            <InputLabel htmlFor="outlined-adornment-password">Mật khẩu mới</InputLabel>
              <OutlinedInput
                fullWidth
                id="outlined-adornment-password"
                type={showNewPassword ? 'text' : 'password'}
                error = {false}
                // label="Password"
                onChange={(event) => {
                  setNewPassword(event.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownNewPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
            <div class="input-box">
            <InputLabel htmlFor="outlined-adornment-password">Xác nhận mật khẩu mới</InputLabel>
              <OutlinedInput
                fullWidth
                id="outlined-adornment-password"
                type={showNewPassword ? 'text' : 'password'}
                // label="Password"
                onChange={(event) => {
                  setCfPassword(event.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowCfPassword}
                      onMouseDown={handleMouseDownCfPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
            </DialogContent>
            <Button variant="contained" onClick={(e) => submit(e) } fullWidth>Thay đổi mật khẩu</Button>

            </form>
        </div>
  
    )
}

export default UpdatePass
