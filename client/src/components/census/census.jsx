import React from 'react';
import PropTypes from 'prop-types';
import CensusForm from '../censusForm/censusForm';
import { useSnackbar } from 'notistack';

Census.propTypes = {};

function Census() {
  const { enqueueSnackbar } = useSnackbar();

  const showNoti = () => {
    enqueueSnackbar('Thêm dữ liệu thành công', { variant: 'success' });
  };

  const handleSubmit = (values, information, address, address1, address2) => {
    // Dữ liệu ném lên đây là đã oke rồi, thêm vào db thôiiii
    showNoti();
    console.log(values, information, address, address1, address2);
  };

  return (
    <div>
      <CensusForm onSubmit={handleSubmit} />
    </div>
  );
}

export default Census;
