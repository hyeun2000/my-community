import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import AuthCard from '../components/ui/auth-card.jsx';
import { supabase } from '../lib/supabase.js';
import { getAuthErrorMessage } from '../utils/auth-error-message.js';

/**
 * LoginPage 컴포넌트
 * 이메일 / 비밀번호 로그인과 회원가입·아이디 찾기·비밀번호 찾기 링크
 *
 * Example usage:
 * <Route path='/login' element={ <LoginPage /> } />
 */
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(getAuthErrorMessage(error));
      return;
    }
    navigate(location.state?.from || '/', { replace: true });
  };

  return (
    <AuthCard title='달려~! 달려~!' subtitle='전기 자전거 동호회에 오신 것을 환영합니다'>
      <Box
        component='form'
        onSubmit={ handleSubmit }
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        { errorMessage && <Alert severity='error'>{ errorMessage }</Alert> }
        <TextField
          label='이메일'
          type='email'
          value={ email }
          onChange={ (event) => setEmail(event.target.value) }
          autoComplete='email'
          required
          fullWidth
        />
        <TextField
          label='비밀번호'
          type='password'
          value={ password }
          onChange={ (event) => setPassword(event.target.value) }
          autoComplete='current-password'
          required
          fullWidth
        />
        <Button type='submit' variant='contained' size='large' disabled={ isSubmitting } fullWidth sx={{ py: 1.4 }}>
          { isSubmitting ? '로그인 중...' : '로그인' }
        </Button>
      </Box>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1.5,
          fontSize: '0.875rem',
        }}
      >
        <Link component={ RouterLink } to='/find-id' underline='hover' color='text.secondary'>
          아이디 찾기
        </Link>
        <Box component='span' sx={{ color: 'divider' }}>|</Box>
        <Link component={ RouterLink } to='/find-password' underline='hover' color='text.secondary'>
          비밀번호 찾기
        </Link>
      </Box>

      <Box sx={{ mt: 2, textAlign: 'center', fontSize: '0.9rem', color: 'text.secondary' }}>
        아직 회원이 아니신가요?{ ' ' }
        <Link component={ RouterLink } to='/signup' underline='hover' color='secondary' sx={{ fontWeight: 700 }}>
          회원가입
        </Link>
      </Box>
    </AuthCard>
  );
}

export default LoginPage;
