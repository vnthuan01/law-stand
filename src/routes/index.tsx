import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { routes } from './config';
import NotFoundPage from '@/pages/notfound/NotFoundPage';
import RoleBasedRoute from './protectedRoute';
import { AuthProvider } from '@/components/provider/auth/AuthContext';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
      document.title = t('app_name');
      return;
    }

    // Nếu segment cuối là số (ID) thì bỏ đi
    if (!isNaN(Number(segments[segments.length - 1]))) {
      segments.pop();
    }

    // Take last segment of pathname
    const lastSegment = segments[segments.length - 1];

    // Dịch segment cuối cùng để làm tiêu đề, nếu không có bản dịch thì dùng chính segment đó
    const pageTitle = t(`paths.${lastSegment}`, { defaultValue: lastSegment.replace('-', ' ') });

    document.title = `${t('common.app_name')} - ${pageTitle}`;
  }, [pathname, t]);

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
