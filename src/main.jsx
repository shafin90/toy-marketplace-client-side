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