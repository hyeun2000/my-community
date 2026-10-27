import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { formatDateTime } from '../../utils/format-date.js';

/**
 * CommentItem 컴포넌트
 * 댓글 한 개
 *
 * Props:
 * @param {object} comment - 댓글 { id, content, created_at, users } [Required]
 * @param {boolean} isOwner - 본인 댓글 여부 [Optional, 기본값: false]
 * @param {function} onDelete - 삭제 클릭 시 실행 (comment 전달) [Optional]
 *
 * Example usage:
 * <CommentItem comment={ comment } isOwner onDelete={ handleDelete } />
 */
function CommentItem({ comment, isOwner = false, onDelete }) {
  const authorName = comment.users?.name ?? '알 수 없음';

  return (
    <Box sx={{ display: 'flex', gap: 1.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.light', fontSize: '0.95rem' }}>
        { authorName.charAt(0) }
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component='strong' sx={{ fontSize: '0.9rem' }}>{ authorName }</Box>
          <Box component='span' sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            { formatDateTime(comment.created_at) }
          </Box>
        </Box>
        <Box sx={{ mt: 0.5, fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          { comment.content }
        </Box>
      </Box>
      { isOwner && (
        <IconButton size='small' aria-label='댓글 삭제' onClick={ () => onDelete?.(comment) } sx={{ alignSelf: 'flex-start' }}>
          <DeleteOutlineIcon fontSize='small' />
        </IconButton>
      ) }
    </Box>
  );
}

export default CommentItem;
