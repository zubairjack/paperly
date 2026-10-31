export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <nav className="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border-strong bg-secondary shadow-sm">
            <span className="text-xl font-extrabold text-text">P</span>
          </div>

          <span className="text-xl font-extrabold tracking-tight text-text">
            Paperly
          </span>
        </a>

        {/* Navigation Menu */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#home"
            className="text-sm font-semibold text-text-secondary transition-colors hover:text-primary"
          >
            Beranda
          </a>

          <a
            href="#features"
            className="text-sm font-semibold text-text-secondary transition-colors hover:text-primary"
          >
            Fitur
          </a>

          <a
            href="#about"
            className="text-sm font-semibold text-text-secondary transition-colors hover:text-primary"
          >
            Tentang
          </a>
        </div>

        {/* Action Button */}
        <a
          href="/editor"
          className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-primary px-5 py-2.5 text-sm font-bold text-text-inverse shadow-md transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          Mulai Mengedit
          <span aria-hidden="true">→</span>
        </a>
      </nav>
    </header>
  );
}
