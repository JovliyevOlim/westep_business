 
import FeatureHomeOne from '../homes/home/FeatureHomeOne'
import AboutHomeOne from '../homes/home/AboutHomeOne'
import CounterHomeOne from '../homes/home/CounterHomeOne'
import InstructorsHomeOne from '../homes/home/InstructorsHomeOne'
import FooterOne from '../../layouts/footers/FooterOne'
import ScrollToTop from '../../ui/common/ScrollToTop'
import ScrollTop from '../../ui/common/ScrollTop'
import Preloader from '../../ui/common/Preloader'

export default function About() {
  return (
    <>
      <Preloader />
      <FeatureHomeOne />
      <AboutHomeOne />
      <CounterHomeOne />
      <InstructorsHomeOne style_2={true} />
      <FooterOne />
      <ScrollToTop />
      <ScrollTop />
    </>
  )
}
