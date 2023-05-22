import Banner from "../Banner/Banner";
import ExtraSection1 from "../ExtraSection1/ExtraSection1";
import ExtraSection2 from "../ExtraSection2/ExtraSection2";
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
            <ExtraSection1></ExtraSection1>
            <ExtraSection2></ExtraSection2>
            
            
        </div>
    );
};

export default Home;