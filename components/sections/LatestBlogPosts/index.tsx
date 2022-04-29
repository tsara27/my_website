import { getAllPosts } from "../../../lib/api";
import Post from "../../../types/post";

type Props = {
  allPosts: Post[]
}

function LatestBlogPosts({ allPosts }: Props) {
  const latestPosts = allPosts.slice(0, 3)

  return (
    <section className="latest-blog-post flex bg-hint-of-red h-96">
    </section>
  )
}

export default LatestBlogPosts;

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'author',
    'categories',
    'date',
    'description',
    'image',
    'slug',
    'tags',
    'title'
  ])

  return {
    props: { allPosts },
  }
}
