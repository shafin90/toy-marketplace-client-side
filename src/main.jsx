import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import {
  createBrowserRouter,
  RouterProvider,
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
import Blog from './component/Blog/Blog';
import NotFoundPage from './component/NotFoundPage/NotFoundPage';
// import ToyTable from './component/ToyTable/ToyTable';
// import Provider from './component/Provider/Provider';


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
        path:"/all_toy",
        element:<All_toy></All_toy>
      },
      {
        path:'/login',
        element:<Login></Login>
      },
      {
        path:'/register',
        element:<Register></Register>
      },
      {
        path:'/:id',
        element:<ViewDetails></ViewDetails>,
        loader:({params})=>fetch(`https://carz-server-shafin90.vercel.app/users/${params.id}`)
      },
      {
        path:'/add_a_toy',
        element:<Add_a_toy></Add_a_toy>
      },
      {
        path:'/toy_table',
        element:<ToyTable></ToyTable>
      },
      {
        path:'/blog',
        element:<Blog></Blog>
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <Provider>
      <RouterProvider router={router} />
    </Provider>

  </React.StrictMode>
);