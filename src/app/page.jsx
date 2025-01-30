import Container from "@/components/Container";
import {HomeBanner} from "@/components/HomeBanner";

export default function Home() {
  return (
    <div className="p-10">
      <Container className="py-4"> 
        <HomeBanner />
      </Container>
    </div>
  );
}
