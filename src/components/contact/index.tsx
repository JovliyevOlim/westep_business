import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../common/Breadcrumb";
import Preloader from "../common/Preloader";
import ScrollTop from "../common/ScrollTop";
import ScrollToTop from "../common/ScrollToTop";
import ContactForm from "./ContactForm";
import GoogleMap from "./GoogleMap";

 

export default function Contact() {
  return (
    <>
      <Preloader />
      <Breadcrumb title="Contact Us" subtitle="Contact Us" />
      <ContactForm />
      <GoogleMap />
      <FooterOne />
      <ScrollToTop />
      <ScrollTop />
    </>
  )
}
