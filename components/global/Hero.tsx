export default function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-red-50 to-white overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black">
          {/* Background Image as Video Replacement */}
          <img
            src="https://images.unsplash.com/photo-1708782341766-0d360d02975c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYW4lMjBjdXJyeSUyMGNvb2tpbmd8ZW58MXx8fHwxNzY2NTE1MDI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Sri Lankan Cuisine"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2 text-red-400">
              <div className="w-12 h-0.5 bg-red-400"></div>
              <span className="text-sm tracking-widest uppercase">Authentic Flavors</span>
              <div className="w-12 h-0.5 bg-red-400"></div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl text-white mb-6 drop-shadow-lg">
            Welcome to<br />
            <span className="text-red-400">Ceylon Curry Pot</span>
          </h2>
          
          <p className="text-xl text-gray-100 max-w-2xl mx-auto mb-8 drop-shadow-md">
            Experience the rich heritage of Sri Lankan cuisine, delivered fresh to your doorstep. 
            Every dish tells a story of tradition, spice, and love.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#menu"
              className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Order Now
            </a>
            <a
              href="#about"
              className="bg-white text-red-600 px-8 py-3 rounded-full border-2 border-white hover:bg-red-50 transition-all shadow-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 48L60 42C120 36 240 24 360 18C480 12 600 12 720 18C840 24 960 36 1080 42C1200 48 1320 48 1380 48L1440 48V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V48Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}