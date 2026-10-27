import { Navigate, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppHeader from './components/common/app-header.jsx';
import ProtectedRoute from './components/common/protected-route.jsx';
import FindIdPage from './pages/find-id-page.jsx';
import FindPasswordPage from './pages/find-password-page.jsx';
import LoginPage from './pages/login-page.jsx';
import PostDetailPage from './pages/post-detail-page.jsx';
import PostListPage from './pages/post-list-page.jsx';
import PostWritePage from './pages/post-write-page.jsx';
import ResetPasswordPage from './pages/reset-password-page.jsx';
import SignupPage from './pages/signup-page.jsx';

function App() {
  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
    }}>
      <AppHeader />
      <Box
        component='main'
        sx={{
          width: '100%',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth='md' sx={{ py: 4, px: { xs: 2, md: 3 } }}>
          <Routes>
            <Route
              path='/'
              element={ <ProtectedRoute><PostListPage /></ProtectedRoute> }
            />
            <Route
              path='/posts/:postId'
              element={ <ProtectedRoute><PostDetailPage /></ProtectedRoute> }
            />
            <Route path='/login' element={ <LoginPage /> } />
            <Route path='/signup' element={ <SignupPage /> } />
            <Route path='/find-id' element={ <FindIdPage /> } />
            <Route path='/find-password' element={ <FindPasswordPage /> } />
            <Route path='/reset-password' element={ <ResetPasswordPage /> } />
            <Route
              path='/write'
              element={ <ProtectedRoute><PostWritePage /></ProtectedRoute> }
            />
            <Route
              path='/posts/:postId/edit'
              element={ <ProtectedRoute><PostWritePage /></ProtectedRoute> }
            />
            <Route path='*' element={ <Navigate to='/' replace /> } />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
