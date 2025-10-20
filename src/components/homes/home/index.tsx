
import HeroHomeOne from './HeroHomeOne'
import FeatureHomeOne from './FeatureHomeOne'
import AboutHomeOne from './AboutHomeOne'
import CounterHomeOne from './CounterHomeOne'
import CoursesHomeOne from './CoursesHomeOne'
import CourseCategoryHomeOne from './CourseCategoryHomeOne'
import WorkingProcessHomeOne from './WorkingProcessHomeOne'
import InstructorsHomeOne from './InstructorsHomeOne'
import VideoHomeOne from './VideoHomeOne'
import ReviewHomeOne from './ReviewHomeOne'
import BrandHomeOne from './BrandHomeOne'
import BlogHomeOne from './BlogHomeOne'
import FooterOne from '../../../layouts/footers/FooterOne'
import ScrollToTop from '../../../ui/common/ScrollToTop'
import ScrollTop from '../../../ui/common/ScrollTop'
import Preloader from '../../../ui/common/Preloader'


export default function HomeOne() {

  return (
    <>
      <Preloader />
      <HeroHomeOne />
      <FeatureHomeOne />
      <AboutHomeOne />
      <CounterHomeOne />
      <CoursesHomeOne />
      <CourseCategoryHomeOne />
      <WorkingProcessHomeOne />
      <InstructorsHomeOne />
      <VideoHomeOne />
      <ReviewHomeOne />
      <BrandHomeOne />
      <BlogHomeOne />
      <FooterOne />
      <ScrollToTop />
      <ScrollTop />
    </>

  )
}
