import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../common/Breadcrumb";
import Preloader from "../common/Preloader";
import ScrollToTop from "../common/ScrollToTop";
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
