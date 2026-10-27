import { Navigate, useLocation } from 'react-router-dom';
import LoadingBox from '../ui/loading-box.jsx';
import { useAuth } from '../../hooks/use-auth.js';

/**
 * ProtectedRoute 컴포넌트
 * 로그인하지 않은 사용자는 로그인 페이지로 보낸다.
 *
 * Props:
 * @param {node} children - 로그인 사용자에게만 보여줄 화면 [Required]
 *
 * Example usage:
 * <ProtectedRoute><PostWritePage /></ProtectedRoute>
 */
function ProtectedRoute({ children }) {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingBox />;
  }

  if (!session) {
    return <Navigate to='/login' replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
