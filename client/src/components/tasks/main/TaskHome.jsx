import Cookies from 'js-cookie';
import * as React from 'react';
import BTask from '../taskB1';
import ATask from '../tasks';

export default function Citizen() {
  const role = Cookies.get('role');
  if (role.indexOf('A') === 0) return <ATask />;
  else if (role === 'B1') return <BTask />;
}
