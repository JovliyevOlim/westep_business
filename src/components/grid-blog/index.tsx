import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../../ui/common/Breadcrumb";
import Preloader from "../../ui/common/Preloader";
import ScrollTop from "../../ui/common/ScrollTop";
import ScrollToTop from "../../ui/common/ScrollToTop";
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
