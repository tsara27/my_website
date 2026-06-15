import Author from "./author";

type PostType = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  ogImage: {
    url: string;
    caption: string;
  };
  content: string;
  tags?: string;
};

export default PostType;
