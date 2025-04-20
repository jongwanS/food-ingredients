import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Button,
  Container,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getBrandMenus, addToFavorites, removeFromFavorites, isFavorite } from '../services/menuService';
import { MenuItem } from '../services/menuService';

const BrandDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [brandName, setBrandName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          setError('브랜드 ID가 없습니다');
          return;
        }
        const brandId = parseInt(id);
        if (isNaN(brandId)) {
          setError('잘못된 브랜드 ID입니다');
          return;
        }
        console.log('Fetching brand menus with id:', brandId);
        const brandData = await getBrandMenus(brandId);
        console.log('Received brand data:', brandData);
        setMenus(brandData.menus);
        setBrandName(brandData.name);
      } catch (err) {
        console.error('Error fetching brand menus:', err);
        setError('브랜드 메뉴를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMenus();
    }
  }, [id]);

  const handleFavorite = (menuId: string) => {
    if (isFavorite(menuId)) {
      removeFromFavorites(menuId);
    } else {
      addToFavorites(menuId);
    }
  };

  const handleMenuClick = (menuId: string) => {
    navigate(`/menu/${menuId}`);
  };

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
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
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
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          홈으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {brandName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          총 {menus.length}개의 메뉴
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
        }}
      >
        {menus.map((menu) => (
          <Card
            key={menu.id}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                cursor: 'pointer',
              },
            }}
            onClick={() => handleMenuClick(menu.id.toString())}
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" component="h2">
                  {menu.name}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(menu.id.toString());
                  }}
                  color={isFavorite(menu.id.toString()) ? 'primary' : 'default'}
                >
                  {isFavorite(menu.id.toString()) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Box>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={`${menu.calories}kcal`} color="primary" />
                <Chip label={menu.servingSize} variant="outlined" />
              </Stack>
              <Typography variant="body2" color="text.secondary" paragraph>
                {menu.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  주재료
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {menu.ingredients.map((ingredient, index) => (
                    <Chip key={index} label={ingredient} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Box>
              {menu.allergens.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    알레르기 유발 성분
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {menu.allergens.map((allergen, index) => (
                      <Chip
                        key={index}
                        label={allergen}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default BrandDetail; 