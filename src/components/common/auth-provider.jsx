import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../hooks/auth-context.js';
import { supabase } from '../../lib/supabase.js';

/**
 * AuthProvider 컴포넌트
 * Supabase 로그인 세션을 구독하고, users 테이블의 프로필을 함께 제공한다.
 *
 * Props:
 * @param {node} children - 하위 컴포넌트 [Required]
 *
 * Example usage:
 * <AuthProvider><App /></AuthProvider>
 */
function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (user) => {
    if (!user) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from('users')
      .select('id, name')
      .eq('auth_id', user.id)
      .maybeSingle();
    setProfile(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await loadProfile(data.session?.user);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      /** 콜백 안에서 Supabase를 바로 호출하면 교착될 수 있어 다음 틱으로 미룬다 */
      setTimeout(() => loadProfile(newSession?.user), 0);
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ session, profile, isLoading, signOut }),
    [session, profile, isLoading, signOut],
  );

  return (
    <AuthContext.Provider value={ value }>
      { children }
    </AuthContext.Provider>
  );
}

export default AuthProvider;
