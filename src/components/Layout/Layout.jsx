import { Container } from "react-bootstrap";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = () => {
    return (
        <Container fluid className="px-0">
            <Header></Header>
            <Footer></Footer>
        </Container>
    );
};

export default Layout;