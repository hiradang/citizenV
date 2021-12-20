// Lọc mảng citizen ra chỉ lấy các tiêu chí và đếm số lượng theo tiêu chí đó
var convertToCountArray = function (citizens, attr) {
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
var getTopN = function(sortedList, n) {
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
  
exports.convertToCountArray = convertToCountArray;
exports.getTopN = getTopN;
  