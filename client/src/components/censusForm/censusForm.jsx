import { yupResolver } from '@hookform/resolvers/yup';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { listCareer, listEthnic, listLevel, listReligion } from '../../constants/listAboutPeople';
import InputField from '../form-control/inputField/inputField';
import './styles.scss';

CensusForm.propTypes = {
  onSubmit: PropTypes.func,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3 + ITEM_PADDING_TOP,
    },
  },
};

function CensusForm({ onSubmit }) {
  const { enqueueSnackbar } = useSnackbar();

  const showNoti = () => {
    enqueueSnackbar('Một số trường chưa có dữ liệu, vui lòng kiểm tra lại', { variant: 'error' });
  };

  // Thông tin cơ bản
  const [information, setInformation] = useState({
    dateOfBirth: new Date(),
    gender: '',
    religion: '',
    ethnic: 'Kinh',
    level: '',
    career: '',
  });

  //Lấy dữ liệu list Tỉnh / Thành phố rồi vứt vào biến listCity
  const listCity = ['Tỉnh Thanh Hóa', 'Tỉnh Nam Định'];

  // Quê quán
  const [address, setAddress] = useState({
    hamlet: '',
    ward: '',
    district: '',
    city: '',
  });

  const [listDistrict, setListDistrict] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [listHamlet, setListHamlet] = useState([]);

  const [disableDistrict, setDisableDistrict] = useState(true);
  const [disableWard, setDisableWard] = useState(true);
  const [disableHamlet, setDisableHamlet] = useState(true);

  // Địa chỉ thường trú
  const [address1, setAddress1] = useState({
    hamlet: '',
    ward: '',
    district: '',
    city: '',
  });

  const [listDistrict1, setListDistrict1] = useState([]);
  const [listWard1, setListWard1] = useState([]);
  const [listHamlet1, setListHamlet1] = useState([]);

  const [disableDistrict1, setDisableDistrict1] = useState(true);
  const [disableWard1, setDisableWard1] = useState(true);
  const [disableHamlet1, setDisableHamlet1] = useState(true);

  // Địa chỉ tạm trú
  const [address2, setAddress2] = useState({
    hamlet: '',
    ward: '',
    district: '',
    city: '',
  });

  const [listDistrict2, setListDistrict2] = useState([]);
  const [listWard2, setListWard2] = useState([]);
  const [listHamlet2, setListHamlet2] = useState([]);

  const [disableDistrict2, setDisableDistrict2] = useState(true);
  const [disableWard2, setDisableWard2] = useState(true);
  const [disableHamlet2, setDisableHamlet2] = useState(true);

  //Validate Họ và tên + CCCD / CMND
  const schema = yup.object().shape({
    name: yup
      .string()
      .required('Vui lòng nhập họ và tên')
      .test('Kí tự bắt đầu', 'Kí tự bắt đầu không hợp lệ', (value) => {
        return !(value[0] === ' ');
      })
      .test('Kí tự kết thúc', 'Kí tự kết thúc không hợp lệ', (value) => {
        const idx = value.length - 1;
        return !(value[idx] === ' ');
      })
      .matches(
        /^[a-zA-Záàạảãăắằặẳẵâấầậẩẫéèẹẻẽêếềệểễíìịỉĩóòọỏõôốồộổỗơớờợởỡúùụủũưứừựửữ][a-zA-Záàạảãăắằặẳẵâấầậẩẫéèẹẻẽêếềệểễíìịỉĩóòọỏõôốồộổỗơớờợởỡúùụủũưứừựửữ\s]*$/,
        'Chỉ nhập các kí tự tiếng Việt'
      )
      .max(100, 'Tối đa 100 kí tự')
      .test('Nhập đúng theo mẫu', 'Mỗi từ cách nhau 1 khoảng trắng', (value) => {
        const list = value.split(' ');
        let space = 0;
        list.forEach((item) => {
          if (!!item === false) space++;
        });

        return space === 0;
      }),
    citizenID: yup
      .string()
      .required('Vui lòng nhập CCCD / CMND')
      .test('Kí tự bắt đầu', 'Kí tự bắt đầu không hợp lệ', (value) => {
        return !(value[0] === ' ');
      })
      .test('Kí tự kết thúc', 'Kí tự kết thúc không hợp lệ', (value) => {
        const idx = value.length - 1;
        return !(value[idx] === ' ');
      })
      .matches(/^[0-9]/, 'Chỉ nhập các chữ số')
      .min(9, 'Nhập tối thiểu 9 chữ số')
      .test('Nhập đúng độ dài', 'Nhập 9 chữ số CMND / 12 chữ số CCCD', (value) => {
        return value.length === 9 || value.length === 12;
      })
      .test('CCCD', 'Số CCCD phải bắt đầu là 0', (value) => {
        return (value[0] === '0' && value.length === 12) || value.length === 9;
      })
      .max(12, 'Nhập tối đa 12 chữ số')
      .test('Khoảng trắng', 'Tồn tại khoảng trắng không hợp lệ', (value) => {
        return value.split(' ').length === 1;
      }),
  });

  const form = useForm({
    defaultValues: {
      name: '',
      citizenID: '',
    },
    resolver: yupResolver(schema),
  });

  const checkValidField = (object) => {
    for (const property in object) {
      if (!!object[property] === false) return false;
    }
    return true;
  };

  const handleSubmit = (values) => {
    if (onSubmit) {
      // values là object chứa: Họ tên + CCCD / CMND
      // information chứa: Ngày sinh / Giới tính / Tôn giáo / Dân tộc / Trình độ / Nghề nghiệp
      const check =
        checkValidField(information) &&
        checkValidField(address) &&
        checkValidField(address1) &&
        checkValidField(address2);

      if (!check) {
        showNoti();
        return;
      } else {
        onSubmit(values, information, address, address1, address2);

        // Dữ liệu chuẩn và ko bị thiếu trường nào thì reset lại toàn bộ các trường
        form.reset();
        // Reset lại thông ti cơ bản
        setInformation({
          dateOfBirth: new Date(),
          gender: '',
          religion: '',
          ethnic: 'Kinh',
          level: '',
          career: '',
        });
        // Reset lại quê quán
        setAddress({
          hamlet: '',
          ward: '',
          district: '',
          city: '',
        });
        // Reset lại địa chỉ thường trú
        setAddress1({
          hamlet: '',
          ward: '',
          district: '',
          city: '',
        });
        // Reset lại địa chỉ tạm trú
        setAddress2({
          hamlet: '',
          ward: '',
          district: '',
          city: '',
        });
      }
    }
  };

  return (
    <div className="wrapper">
      <div style={{ height: '82%', width: '100%', backgroundColor: 'white' }}>
        <div style={{ flexGrow: 1, padding: '40px' }}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <h3 style={{ marginTop: '14px' }}>
              Phiếu điều tra dân số {new Date(Date.now()).getFullYear()}
            </h3>
            <div className="line four">
              <InputField name="name" label="Họ và tên" form={form} />
              <InputField name="citizenID" label="Số CCCD / CMND" form={form} />
              <LocalizationProvider dateAdapter={AdapterDateFns} className="select-date">
                <DatePicker
                  label="Ngày / Tháng / Năm sinh"
                  inputFormat="dd/MM/yyyy"
                  value={information.dateOfBirth}
                  onChange={(newValue) => setInformation({ ...information, dateOfBirth: newValue })}
                  renderInput={(params) => <TextField {...params} />}
                  maxDate={new Date(Date.now())}
                  minDate={new Date(1900, 0, 1)}
                />
              </LocalizationProvider>

              <FormControl className="select-gender">
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={information.gender}
                  label="Giới tính"
                  onChange={(event) =>
                    setInformation({ ...information, gender: event.target.value })
                  }
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="line four">
              <FormControl className="select-religion">
                <InputLabel>Tôn giáo</InputLabel>
                <Select
                  value={information.religion}
                  label="Tôn giáo"
                  onChange={(event) =>
                    setInformation({ ...information, religion: event.target.value })
                  }
                  MenuProps={MenuProps}
                >
                  {listReligion.map((rel) => (
                    <MenuItem value={rel} key={rel}>
                      {rel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                disablePortal
                className="select-ethnic"
                onChange={(event, newValue) => {
                  setInformation({ ...information, ethnic: newValue });
                }}
                value={information.ethnic}
                options={listEthnic}
                renderInput={(params) => <TextField {...params} label="Dân tộc" />}
              />

              <FormControl className="select-level">
                <InputLabel>Trình độ văn hóa</InputLabel>
                <Select
                  value={information.level}
                  label="Trình độ văn hóa"
                  onChange={(event) =>
                    setInformation({ ...information, level: event.target.value })
                  }
                  MenuProps={MenuProps}
                >
                  {listLevel.map((level) => (
                    <MenuItem value={level} key={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                disablePortal
                className="select-career"
                onChange={(event, newValue) => {
                  setInformation({ ...information, career: newValue });
                }}
                value={information.career}
                options={listCareer}
                renderInput={(params) => <TextField {...params} label="Nghề nghiệp" />}
              />
            </div>

            <h3 style={{ marginTop: '30px' }}>Quê quán</h3>
            <div className="line three">
              <Autocomplete
                disablePortal
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress({
                    ...address,
                    city: newValue,
                  });

                  // Có Tỉnh / Thành phố => Lấy dữ liệu Quận Huyện tại đây
                  // .... code
                  // Loan xử lý
                  // Sau khi lấy dữ liệu xong thì set biến disableDistrict = false
                  // Mở cmt đoạn code bên dưới là được
                  // if (address.city) setDisableDistrict(false)
                  // else setDisableDistrict(true);
                }}
                value={address.city}
                options={listCity}
                renderInput={(params) => <TextField {...params} label="Tỉnh / Thành phố" />}
              />

              <Autocomplete
                disablePortal
                disabled={disableDistrict}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress({
                    ...address,
                    district: newValue,
                  });

                  // Có Quận / Huyện => Lấy dữ liệu Xã / Phường tại đây
                  // .... code
                  // Loan xử lý
                  // Sau khi lấy dữ liệu xong thì set biến disableWard = false
                  // Mở cmt đoạn code bên dưới là được
                  // if (address.district) setDisableWard(false)
                  // else setDisableWard(true);
                }}
                value={address.district}
                options={listDistrict}
                renderInput={(params) => <TextField {...params} label="Quận / Huyện" />}
              />

              <Autocomplete
                disablePortal
                disabled={disableWard}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress({
                    ...address,
                    ward: newValue,
                  });

                  // Có Xã / Phường => Lấy dữ liệu Thôn / Khu phố tại đây
                  // .... code
                  // Loan xử lý
                  // Sau khi lấy dữ liệu xong thì set biến disableHamlet = false
                  // Mở cmt đoạn code bên dưới là được
                  // if (address.ward) setDisableHamlet(false)
                  // else setDisableHamlet(true);
                }}
                value={address.ward}
                options={listWard}
                renderInput={(params) => <TextField {...params} label="Xã / Phường" />}
              />

              <Autocomplete
                disablePortal
                disabled={disableHamlet}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress({
                    ...address,
                    hamlet: newValue,
                  });
                }}
                value={address.hamlet}
                options={listHamlet}
                renderInput={(params) => <TextField {...params} label="Thôn / Khu phố" />}
              />
            </div>

            <h3 style={{ marginTop: '30px' }}>Địa chỉ thường trú</h3>
            <div className="line three">
              <Autocomplete
                disablePortal
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress1({
                    ...address1,
                    city: newValue,
                  });

                  // Có Tỉnh / Thành phố => Lấy dữ liệu Quận Huyện tại đây
                  // .... code
                  // Loan xử lý
                  // Sau khi lấy dữ liệu xong thì set biến disableDistrict1 = false
                  // Mở cmt đoạn code bên dưới là được
                  // if (address1.city) setDisableDistrict1(false)
                  // else setDisableDistrict1(true);
                }}
                value={address1.city}
                options={listCity}
                renderInput={(params) => <TextField {...params} label="Tỉnh / Thành phố" />}
              />

              <Autocomplete
                disablePortal
                disabled={disableDistrict1}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress1({
                    ...address1,
                    district: newValue,
                  });

                  // Có Quận / Huyện => Lấy dữ liệu Xã / Phường tại đây
                  // .... code
                  // Loan xử lý
                  // Sau khi lấy dữ liệu xong thì set biến disableWard1 = false
                  // Mở cmt đoạn code bên dưới là được
                  // if (address1.district) setDisableWard1(false)
                  // else setDisableWard1(true);
                }}
                value={address1.district}
                options={listDistrict1}
                renderInput={(params) => <TextField {...params} label="Quận / Huyện" />}
              />

              <Autocomplete
                disablePortal
                disabled={disableWard1}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress1({
                    ...address1,
                    ward: newValue,
                  });

                  // Có Xã / Phường => Lấy dữ liệu Thôn / Khu phố tại đây
                  // .... code
                  // Loan xử lý
                  // Sau khi lấy dữ liệu xong thì set biến disableHamlet1 = false
                  // Mở cmt đoạn code bên dưới là được
                  // if (address1.ward) setDisableHamlet1(false)
                  // else setDisableHamlet1(true);
                }}
                value={address1.ward}
                options={listWard1}
                renderInput={(params) => <TextField {...params} label="Xã / Phường" />}
              />

              <Autocomplete
                disablePortal
                disabled={disableHamlet1}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress1({
                    ...address1,
                    hamlet: newValue,
                  });
                }}
                value={address1.hamlet}
                options={listHamlet1}
                renderInput={(params) => <TextField {...params} label="Thôn / Khu phố" />}
              />
            </div>

            <h3 style={{ marginTop: '30px' }}>Địa chỉ tạm trú</h3>
            <div className="line three">
              <Autocomplete
                disablePortal
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress2({
                    ...address2,
                    city: newValue,
                  });

                  // Có Tỉnh / Thành phố => Lấy dữ liệu Quận Huyện tại đây
                  // .... code
                  // Loan xử lý
                  // Sau khi lấy dữ liệu xong thì set biến disableDistrict2 = false
                  // Mở cmt đoạn code bên dưới là được
                  // if (address2.city) setDisableDistrict2(false)
                  // else setDisableDistrict2(true);
                }}
                value={address2.city}
                options={listCity}
                renderInput={(params) => <TextField {...params} label="Tỉnh / Thành phố" />}
              />

              <Autocomplete
                disablePortal
                disabled={disableDistrict2}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress2({
                    ...address2,
                    district: newValue,
                  });

                  // Có Quận / Huyện => Lấy dữ liệu Xã / Phường tại đây
                  // .... code
                  // Loan xử lý
                  // Sau khi lấy dữ liệu xong thì set biến disableWard2 = false
                  // Mở cmt đoạn code bên dưới là được
                  // if (address2.district) setDisableWard2(false)
                  // else setDisableWard2(true);
                }}
                value={address2.district}
                options={listDistrict2}
                renderInput={(params) => <TextField {...params} label="Quận / Huyện" />}
              />

              <Autocomplete
                disablePortal
                disabled={disableWard2}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress2({
                    ...address2,
                    ward: newValue,
                  });

                  // Có Xã / Phường => Lấy dữ liệu Thôn / Khu phố tại đây
                  // .... code
                  // Loan xử lý
                  // Sau khi lấy dữ liệu xong thì set biến disableHamlet2 = false
                  // Mở cmt đoạn code bên dưới là được
                  // if (address2.ward) setDisableHamlet2(false)
                  // else setDisableHamlet2(true);
                }}
                value={address2.ward}
                options={listWard2}
                renderInput={(params) => <TextField {...params} label="Xã / Phường" />}
              />

              <Autocomplete
                disablePortal
                disabled={disableHamlet2}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress2({
                    ...address2,
                    hamlet: newValue,
                  });
                }}
                value={address2.hamlet}
                options={listHamlet2}
                renderInput={(params) => <TextField {...params} label="Thôn / Khu phố" />}
              />
            </div>

            <button className="button" type="submit">
              <p>THÊM VÀO DANH SÁCH</p>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CensusForm;
