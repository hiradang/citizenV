import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import './styles.scss';
import logoUrl from '../../constants/images/logo.png';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const submit = (e) => {
    // e.preventDefault();
    const data = { username: username, password: password };
    axios.post('http://localhost:3001/account/login', data).then((response) => {
      console.log(response.data);
          if (response.data.error) {

              Swal.fire({
                  title: "Oops...",
                  text: response.data.error,
                  icon: "question",
                  button: "Done",

              })
          } else {
            Cookies.set('user', response.data.username, {
                //expires: new Date(new Date(Date.now()).getTime() + 60*60 * 1000),
                expires: 1/2,
                secure: true,
              });
              Cookies.set('token', response.data.accessToken, { expires: 1 / 2, secure: true });
              Cookies.set('role', response.data.role, { expires: 1 / 2, secure: true });
              Cookies.set('refreshToken', response.data.refreshToken, { expires: 1 / 2, secure: true });
              window.location.reload();
            }
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div class="container-login">
      <div className="logo">
        <img src={logoUrl} alt="" />
        <span>Hệ thống điều tra dân số CitizenV</span>
      </div>
      <Box>
        <div class="login-input">
          <form method="POST" action="/login">
            <div class="input-box">
              <TextField
                id="outlined-basic"
                label="Username"
                fullWidth
                // helperText="Incorrect entry." error
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
            </div>
            <div class="input-box">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                fullWidth
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
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
            <Button variant="contained" onClick={(e) => submit(e) } fullWidth>Đăng nhập</Button>
            {/* <button
              type="submit"
              id="submit"
              class="btn btn-primary btn-submit"
              onClick={(e) => submit(e)}
            >
              Đăng nhập
            </button> */}
          </form>
        </div>
      </Box>
    </div>
  );
}

export default Login;
