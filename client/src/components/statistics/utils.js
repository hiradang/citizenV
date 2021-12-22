import moment from 'moment';

// Lọc mảng citizen ra chỉ lấy các tiêu chí và đếm số lượng theo tiêu chí đó
export function convertToCountArray (citizens, attr) {
    var listFilter = citizens.map((citizen) => {
        return (citizen[attr]);
    })

    // listFilter = ["Khong", "Khong", "Phat giao", "Hoi giao"]

    let listCount =[];
    for (let i = 0; i < listFilter.length; i++) {
        listCount[listFilter[i]] = (listCount[listFilter[i]] || 0) + 1;
    }

    // listCount = [Khong: 2, Phat giao: 1, Hoi giao: 1]

    const sorted = Object.keys(listCount).sort((a, b) => listCount[b] - listCount[a]);
    let listSorted = [];
    for (let i = 0; i < sorted.length; i++) {
        // listSorted.push(listCount[sorted[i]]);
        listSorted.push({
            name: sorted[i],
            quantity: listCount[sorted[i]]
        })
    }
    return listSorted;

};

// Lấy ra danh sách top N và phần còn lại
// input = [Khong: 10, Phat giao: 9, Hoi giao: 8, "Nho giao": 2, "Thien chua giao": 1]
// Voi n = 3 output tương ứng như sau
// [Khong: 10, Phat giao: 9, Hoi giao: 8, "Con lai": 3]
export function getTopN(sortedList, n) {
    console.log(sortedList);
    var topN = sortedList.slice(0, n);
    
    var count = 0;
    for (let i = n; i < sortedList.length; i++) {
        count += sortedList[i].quantity;
    }
    topN.push({
        name: "Còn lại",
        quantity: count,
    })
    return topN;
}


// Chuyển đổi từ dạng số lượng sang phần trăm
// dùng cho PieChart
// input = [Khong: 10, Phat giao: 9, Hoi giao: 8, "Con lai": 3]
// output = [Khong: 33.33, Phat giao: 30, Hoi giao: 26.67, "Con lai": 10]
export function convertToPercent(sortedList){
    let sum = sortedList.reduce(((previousSum, ele) => {
        previousSum += ele.quantity;
        return previousSum;
    }), 0)

    let percentList = sortedList.map((ele) => {
        return ({
            name: ele.name,
            quantity: (ele.quantity/sum * 100).toFixed(2)
        })
    })
    return percentList;
}

// Input: job -> Nghề nghiệp
// level -> Trình độ văn hóa v.v
export function convertFromCriteriaToName(criteria){
    switch (criteria) {
        case "level": 
            return "Trình độ văn hóa";
        case "religion":
            return "Tôn giáo";
        case "job":
            return "Nghề nghiệp";
        case "gender":
            return "Giới tính"
        case "age":
            return "Độ tuổi";
        case "ethinic":
            return "Dân tộc"
        default:
            return ""
    }
}
  
// Tính tuổi hiện nay dựa vào sinh nhật
export function calculateAge(dob) {
  var age = moment().diff(moment(dob), 'years');
  return age;
}

// output: [{name: 1, quantity: 240}, {name: 2, quantity: 203}, {name: 3, quantity: 230}, ...
// {name: 99, quantity: 50}]
export function convertAgeToArray(citizens) {
    console.log(citizens[0])
    let ageArray = citizens.map((citizen) => {
        return (calculateAge(citizen.date_of_birth))
    })

    let listCount =[];
    for (let i = 0; i < ageArray.length; i++) {
        listCount[ageArray[i]] = (listCount[ageArray[i]] || 0) + 1;
    }
    
    let resultList = listCount.map((ele, key) => {
        return ({
            name: key,
            quantity: listCount[key]
        })
    })
    return resultList;
}

// input la output của hàm convertAgeToArray
// output: Đếm số lượng tuổi theo 1 chục, ví dụ 0 - 10, 10 - 20, 20 - 30,...
export function convertAgeJump10(countArray) {
    let result = [];
    for (let i = 0; i < 10; i++) {
        let count = 0;
        for (let j = 0; j < 10; j++) {
            if (countArray[i * 10 + j]) {
                count += countArray[i * 10 + j].quantity;
            }
        }
        result.push({
            name: `${i * 10} - ${i * 10 + 9}`,
            quantity: count
        })
    }
    return result;
}

