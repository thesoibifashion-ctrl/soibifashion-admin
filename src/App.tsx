import "./App.css";
import { Routes, Route } from "react-router-dom";
import LogIn from "./pages/auth/LogIn";
import EmailConfirm from "./pages/auth/EmailConfirm";
import ResetPassword from "./pages/auth/ResetPassword";
import DashboardLayout from "./components/layouts/admin-layout/Index";
import UsersPage from "./pages/admin/users/Index";
import ContentManagement from "./pages/admin/content-management/Index";
import EditBlog from "./pages/admin/content-management/create/new-blog/Index";
import ProjectPage from "./pages/admin/project/Index";
import ResearchPage from "./pages/admin/research/Index";
import NewsletterPage from "./pages/admin/news-letter/Index";
import { RedirectIfAuthed, RequireAuth } from "./components/RequireAuth";

function App() {
  return (
    <Routes>
      <Route element={<RedirectIfAuthed />}>
        <Route path="/auth">
          <Route path="login" element={<LogIn />} />
          <Route path="email-confirm" element={<EmailConfirm />} />
        </Route>
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<UsersPage />} />
          <Route path="/content-management" element={<ContentManagement />} />
          <Route
            path="/content-management/edit-content/:tab"
            element={<EditBlog />}
          />
          <Route
            path="/content-management/edit-content/:tab/:id"
            element={<EditBlog />}
          />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
