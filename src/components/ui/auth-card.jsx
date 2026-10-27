import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ElectricBikeIcon from '@mui/icons-material/ElectricBike';

/**
 * AuthCard 컴포넌트
 * 로그인 / 회원가입 / 계정 찾기 화면의 공통 카드 레이아웃
 *
 * Props:
 * @param {string} title - 카드 제목 [Required]
 * @param {string} subtitle - 제목 아래 안내 문구 [Optional]
 * @param {node} children - 카드 본문 [Required]
 *
 * Example usage:
 * <AuthCard title='로그인' subtitle='환영합니다'>...</AuthCard>
 */
function AuthCard({ title, subtitle, children }) {
  return (
    <Paper
      elevation={ 0 }
      sx={{
        width: '100%',
        maxWidth: 440,
        mx: 'auto',
        p: { xs: 3, md: 5 },
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 12px 40px rgba(78, 52, 46, 0.12)',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 1.5,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            background: 'linear-gradient(135deg, #4E342E 0%, #FF8F00 100%)',
            transform: 'rotate(-8deg)',
          }}
        >
          <ElectricBikeIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography
          variant='h5'
          component='h1'
          sx={{ fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.6rem' }, lineHeight: 1.3 }}
        >
          { title }
        </Typography>
        { subtitle && (
          <Typography variant='body2' sx={{ mt: 0.5, color: 'text.secondary', lineHeight: 1.5 }}>
            { subtitle }
          </Typography>
        ) }
      </Box>
      { children }
    </Paper>
  );
}

export default AuthCard;
