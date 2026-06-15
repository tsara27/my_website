import Head from "next/head";
import Navbar from "../complex/Navbar";
import Footer from "../complex/Footer";
import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  tags?: Array<string>;
  children: ReactNode;
};

function BlogLayout({ title, description, tags, children }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={tags?.join(", ")} />
        <meta name="author" content="Tsara Fatma Larasati S" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="font-sans">
        <Navbar />
        {children}
        <Footer />
      </main>
    </>
  );
}

export default BlogLayout;
