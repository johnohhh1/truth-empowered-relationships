'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/icon-192.png" alt="TER" className="w-10 h-10 rounded-lg" />
              <div className="text-left">
                <p className="font-semibold">Truth Empowered Relationships</p>
                <p className="text-sm text-gray-400">Transform reactive patterns into conscious connection</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © {currentYear} John Olenski. All Rights Reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Developed by{' '}
                <a
                  href="https://johnohhh1.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ter-blue hover:text-ter-lavender transition-colors"
                >
                  johnohhh1
                </a>
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
            <p>
              Licensed under the{' '}
              <a
                href="https://github.com/johnohhh1/truth-empowered-relationships/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-400"
              >
                Proprietary License
              </a>
              {' '}• For educational and personal use only
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
