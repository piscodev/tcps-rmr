// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body id="__next">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
