import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../../ui/common/Breadcrumb";
import Preloader from "../../ui/common/Preloader";
import ScrollToTop from "../../ui/common/ScrollToTop";
import StandardBlogArea from "./StandardBlogArea";


 

export default function StandardBlog() {
  return (
    <>
      <Preloader />
      <Breadcrumb title="Standard Blog" subtitle="Standard Blog" />
      <StandardBlogArea />
      <FooterOne />
      <ScrollToTop />
    </>
  )
}
