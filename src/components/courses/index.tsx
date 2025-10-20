import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../../ui/common/Breadcrumb";
import Preloader from "../../ui/common/Preloader";
import ScrollTop from "../../ui/common/ScrollTop";
import ScrollToTop from "../../ui/common/ScrollToTop";
import CoursesArea from "./CoursesArea";

 

export default function Courses() {
  return (
    <>
      <Preloader />
      <Breadcrumb title="Course Style 1" subtitle="Course Style 1" />
      <CoursesArea />
      <FooterOne />
      <ScrollToTop />
      <ScrollTop />
    </>
  )
}
