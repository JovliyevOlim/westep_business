import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../../ui/common/Breadcrumb";
import Preloader from "../../ui/common/Preloader";
import ScrollTop from "../../ui/common/ScrollTop";
import ScrollToTop from "../../ui/common/ScrollToTop";
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
