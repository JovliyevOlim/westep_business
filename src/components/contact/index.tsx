import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../../ui/common/Breadcrumb";
import Preloader from "../../ui/common/Preloader";
import ScrollTop from "../../ui/common/ScrollTop";
import ScrollToTop from "../../ui/common/ScrollToTop";
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
