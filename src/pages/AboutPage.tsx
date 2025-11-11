import { Link } from 'react-router-dom'
import { Save, Telescope, Zap } from 'lucide-react'
import quiverLogo from '../../QuiverLogo.png'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        {/* Background Logo */}
        <div
          className="absolute inset-0 opacity-[0.08] bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url(${quiverLogo})`,
            backgroundSize: '900px 900px',
          }}
        />

        <div className="relative max-w-5xl mx-auto space-y-8">
          <h1 className="text-7xl md:text-8xl font-bold text-gray-900 tracking-tight">Quiver</h1>
          <p className="text-3xl md:text-4xl text-gray-700 font-light max-w-3xl mx-auto leading-tight">
            Build your quiver of AI prompts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              to="/discover"
              className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              Explore Prompts
            </Link>
            <Link
              to="/"
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-semibold hover:border-gray-900 transition-all hover:scale-105 shadow-md hover:shadow-lg text-lg"
            >
              My Quiver
            </Link>
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-24 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-4">
              <div className="inline-block px-4 py-1 bg-red-50 text-red-700 rounded-full text-sm font-semibold mb-2">
                The Problem
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Prompting is complicated</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Writing effective AI prompts takes time and expertise. Great prompts exist, but they're scattered
                across conversations, documents, and bookmarks—impossible to find when you need them.
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-block px-4 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold mb-2">
                The Solution
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Build on others' work</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Start with proven prompts from other educators. Save them to your personal quiver, organize by topic,
                and share your best ones back. Free, no authentication required—as easy as it gets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Value Sections */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Build Your Quiver */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-900 transition-all hover:shadow-xl space-y-6">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Save className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">Build Your Quiver</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Curate your personal collection of effective prompts. Organize by subject, grade level, or use case.
                </p>
              </div>
            </div>

            {/* Use Others' Work */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-900 transition-all hover:shadow-xl space-y-6">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Telescope className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">Use Others' Work</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Discover proven prompts from educators. Add them to your quiver with one click—no reinventing the wheel.
                </p>
              </div>
            </div>

            {/* Streamlined & Free */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-900 transition-all hover:shadow-xl space-y-6">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">Streamlined & Free</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  No login required. No subscriptions. Just clean, easy-to-use prompt management that works instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.05] bg-center bg-repeat pointer-events-none"
          style={{
            backgroundImage: `url(${quiverLogo})`,
            backgroundSize: '250px 250px',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold text-gray-900">Start building your quiver today</h2>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
            Join educators who are working smarter by learning from each other's best prompts.
          </p>
          <Link
            to="/"
            className="inline-block px-10 py-5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-xl hover:shadow-2xl text-lg"
          >
            My Quiver
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Quiver. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

