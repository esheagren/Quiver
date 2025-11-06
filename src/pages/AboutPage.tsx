import quiverLogo from '../../QuiverLogo.png'

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      {/* Fullscreen Background Logo */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${quiverLogo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      
      {/* Optional overlay for better text readability */}
      <div className="fixed inset-0 bg-white/60 z-10" />
      
      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col py-12 px-6">
          <div className="max-w-5xl mx-auto space-y-10">
            <h1 className="text-9xl font-bold text-gray-900 text-center">Quiver</h1>
            <div className="space-y-8">
              <p className="text-4xl font-bold text-gray-900">
                The most streamlined place to store and share GPTs for schools.
              </p>
              <p className="text-2xl text-gray-800 leading-relaxed font-medium">
                Quiver helps educators save, discover, and share CustomGPT prompts without the friction of authentication. 
                Teachers can quickly build their personal collection of AI prompts and explore prompts shared by the community. 
                Whether you're looking for lesson planning ideas, content explanations, or writing assistance, Quiver makes it easy 
                to find and use the right prompts for your classroom.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="relative z-20 py-8 border-t border-gray-200/50 mt-auto">
          <div className="container mx-auto px-6">
            <div className="text-center text-sm text-gray-600">
              <p>&copy; {new Date().getFullYear()} Quiver. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

