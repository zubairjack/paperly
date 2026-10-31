const features = [
  {
    number: "01",
    icon: "✍",
    title: "E-Signature",
    description:
      "Tambahkan tanda tangan ke dokumen PDF menggunakan mouse, trackpad, atau gambar tanda tangan yang diunggah.",
    accent: "bg-secondary",
  },
  {
    number: "02",
    icon: "▣",
    title: "Stamp & Initials",
    description:
      "Tambahkan stempel perusahaan, inisial, dan paraf langsung ke dokumen Anda.",
    accent: "bg-surface-secondary",
  },
  {
    number: "03",
    icon: "T",
    title: "Text & Date",
    description:
      "Tambahkan teks, tanggal, atau informasi lainnya di bagian dokumen PDF sesuai kebutuhan.",
    accent: "bg-primary",
  },
  {
    number: "04",
    icon: "◈",
    title: "Private Workspace",
    description:
      "Proses dokumen PDF langsung di browser tanpa perlu mengunggahnya ke server.",
    accent: "bg-surface-secondary",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="border-t border-border bg-surface px-6 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Features
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            Edit dan lengkapi PDF dengan lebih mudah.
          </h2>

          <p className="mt-5 text-base leading-8 text-text-secondary">
            Mulai dari menambahkan tanda tangan, stempel, paraf, hingga teks dan
            tanggal. Nggak perlu repot menggunakan banyak aplikasi untuk
            menyelesaikan dokumen PDF.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group rounded-lg border border-border-strong bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Card Top */}
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-md border border-border-strong ${feature.accent} text-xl font-bold ${
                    feature.accent === "bg-primary"
                      ? "text-text-inverse"
                      : "text-text"
                  }`}
                >
                  {feature.icon}
                </div>

                <span className="text-xs font-bold tracking-widest text-text-secondary">
                  {feature.number}
                </span>
              </div>

              {/* Card Content */}
              <div className="mt-10">
                <h3 className="text-lg font-bold text-text">{feature.title}</h3>

                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {feature.description}
                </p>
              </div>

              {/* Card Bottom */}
              <div className="mt-8 flex items-center justify-between">
                <div className="h-1 w-10 rounded-full bg-primary transition-all duration-200 group-hover:w-16" />

                <span className="text-xs font-bold text-text-secondary">
                  {feature.number}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
