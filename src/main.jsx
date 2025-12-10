import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import './index.css'
import Layout from './component/Layout/Layout';
import Home from './component/Home/Home';
import Provider from './component/Provider/Provider';
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute';
import { UserProvider } from './context/UserContext';
import { API_CONFIG } from './config/apiConfig';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Lazy load components for code splitting
// Keep frequently used components (Home, Login, Register) loaded immediately
const All_toy = lazy(() => import('./component/All_toy/All_toy'));
const Login = lazy(() => import('./component/Login/Login'));
const Register = lazy(() => import('./component/Register/Register'));
const ViewDetails = lazy(() => import('./component/ViewDetails/ViewDetails'));
const Add_a_toy = lazy(() => import('./component/Add_a_toy/Add_a_toy'));
const ToyTable = lazy(() => import('./component/ToyTable/ToyTable'));
const FAQ = lazy(() => import('./component/FAQ/FAQ'));
const Seeder = lazy(() => import('./component/Seeder/Seeder'));
const NotFoundPage = lazy(() => import('./component/NotFoundPage/NotFoundPage'));
const Profile = lazy(() => import('./component/Profile/Profile'));
const ShopDashboard = lazy(() => import('./component/ShopDashboard/ShopDashboard'));
const ListOldToy = lazy(() => import('./component/ListOldToy/ListOldToy'));
const ListShopToy = lazy(() => import('./component/ListShopToy/ListShopToy'));
const AnalyticsDashboard = lazy(() => import('./component/AnalyticsDashboard/AnalyticsDashboard'));
const ShopList = lazy(() => import('./component/ShopList/ShopList'));
const ShopDetails = lazy(() => import('./component/ShopDetails/ShopDetails'));
const ShopManagement = lazy(() => import('./component/ShopManagement/ShopManagement'));
const Chat = lazy(() => import('./component/Chat/Chat'));

// Wrapper component for Suspense
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/all_toy",
        element: <SuspenseWrapper><All_toy /></SuspenseWrapper>
      },
      {
        path: '/login',
        element: <SuspenseWrapper><Login /></SuspenseWrapper>
      },
      {
        path: '/register',
        element: <SuspenseWrapper><Register /></SuspenseWrapper>
      },
      {
        path: '/view_details/:id',
        element: <SuspenseWrapper><ViewDetails /></SuspenseWrapper>,
        loader: ({ params }) => fetch(`${API_CONFIG.BASE_URL}/toys/${params.id}`)
          .then(res => {
            if (!res.ok) {
              throw new Error('Failed to fetch toy details');
            }
            return res.json();
          })
      },
      {
        path: '/add_a_toy',
        element: <SuspenseWrapper><Add_a_toy /></SuspenseWrapper>
      },
      {
        path: '/list-old-toy',
        element: <SuspenseWrapper><ListOldToy /></SuspenseWrapper>
      },
      {
        path: '/list-shop-toy',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute requiredRole="shop_owner">
              <ListShopToy />
            </ProtectedRoute>
          </SuspenseWrapper>
        )
      },
      {
        path: '/toy_table',
        element: <SuspenseWrapper><ToyTable /></SuspenseWrapper>
      },
      {
        path: '/profile',
        element: <SuspenseWrapper><Profile /></SuspenseWrapper>
      },
      {
        path: '/shop-dashboard',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute requiredRole="shop_owner">
              <ShopDashboard />
            </ProtectedRoute>
          </SuspenseWrapper>
        )
      },
      {
        path: '/analytics',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute requiredRole="shop_owner">
              <AnalyticsDashboard />
            </ProtectedRoute>
          </SuspenseWrapper>
        )
      },
      {
        path: '/faq',
        element: <SuspenseWrapper><FAQ /></SuspenseWrapper>
      },
      {
        path: '/seed',
        element: <SuspenseWrapper><Seeder /></SuspenseWrapper>
      },
      {
        path: '/shops',
        element: <SuspenseWrapper><ShopList /></SuspenseWrapper>
      },
      {
        path: '/shops/:shopOwnerEmail',
        element: <SuspenseWrapper><ShopDetails /></SuspenseWrapper>
      },
      {
        path: '/manage-shop',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute requiredRole="shop_owner">
              <ShopManagement />
            </ProtectedRoute>
          </SuspenseWrapper>
        )
      },
      {
        path: '/chat',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          </SuspenseWrapper>
        )
      },
      {
        path: '/chat/:userEmail',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          </SuspenseWrapper>
        )
      },

    ]
  },
  {
    path: '*',
    element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>
  }
]);

// Register Service Worker for offline caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Provider>
            <RouterProvider router={router} />
          </Provider>
        </UserProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
