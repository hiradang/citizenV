import React from 'react';
import PropTypes from 'prop-types';
import CensusForm from './censusForm/censusForm';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import ImageNotDeclare from '../../constants/images/work/canNotDeclare.svg';
import { useEffect, useState } from 'react';
import PrintForm from './PrintForm/PrintForm';
import Cookies from 'js-cookie';

Census.propTypes = {};

const role = Cookies.get('role');
function Census() {
  const { enqueueSnackbar } = useSnackbar();
  const [declare, setDeclare] = useState(null);
  const idWard = Cookies.get('user').toString().substr(0, 6);
  const showNoti = () => {
    enqueueSnackbar('Thêm dữ liệu thành công', { variant: 'success' });
  };
  useEffect(() => {
    axios.get(`http://localhost:3001/task/${idWard}`).then((response) => {
      if (response.data === null) {
        setDeclare(true);
      } else setDeclare(response.data.is_finished);
    });
  }, [declare]);
  const showNotiError = () => {
    enqueueSnackbar('Dữ liệu đã tồn tại', { variant: 'error' });
  };

  const handleSubmit = (values, information, address, address1, address2) => {
    const date =
      information.dateOfBirth.getFullYear().toString() +
      '-' +
      (information.dateOfBirth.getMonth() + 1).toString() +
      '-' +
      information.dateOfBirth.getDate().toString();
    const data = {
      id_citizen: values.citizenID,
      citizen_name: values.name,
      date_of_birth: date,
      gender: information.gender,
      hometown: address,
      tempAddress: address2,
      address: address1,
      ethnic: information.ethnic,
      religion: information.religion,
      level: information.level,
      job: information.career,
    };
    axios.post(`http://localhost:3001/citizen`, data).then((response) => {
      console.log(response.data);
      if (response.data.error) showNotiError();
      else showNoti();
    });
  };

  return (
    <div>
      {role === 'B1' ? <PrintForm /> : <></>}

      {declare === false && <CensusForm onSubmit={handleSubmit} />}
      {declare === true && (
        <>
          <div className="row">
            <div className="col l-12 m-12 c-12">
              <h2>Không có cuộc điều tra dân số nào đang diễn ra</h2>
            </div>
          </div>
          <div className="row">
            <div className="col l-4 l-o-4 m-6 m-o-3 c-6 c-o-3">
              <img src={ImageNotDeclare} alt="notDeclare" style={{ width: '100%' }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Census;