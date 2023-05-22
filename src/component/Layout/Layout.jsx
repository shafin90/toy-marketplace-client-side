import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useContext } from "react";
import { AuthContext } from "../Provider/Provider";
import PageTitle from "../PageTitle/PageTitle";
import './Layout.css';


const Layout = () => {
    
    const { handle_react_tab} = useContext(AuthContext);
    
   
    return (
        <div className="body" onMouseEnter={handle_react_tab}>
           
            <Header></Header>
            <Outlet></Outlet>
            <Footer></Footer>


            
        </div>
    );
};

export default Layout;