import { useContext } from 'react';
import { AuthContext } from './auth-context.js';

/**
 * 로그인 정보 조회 훅
 *
 * Example usage:
 * const { session, profile, isLoading, signOut } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
}
