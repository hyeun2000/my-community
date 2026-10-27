import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import AuthCard from '../components/ui/auth-card.jsx';
import { supabase } from '../lib/supabase.js';
import { getAuthErrorMessage } from '../utils/auth-error-message.js';

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  phone: '',
};

/**
 * SignupPage 컴포넌트
 * 이름 / 이메일 / 비밀번호 / 전화번호로 회원가입
 * 비밀번호는 Supabase Auth가 암호화해 보관하고, 나머지는 users 테이블에 자동 저장된다.
 *
 * Example usage:
 * <Route path='/signup' element={ <SignupPage /> } />
 */
function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPasswordMismatch = form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    if (form.password !== form.passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    setIsSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name.trim(), phone: form.phone.trim() },
        emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
      },
    });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(getAuthErrorMessage(error));
      return;
    }
    if (data.session) {
      navigate('/', { replace: true });
      return;
    }
    setIsDone(true);
  };

  if (isDone) {
    return (
      <AuthCard title='가입 신청 완료!' subtitle='이제 함께 달릴 준비가 거의 끝났어요'>
        <Alert severity='success' sx={{ mb: 2 }}>
          { form.email } 로 인증 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인해 주세요.
        </Alert>
        <Button component={ RouterLink } to='/login' variant='contained' fullWidth size='large'>
          로그인하러 가기
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title='회원가입' subtitle='달려~! 달려~! 동호회의 새 멤버가 되어 주세요'>
      <Box
        component='form'
        onSubmit={ handleSubmit }
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        { errorMessage && <Alert severity='error'>{ errorMessage }</Alert> }
        <TextField label='이름' name='name' value={ form.name } onChange={ handleChange } autoComplete='name' required fullWidth />
        <TextField label='이메일' name='email' type='email' value={ form.email } onChange={ handleChange } autoComplete='email' helperText='로그인할 때 사용합니다' required fullWidth />
        <TextField label='비밀번호' name='password' type='password' value={ form.password } onChange={ handleChange } autoComplete='new-password' helperText='6자 이상' required fullWidth />
        <TextField
          label='비밀번호 확인'
          name='passwordConfirm'
          type='password'
          value={ form.passwordConfirm }
          onChange={ handleChange }
          autoComplete='new-password'
          error={ isPasswordMismatch }
          helperText={ isPasswordMismatch ? '비밀번호가 일치하지 않습니다' : ' ' }
          required
          fullWidth
        />
        <TextField label='전화번호' name='phone' type='tel' value={ form.phone } onChange={ handleChange } autoComplete='tel' placeholder='010-1234-5678' helperText='아이디 찾기에 사용됩니다' required fullWidth />
        <Button type='submit' variant='contained' size='large' disabled={ isSubmitting } fullWidth sx={{ py: 1.4 }}>
          { isSubmitting ? '가입 중...' : '가입하기' }
        </Button>
      </Box>
      <Box sx={{ mt: 3, textAlign: 'center', fontSize: '0.9rem', color: 'text.secondary' }}>
        이미 회원이신가요?{ ' ' }
        <Link component={ RouterLink } to='/login' underline='hover' color='secondary' sx={{ fontWeight: 700 }}>
          로그인
        </Link>
      </Box>
    </AuthCard>
  );
}

export default SignupPage;
