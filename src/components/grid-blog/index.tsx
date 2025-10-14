import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../common/Breadcrumb";
import Preloader from "../common/Preloader";
import ScrollTop from "../common/ScrollTop";
import ScrollToTop from "../common/ScrollToTop";
import GridBlogArea from "./GridBlogArea";

 

export default function GridBlog() {
  return (
    <>
      <Preloader />

      <Breadcrumb title="Grid Blog" subtitle="Grid Blog" />
      <GridBlogArea />
      <FooterOne />
      <ScrollToTop />
      <ScrollTop />
    </>
  )
}
