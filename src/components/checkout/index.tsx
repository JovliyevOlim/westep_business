import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../../ui/common/Breadcrumb";
import Preloader from "../../ui/common/Preloader";
import ScrollTop from "../../ui/common/ScrollTop";
import ScrollToTop from "../../ui/common/ScrollToTop";
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
