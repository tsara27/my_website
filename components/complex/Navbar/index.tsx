import Link from "next/link";

function Navbar() {
  return (
    <section className="sm:container mx-auto py-7">
      <nav className="flex justify-between px-7">
        <div className="nav-logo">
          <Link href="/" className="font-logo text-3xl text-faded-red">
            Tsara Fatma
          </Link>
        </div>
        <div className="nav-links font-display text-black text-xl tracking-0">
          <Link href="/" className="pr-5">
            About Me
          </Link>
          <Link href="/" className="text-gray">
            Blog
          </Link>
        </div>
      </nav>
    </section>
  );
}

export default Navbar;
