import Hero from "../components/sections/Hero";
import Companies from "../components/sections/Companies";
import Company from "../types/company";
import CompanyJSON from "../data/companies.json";
import LandingPageLayout from "../components/layout/LandingPageLayout";
import LatestBlogPosts from "../components/sections/LatestBlogPosts";
import Post from "../types/post";
import { getAllPosts } from "../lib/api";
import { GetStaticProps } from "next";

type Props = {
  allPosts: Post[];
  companies: Company[];
};

const Index = ({ allPosts, companies }: Props) => {
  const posts = allPosts.slice(0, 3);

  return (
    <LandingPageLayout
      title="Tsara Sudrajat - Software Engineer"
      description="The Software Engineer"
    >
      <Hero />
      <LatestBlogPosts posts={posts} />
      <Companies companies={companies} />
    </LandingPageLayout>
  );
};

export default Index;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);

  return {
    props: {
      companies: CompanyJSON,
      allPosts: allPosts as unknown as Post[],
    },
  };
};
