import Link from "next/link";

function Navbar() {
  return (
    <section className="container mx-auto py-7">
      <nav className="flex justify-between px-7">
        <div className="nav-logo">
          <Link href="/">
            <a className="font-logo text-3xl text-faded-red">Tsara Fatma</a>
          </Link>
        </div>
        <div className="nav-links font-sans text-black text-xl tracking-0">
          <Link href="/">
            <a className="pr-5">About Me</a>
          </Link>
          <Link href="/">
            <a className="text-gray">Blog</a>
          </Link>
        </div>
      </nav>
    </section>
  );
}

export default Navbar;
