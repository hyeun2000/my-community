import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CommentSection from '../components/post/comment-section.jsx';
import ConfirmDialog from '../components/ui/confirm-dialog.jsx';
import LoadingBox from '../components/ui/loading-box.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { supabase } from '../lib/supabase.js';
import { formatDateTime } from '../utils/format-date.js';
import { getStoragePath, POST_IMAGE_BUCKET } from '../utils/storage-path.js';

/**
 * PostDetailPage 컴포넌트
 * 게시글 내용, 작성자, 사진, 작성일자와 댓글을 보여준다.
 *
 * Example usage:
 * <Route path='/posts/:postId' element={ <PostDetailPage /> } />
 */
function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  /** StrictMode에서 조회수가 두 번 오르지 않도록 기록 */
  const viewedPostRef = useRef(null);

  useEffect(() => {
    let isActive = true;
    const loadPost = async () => {
      setIsLoading(true);
      if (viewedPostRef.current !== postId) {
        viewedPostRef.current = postId;
        await supabase.rpc('increment_views', { p_post_id: Number(postId) });
      }
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, image_url, views, created_at, updated_at, user_id, users(name)')
        .eq('id', postId)
        .maybeSingle();
      if (!isActive) {
        return;
      }
      if (error || !data) {
        setErrorMessage('게시글을 찾을 수 없습니다.');
      }
      setPost(data);
      setIsLoading(false);
    };
    loadPost();
    return () => {
      isActive = false;
    };
  }, [postId]);

  const handleDelete = async () => {
    setIsDeleteOpen(false);
    const { error } = await supabase.from('posts').delete().eq('id', post.id);
    if (error) {
      setErrorMessage('삭제에 실패했습니다.');
      return;
    }
    const imagePath = getStoragePath(post.image_url);
    if (imagePath) {
      await supabase.storage.from(POST_IMAGE_BUCKET).remove([imagePath]);
    }
    navigate('/', { replace: true });
  };

  if (isLoading) {
    return <LoadingBox />;
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Alert severity='warning' sx={{ mb: 2 }}>{ errorMessage }</Alert>
        <Button component={ RouterLink } to='/' variant='contained'>목록으로</Button>
      </Box>
    );
  }

  const isOwner = profile?.id === post.user_id;
  const authorName = post.users?.name ?? '알 수 없음';
  const isEdited = post.updated_at && new Date(post.updated_at) - new Date(post.created_at) > 1000;

  return (
    <Box>
      <Button component={ RouterLink } to='/' startIcon={ <ArrowBackIcon /> } color='inherit' sx={{ mb: 2 }}>
        목록으로
      </Button>

      { errorMessage && <Alert severity='error' sx={{ mb: 2 }}>{ errorMessage }</Alert> }

      <Paper
        elevation={ 0 }
        sx={{ p: { xs: 2.5, md: 4 }, border: '1px solid', borderColor: 'divider', borderTop: '4px solid', borderTopColor: 'primary.main', borderRadius: 3 }}
      >
        <Box sx={{ fontSize: '0.85rem', color: 'secondary.main', fontWeight: 700 }}>No.{ post.id }</Box>
        <Typography
          component='h1'
          sx={{ mt: 0.5, fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.9rem' }, lineHeight: 1.3, wordBreak: 'break-word' }}
        >
          { post.title }
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>{ authorName.charAt(0) }</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box component='strong' sx={{ display: 'block', fontSize: '0.95rem' }}>{ authorName }</Box>
            <Box sx={{ fontSize: '0.8rem', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <span>{ formatDateTime(post.created_at) }{ isEdited ? ' (수정됨)' : '' }</span>
              <Box component='span' sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3 }}>
                <VisibilityOutlinedIcon sx={{ fontSize: 14 }} /> { post.views }
              </Box>
            </Box>
          </Box>
          { isOwner && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button component={ RouterLink } to={ `/posts/${post.id}/edit` } variant='outlined' size='small'>
                수정
              </Button>
              <Button variant='outlined' color='error' size='small' onClick={ () => setIsDeleteOpen(true) }>
                삭제
              </Button>
            </Box>
          ) }
        </Box>

        <Divider sx={{ my: 3 }} />

        { post.image_url && (
          <Box
            component='img'
            src={ post.image_url }
            alt={ post.title }
            sx={{ display: 'block', maxWidth: '100%', maxHeight: 600, mx: 'auto', mb: 3, borderRadius: 2 }}
          />
        ) }

        <Box sx={{ fontSize: { xs: '1rem', md: '1.05rem' }, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: 120 }}>
          { post.content }
        </Box>
      </Paper>

      <CommentSection postId={ post.id } />

      <ConfirmDialog
        isOpen={ isDeleteOpen }
        title='게시글 삭제'
        message='삭제한 게시글과 댓글은 복구할 수 없습니다. 삭제하시겠습니까?'
        onConfirm={ handleDelete }
        onClose={ () => setIsDeleteOpen(false) }
      />
    </Box>
  );
}

export default PostDetailPage;
