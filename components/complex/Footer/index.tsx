import Link from "next/link";

const Footer = () => {
  return (
    <section className="footer border border-iron bg-hint-of-red">
      <div className="sm:container mx-auto flex xs:flex-col md:flex-row border-b border-light-gray pb-20">
        <div className="about-me-wrapper sm:basis-full md:basis-1/3">
          <h2 className="font-display text-gray xs:text-3xl sm:text-4xl md:text-5xlmb-2 mt-12 pl-8">
            About Me
          </h2>
          <p className="text-dove-gray mb-2 mt-12 px-8">
            I am a mom, a wife, and also a programmer who is trying to improve
            and spread good things for others.
          </p>
          <p className="text-dove-gray mb-2 mt-4 px-8">
            Thank you for my husband who helped me designing this website.
          </p>
        </div>
        <div className="quick-links-wrapper sm:basis-full md:basis-1/3">
          <h2 className="font-display text-gray xs:text-3xl sm:text-4xl md:text-5xl mb-2 mt-12 pl-8">
            Quick Links
          </h2>
          <Link
            href="/blog"
            className="block hover:underline text-dove-gray mb-2 mt-12 px-8"
          >
            Blog
          </Link>
        </div>
        <div className="connect-with-me-wrapper sm:basis-full md:basis-1/3">
          <h2 className="font-display text-gray xs:text-3xl sm:text-4xl md:text-5xl mb-2 mt-12 pl-8">
            Connect with Me
          </h2>
          <Link
            href="https://github.com/tsara27"
            className="block hover:underline text-dove-gray mb-2 mt-12 px-8"
            target="__blank"
          >
            Github
          </Link>
          <Link
            href="http://instagram.com/tsara27"
            className="block hover:underline text-dove-gray mb-2 mt-6 px-8"
            target="__blank"
          >
            Instagram
          </Link>
          <Link
            href="https://www.linkedin.com/in/tsarasudrajat/"
            className="block hover:underline text-dove-gray mb-2 mt-6 px-8"
            target="__blank"
          >
            LinkedIn
          </Link>
          <Link
            href="mailto:tsara.tf@gmail.com?Subject=Hello%20Tsara!"
            className="block hover:underline text-dove-gray mb-2 mt-6 px-8"
            target="__blank"
          >
            Email
          </Link>
        </div>
      </div>
      <div className="sm:container mx-auto flex py-6 justify-between">
        <p className="text-dove-gray pl-8">2022</p>
        <p className="font-logo text-3xl text-gray pr-8 origin-bottom -rotate-12 relative bottom-5">
          Tsara Fatma
        </p>
      </div>
    </section>
  );
};

export default Footer;
