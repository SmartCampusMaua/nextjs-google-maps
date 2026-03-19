import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">SmartCampus Mauá</h1>
        <p className="text-lg text-gray-600 mb-8">
          Real-time sensor monitoring for energy and water consumption
        </p>
        <Link
          href="/maps"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          <span>View Sensor Map</span>
          <span>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
          <div className="text-2xl mb-2">⚡</div>
          <h2 className="text-xl font-semibold mb-1">Energy Monitoring</h2>
          <p className="text-gray-600 text-sm">
            Track electricity consumption across buildings in real time.
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <div className="text-2xl mb-2">💧</div>
          <h2 className="text-xl font-semibold mb-1">Water Monitoring</h2>
          <p className="text-gray-600 text-sm">
            Monitor water usage and detect anomalies across facilities.
          </p>
        </div>
      </div>
    </main>
  );
}
