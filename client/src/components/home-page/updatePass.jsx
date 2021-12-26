import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import PasswordField from '../form-control/passwordField/passwordField';

function UpdatePass(props) {
  const id = Cookies.get('user');
  // Lấy một khẩu hiện tại rồi cho vào biến crPass nhé Loan:
  const crPass = 'password';

  const schema = yup.object().shape({
    current: yup
      .string()
      .required('Chưa nhập mật khẩu hiện tại')
      .test('check cũ mới', 'Mật khẩu không chính xác', async (value) => {
        const res = await axios.post(`http://localhost:3001/account/login`, {
          username: id,
          password: value,
        });
        if (res.data.error) return 0;
        else return 1;
      }),
    new: yup
      .string()
      .required('Chưa nhập mật khẩu mới')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
        'Phải tồn tại ít nhất 1 chữ số và 1 chữ cái viết hoa'
      )
      .min(6, 'Độ dài tối thiểu phải là 6 kí tự'),
    confirm: yup
      .string()
      .required('Xác nhận lại mật khẩu')
      .oneOf([yup.ref('new')], 'Mật khẩu không trùng nhau'),
  });

  const form = useForm({
    defaultValues: {
      current: '',
      new: '',
      confirm: '',
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = (values) => {
    axios
      .post(`http://localhost:3001/account/update/${id}`, { password: values.new })
      .then(props.handleClose());
  };

  return (
    <div class="container-change-pass">
      <form method="POST" action="/" onSubmit={form.handleSubmit(handleSubmit)} className="grid">
        <h3>Thay đổi mật khẩu</h3>
        <div className="row">
          <div className="col l-12">
            <DialogContent>
              <PasswordField name="current" label="Mật khẩu hiện tại" form={form} />
              <PasswordField name="new" label="Mật khẩu mới" form={form} />
              <PasswordField name="confirm" label="Xác nhận mật khẩu" form={form} />
            </DialogContent>
          </div>
        </div>
        <div className="row">
          <div className="col l-4 l-o-4">
            <Button variant="contained" type="submit" fullWidth>
              Cập nhật
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdatePass;
