
import Menu from "../components/Menu";
import Mainimage from "../components/Mainimage";
import Container1 from "../components/Container1";
import Container2 from "../components/Container2";
import PopularThisWeek from "@/components/PouplarThisWeek";
import ShopByPrice from "../components/ShopByPrice";
import ShopByStyle from "@/components/ShopByStyle";
import TheDepopEdit from "@/components/TheDepopEdit";
import VerticalMenu from "@/components/VerticalMenu";
import WebsiteBanner from "../components/WebsiteBanner";

export default function Home() {
  return (
    <>
      <Menu />
      <Mainimage />
      <Container1/>
      <Container2>
        <WebsiteBanner/>
        <TheDepopEdit/>
        <ShopByPrice/>
        <ShopByStyle/>
      </Container2>
      <VerticalMenu/>
    </>
  );
}
