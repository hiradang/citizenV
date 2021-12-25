import React from 'react';
import './styles.scss';

function Footer() {
  return (
    <div className="grid footer">
      <div className="row">
        <div className="col l-10 l-o-1 m-10 m-o-1 c-12 c-o-0" style={{ paddingTop: '12px' }}>
          <h5>CUNG CẤP THÔNG TIN ĐẦY ĐỦ VÀ CHÍNH XÁC LÀ TRÁCH NHIỆM CỦA MỌI NGƯỜI DÂN</h5>
        </div>
      </div>
      <div className="row">
        <div className="col l-10 l-o-1 m-10 m-o-1 c-12 c-o-0" style={{ paddingTop: '8px' }}>
          <h5>TÍCH CỰC THAM GIA TỔNG ĐIỀU TRA DÂN SỐ NĂM {new Date(Date.now()).getFullYear()}</h5>
        </div>
      </div>
      <div className="row">
        <div className="col l-10 l-o-1 m-10 m-o-1 c-12 c-o-0" style={{ padding: '8px 0' }}>
          <h5>LÀ GÓP PHẦN XÂY DỰNG TƯƠNG LAI CHO ĐẤT NƯỚC VÀ MỖI CHÚNG TA</h5>
        </div>
      </div>
      <div className="row copy-right">
        <div className="col l-10 l-o-1 m-10 m-o-1 c-12 c-o-0">
          <h5>© 2021 Copyright Huy - Bình - Loan</h5>
        </div>
      </div>
    </div>
  );
}

export default Footer;
