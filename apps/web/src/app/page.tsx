export const dynamic = 'force-dynamic';

export default async function Home() {
  const url = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/health` : 'http://localhost:3000/api/health';
  let dbStatus = "unknown";
  let timestamp = "";
  
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    dbStatus = data.db;
    timestamp = data.timestamp;
  } catch {
    dbStatus = "error connecting to api";
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-zinc-950 text-white">
      <main className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-light tracking-tight">Walking Skeleton</h1>
        <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 shadow-2xl">
          <p className="font-mono text-sm text-zinc-400">Status: <span className="text-emerald-400">{dbStatus}</span></p>
          {timestamp && <p className="font-mono text-xs text-zinc-600 mt-2">{timestamp}</p>}
        </div>
      </main>
    </div>
  );
}
