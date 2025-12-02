import Banner from "../Banner/Banner";
import PageTitle from "../PageTitle/PageTitle";
import ProductSlider from "../ProductSlider/ProductSlider";
import { useContext } from "react";
import { AuthContext } from "../Provider/Provider";
import ShopOwnerHome from "../ShopOwnerHome/ShopOwnerHome";
import ShopListSection from "../ShopListSection/ShopListSection";
import BestSellingToys from "../BestSellingToys/BestSellingToys";
import OurGoal from "../OurGoal/OurGoal";

const Home = () => {
  const { latestToy, featuredProducts, bestSellerProducts, userRole, user } = useContext(AuthContext);

  // Show shop owner dashboard if logged in as shop owner
  if (user && userRole === 'shop_owner') {
    return <ShopOwnerHome />;
  }

  // Regular home page for users and guests
  return (
    <div>
      <PageTitle title={"Home"}></PageTitle>
      <Banner></Banner>
      <ShopListSection />
      <BestSellingToys />
      <OurGoal />
    </div>
  );
};

export default Home;