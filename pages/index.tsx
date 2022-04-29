import type { NextPage } from 'next'
import LandingPageLayout from '../components/layout/landing_page_layout'
import Hero from "../components/sections/Hero";
import LatestBlogPosts from '../components/sections/LatestBlogPosts';

const Home: NextPage = () => {
  return (
      <LandingPageLayout title="Tsara Sudrajat - Software Engineer" description="The Software Engineer">
        <Hero />
        <LatestBlogPosts />
      </LandingPageLayout>
  )
}

export default Home
