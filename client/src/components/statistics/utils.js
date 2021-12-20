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
  
exports.convertToCountArray = convertToCountArray;
  