import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../../ui/common/Breadcrumb";
import Preloader from "../../ui/common/Preloader";
import ScrollTop from "../../ui/common/ScrollTop";
import ScrollToTop from "../../ui/common/ScrollToTop";
import CourseDetailsArea from "./CourseDetailsArea";

 

export default function CourseDetails() {
  return (
    <>
      <Preloader />
      <Breadcrumb title="Course Details" subtitle="Course Details" />
      <CourseDetailsArea />
      <FooterOne />
      <ScrollToTop />
      <ScrollTop />
    </>
  )
}
