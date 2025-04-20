import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Chip,
  Stack,
  Button,
} from '@mui/material';
import { getFavorites, getMenuDetail } from '../services/menuService';
import { MenuItem } from '../services/menuService';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [favoriteMenus, setFavoriteMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteMenus = async () => {
      const favoriteIds = getFavorites();
      const menus = await Promise.all(
        favoriteIds.map(id => getMenuDetail(id).catch(() => null))
      );
      setFavoriteMenus(menus.filter((menu): menu is MenuItem => menu !== null));
      setLoading(false);
    };

    fetchFavoriteMenus();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  if (favoriteMenus.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            gap: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            즐겨찾기가 비어있습니다
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            메뉴 상세 페이지에서 하트 아이콘을 눌러 즐겨찾기에 추가해보세요
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
          >
            홈으로 가기
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          즐겨찾기
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {favoriteMenus.length}개의 메뉴가 즐겨찾기에 추가되어 있습니다
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {favoriteMenus.map((menu) => (
          <Box key={menu.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => navigate(`/menu/${menu.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={menu.image}
                alt={menu.name}
                sx={{
                  objectFit: 'contain',
                  p: 2,
                  backgroundColor: 'white',
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {menu.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {menu.brandName}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={`${menu.calories}kcal`}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={menu.servingSize}
                    variant="outlined"
                    size="small"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {menu.ingredients.slice(0, 3).join(', ')}
                  {menu.ingredients.length > 3 ? '...' : ''}
                </Typography>
                {menu.allergens.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                    {menu.allergens.map((allergen, index) => (
                      <Chip
                        key={index}
                        label={allergen}
                        color="error"
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Favorites; 