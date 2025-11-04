import { ExternalLink, Github } from "lucide-react"

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono">
      {/* Header */}
      <header className="border-b-4 border-green-400 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="border-2 border-white p-3 md:p-4 mb-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">CHARGING THE FUTURE</h1>
            <p className="text-base md:text-xl text-green-400">
              world's first-ever TI economy powered by psyop-free products and services
            </p>
          </div>
          <nav className="flex flex-col sm:flex-row gap-3 md:gap-6">
            <a
              href="#about"
              className="border-2 border-white px-3 py-2 md:px-4 md:py-2 hover:bg-white hover:text-black transition-none text-center text-sm md:text-base"
            >
              [ABOUT]
            </a>
            <a
              href="#projects"
              className="border-2 border-white px-3 py-2 md:px-4 md:py-2 hover:bg-white hover:text-black transition-none text-center text-sm md:text-base"
            >
              [PRODUCTS]
            </a>
          </nav>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="border-b-4 border-green-400 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-white pb-2">ABOUT US</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="border-2 border-white p-6">
              <h3 className="text-xl font-bold mb-4 text-green-400">MISSION</h3>
              <p className="mb-4 leading-relaxed">
                At Charging the Future, we strive to empower individuals to Live, Work, & Conquer in a world where clarity, critical thinking, and authenticity guide every decision. As pioneers of the world’s first TI economy, we focus on offering psyop-free products and services that foster a safe and thriving community.
              </p>
            </div>
                        <div className="border-2 border-white p-6">
              <h3 className="text-xl font-bold mb-4 text-green-400">COMMITMENT</h3>
              <p className="mb-4 leading-relaxed">
                We are dedicated to supporting one another as we navigate the complexities of life. Together, we commit to choices that align with our core values and aspirations, ensuring that everyone has the opportunity to live without fear.
              </p>
            </div>
                        <div className="border-2 border-white p-6">
              <h3 className="text-xl font-bold mb-4 text-green-400">PURPOSE</h3>
              <p className="mb-4 leading-relaxed">
                Founded with a vision to prevent the tragic consequences of human trafficking, we seek to create an economy that not only uplifts those who have been affected but also empowers every individual to reclaim their power. By building a sustainable and ethical marketplace, we aim to pave the way for a brighter future where every person can thrive.
              </p>
            </div>
          </div>


        </div>
      </section>

      {/* Products Section */}
      <section id="projects" className="border-b-4 border-green-400 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-white pb-2">PRODUCTS & SERVICES</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project 1 */}
            <div className="border-2 border-white">
              <div className="border-b-2 border-white p-4 bg-green-400 text-black">
                <h3 className="text-xl font-bold">TOWNSQUARE</h3>
              </div>
              <div className="p-6">
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Distributed Cache System Architecture"
                  className="w-full h-48 object-cover border-2 border-white mb-4"
                />
                <p className="mb-4">online forum</p>
                <div className="flex gap-4">
                  <a
                    href="https://chargingthefuture.discourse.group"
                    className="border-2 border-white px-3 py-1 hover:bg-white hover:text-black flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    GO TO
                  </a>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="border-2 border-white">
              <div className="border-b-2 border-white p-4 bg-green-400 text-black">
                <h3 className="text-xl font-bold">APP</h3>
              </div>
              <div className="p-6">
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Distributed Cache System Architecture"
                  className="w-full h-48 object-cover border-2 border-white mb-4"
                />
                <p className="mb-4">hub of psyop-free products and services</p>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/chargingthefuture/app"
                    className="border-2 border-white px-3 py-1 hover:bg-white hover:text-black flex items-center gap-2"
                  >
                    <Github size={16} />
                    CODE
                  </a>
                  <a
                    href="https://app.chargingthefuture.com"
                    className="border-2 border-white px-3 py-1 hover:bg-white hover:text-black flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    GO TO
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-green-400 p-6 text-center">
        <p className="text-green-400">© 2025 CHARGING THE FUTURE</p>
      </footer>
    </div>
  )
}
