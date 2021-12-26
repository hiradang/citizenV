import * as React from 'react';
import Cookies from 'js-cookie';
import A1Citizen from './A1/allCitizen';
import A2Citizen from './A2/A2_cititizen';
import A3Citizen from './A3/A3_citizen';
import B1Citizen from './B1/B1_Citizen';
import B2Citizen from './B2/B2_Citizen';
import NotFoundPage from '../NotFoundPage//NotFoundPage';

export default function Citizen() {
  const role = Cookies.get('role');
  if (role === 'A1') return <A1Citizen />;
  else if (role === 'A2') return <A2Citizen />;
  else if (role === 'A3') return <A3Citizen />;
  else if (role === 'B1') return <B1Citizen />;
  else return <B2Citizen />;
}
