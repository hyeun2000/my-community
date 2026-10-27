const MESSAGES = {
  'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'Email not confirmed': '이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.',
  'User already registered': '이미 가입된 이메일입니다.',
  'Password should be at least': '비밀번호는 6자 이상이어야 합니다.',
  'Unable to validate email address': '올바른 이메일 형식이 아닙니다.',
  'New password should be different': '기존 비밀번호와 다른 비밀번호를 입력해 주세요.',
};

/**
 * Supabase Auth 오류를 한국어 메시지로 변환
 */
export function getAuthErrorMessage(error) {
  if (!error) {
    return '';
  }
  const matchedKey = Object.keys(MESSAGES).find((key) => error.message?.includes(key));
  if (matchedKey) {
    return MESSAGES[matchedKey];
  }
  if (error.status === 429) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
  }
  return error.message || '알 수 없는 오류가 발생했습니다.';
}
