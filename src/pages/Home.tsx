import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  Fastfood as FastfoodIcon,
  LocalPizza as PizzaIcon,
  Coffee as CoffeeIcon,
  Icecream as IcecreamIcon,
  Cake as CakeIcon,
  Restaurant as RestaurantIcon,
  RamenDining as RamenIcon,
  SetMeal as ChineseFoodIcon,
  DinnerDining as SushiIcon,
  LocalDining as FoodIcon,
} from '@mui/icons-material';
import { getBrands } from '../services/menuService';
import { BrandMenu } from '../services/menuService';

const getBrandIcon = (brandName: string) => {
  const lowerName = brandName.toLowerCase();
  
  if (lowerName.includes('버거') || lowerName.includes('햄버거')) {
    return <FastfoodIcon sx={{ fontSize: 60, color: 'primary.main' }} />;
  } else if (lowerName.includes('치킨') || lowerName.includes('통닭')) {
    return <FastfoodIcon sx={{ fontSize: 60, color: 'warning.main' }} />;
  } else if (lowerName.includes('피자')) {
    return <PizzaIcon sx={{ fontSize: 60, color: 'error.main' }} />;
  } else if (lowerName.includes('커피') || lowerName.includes('카페')) {
    return <CoffeeIcon sx={{ fontSize: 60, color: 'brown' }} />;
  } else if (lowerName.includes('아이스크림') || lowerName.includes('빙수')) {
    return <IcecreamIcon sx={{ fontSize: 60, color: 'info.main' }} />;
  } else if (lowerName.includes('도넛') || lowerName.includes('베이커리')) {
    return <CakeIcon sx={{ fontSize: 60, color: 'secondary.main' }} />;
  } else if (lowerName.includes('샌드위치') || lowerName.includes('샐러드')) {
    return <RestaurantIcon sx={{ fontSize: 60, color: 'success.main' }} />;
  } else if (lowerName.includes('떡볶이') || lowerName.includes('분식')) {
    return <RamenIcon sx={{ fontSize: 60, color: 'error.main' }} />;
  } else if (lowerName.includes('중국집') || lowerName.includes('중식')) {
    return <ChineseFoodIcon sx={{ fontSize: 60, color: 'warning.main' }} />;
  } else if (lowerName.includes('일식') || lowerName.includes('스시')) {
    return <SushiIcon sx={{ fontSize: 60, color: 'primary.main' }} />;
  } else {
    return <FoodIcon sx={{ fontSize: 60, color: 'text.secondary' }} />;
  }
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<BrandMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBrands();
        setBrands(data);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('브랜드 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
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
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        브랜드 카테고리
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {brands.map((brand) => (
          <Card
            key={brand.id}
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
            onClick={() => navigate(`/brand/${brand.id}`)}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 120,
                backgroundColor: 'background.paper',
                p: 2,
              }}
            >
              {getBrandIcon(brand.name)}
            </Box>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography gutterBottom variant="h6" component="h2">
                {brand.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {brand.menuCount}개의 메뉴
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Home; 