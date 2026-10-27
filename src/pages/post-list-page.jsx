import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import HeroBanner from '../components/post/hero-banner.jsx';
import PostTable from '../components/post/post-table.jsx';
import LoadingBox from '../components/ui/loading-box.jsx';
import { supabase } from '../lib/supabase.js';

const PAGE_SIZE = 10;

/**
 * PostListPage 컴포넌트
 * 게시글 목록 (번호, 제목, 작성자, 작성일, 조회수) + 페이지네이션
 *
 * Example usage:
 * <Route path='/' element={ <PostListPage /> } />
 */
function PostListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isActive = true;
    const loadPosts = async () => {
      setIsLoading(true);
      const from = (page - 1) * PAGE_SIZE;
      const { data, count, error } = await supabase
        .from('posts')
        .select('id, title, views, image_url, created_at, users(name), comments(count)', { count: 'exact' })
        .order('id', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);
      if (!isActive) {
        return;
      }
      if (error) {
        setErrorMessage('게시글을 불러오지 못했습니다.');
      } else {
        setErrorMessage('');
        setPosts(data);
        setTotalCount(count ?? 0);
      }
      setIsLoading(false);
    };
    loadPosts();
    return () => {
      isActive = false;
    };
  }, [page]);

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <Box>
      <HeroBanner totalCount={ totalCount } onWrite={ () => navigate('/write') } />
      { errorMessage && <Alert severity='error' sx={{ mb: 2 }}>{ errorMessage }</Alert> }
      { isLoading ? <LoadingBox /> : <PostTable posts={ posts } /> }
      { pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={ pageCount }
            page={ page }
            color='primary'
            onChange={ (_event, value) => setSearchParams({ page: String(value) }) }
          />
        </Box>
      ) }
    </Box>
  );
}

export default PostListPage;
