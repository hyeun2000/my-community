import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

/**
 * ImageUploadField 컴포넌트
 * 게시글 사진 1장을 선택하고 미리보기를 보여준다.
 *
 * Props:
 * @param {string} previewUrl - 미리보기 이미지 URL [Optional]
 * @param {function} onSelect - 파일 선택 시 실행 (file 전달) [Required]
 * @param {function} onRemove - 사진 제거 시 실행 [Required]
 *
 * Example usage:
 * <ImageUploadField previewUrl={ preview } onSelect={ handleSelect } onRemove={ handleRemove } />
 */
function ImageUploadField({ previewUrl, onSelect, onRemove }) {
  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onSelect(file);
    }
    event.target.value = '';
  };

  if (previewUrl) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
        <Box
          component='img'
          src={ previewUrl }
          alt='첨부 사진 미리보기'
          sx={{ display: 'block', maxWidth: '100%', maxHeight: 320, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
        />
        <IconButton
          size='small'
          onClick={ onRemove }
          aria-label='사진 삭제'
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>
    );
  }

  return (
    <Button
      component='label'
      variant='outlined'
      startIcon={ <AddPhotoAlternateIcon /> }
      sx={{ borderStyle: 'dashed', py: 1.5 }}
    >
      사진 첨부 (최대 5MB)
      <input type='file' accept='image/jpeg,image/png,image/gif,image/webp' hidden onChange={ handleChange } />
    </Button>
  );
}

export default ImageUploadField;
