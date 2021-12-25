import Cookies from 'js-cookie';
import * as React from 'react';
import B_Task from '../taskB1';
import A_Task from '../tasks';

export default function Citizen() {
  const role = Cookies.get('role');
  if (role.indexOf('A') === 0) return <A_Task />;
  else if (role === 'B1') return <B_Task />;
}
