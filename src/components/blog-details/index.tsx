import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../common/Breadcrumb";
import Preloader from "../common/Preloader";
import ScrollTop from "../common/ScrollTop";
import ScrollToTop from "../common/ScrollToTop";
import BlogDetailsArea from "./BlogDetailsArea";


 
export default function BlogDetails() {
  return (
    <>
      <Preloader />
      <Breadcrumb title="Blog Details" subtitle="Blog Details" />
      <BlogDetailsArea />
      <FooterOne />
      <ScrollToTop />
      <ScrollTop />
    </>
  )
}
