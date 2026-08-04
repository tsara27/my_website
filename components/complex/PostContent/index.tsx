import Link from "next/link";
import markdownStyles from "./styles.module.scss";
import Image from "next/image";

type Props = {
  content: string;
  image: {
    url: string;
    caption: string;
  };
};

function PostContent({ content, image }: Props) {
  return (
    <div className="xs:max-w-[90%] sm:max-w-xl sm-tab:max-w-3xl md:max-w-4xl mx-auto">
      <Image
        src={image.url}
        alt="Photo by Anna Pelzer on Unsplash"
        width="1000"
        height="1000"
        style={{
          maxWidth: "100%"
        }}
      />
      <span className="text-sm text-right text-dove-gray block">{image.caption}</span>
      <div
        className={`${markdownStyles["markdown"]} font-article`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export default PostContent;
