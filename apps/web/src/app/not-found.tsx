import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-black text-white min-h-screen">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-zinc-400 mb-8">Could not find requested resource</p>
      <Link href="/" className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200">
        Return Home
      </Link>
    </div>
  )
}
