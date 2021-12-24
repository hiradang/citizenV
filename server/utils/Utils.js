// Kiểm tra xem có phải Tiếng Việt hợp lệ hay không
export function isVietnamese(str) {
    var re = /^[a-zA-Z!@#$%^&*)( +=._-]{2,}$/g; // regex here
    return re.test(removeVietnameseTones(str));
  }