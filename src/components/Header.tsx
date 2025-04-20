import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 디버깅을 위한 로그
  console.log('Header rendered');
  console.log('Current path:', location.pathname);
  console.log('Path segments:', location.pathname.split('/'));

  const showBackButton = location.pathname !== '/' && location.pathname !== '/search';

  return (
    <AppBar position="static">
      <Toolbar>
        {showBackButton && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
            aria-label="뒤로가기"
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <RestaurantIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          맛있는 식품 성분
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 