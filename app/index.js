// pages/index.js
import Head from 'next/head'

export default function Home() {
  return (
    <div className="bg-blue-50 min-h-screen flex flex-col items-center justify-center py-2">
      <Head>
        <title>Next.js Tailwind CSS Home</title>
        <meta name="description" content="A simple homepage using Next.js and Tailwind CSS with a blue theme" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          Welcome to My Blue-Themed Homepage
        </h1>
        <p className="text-lg text-blue-700 mb-8">
          This is a simple homepage built with Next.js and styled with Tailwind CSS, featuring hues of blue.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="#"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Learn More
          </a>
          <a
            href="#"
            className="bg-blue-200 text-blue-800 py-2 px-4 rounded hover:bg-blue-300"
          >
            Contact Us
          </a>
        </div>
      </main>

      <footer className="absolute bottom-0 w-full py-4 bg-blue-100 text-center text-blue-600">
        <p>&copy; 2024 My Website</p>
      </footer>
    </div>
  )
}
