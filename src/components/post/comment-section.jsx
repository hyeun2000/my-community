import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import { useAuth } from '../../hooks/use-auth.js';
import { supabase } from '../../lib/supabase.js';
import CommentItem from './comment-item.jsx';

/**
 * CommentSection 컴포넌트
 * 게시글의 댓글 목록과 작성 폼
 *
 * Props:
 * @param {number} postId - 댓글을 불러올 게시글 번호 [Required]
 *
 * Example usage:
 * <CommentSection postId={ 3 } />
 */
function CommentSection({ postId }) {
  const location = useLocation();
  const { profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** 값이 바뀌면 댓글 목록을 다시 불러온다 */
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;
    supabase
      .from('comments')
      .select('id, content, created_at, user_id, users(name)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!isActive) {
          return;
        }
        if (error) {
          setErrorMessage('댓글을 불러오지 못했습니다.');
          return;
        }
        setComments(data);
      });
    return () => {
      isActive = false;
    };
  }, [postId, reloadKey]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim() || !profile) {
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    const { error } = await supabase
      .from('comments')
      .insert({ content: content.trim(), post_id: postId, user_id: profile.id });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage('댓글 등록에 실패했습니다.');
      return;
    }
    setContent('');
    setReloadKey((prev) => prev + 1);
  };

  const handleDelete = async (comment) => {
    const { error } = await supabase.from('comments').delete().eq('id', comment.id);
    if (error) {
      setErrorMessage('댓글 삭제에 실패했습니다.');
      return;
    }
    setComments((prev) => prev.filter((item) => item.id !== comment.id));
  };

  return (
    <Paper
      elevation={ 0 }
      sx={{ mt: 3, p: { xs: 2, md: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
    >
      <Typography
        component='h2'
        sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' } }}
      >
        <ChatBubbleOutlineIcon sx={{ color: 'secondary.main' }} />
        댓글 { comments.length }
      </Typography>

      { errorMessage && <Alert severity='error' sx={{ mt: 2 }}>{ errorMessage }</Alert> }

      <Box sx={{ mt: 1 }}>
        { comments.map((comment) => (
          <CommentItem
            key={ comment.id }
            comment={ comment }
            isOwner={ profile?.id === comment.user_id }
            onDelete={ handleDelete }
          />
        )) }
        { comments.length === 0 && (
          <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary', fontSize: '0.9rem' }}>
            첫 댓글을 남겨 주세요!
          </Box>
        ) }
      </Box>

      { profile ? (
        <Box component='form' onSubmit={ handleSubmit } sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            placeholder='따뜻한 댓글을 남겨 주세요'
            value={ content }
            onChange={ (event) => setContent(event.target.value) }
            multiline
            minRows={ 2 }
            fullWidth
          />
          <Button
            type='submit'
            variant='contained'
            disabled={ isSubmitting || !content.trim() }
            sx={{ alignSelf: 'flex-end', px: 3 }}
          >
            등록
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 2, p: 2, textAlign: 'center', bgcolor: '#F3EBE5', borderRadius: 2, fontSize: '0.9rem' }}>
          댓글을 작성하려면{ ' ' }
          <Link component={ RouterLink } to='/login' state={{ from: location.pathname }} color='secondary' sx={{ fontWeight: 700 }}>
            로그인
          </Link>
          해 주세요.
        </Box>
      ) }
    </Paper>
  );
}

export default CommentSection;
