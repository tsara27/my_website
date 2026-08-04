import BlogLayout from "../../components/layout/BlogLayout";
import ErrorPage from "next/error";
import Image from "next/image";
import PostContent from "../../components/complex/PostContent";
import PostImage from "../../components/complex/PostImage";
import PostTitle from "../../components/complex/PostTitle";
import PostType from "../../types/post";
import markdownToHtml from "../../lib/markdownToHtml";
import { format } from "date-fns";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import { useRouter } from "next/router";

type Props = {
  post: PostType;
};

const Post = ({ post }: Props) => {
  const router = useRouter();

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const parsedPostedAt = new Date(post.date);

  return (
    <BlogLayout
      title="Tsara Sudrajat - Software Engineer"
      description="Blog posts"
    >
      <div className="py-20">
        <PostTitle title={post.title} date={format(parsedPostedAt, "PPP")} />
        <PostContent content={post.content} image={post.ogImage} />
      </div>
    </BlogLayout>
  );
};

export default Post;

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "content",
    "slug",
    "author",
    "excerpt",
    "ogImage"
  ]);

  console.log(post.content);
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
