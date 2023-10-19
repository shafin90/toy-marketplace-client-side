import Banner from "../Banner/Banner";
// import CarMove from "../CarMove/CarMove";

import Gallery from "../Gallery/Gallery";
import Opinion from "../Opinion/Opinion";
import PageTitle from "../PageTitle/PageTitle";
import ReactTab from "../ReactTab/ReactTab";
import ProductSlider from "../ProductSlider/ProductSlider";
import { useContext } from "react";
import { AuthContext } from "../Provider/Provider";
import SalesDiscountComponent from "../SalesDiscountComponent/SalesDiscountComponent";
import CustomerReviewsComponent from "../CustomerReviewsComponent/CustomerReviewComponent";



const Home = () => {
    const { latestToy, featuredProducts, bestSellerProducts } = useContext(AuthContext); // Retrieveing data from Provider component through context API

    const items = [
        {
            backgroundImage: 'https://wallpapercave.com/wp/ejztUyK.jpg',
            productImage: 'https://www.pngkit.com/png/full/87-870557_toy-car-png.png',
            offer: 'Exciting Offer 1: 50% Off!',
            productName: 'Fire Moto',
        },
        {
            backgroundImage: 'https://wallpapercave.com/wp/ejztUyK.jpg',
            productImage: 'https://content.speedway.com/documents/TemplateFiles/images/toy-truck/toy-truck-back-with-star.png',
            offer: 'Exciting Offer 2: 70% Off!',
            productName: 'Hill cracker',
        },
        {
            backgroundImage: 'https://wallpapercave.com/wp/ejztUyK.jpg',
            productImage: 'http://pluspng.com/img-png/png-toy-car-ferrari-car-png-image-900.png',
            offer: 'Exciting Offer 10: 80% Off!',
            productName: 'Zet moto',
        }
    ];

    const reviews = [
        {
          text: 'Great product and excellent customer service. I highly recommend it!',
          name: 'John Doe',
          rating: 5, // 5-star review
        },
        {
          text: "Product quality could be better, but the service is good.",
          name: 'Jane Smith',
          rating: 3, // 3-star review
        },
        {
          text: 'This is exactly what I was looking for. A must-buy!',
          name: 'Alice Johnson',
          rating: 5, // 5-star review
        },
        {
          text: 'Incredible value for the price. I’m a happy customer!',
          name: 'Bob Wilson',
          rating: 5, // 5-star review
        },
        {
          text: 'I’m impressed with the product quality and the quick delivery!',
          name: 'Eva Brown',
          rating: 3, // 3-star review
        },
      ];


    return (
        <div>
            <PageTitle title={"Home"}></PageTitle>

            <Banner></Banner>
            <Gallery></Gallery>
            <ReactTab></ReactTab>

            <SalesDiscountComponent items={items} />
            
            <ProductSlider heading='New Collections' itemList={latestToy}></ProductSlider>
            <ProductSlider heading='Featured Products' itemList={featuredProducts}></ProductSlider>
            <ProductSlider heading="Best Seller Products" itemList={bestSellerProducts}></ProductSlider>
            <CustomerReviewsComponent reviews={reviews} />
            <Opinion></Opinion>


        </div>
    );
};

export default Home;