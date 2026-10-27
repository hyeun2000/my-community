import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ImageUploadField from '../components/post/image-upload-field.jsx';
import LoadingBox from '../components/ui/loading-box.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { supabase } from '../lib/supabase.js';
import { getStoragePath, POST_IMAGE_BUCKET } from '../utils/storage-path.js';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * PostWritePage 컴포넌트
 * 게시글 작성 / 수정 (postId 파라미터가 있으면 수정 모드)
 *
 * Example usage:
 * <Route path='/write' element={ <PostWritePage /> } />
 * <Route path='/posts/:postId/edit' element={ <PostWritePage /> } />
 */
function PostWritePage() {
  const { postId } = useParams();
  const isEditMode = Boolean(postId);
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode || !profile) {
      return;
    }
    const loadPost = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, content, image_url, user_id')
        .eq('id', postId)
        .maybeSingle();
      if (!data || data.user_id !== profile.id) {
        setErrorMessage('수정 권한이 없는 게시글입니다.');
      } else {
        setTitle(data.title);
        setContent(data.content);
        setOriginalImageUrl(data.image_url);
        setPreviewUrl(data.image_url);
      }
      setIsLoading(false);
    };
    loadPost();
  }, [isEditMode, postId, profile]);

  /** 로컬 미리보기 URL 정리 */
  useEffect(() => () => {
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const handleSelectImage = (file) => {
    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMessage('사진은 5MB 이하만 첨부할 수 있습니다.');
      return;
    }
    setErrorMessage('');
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const uploadImage = async (file) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `${session.user.id}/${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from(POST_IMAGE_BUCKET).upload(filePath, file);
    if (error) {
      throw error;
    }
    return supabase.storage.from(POST_IMAGE_BUCKET).getPublicUrl(filePath).data.publicUrl;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!profile) {
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      let imageUrl = previewUrl ? originalImageUrl : null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const payload = { title: title.trim(), content: content.trim(), image_url: imageUrl };

      const { data, error } = isEditMode
        ? await supabase.from('posts').update(payload).eq('id', postId).select('id').single()
        : await supabase.from('posts').insert({ ...payload, user_id: profile.id }).select('id').single();
      if (error) {
        throw error;
      }

      /** 사진을 바꾸거나 지웠다면 이전 사진 파일 정리 */
      const oldPath = getStoragePath(originalImageUrl);
      if (oldPath && originalImageUrl !== imageUrl) {
        await supabase.storage.from(POST_IMAGE_BUCKET).remove([oldPath]);
      }
      navigate(`/posts/${data.id}`, { replace: true });
    } catch {
      setErrorMessage('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setIsSubmitting(false);
    }
  };

  if (isLoading || (isEditMode && !profile)) {
    return <LoadingBox />;
  }

  return (
    <Paper
      elevation={ 0 }
      sx={{ p: { xs: 2.5, md: 4 }, border: '1px solid', borderColor: 'divider', borderTop: '4px solid', borderTopColor: 'secondary.main', borderRadius: 3 }}
    >
      <Typography component='h1' sx={{ fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.75rem' }, mb: 3 }}>
        { isEditMode ? '게시글 수정' : '새 게시글 작성' }
      </Typography>
      <Box component='form' onSubmit={ handleSubmit } sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        { errorMessage && <Alert severity='error'>{ errorMessage }</Alert> }
        <TextField
          label='제목'
          value={ title }
          onChange={ (event) => setTitle(event.target.value) }
          slotProps={{ htmlInput: { maxLength: 100 } }}
          required
          fullWidth
        />
        <TextField
          label='내용'
          value={ content }
          onChange={ (event) => setContent(event.target.value) }
          placeholder='라이딩 코스, 정비 팁, 모임 소식 등을 자유롭게 적어 주세요'
          multiline
          minRows={ 10 }
          required
          fullWidth
        />
        <ImageUploadField
          previewUrl={ previewUrl }
          onSelect={ handleSelectImage }
          onRemove={ handleRemoveImage }
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button color='inherit' onClick={ () => navigate(-1) }>취소</Button>
          <Button
            type='submit'
            variant='contained'
            disabled={ isSubmitting || !profile || !title.trim() || !content.trim() }
            sx={{ px: 4 }}
          >
            { isSubmitting ? '저장 중...' : isEditMode ? '수정 완료' : '등록' }
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default PostWritePage;
