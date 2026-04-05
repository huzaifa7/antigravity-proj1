export default async function Page() {
  let health = { status: 'unknown', db: 'unknown' }
  
  try {
    const res = await fetch('http://localhost:3000/api/health', { cache: 'no-store' })
    if (res.ok) {
      health = await res.json()
    }
  } catch(e) {
    // Ignore build time or down server fetch drops
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 text-gray-900">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Antigravity Timeline</h1>
        <p className="text-xl text-gray-600">Incident and Post-Mortem Tracking</p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">System Status</h2>
          <div className="flex flex-col gap-2 text-sm text-left font-mono">
            <div>API Status: <span className={health.status === 'ok' ? 'text-green-600' : 'text-red-600'}>{health.status}</span></div>
            <div>Database: <span className={health.db === 'connected' ? 'text-green-600' : 'text-amber-600'}>{health.db}</span></div>
          </div>
        </div>
      </div>
    </main>
  )
}
