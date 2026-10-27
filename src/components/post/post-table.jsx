import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import { formatListDate } from '../../utils/format-date.js';
import PostListItem from './post-list-item.jsx';

const HEAD_CELL_SX = { fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap' };

/**
 * PostTable 컴포넌트
 * 게시글 목록 (데스크톱: 표 / 모바일: 카드형 리스트)
 *
 * Props:
 * @param {array} posts - 게시글 목록 [Required]
 *
 * Example usage:
 * <PostTable posts={ posts } />
 */
function PostTable({ posts }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  if (posts.length === 0) {
    return (
      <Paper
        elevation={ 0 }
        sx={{ py: 8, textAlign: 'center', color: 'text.secondary', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
      >
        아직 게시글이 없어요. 첫 라이딩 이야기를 들려주세요! 🚴
      </Paper>
    );
  }

  if (isMobile) {
    return (
      <Paper elevation={ 0 } sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
        { posts.map((post) => <PostListItem key={ post.id } post={ post } />) }
      </Paper>
    );
  }

  return (
    <Paper elevation={ 0 } sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
      <Table>
        <TableHead sx={{ bgcolor: '#F3EBE5', borderTop: '2px solid', borderColor: 'primary.main' }}>
          <TableRow>
            <TableCell align='center' sx={{ ...HEAD_CELL_SX, width: 80 }}>번호</TableCell>
            <TableCell sx={ HEAD_CELL_SX }>제목</TableCell>
            <TableCell align='center' sx={{ ...HEAD_CELL_SX, width: 130 }}>작성자</TableCell>
            <TableCell align='center' sx={{ ...HEAD_CELL_SX, width: 110 }}>작성일</TableCell>
            <TableCell align='center' sx={{ ...HEAD_CELL_SX, width: 80 }}>조회</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { posts.map((post) => {
            const commentCount = post.comments?.[0]?.count ?? 0;
            return (
              <TableRow
                key={ post.id }
                hover
                onClick={ () => navigate(`/posts/${post.id}`) }
                sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
              >
                <TableCell align='center' sx={{ color: 'text.secondary' }}>{ post.id }</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box
                      component='span'
                      sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      { post.title }
                    </Box>
                    { post.image_url && <ImageIcon sx={{ fontSize: 18, color: 'text.secondary' }} /> }
                    { commentCount > 0 && (
                      <Box component='span' sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.85rem' }}>
                        [{ commentCount }]
                      </Box>
                    ) }
                  </Box>
                </TableCell>
                <TableCell align='center'>{ post.users?.name ?? '알 수 없음' }</TableCell>
                <TableCell align='center' sx={{ color: 'text.secondary' }}>{ formatListDate(post.created_at) }</TableCell>
                <TableCell align='center' sx={{ color: 'text.secondary' }}>{ post.views }</TableCell>
              </TableRow>
            );
          }) }
        </TableBody>
      </Table>
    </Paper>
  );
}

export default PostTable;
