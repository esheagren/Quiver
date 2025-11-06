import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AddPromptDialog from './AddPromptDialog'

// Import PNG images
import quiverIcon from '../assets/images/quiver.png'
import telescopeIcon from '../assets/images/telescope.png'
import questionMarkIcon from '../assets/images/questionMark.png'
import addButtonIcon from '../assets/images/addButton.png'

export default function Header() {
  const location = useLocation()
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const navItems = [
    {
      to: '/',
      icon: quiverIcon,
      label: 'My Quiver',
      alt: 'My Quiver',
    },
    {
      to: '/discover',
      icon: telescopeIcon,
      label: 'Explore',
      alt: 'Explore',
    },
  ]

  const isAboutActive = location.pathname === '/about'

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#D3D6DB]/80 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            {/* Left spacer for equal width columns */}
            <div className="flex-1"></div>
            
            {/* Center: Main navigation items */}
            <div className="flex items-center justify-center gap-6">
              <nav className="flex items-center gap-6">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex flex-col items-center justify-center gap-2 p-2 rounded-lg transition-all hover:bg-gray-50 ${
                        isActive ? 'bg-gray-50' : ''
                      }`}
                    >
                      <img
                        src={item.icon}
                        alt={item.alt}
                        className="h-12 w-12 object-contain"
                      />
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-[#E8B970]' : 'text-[#5C606B]'
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
                
                {/* Add Button */}
                <button
                  onClick={() => setAddDialogOpen(true)}
                  className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg transition-all hover:bg-gray-50"
                >
                  <img
                    src={addButtonIcon}
                    alt="Add"
                    className="h-12 w-12 object-contain"
                  />
                  <span className="text-sm font-medium text-[#5C606B]">
                    Add
                  </span>
                </button>
              </nav>
            </div>

            {/* Right: About Button */}
            <div className="flex-1 flex items-center justify-end">
              <Link
                to="/about"
                className={`flex flex-col items-center justify-center gap-2 p-2 rounded-lg transition-all hover:bg-gray-50 ${
                  isAboutActive ? 'bg-gray-50' : ''
                }`}
              >
                <img
                  src={questionMarkIcon}
                  alt="About"
                  className="h-12 w-12 object-contain"
                />
                <span className={`text-sm font-medium ${
                  isAboutActive ? 'text-[#E8B970]' : 'text-[#5C606B]'
                }`}>
                  About
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <AddPromptDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </>
  )
}

