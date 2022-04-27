import Head from 'next/head'

type Props = {
  title: string
  description: string
  tags?: Array<string>
  children: Element | React.ReactNode
}

function LandingPageLayout({ title, description, tags, children }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={tags && tags.join(", ")} />
        <meta name="author" content="Tsara Fatma Larasati S" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto">
        <nav className="flex flex-row">
        </nav>
        {children}
      </main>
      <section className="footer"></section>
    </>
  )
}

export default LandingPageLayout
