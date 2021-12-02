import { Home } from '@material-ui/icons';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

export const roleA = [
  {
    listIcon: <Home />,
    listText: 'Trang chủ',
    url: '/trangchu',
  },
  {
    listIcon: <AssignmentIcon />,
    listText: 'Quản lý',
    url: '/quanly',
  },
  {
    listIcon: <WorkIcon />,
    listText: 'Công việc',
    url: '/congviec',
  },
  {
    listIcon: <AssignmentIndIcon />,
    listText: 'Dân số',
    url: '/danso',
  },
  {
    listIcon: <AssessmentIcon />,
    listText: 'Thống kê',
    url: '/thongke',
  },
];
