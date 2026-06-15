import Company from "../../../types/company";
import Image from "next/image";

type Props = {
  companies: Company[];
};

function Companies({ companies }: Props) {
  if (!companies) {
    return <div />;
  }

  const companyLists = companies.map((company, index) => {
    return (
      <div className="h-20 m-14 grayscale xs:h-8 xs:m-6">
        <Image
          alt="Company image"
          key={index}
          src={company["logo"]}
          height={company["height"]}
          width={company["width"]}
        />
      </div>
    );
  });

  return (
    <section className="companies-lists flex flex-col pb-20 h-full">
      <div className="sm:container mx-auto">
        <h2 className="font-display text-gray xs:text-4xl sm:text-4xl md:text-5xl mb-8 mt-12 pl-8">
          I Helped These Companies
        </h2>
        <div className="sm:container mx-auto flex flex-row flex-wrap">
          {companyLists}
        </div>
      </div>
    </section>
  );
}

export default Companies;
