'use client'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-black text-white min-h-screen">
      <h2 className="text-2xl mb-4 text-red-500 font-mono">Something went wrong!</h2>
      <button
        className="px-4 py-2 border border-zinc-700 rounded-md hover:bg-zinc-800"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}
