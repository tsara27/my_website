import Post from "../../../types/post";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

type Props = {
  posts: Post[];
};

function BlogPosts({ posts }: Props) {
  if (!posts) {
    return <div />;
  }

  const allPosts = posts.map((post, index) => {
    const parsedPostedAt = new Date(post.date);
    return (
      <div
        className="flex flex-row font-sans px-8 gap-x-12 h-80 items-center my-8"
        key={index}
      >
        <div className="sm:block w-2/5 h-72 relative xs:hidden">
          <Image
            alt="Blog image"
            key={index}
            layout="fill"
            placeholder="blur"
            blurDataURL="https://via.placeholder.com/350x250?text=Placeholder"
            objectFit="cover"
            src={post.ogImage.url}
          />
        </div>
        <div className="flex flex-col xs:w-full sm:w-3/5">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="font-display text-gray text-3xl cursor-pointer mb-4 tracking-tighter mt-4 hover:text-dove-gray">
              {post.title}
            </h3>
          </Link>
          <div className="text-dove-gray flex flex-row justify-start content-center items-center xs:pb-10 sm:pb-5 gap-2">
            <Image
              layout="fixed"
              width={15}
              height={15}
              src={"/assets/images/Icons/calendar.webp"}
              alt="Calendar Icon"
            />
            <p className="text-dove-gray">
              Published in {format(parsedPostedAt, "PPP")}
            </p>
          </div>
          <p className="text-dove-gray xs:pb-10 sm:pb-5">{post.excerpt}</p>
          <div className="border-b border-light-gray"></div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-faded-red hover:text-dove-gray font-display text-lg pt-7"
          >
            Read more
          </Link>
        </div>
      </div>
    );
  });

  return (
    <section className="blog-posts flex flex-col pb-20 mt-20">
      <div className="sm:container mx-auto">
        <div className="sm:container mx-auto flex flex-col gap-y-10 flex-wrap  ">
          {allPosts}
        </div>
      </div>
    </section>
  );
}

export default BlogPosts;
