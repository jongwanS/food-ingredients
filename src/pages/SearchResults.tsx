import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { searchMenus } from '../services/menuService';
import { MenuItem as MenuItemType } from '../services/menuService';

type SortOption = 'name' | 'calories' | 'brandName';
type FilterOption = {
  brand: string[];
  calories: [number, number];
  allergens: string[];
};

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [menus, setMenus] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filters, setFilters] = useState<FilterOption>({
    brand: [],
    calories: [0, 2000],
    allergens: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) return;
      try {
        const data = await searchMenus(searchQuery);
        setMenus(data);
        setLoading(false);
      } catch (err) {
        setError('검색 결과를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRetry = () => {
    if (!searchQuery) return;
    setLoading(true);
    setError(null);
    const fetchSearchResults = async () => {
      try {
        const data = await searchMenus(searchQuery);
        setMenus(data);
        setLoading(false);
      } catch (err) {
        setError('검색 결과를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchSearchResults();
  };

  const filteredAndSortedMenus = useMemo(() => {
    let result = [...menus];

    // 필터링 적용
    if (filters.brand.length > 0) {
      result = result.filter(menu => filters.brand.includes(menu.brandName));
    }
    if (filters.allergens.length > 0) {
      result = result.filter(menu => 
        !menu.allergens.some(allergen => filters.allergens.includes(allergen))
      );
    }
    result = result.filter(menu => 
      menu.calories >= filters.calories[0] && menu.calories <= filters.calories[1]
    );

    // 정렬 적용
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'calories':
          return a.calories - b.calories;
        case 'brandName':
          return a.brandName.localeCompare(b.brandName);
        default:
          return 0;
      }
    });

    return result;
  }, [menus, filters, sortBy]);

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
        <Button variant="contained" onClick={handleRetry}>
          다시 시도
        </Button>
      </Box>
    );
  }

  const uniqueBrands = Array.from(new Set(menus.map(menu => menu.brandName)));
  const uniqueAllergens = Array.from(new Set(menus.flatMap(menu => menu.allergens)));

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          검색 결과
        </Typography>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="메뉴 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
        </form>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            필터
          </Button>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>정렬</InputLabel>
            <Select
              value={sortBy}
              label="정렬"
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              startAdornment={<SortIcon />}
            >
              <MenuItem value="name">이름순</MenuItem>
              <MenuItem value="calories">칼로리순</MenuItem>
              <MenuItem value="brandName">브랜드순</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {showFilters && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
              <Box>
                <Typography gutterBottom>브랜드</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {uniqueBrands.map(brand => (
                    <Chip
                      key={brand}
                      label={brand}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          brand: prev.brand.includes(brand)
                            ? prev.brand.filter(b => b !== brand)
                            : [...prev.brand, brand]
                        }));
                      }}
                      color={filters.brand.includes(brand) ? 'primary' : 'default'}
                    />
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography gutterBottom>칼로리 범위</Typography>
                <Slider
                  value={filters.calories}
                  onChange={(_, value) => setFilters(prev => ({
                    ...prev,
                    calories: value as [number, number]
                  }))}
                  valueLabelDisplay="auto"
                  min={0}
                  max={2000}
                  step={50}
                />
              </Box>
              <Box>
                <Typography gutterBottom>알레르기 유발성분 제외</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {uniqueAllergens.map(allergen => (
                    <Chip
                      key={allergen}
                      label={allergen}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          allergens: prev.allergens.includes(allergen)
                            ? prev.allergens.filter(a => a !== allergen)
                            : [...prev.allergens, allergen]
                        }));
                      }}
                      color={filters.allergens.includes(allergen) ? 'error' : 'default'}
                    />
                  ))}
                </Stack>
              </Box>
            </Box>
          </Paper>
        )}

        {filteredAndSortedMenus.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            검색 결과가 없습니다.
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {filteredAndSortedMenus.length}개의 결과를 찾았습니다.
          </Typography>
        )}
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
        {filteredAndSortedMenus.map((menu) => (
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

export default SearchResults; 