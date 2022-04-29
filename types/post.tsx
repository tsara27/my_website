type PostType = {
  categories: string,
  content: string,
  date: string,
  description: string,
  image: string,
  slug: string,
  tags: string[],
  title: string,
  ogImage: {
    url: string
  }
}

export default PostType;
