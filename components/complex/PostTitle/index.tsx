import Image from "next/image";

type Props = {
  title: string;
  date: string;
};

const PostTitle = ({ title, date }: Props) => {
  return (
    <div className="xs:max-w-[90%] sm:max-w-lg sm-tab:max-w-2xl md:max-w-3xl mx-auto">
      <div className="flex flex-col gap-4">
        <h3 className="font-display text-gray xs:text-2xl sm:text-3xl md:text-5xl bold cursor-pointer mb-4 tracking-tighter mt-4 hover:text-dove-gray">
          {title}
        </h3>
        <div className="font-display text-dove-gray flex flex-row justify-self-center justify-start content-center border-y border-light-gray items-center gap-2 py-4 mb-4">
          <Image
            layout="fixed"
            width={15}
            height={15}
            src={"/assets/images/Icons/calendar.webp"}
            alt="date"
          />
          <p className="font-article text-dove-gray justify-self-center place-self-center">
            Published in {date}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostTitle;
