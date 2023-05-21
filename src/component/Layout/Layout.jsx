import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useContext } from "react";
import { AuthContext } from "../Provider/Provider";
import PageTitle from "../PageTitle/PageTitle";


const Layout = () => {
    const { handle_react_tab} = useContext(AuthContext);
    return (
        <div onMouseEnter={handle_react_tab}>
           
            <Header></Header>
            <Outlet></Outlet>
            <Footer></Footer>


            
        </div>
    );
};

export default Layout;