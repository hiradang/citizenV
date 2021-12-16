import React from 'react';
import {useState } from "react";
import axios from "axios";
//import Swal from 'sweetalert2';
import { useHistory} from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let history = useHistory();
    const submit = (e) => {
        e.preventDefault();
        const data = { username: username, password: password };
        axios.post("http://localhost:3001/account/login", data).then((response) => {
            console.log(response.data)
            sessionStorage.setItem("accessToken", response.data.accessToken);
        //     // alert(response.data.error)
        //     if (response.data.error) {
               
        //         Swal.fire({
        //             title: "Oops...",
        //             text: response.data.error,
        //             icon: "question",
        //             button: "Done",
            
        //         })
        //     } else {
        //         console.log(response.data)
                
        //         if (response.data.warn) {
        //             localStorage.setItem("login", response.data.user.role);
        //             localStorage.setItem("id", response.data.user.id_account.toString())
        //             history.push(`/updatePass/${username}`)
        //         }
        //         else {
        //             localStorage.setItem("login", response.data.role);
        //             localStorage.setItem("id", response.data.id_account.toString())
        //             history.push('/')
        //             window.location.reload()
        //         }
        //         // if (response.data.role === "teacher") history.push(`/teacher/${response.data.id_account}`);
        //         // else history.push(`/student/${response.data.id_account}`);
        //       }
        });
  };
    return (
    <div class = "container-login">
        <div class = "login-input" >
            <form method = "POST" action = "/" >
            <h2>Đăng nhập</h2>
            <div class="input-box">
            <label for="exampleInputEmail1">Username</label>
                <i class="input-icon fas fa-user "></i>
                <input class = 'form-control'id = "username" name = 'username' placeholder="Username" required
                onChange={(event) => {
                setUsername(event.target.value);
        }}>
            </input>
            </div>
            <div class="input-box">
                <label for="exampleInputPassword1">Password</label>
                <i class="  input-icon fas fa-lock"></i>
                <input type="password" class="form-control" id="password" name = 'password' placeholder="Password" required
                onChange={(event) => {
                    setPassword(event.target.value);
                }}></input>
            </div>
            <button type="submit" id= "submit" class="btn btn-primary btn-submit"  onClick= {(e) => submit(e)} >Đăng nhập</button>
            </form>
        </div>
    </div>
    )
}

export default Login
