// Kiểm tra xem có phải Tiếng Việt hợp lệ hay không
function isVietnamese(str) {
  var re = /^[a-zA-Z!@#$%^&*)( +=._-]{2,200}$/g; // regex here
  return re.test(removeVietnameseTones(str));
}

//  Loại bỏ các từ tiếng Việt -> thay bằng ký tự tiếng Anh
function removeVietnameseTones(str) {
  if (str === null || str === undefined) return str;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  return str;
}

// Kiểm tra xem có phải một số hay không
function isNumber(str) {
  var reg = /^\d+$/;
  return reg.test(str);
}

//Kiểm tra xem có phải số CCCD/CMND
function CheckCitizenId(str) {
  var re1 = /^[0-9]{12}$/g;
  var re = /^[0-9]{9}$/g; // regex here
  return re1.test(str) || re.test(str);
}

//Kiểm tra xem có phải iD address
function CheckIdAddress(str) {
  var re1 = /^[0-9]{8}$/g;
  return re1.test(str);
}

//Kiểm tra có phải là giới tính hợp lệ không
function CheckGender(str) {
  return str === 'Nam' || str === 'Nữ';
}

// Kiểm tra có phải ngày tháng trong Tiếng Anh hợp lệ không

function CheckDate(str) {
  // định dạng yyyy-mm-dd
  var re1 = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/g;
  if (!re1.test(str)) return false;
  // Ngày có thật?
  const arr = str.split('-');
  const ngay = arr[2];
  const thang = arr[1];
  const nam = arr[0];
  if (
    nam > new Date(Date.now()).getFullYear() &&
    thang > new Date(Date.now()).getMonth() + 1 &&
    ngay > new Date(Date.now()).getDay()
  )
    return false;
  if (ngay < 1 || ngay > 31) return false;
  if (thang < 1 || thang > 12) return false;
  if (
    thang == 1 ||
    thang == 3 ||
    thang == 5 ||
    thang == 7 ||
    thang == 8 ||
    thang == 10 ||
    thang == 12
  ) {
    if (ngay > 31) return false;
  } else if (thang == 2) {
    if (nam % 4 == 0 && nam % 100 != 0) {
      if (ngay > 29) return false;
    } else if (ngay > 28) return false;
  } else if (ngay > 30) return false;
  return true;
}
module.exports = { CheckCitizenId, isVietnamese, CheckGender, CheckDate, CheckIdAddress, isNumber };
