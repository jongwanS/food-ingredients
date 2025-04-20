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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  LinearProgress,
  Tabs,
  Tab,
  TableHead,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getMenuDetail, addToFavorites, removeFromFavorites, isFavorite } from '../services/menuService';
import { MenuItem } from '../services/menuService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nutrition-tabpanel-${index}`}
      aria-labelledby={`nutrition-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `nutrition-tab-${index}`,
    'aria-controls': `nutrition-tabpanel-${index}`,
  };
}

const MenuDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [menu, setMenu] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching menu with ID:', id);
        const data = await getMenuDetail(id);
        console.log('Received menu data:', data);
        setMenu(data);
        setIsFav(isFavorite(id));
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('메뉴 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  const handleFavorite = () => {
    if (!menu) return;
    if (isFav) {
      removeFromFavorites(menu.id);
    } else {
      addToFavorites(menu.id);
    }
    setIsFav(!isFav);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  if (error || !menu) {
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
        <Typography color="error">{error || '메뉴를 찾을 수 없습니다'}</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          홈으로 돌아가기
        </Button>
      </Box>
    );
  }

  const nutritionData = [
    { name: '칼로리', value: menu.calories, unit: 'kcal', max: 2000 },
    { name: '단백질', value: menu.protein, unit: 'g', max: 50 },
    { name: '지방', value: menu.fat, unit: 'g', max: 70 },
    { name: '탄수화물', value: menu.carbs, unit: 'g', max: 300 },
    { name: '나트륨', value: menu.sodium, unit: 'mg', max: 2000 },
    { name: '당류', value: menu.sugar, unit: 'g', max: 50 },
    { name: '식이섬유', value: menu.fiber, unit: 'g', max: 30 },
    { name: '콜레스테롤', value: menu.cholesterol, unit: 'mg', max: 300 },
    { name: '포화지방', value: menu.saturatedFat, unit: 'g', max: 20 },
    { name: '트랜스지방', value: menu.transFat, unit: 'g', max: 2 },
  ];

  const calculateActualNutrition = (value: number, servingSize: string) => {
    const actualSize = parseFloat(menu.foodWeight.replace('g', ''));
    return Math.round((value * actualSize) / 100);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {menu.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {menu.brandName}
          </Typography>
          <IconButton onClick={handleFavorite} color="primary">
            {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 4 }}>
        <Card>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="300"
              image={menu.image || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={menu.name}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
              onClick={handleFavorite}
            >
              {isFav ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              기본 정보
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                label={`${calculateActualNutrition(menu.calories, menu.foodWeight)}kcal`}
                color="primary"
                size="small"
              />
              <Chip
                label={menu.foodWeight.replace('g', '') + 'g'}
                variant="outlined"
                size="small"
              />
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, mb: 2 }}>
              <Typography variant="body2">
                탄수화물: {calculateActualNutrition(menu.carbs, menu.foodWeight)}g
              </Typography>
              <Typography variant="body2">
                단백질: {calculateActualNutrition(menu.protein, menu.foodWeight)}g
              </Typography>
              <Typography variant="body2">
                지방: {calculateActualNutrition(menu.fat, menu.foodWeight)}g
              </Typography>
              <Typography variant="body2">
                당류: {calculateActualNutrition(menu.sugar, menu.foodWeight)}g
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {menu.description}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              영양 정보
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="nutrition tabs">
                <Tab label="100g 기준" {...a11yProps(0)} />
                <Tab label={`실제 용량 기준 (${menu.foodWeight})`} {...a11yProps(1)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>영양성분</TableCell>
                      <TableCell align="right">함량</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nutritionData.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell component="th" scope="row">
                          {item.name}
                        </TableCell>
                        <TableCell align="right">
                          {item.value} {item.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>영양성분</TableCell>
                      <TableCell align="right">함량</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nutritionData.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell component="th" scope="row">
                          {item.name}
                        </TableCell>
                        <TableCell align="right">
                          {calculateActualNutrition(item.value, menu.foodWeight)} {item.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              성분 정보
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                주재료
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {menu.ingredients.map((ingredient, index) => (
                  <Chip key={index} label={ingredient} variant="outlined" />
                ))}
              </Stack>
            </Box>

            {menu.allergens.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  알레르기 유발 성분
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {menu.allergens.map((allergen, index) => (
                    <Chip
                      key={index}
                      label={allergen}
                      color="error"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {menu.additives.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  식품첨가물
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {menu.additives.map((additive, index) => (
                    <Chip
                      key={index}
                      label={additive}
                      color="warning"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default MenuDetail; 