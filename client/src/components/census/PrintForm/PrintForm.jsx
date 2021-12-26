import React, { useRef } from 'react';
import { render } from 'react-dom';
import { useReactToPrint } from 'react-to-print';
import './style.scss';
import Logo from '../../constants/images/print/logo.png';
import Square from '@mui/icons-material/CheckBoxOutlineBlank';
import Button from '@mui/material/Button';
import PrintIcon from '@mui/icons-material/LocalPrintshopOutlined';
// import Dot from './Dot';

const Dot = () => {
  return (
    <p>
      ....................................................................................................................................................
    </p>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="header">
          <h2>BAN CHỈ ĐẠO TỔNG ĐIỀU TRA DÂN SỐ VÀ NHÀ Ở TRUNG ƯƠNG</h2>
          <h1>PHIẾU TỔNG ĐIỀU TRA DÂN SỐ VÀ NHÀ Ở</h1>
          <h3>NĂM 2021</h3>
          <img src={Logo} alt="census-logo"></img>
          <p>(Điều tra toàn bộ)</p>
        </div>

        <div className="info">
          <div className="id_number">
            <p className="row">1. Số chứng minh nhân dân/ Căn cước công dân: </p>
            <p className="instruction">Đánh dấu (X) vào giấy tờ phù hợp và điền số.</p>
            <Square className="square" /> Chứng minh nhân dân (9
            số):...............................................................................................
            <br />
            <Square className="square" /> Căn cước công dân (12
            số):..................................................................................................
            <br />
          </div>

          <div className="name">
            <p className="row">2. Họ và tên: (viết in hoa) </p>
            <p className="instruction">
              Viết tên in hoa, đầy đủ giống câu và đúng như giấy khai sinh.
            </p>
            <Dot />
          </div>

          <div className="birthday">
            <p className="row">3. Ngày sinh: </p>
            <p className="instruction">
              Ngày sinh phải trùng khớp với thông tin trong giấy khai sinh.
            </p>
            <div>
              <span>Ngày:...............</span>
              <span>Tháng:...............</span>
              <span>Năm:...............</span>
            </div>
          </div>

          <div clasName="gender">
            <p className="row">4. Giới tính: </p>
            <span className="male">
              <Square className="square" />
              Nam
            </span>
            <span>
              <Square className="square" />
              Nữ
            </span>
          </div>

          <div>
            <p className="row">5. Quê quán: </p>
            <p className="instruction">
              Viết đầy đủ thông tin từ thôn/xóm/khu phố, xã/phường/thị trấn, quận/huyện/thành
              phố/thị xã, tỉnh/thành phố trực thuộc TW.
            </p>
            <Dot />
            <Dot />
          </div>

          <div>
            <p className="row">6. Địa chỉ tạm trú: </p>
            <p className="instruction">
              Viết đầy đủ thông tin từ thôn/xóm/khu phố, xã/phường/thị trấn, quận/huyện/thành
              phố/thị xã, tỉnh/thành phố trực thuộc TW.
            </p>
            <Dot />
            <Dot />
          </div>

          <div>
            <p className="row">7. Địa chỉ thường trú: </p>
            <p className="instruction">
              Viết đầy đủ thông tin từ thôn/xóm/khu phố, xã/phường/thị trấn, quận/huyện/thành
              phố/thị xã, tỉnh/thành phố trực thuộc TW.
            </p>
            <Dot />
            <Dot />
          </div>

          <br />
          <br />
          <br />
          <br />
          <br />

          <div className="religion">
            <p className="row">8. Tôn giáo: </p>
            <Dot />
          </div>

          <div className="level">
            <p className="row">9. Trình độ văn hóa:</p>
            <p className="instruction">Đánh dấu (X) vào ô thích hợp.</p>
            <div>
              <p>
                <Square className="square" /> Mù chữ
              </p>
              <p>
                <Square className="square" /> Tiểu học
              </p>
              <p>
                <Square className="square" /> Trung học cơ sở
              </p>
              <p>
                <Square className="square" /> Trung học phổ thông
              </p>
              <p>
                <Square className="square" /> Cao đẳng
              </p>
              <p>
                <Square className="square" /> Đại học và trên đại học
              </p>
            </div>
          </div>

          <div className="job">
            <p className="row">10. Nghề nghiệp:</p>
            <Dot />
          </div>
        </div>

        <p className="date">......................, ngày.........tháng.........năm.........</p>

        <div className="sign">
          <div className="left">
            <p className="row">Người khai báo</p>
            <p className="instruction">(Ký và ghi rõ họ tên)</p>
          </div>
          <div className="right">
            <div className="row">Xác nhận của chính quyền địa phương</div>
          </div>
        </div>
      </div>
    );
  }
}

export default function Example() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <Button onClick={handlePrint} variant="contained" className="printButton">
        <PrintIcon />
        In phiếu
      </Button>

      <div className="printComponent">
        <ComponentToPrint ref={componentRef} />
      </div>
    </div>
  );
}
