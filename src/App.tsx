import "./App.css";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layouts/admin-layout/Index";
import UsersPage from "./pages/admin/users/Index";
import ResearchPage from "./pages/admin/collections/Index";
import { RedirectIfAuthed } from "./components/RequireAuth";
import LogIn from "./pages/auth/LogIn";
import CreateProductPage from "./pages/admin/quotes/Products";
import UserManagement from "./pages/admin/user-management/Index";
import QuotesPage from "./pages/admin/quotes/Index";
import CartOrdersPage from "./pages/admin/cart/Index";
import ProductDetails from "./pages/admin/products/product-details/ProductDetails";
import ProductsPage from "./pages/admin/products/Index";
import SettingsPage from "./pages/admin/settings/Index";
import Analytics from "./pages/admin/analytics/Index";
import CustomizationsPage from "./pages/admin/customizations/Index";
import GalleryPage from "./pages/admin/gallery/Index";
import ProductFormPage from "./pages/admin/products/product-details/ProductDetails";
import ProductDetailsPages from "./pages/admin/products/product-details/Index";

function App() {


  return (
    <Routes>
        <Route path="/auth">
          <Route path="login" element={<LogIn />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/" element={<UsersPage />} />
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
      </Route>
    </Routes>
  );
}

export default App;
