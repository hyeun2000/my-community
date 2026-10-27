import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import ImageIcon from '@mui/icons-material/Image';
import { formatListDate } from '../../utils/format-date.js';

/**
 * PostListItem 컴포넌트
 * 모바일 화면용 게시글 한 줄
 *
 * Props:
 * @param {object} post - 게시글 { id, title, views, created_at, image_url, users, comments } [Required]
 *
 * Example usage:
 * <PostListItem post={ post } />
 */
function PostListItem({ post }) {
  const commentCount = post.comments?.[0]?.count ?? 0;

  return (
    <Box
      component={ RouterLink }
      to={ `/posts/${post.id}` }
      sx={{
        display: 'block',
        px: 2,
        py: 1.75,
        color: 'inherit',
        textDecoration: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-of-type': { borderBottom: 0 },
        '&:active': { bgcolor: '#F3EBE5' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box
          component='span'
          sx={{ fontWeight: 600, fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          { post.title }
        </Box>
        { post.image_url && <ImageIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> }
        { commentCount > 0 && (
          <Box component='span' sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
            [{ commentCount }]
          </Box>
        ) }
      </Box>
      <Box sx={{ mt: 0.5, fontSize: '0.8rem', color: 'text.secondary', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <span>No.{ post.id }</span>
        <span>{ post.users?.name ?? '알 수 없음' }</span>
        <span>{ formatListDate(post.created_at) }</span>
        <span>조회 { post.views }</span>
      </Box>
    </Box>
  );
}

export default PostListItem;
