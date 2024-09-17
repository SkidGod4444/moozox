import { Home, Search, Library } from "lucide-react"
import Link from "next/link"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-background bg-opacity-80 h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Moozox</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-6">
        <Link href="/" className="flex items-center space-x-3 text-gray-300 hover:text-teal-500 transition-colors duration-200 px-6 py-3">
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link href="/search" className="flex items-center space-x-3 text-gray-300 hover:text-teal-500 transition-colors duration-200 px-6 py-3">
          <Search className="h-5 w-5" />
          <span>Search</span>
        </Link>
        <Link href="/library" className="flex items-center space-x-3 text-gray-300 hover:text-teal-500 transition-colors duration-200 px-6 py-3">
          <Library className="h-5 w-5" />
          <span>Your Library</span>
        </Link>
      </nav>
      <div className="p-6">
        <h3 className="text-sm font-semibold mb-4 text-teal-500 uppercase">Playlists</h3>
        <ul className="space-y-2">
          <li><Link href="/playlist/chill" className="text-gray-500 hover:text-teal-500 transition-colors duration-200">Chill Vibes</Link></li>
          <li><Link href="/playlist/workout" className="text-gray-500 hover:text-teal-500 transition-colors duration-200">Workout Mix</Link></li>
          <li><Link href="/playlist/study" className="text-gray-500 hover:text-teal-500 transition-colors duration-200">Study Session</Link></li>
        </ul>
      </div>
    </aside>
  )
}