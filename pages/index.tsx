import type { NextPage } from 'next'
import LandingPageLayout from '../components/layout/landing_page_layout'

const Home: NextPage = () => {
  return (
      <LandingPageLayout title="Tsara Sudrajat - Software Engineer" description="The Software Engineer">
        <div className="flex">
          <a href="#">Tsara</a>
        </div>
      </LandingPageLayout>
  )
}

export default Home
