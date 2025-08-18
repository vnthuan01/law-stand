import {BrowserRouter, Routes, Route} from "react-router-dom";
import {routes} from "./config";
import NotFoundPage from "@/pages/notfound/NotFoundPage";
import RoleBasedRoute from "./protectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
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
          )
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
