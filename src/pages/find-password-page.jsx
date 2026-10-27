import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AuthCard from '../components/ui/auth-card.jsx';
import { supabase } from '../lib/supabase.js';
import { getAuthErrorMessage } from '../utils/auth-error-message.js';

/**
 * FindPasswordPage 컴포넌트
 * 가입한 이메일로 비밀번호 재설정 링크를 보낸다.
 *
 * Example usage:
 * <Route path='/find-password' element={ <FindPasswordPage /> } />
 */
function FindPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}reset-password`,
    });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(getAuthErrorMessage(error));
      return;
    }
    setIsSent(true);
  };

  return (
    <AuthCard title='비밀번호 찾기' subtitle='가입한 이메일로 비밀번호 재설정 링크를 보내 드려요'>
      <Box
        component='form'
        onSubmit={ handleSubmit }
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        { errorMessage && <Alert severity='error'>{ errorMessage }</Alert> }
        { isSent && (
          <Alert severity='success'>
            재설정 메일을 보냈습니다. 메일의 링크를 눌러 새 비밀번호를 설정해 주세요.
          </Alert>
        ) }
        <TextField
          label='이메일'
          type='email'
          value={ email }
          onChange={ (event) => setEmail(event.target.value) }
          autoComplete='email'
          required
          fullWidth
        />
        <Button type='submit' variant='contained' size='large' disabled={ isSubmitting } fullWidth sx={{ py: 1.4 }}>
          재설정 메일 보내기
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={ RouterLink } to='/login' variant='outlined' fullWidth>로그인</Button>
          <Button component={ RouterLink } to='/find-id' variant='outlined' fullWidth>아이디 찾기</Button>
        </Box>
      </Box>
    </AuthCard>
  );
}

export default FindPasswordPage;
