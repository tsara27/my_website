import type { NextPage } from 'next'
import LandingPageLayout from '../components/layout/landing_page_layout'
import Hero from "../components/sections/Hero";
import LatestBlogPosts from '../components/sections/LatestBlogPosts';
import { fetchLatestPosts } from "../lib/fetch_latest_posts";

const Home: NextPage = ({ posts }) => {
  return (
      <LandingPageLayout title="Tsara Sudrajat - Software Engineer" description="The Software Engineer">
        <Hero />
        <LatestBlogPosts posts={posts} />
      </LandingPageLayout>
  )
}

export default Home;

export const getStaticProps = async (context) => {
  const posts = await fetchLatestPosts();
  return {
    props: {
      posts
    }
  }
}

