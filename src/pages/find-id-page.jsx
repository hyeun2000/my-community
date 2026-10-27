import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AuthCard from '../components/ui/auth-card.jsx';
import { supabase } from '../lib/supabase.js';

/**
 * FindIdPage 컴포넌트
 * 이름 + 전화번호로 가입한 이메일(일부 가림)을 찾는다.
 *
 * Example usage:
 * <Route path='/find-id' element={ <FindIdPage /> } />
 */
function FindIdPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [foundEmail, setFoundEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setFoundEmail('');
    setIsSubmitting(true);
    const { data, error } = await supabase.rpc('find_email', {
      p_name: name.trim(),
      p_phone: phone.trim(),
    });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage('조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    if (!data) {
      setErrorMessage('일치하는 회원 정보가 없습니다.');
      return;
    }
    setFoundEmail(data);
  };

  return (
    <AuthCard title='아이디 찾기' subtitle='가입할 때 입력한 이름과 전화번호를 입력해 주세요'>
      <Box
        component='form'
        onSubmit={ handleSubmit }
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        { errorMessage && <Alert severity='error'>{ errorMessage }</Alert> }
        { foundEmail && (
          <Alert severity='success'>
            회원님의 아이디는 <Box component='strong'>{ foundEmail }</Box> 입니다.
          </Alert>
        ) }
        <TextField label='이름' value={ name } onChange={ (event) => setName(event.target.value) } required fullWidth />
        <TextField label='전화번호' type='tel' value={ phone } onChange={ (event) => setPhone(event.target.value) } placeholder='010-1234-5678' required fullWidth />
        <Button type='submit' variant='contained' size='large' disabled={ isSubmitting } fullWidth sx={{ py: 1.4 }}>
          아이디 찾기
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={ RouterLink } to='/login' variant='outlined' fullWidth>로그인</Button>
          <Button component={ RouterLink } to='/find-password' variant='outlined' fullWidth>비밀번호 찾기</Button>
        </Box>
      </Box>
    </AuthCard>
  );
}

export default FindIdPage;
