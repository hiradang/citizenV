import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Count() {
  const [citizens, setListCitizen] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/citizen/').then((response) => {
      setListCitizen(response.data);
    });
  }, []);

  // Chaỵ vòng for chèn dữ liệu vào database
  var listFilter = citizens.map((citizen) => {
    return citizen['address'].substring(0, 8);
  });

  let listCount = [];
  for (let i = 0; i < listFilter.length; i++) {
    listCount[listFilter[i]] = (listCount[listFilter[i]] || 0) + 1;
  }
  const sorted = Object.keys(listCount).sort((a, b) => listCount[b] - listCount[a]);
  let listSorted = [];
  for (let i = 0; i < sorted.length; i++) {
    listSorted.push({
      name: sorted[i],
      quantity: listCount[sorted[i]],
    });
  }

  console.log(listSorted);
  let query = '';

  listSorted.forEach((ele) => {
    query += `update hamlets set quantity_hamlet=${ele.quantity} where id_hamlet =${ele.name};`;
  });

  return <div>{query}</div>;
}
