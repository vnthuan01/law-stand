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

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
