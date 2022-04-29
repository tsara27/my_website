import Image from "next/image";

function Hero() {
  return (
    <section className="hero container mx-auto flex justify-between p-20">
      <div className="w-2/5">
        <h1 className="font-display text-gray text-7xl mb-8 tracking-tighter mt-32">Tsara Fatma</h1>
        <div className="border-l-4 pl-6 border-candy-pink text-xl opacity-30">
          <p className="mb-3">I am software engineer with more than 7 years experience. I have contributed / developed various web applications and RESTful APIs. </p>
          <p className="mb-3">If you need someone to help you building or maintaining your product, please get in touch with me and let's talk!</p>
        </div>
      </div>
      <div className="">
        <Image src="/images/Scene/working.svg" width={487} height={600}/>
      </div>
    </section>
  )
}

export default Hero;
