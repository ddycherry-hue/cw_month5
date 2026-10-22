// Все маршруты в одном месте

import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import MainLayout from "./layouts/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";
import ProductPage from "./pages/ProductPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProductFormPage from "./pages/ProductFormPage";
import CartPage from "./pages/CartPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'products/:id', element: <ProductPage /> }, 
            { path: 'favorites', element: <FavoritesPage /> },
            { path: 'cart', element: <CartPage /> },
            { path: 'products/new', element: <ProductFormPage /> },
            { path: 'products/:id/edit', element: <ProductFormPage editing /> },
            { path: 'about', element: <AboutPage /> },
            { path: '*', element: <NotFoundPage /> }
        ]
    }
])
