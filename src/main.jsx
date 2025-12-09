import React from 'react'
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
import All_toy from './component/All_toy/All_toy';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import ViewDetails from './component/ViewDetails/ViewDetails';
import Add_a_toy from './component/Add_a_toy/Add_a_toy';
import ToyTable from './component/ToyTable/ToyTable';
import FAQ from './component/FAQ/FAQ';
import Seeder from './component/Seeder/Seeder';
import NotFoundPage from './component/NotFoundPage/NotFoundPage';
import Profile from './component/Profile/Profile';
import ShopDashboard from './component/ShopDashboard/ShopDashboard';
import ListOldToy from './component/ListOldToy/ListOldToy';
import ListShopToy from './component/ListShopToy/ListShopToy';
import AnalyticsDashboard from './component/AnalyticsDashboard/AnalyticsDashboard';
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute';
import ShopList from './component/ShopList/ShopList';
import ShopDetails from './component/ShopDetails/ShopDetails';
import ShopManagement from './component/ShopManagement/ShopManagement';
import Chat from './component/Chat/Chat';
import { UserProvider } from './context/UserContext';
import { API_CONFIG } from './config/apiConfig';

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
        element: <All_toy></All_toy>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/register',
        element: <Register></Register>
      },
      {
        path: '/view_details/:id',
        element: <ViewDetails></ViewDetails>,
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
        element: <Add_a_toy></Add_a_toy>
      },
      {
        path: '/list-old-toy',
        element: <ListOldToy></ListOldToy>
      },
      {
        path: '/list-shop-toy',
        element: (
          <ProtectedRoute requiredRole="shop_owner">
            <ListShopToy></ListShopToy>
          </ProtectedRoute>
        )
      },
      {
        path: '/toy_table',
        element: <ToyTable></ToyTable>
      },
      {
        path: '/profile',
        element: <Profile></Profile>
      },
      {
        path: '/shop-dashboard',
        element: (
          <ProtectedRoute requiredRole="shop_owner">
            <ShopDashboard></ShopDashboard>
          </ProtectedRoute>
        )
      },
      {
        path: '/analytics',
        element: (
          <ProtectedRoute requiredRole="shop_owner">
            <AnalyticsDashboard></AnalyticsDashboard>
          </ProtectedRoute>
        )
      },
      {
        path: '/faq',
        element: <FAQ></FAQ>
      },
      {
        path: '/seed',
        element: <Seeder></Seeder>
      },
      {
        path: '/shops',
        element: <ShopList></ShopList>
      },
      {
        path: '/shops/:shopOwnerEmail',
        element: <ShopDetails></ShopDetails>
      },
      {
        path: '/manage-shop',
        element: (
          <ProtectedRoute requiredRole="shop_owner">
            <ShopManagement></ShopManagement>
          </ProtectedRoute>
        )
      },
      {
        path: '/chat',
        element: (
          <ProtectedRoute>
            <Chat></Chat>
          </ProtectedRoute>
        )
      },
      {
        path: '/chat/:userEmail',
        element: (
          <ProtectedRoute>
            <Chat></Chat>
          </ProtectedRoute>
        )
      },

    ]
  },
  {
    path: '*',
    element: <NotFoundPage></NotFoundPage>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </UserProvider>
  </React.StrictMode>
);
