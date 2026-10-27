import { createContext } from 'react';

/**
 * 로그인 세션과 사용자 프로필을 공유하는 Context
 * - session: Supabase Auth 세션
 * - profile: users 테이블의 { id, name }
 */
export const AuthContext = createContext(null);
