import * as React from 'react';
import Cookies from 'js-cookie';
import A1Statistics from '../A1/statistics';
import A2Statistics from '../A2/statistics';
import A3Statistics from '../A3/statistics';
import B1Statistics from '../B1/statistics';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';

export default function Citizen() {
  const role = Cookies.get('role');
  if (role === 'A1') return <A1Statistics />;
  else if (role === 'A2') return <A2Statistics />;
  else if (role === 'A3') return <A3Statistics />;
  else if (role === 'B1') return <B1Statistics />;
  else return <NotFoundPage />;
}
