const footerLinks = {
  Produk: [
    { label: "Fitur", href: "#features" },
    { label: "Editor PDF", href: "/editor" },
  ],
  Paperly: [
    { label: "Tentang Kami", href: "#about" },
    { label: "Hubungi Kami", href: "mailto:hello@paperly.app" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border-strong bg-[#222222] px-6 py-14 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Main Footer */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex w-fit items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/30 bg-secondary text-text shadow-sm">
                <span className="text-xl font-extrabold">P</span>
              </div>

              <span className="text-2xl font-extrabold tracking-tight">
                Paperly<span className="text-secondary">.</span>
              </span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              Urus PDF, nggak perlu ribet. Tambahkan tanda tangan, stempel,
              paraf, dan teks dalam satu tempat.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              <span className="text-xs font-medium text-white/70">
                Sederhana. Praktis. Satu tempat.
              </span>
            </div>
          </div>

          {/* Navigation */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold text-white">{title}</h3>

              <ul className="mt-5 space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-secondary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            ©2026 Paperly. Hak cipta dilindungi @okenet-dev
          </p>

          <p className="text-xs text-white/50">
            Dibuat untuk memudahkan urusan dokumen PDF.
          </p>
        </div>
      </div>
    </footer>
  );
}
