import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Nunito_Sans, Playfair_Display, Roboto_Flex } from 'next/font/google'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900', '1000'],
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  weight: ['400', '500'],
})

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-roboto-flex',
  weight: ['100', '200', '300', '400', '500', '600'],
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${nunitoSans.variable} ${playfairDisplay.variable} ${robotoFlex.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
