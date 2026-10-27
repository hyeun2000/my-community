import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BoltIcon from '@mui/icons-material/Bolt';
import EditIcon from '@mui/icons-material/Edit';
import ElectricBikeIcon from '@mui/icons-material/ElectricBike';

/**
 * HeroBanner 컴포넌트
 * 게시판 상단의 동호회 소개 배너
 *
 * Props:
 * @param {number} totalCount - 전체 게시글 수 [Optional, 기본값: 0]
 * @param {function} onWrite - 글쓰기 버튼 클릭 시 실행 [Required]
 *
 * Example usage:
 * <HeroBanner totalCount={ 12 } onWrite={ handleWrite } />
 */
function HeroBanner({ totalCount = 0, onWrite }) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        p: { xs: 3, md: 5 },
        mb: { xs: 3, md: 4 },
        color: '#fff',
        background: 'linear-gradient(120deg, #2B1A15 0%, #4E342E 45%, #8D4E1E 80%, #FF8F00 130%)',
        boxShadow: '0 16px 40px rgba(43, 26, 21, 0.35)',
      }}
    >
      <ElectricBikeIcon
        sx={{
          position: 'absolute',
          right: { xs: -20, md: 10 },
          bottom: { xs: -30, md: -40 },
          fontSize: { xs: 160, md: 240 },
          opacity: 0.12,
          transform: 'rotate(-10deg)',
        }}
      />
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1.5,
          py: 0.5,
          mb: 2,
          borderRadius: 10,
          bgcolor: 'secondary.main',
          fontSize: '0.8rem',
          fontWeight: 700,
        }}
      >
        <BoltIcon sx={{ fontSize: 16 }} />
        전기 자전거 동호회
      </Box>
      <Typography
        component='h1'
        sx={{
          fontWeight: 900,
          fontStyle: 'italic',
          fontSize: { xs: '2rem', md: '3rem' },
          lineHeight: 1.2,
          letterSpacing: '-0.03em',
        }}
      >
        달려~! 달려~!
      </Typography>
      <Typography sx={{ mt: 1, opacity: 0.85, fontSize: { xs: '0.95rem', md: '1.1rem' }, lineHeight: 1.6 }}>
        라이딩 후기, 정비 꿀팁, 번개 모임까지! 함께 달리는 즐거움을 나눠요.
      </Typography>
      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', position: 'relative' }}>
        <Button
          variant='contained'
          color='secondary'
          size='large'
          startIcon={ <EditIcon /> }
          onClick={ onWrite }
          sx={{ borderRadius: 10, px: 3 }}
        >
          글쓰기
        </Button>
        <Box component='span' sx={{ fontSize: '0.9rem', opacity: 0.85 }}>
          전체 게시글 <Box component='strong' sx={{ color: 'secondary.light' }}>{ totalCount }</Box>개
        </Box>
      </Box>
    </Box>
  );
}

export default HeroBanner;
