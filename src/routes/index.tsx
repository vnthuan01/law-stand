import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { routes } from './config';
import NotFoundPage from '@/pages/notfound/NotFoundPage';
import RoleBasedRoute from './protectedRoute';
import { AuthProvider } from '@/components/provider/auth/AuthContext';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function TitleUpdater() {
  const { pathname } = useLocation();

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
      document.title = 'Law Stand';
      return;
    }

    // Nếu segment cuối là số (ID) thì bỏ đi
    if (!isNaN(Number(segments[segments.length - 1]))) {
      segments.pop();
    }

    // Take last segment of pathname
    const lastSegment = segments[segments.length - 1];

    // Split theo dấu "-" và viết hoa chữ cái đầu mỗi từ
    const formatted = lastSegment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    document.title = `Law Stand - ${formatted}`;
  }, [pathname]);

  return null;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <TitleUpdater />
      <AuthProvider>
        <Routes>
          {routes.map((r, idx) =>
            r.isProtected ? (
              <Route
                key={idx}
                path={r.path}
                element={<RoleBasedRoute element={r.element} roles={r.roles} />}
              />
            ) : (
              <Route key={idx} path={r.path} element={r.element} />
            ),
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
