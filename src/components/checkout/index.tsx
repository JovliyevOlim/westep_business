import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../common/Breadcrumb";
import Preloader from "../common/Preloader";
import ScrollTop from "../common/ScrollTop";
import ScrollToTop from "../common/ScrollToTop";
import CheckoutArea from "./CheckoutArea";

 

export default function Checkout() {
  return (
    <>
      <Preloader />
      <Breadcrumb title="Checkout" subtitle="Checkout" />
      <CheckoutArea />
      <FooterOne />
      <ScrollToTop />
      <ScrollTop />
    </>
  )
}
