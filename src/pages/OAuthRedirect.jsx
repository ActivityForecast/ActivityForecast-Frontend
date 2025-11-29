import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from 'stores/auth';
import { fetchMe } from 'api/auth';

export default function OAuthRedirect() {
  const [search] = useSearchParams();
  const nav = useNavigate();
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const success = search.get('success');
        const token = search.get('token');
        const refreshToken = search.get('refreshToken');
        const error = search.get('error');
        const message = search.get('message');

        if (success === 'false' || error) {
          throw new Error(message || error || '소셜 로그인에 실패했어요.');
        }

        if (!token) {
          const me = await fetchMe();
          if (me) {
            useAuthStore.setState({ user: me.user || me });
            nav('/', { replace: true });
            return;
          }
          throw new Error('토큰이 없고 세션 확인도 실패했어요.');
        }
        useAuthStore.setState({
          accessToken: token,
          refreshToken: refreshToken || null,
          tokenType: 'Bearer',
        });

        const me = await fetchMe().catch(() => null);
        if (me) useAuthStore.setState({ user: me.user || me });

        nav('/', { replace: true });
      } catch (e) {
        setErr(
          e?.response?.data?.message ||
            e?.message ||
            '카카오 로그인 처리 중 오류'
        );
      }
    })();
  }, [nav, search]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg border px-6 py-4 shadow-sm">
        <p className="text-sm">카카오 로그인 처리 중…</p>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      </div>
    </div>
  );
}
