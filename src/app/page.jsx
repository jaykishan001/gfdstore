import Container from "@/components/Container";
import HeaderCategoryOptions from "@/components/HeaderCategoryOptions";
import {HomeBanner} from "@/components/HomeBanner";
import ProductPage from "./product/page";

export default function Home() {
  return (
    <div className="p-10">
      <Container className=""> 
      <HeaderCategoryOptions activePage={"Home"} />
        <HomeBanner />
        <ProductPage />
      </Container>
    </div>
  );
}
