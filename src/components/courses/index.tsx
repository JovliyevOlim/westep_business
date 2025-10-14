import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../common/Breadcrumb";
import Preloader from "../common/Preloader";
import ScrollTop from "../common/ScrollTop";
import ScrollToTop from "../common/ScrollToTop";
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
