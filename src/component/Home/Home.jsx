import Banner from "../Banner/Banner";
import Gallery from "../Gallery/Gallery";
import PageTitle from "../PageTitle/PageTitle";
import ReactTab from "../ReactTab/ReactTab";



const Home = () => {
    return (
        <div>
             <PageTitle title={"Home"}></PageTitle>
            <Banner></Banner>
            <Gallery></Gallery>
            <ReactTab></ReactTab>
            
            
        </div>
    );
};

export default Home;