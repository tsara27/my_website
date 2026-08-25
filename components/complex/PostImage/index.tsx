import Image from "next/image";
import vercel from '../../../public/assets/images/posts/what-i-learned-from-my-journey-for-better-health.jpeg';

type Props = {
  imageName: string;
};

const PostImage = ({ imageName }: Props) => {
  let image = `/assets/images/posts/${imageName}.jpeg`
  return (
    <div className="max-w-3xl mx-auto">
      <Image
        src={image}
        //src={vercel}
        alt="Photo by Anna Pelzer on Unsplash"
        width={800}
        height={600}
        style={{
          width: "100%",
          height: "auto"
        }}
      />
    </div>
  );
};

export default PostImage;
