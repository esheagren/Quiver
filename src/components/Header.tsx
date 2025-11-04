import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import AddPromptDialog from './AddPromptDialog'
import quiverLogo from '../../QuiverLogo.png'

export default function Header() {
  const location = useLocation()
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link 
              to="/" 
              className="flex items-center gap-3 transition-all hover:opacity-80 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-xl group-hover:bg-orange-400/30 transition-all" />
                <img 
                  src={quiverLogo} 
                  alt="Quiver" 
                  className="relative h-12 w-12 object-contain drop-shadow-sm"
                />
              </div>
            </Link>
            <nav className="flex space-x-8">
              <Link
                to="/"
                className={`text-sm font-semibold transition-all duration-200 relative pb-1 ${
                  location.pathname === '/' 
                    ? 'text-orange-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Quiver
                {location.pathname === '/' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                )}
              </Link>
              <Link
                to="/discover"
                className={`text-sm font-semibold transition-all duration-200 relative pb-1 ${
                  location.pathname === '/discover'
                    ? 'text-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Discover
                {location.pathname === '/discover' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                )}
              </Link>
            </nav>
          </div>
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all duration-200 font-semibold group"
          >
            <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
            Add Prompt
          </Button>
        </div>
      </div>
      <AddPromptDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </header>
  )
}

