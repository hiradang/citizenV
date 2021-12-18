import '../style.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
// Charts
import PieChart from '../charts/PieChart';
import VerticalBar from '../charts/VerticalBar';
import HorizontalBar from '../charts/HorizontalBar';
import LineChart from '../charts/LineChart';

function Statistics() {
  return (
    <div className="page-container">
      Thống kê
      <PieChart />
      <VerticalBar />
      <HorizontalBar />
      <LineChart />
    </div>
  );
}

export default Statistics;
