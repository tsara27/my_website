import Image from "next/image";
import LetsTalkButton from "./LetsTalkButton";

function Hero() {
  return (
    <section className="hero sm:container mx-auto flex flex-wrap xs:flex-col-reverse md:flex-col lg:flex-row sm:justify-center lg:justify-between xs:p-4 md:p-20">
      <div className="md:w-full lg:w-2/5 xs:mb-12">
        <h1 className="font-display text-gray xs:text-5xl md:text-7xl mb-8 tracking-tighter md:mt-32">
          Tsara Fatma
        </h1>
        <div className="font-regular font-normal border-l-4 pl-6 border-candy-pink text-xl opacity-30">
          <p className="mb-3">
            I am software engineer with more than 7 years experience. I have
            contributed / developed various web applications and RESTful APIs.{" "}
          </p>
          <p className="mb-3">
            If you need someone to help you building or maintaining your
            product, please get in touch with me and let's talk!
          </p>
        </div>
        <LetsTalkButton />
      </div>
      <div className="">
        <Image
          src="/assets/images/tsara_.png"
          loading="eager"
          width={487}
          height={600}
          alt="Working illustration"
        />
      </div>
    </section>
  );
}

export default Hero;
