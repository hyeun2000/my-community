import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import ElectricBikeIcon from '@mui/icons-material/ElectricBike';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../hooks/use-auth.js';

/**
 * AppHeader 컴포넌트
 * 사이트 로고와 로그인 상태에 따른 메뉴를 보여준다.
 *
 * Example usage:
 * <AppHeader />
 */
function AppHeader() {
  const navigate = useNavigate();
  const { session, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <AppBar
      position='sticky'
      elevation={ 0 }
      sx={{
        background: 'linear-gradient(90deg, #2B1A15 0%, #4E342E 60%, #6D4C41 100%)',
        borderBottom: '3px solid',
        borderColor: 'secondary.main',
      }}
    >
      <Container maxWidth='md' sx={{ px: { xs: 2, md: 3 } }}>
        <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: 56, md: 64 } }}>
          <Box
            component={ RouterLink }
            to='/'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            <ElectricBikeIcon sx={{ color: 'secondary.main', fontSize: { xs: 28, md: 32 } }} />
            <Box
              component='span'
              sx={{
                fontWeight: 900,
                fontSize: { xs: '1.1rem', md: '1.35rem' },
                letterSpacing: '-0.02em',
                fontStyle: 'italic',
              }}
            >
              달려~! 달려~!
            </Box>
          </Box>

          { session ? (
            <>
              <Box
                component='span'
                sx={{ display: { xs: 'none', sm: 'inline' }, fontSize: '0.9rem', mr: 1 }}
              >
                <Box component='strong' sx={{ color: 'secondary.light' }}>{ profile?.name }</Box>님 라이딩 GO!
              </Box>
              <Button
                component={ RouterLink }
                to='/write'
                variant='contained'
                color='secondary'
                size='small'
                startIcon={ <EditIcon /> }
              >
                글쓰기
              </Button>
              <Button color='inherit' size='small' onClick={ handleSignOut }>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button component={ RouterLink } to='/login' color='inherit' size='small'>
                로그인
              </Button>
              <Button
                component={ RouterLink }
                to='/signup'
                variant='contained'
                color='secondary'
                size='small'
              >
                회원가입
              </Button>
            </>
          ) }
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppHeader;
