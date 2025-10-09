import { ExternalLink, Github } from "lucide-react"

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono">
      {/* Header */}
      <header className="border-b-4 border-green-400 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="border-2 border-white p-3 md:p-4 mb-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">CHARGING THE FUTURE</h1>
            <p className="text-base md:text-xl text-green-400">world's first-ever TI economy powered by psyop-free products and services</p>
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
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-white pb-2">ABOUT_US.TXT</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border-2 border-white p-6">
              <h3 className="text-xl font-bold mb-4 text-green-400">COMMITMENT:</h3>
              <p className="mb-4 leading-relaxed">
                Together, we commit to clarity, critical thinking, and authenticity, supporting one another as we navigate the complexities of our world and make choices that reflect our values and aspirations.
              </p>
            </div>
            <div className="border-2 border-white p-6">
              <h3 className="text-xl font-bold mb-4 text-green-400">PRIVACY POLICY.JSON:</h3>
              <pre className="text-sm leading-relaxed">
                {`{
  "Effective Date": [
    "September 14 2025"
  ],
  "minimal": [
    "At CTF, we prioritize your
    privacy and are committed
    to collecting as little
    information as possible.
    We only gather the essential
    data needed to provide our
    services, such as your
    name and email address
    for account creation and
    communication."
  ],
  "do not sell": [
    "We do not sell your data to
    third parties. Your information
    is shared minimally and only
    with trusted partners necessary
    for service delivery, such as
    payment processors. We ensure
    that any third parties we work
    with adhere to
    strict privacy standards."
  ],
  "control": [
    "You have full control over
    your account. You can delete your
    account at any time, and upon
    deletion, we will remove your
    personal information
    from our systems. If you have
    any questions or
    concerns about your privacy,
    feel free to contact us.
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="projects" className="border-b-4 border-green-400 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-white pb-2">PRODUCTS.DIR</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project 1 */}
            <div className="border-2 border-white">
              <div className="border-b-2 border-white p-4 bg-green-400 text-black">
                <h3 className="text-xl font-bold">SUPPORTMATCH</h3>
              </div>
              <div className="p-6">
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Distributed Cache System Architecture"
                  className="w-full h-48 object-cover border-2 border-white mb-4"
                />
                <p className="mb-4">
                  match to others with similar experiences for collaboration or friendship
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/chargingthefuture/supportmatch"
                    className="border-2 border-white px-3 py-1 hover:bg-white hover:text-black flex items-center gap-2"
                  >
                    <Github size={16} />
                    CODE
                  </a>
                  <a
                    href="https://supportmatch.chargingthefuture.com"
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
                <h3 className="text-xl font-bold">TOWNSQUARE</h3>
              </div>
              <div className="p-6">
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Distributed Cache System Architecture"
                  className="w-full h-48 object-cover border-2 border-white mb-4"
                />
                <p className="mb-4">
                  CTF online forum
                </p>
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
