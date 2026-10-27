import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AuthCard from '../components/ui/auth-card.jsx';
import LoadingBox from '../components/ui/loading-box.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { supabase } from '../lib/supabase.js';
import { getAuthErrorMessage } from '../utils/auth-error-message.js';

/**
 * ResetPasswordPage 컴포넌트
 * 비밀번호 재설정 메일의 링크로 들어와 새 비밀번호를 설정한다.
 *
 * Example usage:
 * <Route path='/reset-password' element={ <ResetPasswordPage /> } />
 */
function ResetPasswordPage() {
  const { session, isLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    if (password !== passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(getAuthErrorMessage(error));
      return;
    }
    setIsDone(true);
  };

  if (isLoading) {
    return <LoadingBox />;
  }

  if (!session) {
    return (
      <AuthCard title='비밀번호 재설정' subtitle='링크가 만료되었거나 올바르지 않습니다'>
        <Button component={ RouterLink } to='/find-password' variant='contained' fullWidth size='large'>
          재설정 메일 다시 받기
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title='비밀번호 재설정' subtitle='새로 사용할 비밀번호를 입력해 주세요'>
      { isDone ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity='success'>비밀번호가 변경되었습니다.</Alert>
          <Button component={ RouterLink } to='/' variant='contained' fullWidth size='large'>
            홈으로
          </Button>
        </Box>
      ) : (
        <Box
          component='form'
          onSubmit={ handleSubmit }
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          { errorMessage && <Alert severity='error'>{ errorMessage }</Alert> }
          <TextField label='새 비밀번호' type='password' value={ password } onChange={ (event) => setPassword(event.target.value) } autoComplete='new-password' helperText='6자 이상' required fullWidth />
          <TextField label='새 비밀번호 확인' type='password' value={ passwordConfirm } onChange={ (event) => setPasswordConfirm(event.target.value) } autoComplete='new-password' required fullWidth />
          <Button type='submit' variant='contained' size='large' disabled={ isSubmitting } fullWidth sx={{ py: 1.4 }}>
            비밀번호 변경
          </Button>
        </Box>
      ) }
    </AuthCard>
  );
}

export default ResetPasswordPage;
