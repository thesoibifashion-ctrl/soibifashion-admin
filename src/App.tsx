import "./App.css";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layouts/admin-layout/Index";
import ResearchPage from "./pages/admin/collections/Index";
// import { RedirectIfAuthed } from "./components/RequireAuth";
import LogIn from "./pages/auth/LogIn";
import CreateProductPage from "./pages/admin/quotes/Products";
import UserManagement from "./pages/admin/user-management/Index";
import QuotesPage from "./pages/admin/quotes/Index";
import CartOrdersPage from "./pages/admin/cart/Index";
import ProductsPage from "./pages/admin/products/Index";
import SettingsPage from "./pages/admin/settings/Index";
import Analytics from "./pages/admin/analytics/Index";
import CustomizationsPage from "./pages/admin/customizations/Index";
import GalleryPage from "./pages/admin/gallery/Index";
import ProductDetailsPages from "./pages/admin/products/product-details/Index";
import HomePage from "./pages/admin/home/Index";
import MeasurementPage from "./pages/admin/measurements/Index";
import EditBlog from "./pages/admin/content-management/create/new-blog/Index";
import ContentManagement from "./pages/admin/content-management/Index";
import AnalyticsPage from "./pages/admin/analytics/Index";

function App() {


  return (
    <Routes>
        <Route path="/auth">
          <Route path="login" element={<LogIn />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/" element={<AnalyticsPage />} />
          <Route path="/create" element={<CreateProductPage />} />

          <Route path="/user" element={<UserManagement />} />
          <Route path="/cart" element={<CartOrdersPage />} />
        
          <Route path="/quotes" element={<QuotesPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products-details" element={<ProductDetailsPages />} />
          <Route path="/products-details/:id" element={<ProductDetailsPages />} />
          <Route path="/collections" element={<ResearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/customizations" element={<CustomizationsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/measurement" element={<MeasurementPage />} />
          <Route path="/content-management" element={<ContentManagement />} />
          <Route
            path="/content-management/edit-content/blog/:id"
            element={<EditBlog />}
          />
      </Route>
    </Routes>
  );
}

export default App;
