import BlogPosts from "../components/sections/BlogPosts";
import Post from "../types/post";
import { getAllPosts } from "../lib/api";
import BlogLayout from "../components/layout/BlogLayout";
import { GetStaticProps } from "next";

type Props = {
  allPosts: Post[];
};

const Blog = ({ allPosts }: Props) => {
  return (
    <BlogLayout
      title="Tsara Sudrajat - Software Engineer"
      description="Blog posts"
    >
      <BlogPosts posts={allPosts} />
    </BlogLayout>
  );
};

export default Blog;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
    "ogImage"
  ]);

  return {
    props: {
      allPosts: allPosts as unknown as Post[]
    },
  };
};
