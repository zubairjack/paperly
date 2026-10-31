const benefits = [
  {
    number: "01",
    title: "Simple by Design",
    description:
      "Tampilan yang sederhana agar kamu bisa fokus mengurus dokumen tanpa kebingungan.",
  },
  {
    number: "02",
    title: "Work in One Place",
    description:
      "Tambahkan tanda tangan, stempel, paraf, dan teks tanpa perlu berpindah-pindah aplikasi.",
  },
  {
    number: "03",
    title: "Privacy First",
    description:
      "Pada versi awal Paperly, dokumen PDF diproses langsung di browser tanpa perlu diunggah ke server.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="border-t border-border bg-background px-6 py-24 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
        {/* About Content */}
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            About Paperly
          </p>

          <h2 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl">
            Urusan dokumen jadi
            <span className="text-primary"> lebih mudah.</span>
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-text-secondary">
            Paperly adalah ruang kerja untuk mengurus berbagai kebutuhan dokumen
            PDF sehari-hari. Mulai dari menambahkan tanda tangan hingga stempel
            perusahaan, semuanya bisa dilakukan dalam satu tempat dengan
            tampilan yang simpel dan mudah digunakan.
          </p>

          <p className="mt-4 max-w-xl text-base leading-8 text-text-secondary">
            Tujuan kami sederhana: membantu kamu menyiapkan dan menyelesaikan
            dokumen PDF tanpa proses yang ribet.
          </p>

          {/* Small Highlight */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-md border border-border-strong bg-surface px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-text">
              <span className="text-lg font-bold">P</span>
            </div>

            <div>
              <p className="text-sm font-bold text-text">
                Satu tempat untuk semuanya.
              </p>
              <p className="text-xs text-text-secondary">
                Semua kebutuhan PDF dalam satu ruang kerja.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="divide-y divide-border border-y border-border">
          {benefits.map((benefit) => (
            <article key={benefit.number} className="group flex gap-6 py-7">
              <span className="pt-1 text-sm font-bold text-primary">
                {benefit.number}
              </span>

              <div>
                <h3 className="text-lg font-bold text-text transition-colors group-hover:text-primary">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-text-secondary">
                  {benefit.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
