import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * LoadingBox 컴포넌트
 * 데이터를 불러오는 동안 가운데에 로딩 표시를 보여준다.
 *
 * Example usage:
 * <LoadingBox />
 */
function LoadingBox() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress color='secondary' />
    </Box>
  );
}

export default LoadingBox;
