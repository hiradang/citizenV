import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import PropTypes from 'prop-types';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './styles.scss';
import Slide from '../slide/slide';
import Citizen from '../all-citizen/allCitizen';
import Manage from '../manage/main/manage';
import { useLocation } from 'react-router-dom';
import logoUrl from '../../constants/images/logo.png';
import Tasks from '../tasks/tasks';

const drawerWidth = 240;

HomePage.propTypes = {
  HomePage: PropTypes.array.isRequired,
};

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#f5f7ff',
    height: '100%',
    width: '100%',
    padding: '0 50px',
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function HomePage({ listItems }) {
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const toggleSideBar = () => {
    setOpen(!open);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const toggleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const toggleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const sideList = () => (
    <Box className="menuSliderContainer" component="div">
      <Divider />
      <List disablePadding>
        {listItems.map((listItem, index) => (
          <NavLink to={listItem.url} className="link">
            <ListItem button key={index}>
              <ListItemIcon className="icon">{listItem.listIcon}</ListItemIcon>
              <ListItemText primary={listItem.listText} />
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Box>
  );

  const render = () => {
    if (location.pathname === '/trangchu') return <Slide />;
    if (location.pathname === '/danso') return <Citizen />;
    if (location.pathname === '/congviec') return <Tasks />;
    if (location.pathname === '/quanly') return <Manage />;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={toggleSideBar}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <img src={logoUrl} alt="" />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            fontWeight={600}
            fontSize="16px"
          >
            <i>CitizenV</i>
          </Typography>

          <IconButton
            size="large"
            color="inherit"
            className="accountIcon"
            onClick={toggleUserClick}
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={toggleSideBar}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {sideList()}
      </Drawer>
      <Main open={open} className="">
        <DrawerHeader />
        {render()}
      </Main>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={toggleCloseUserMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={toggleCloseUserMenu} className="menuItem">
          Trang cá nhân
        </MenuItem>
        <MenuItem onClick={toggleCloseUserMenu} className="menuItem">
          Đăng xuất
        </MenuItem>
      </Menu>
    </Box>
  );
}
