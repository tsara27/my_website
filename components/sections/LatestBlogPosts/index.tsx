function LatestBlogPosts({ posts }) {
  if (!posts) {
    return <div />;
  }


  return (
    <section className="latest-blog-post flex bg-hint-of-red h-96">
      {JSON.stringify(posts)}
    </section>
  )
}

export default LatestBlogPosts;
