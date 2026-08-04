import Image from "next/image";

type Props = {
  title: string;
  date: string;
};

const PostTitle = ({ title, date }: Props) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col xs:w-full sm:w-3/5">
        <h3 className="font-display text-gray text-3xl cursor-pointer mb-4 tracking-tighter mt-4 hover:text-dove-gray">
          {title}
        </h3>
        <div className="font-display text-dove-gray flex flex-row justify-start content-center items-center xs:pb-10 sm:pb-5 gap-2">
          <Image
            width={15}
            height={15}
            src={"/assets/images/Icons/calendar.webp"}
            alt="Calendar Icon"
          />
          <p className="text-dove-gray">Published in {date}</p>
        </div>
      </div>
    </div>
  );
};

export default PostTitle;
