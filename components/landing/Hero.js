export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-background px-6 py-20 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Hero Content */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="text-sm font-semibold text-text">
              A simpler way to work with PDF
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">
            Edit PDF.
            <br />
            <span className="text-primary"> nggak perlu ribet</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
            Nggak perlu repot pindah-pindah aplikasi. Tambahkan tanda tangan,
            stempel, paraf, teks, hingga tanggal langsung ke dokumen PDF. Semua
            bisa kamu kerjakan dengan mudah dalam satu tempat bersama Paperly.
          </p>

          {/* Action Buttons */}
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/editor"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border-strong bg-primary px-7 py-3.5 text-sm font-bold text-text-inverse shadow-md transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none sm:w-auto"
            >
              Start Editing
              <span aria-hidden="true">→</span>
            </a>

            <a
              href="#features"
              className="inline-flex w-full items-center justify-center rounded-md border border-border-strong bg-surface px-7 py-3.5 text-sm font-semibold text-text shadow-sm transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none sm:w-auto"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Workspace Preview */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-border-strong bg-surface shadow-lg">
            {/* Preview Header */}
            <div className="flex h-12 items-center justify-between border-b border-border bg-surface px-5">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-danger" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning" />
                <div className="h-2.5 w-2.5 rounded-full bg-success" />
              </div>

              <span className="text-xs font-bold text-text">
                Paperly Workspace
              </span>

              <span className="text-xs text-text-secondary">PDF Editor</span>
            </div>

            {/* Preview Body */}
            <div className="grid min-h-80 grid-cols-12 bg-workspace">
              {/* Sidebar */}
              <div className="col-span-2 border-r border-border bg-surface p-3 sm:p-4">
                <div className="mb-4 h-2 w-12 rounded bg-border" />

                <div className="space-y-4">
                  <div className="aspect-[3/4] rounded-sm border-2 border-primary bg-surface-secondary p-2">
                    <div className="h-1 w-8 rounded bg-border" />
                    <div className="mt-3 h-1 w-full rounded bg-border" />
                    <div className="mt-2 h-1 w-3/4 rounded bg-border" />
                  </div>

                  <div className="aspect-[3/4] rounded-sm border border-border bg-surface p-2">
                    <div className="h-1 w-8 rounded bg-border" />
                    <div className="mt-3 h-1 w-full rounded bg-border" />
                    <div className="mt-2 h-1 w-3/4 rounded bg-border" />
                  </div>
                </div>
              </div>

              {/* Document Area */}
              <div className="col-span-8 flex items-center justify-center p-4 sm:p-10">
                <div className="relative min-h-64 w-full max-w-sm bg-surface p-6 shadow-md sm:min-h-80 sm:p-8">
                  <div className="text-center">
                    <div className="text-sm font-bold text-text">
                      DOCUMENT AGREEMENT
                    </div>

                    <div className="mx-auto mt-2 h-1 w-16 rounded bg-primary" />
                  </div>

                  <div className="mt-8 space-y-3">
                    <div className="h-1.5 w-full rounded bg-border" />
                    <div className="h-1.5 w-full rounded bg-border" />
                    <div className="h-1.5 w-4/5 rounded bg-border" />
                    <div className="h-1.5 w-full rounded bg-border" />
                    <div className="h-1.5 w-3/4 rounded bg-border" />
                  </div>

                  {/* Signature */}
                  <div className="mt-10">
                    <div className="text-xs text-text-secondary">
                      Authorized Signature
                    </div>

                    <div className="mt-3 inline-block border-b border-primary px-3 pb-1">
                      <span className="font-serif text-xl italic text-primary">
                        Johni
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-text-secondary">
                      Signed digitally
                    </div>
                  </div>

                  {/* Stamp */}
                  <div className="absolute bottom-8 right-6 rotate-[-12deg] rounded-md border-2 border-secondary px-2 py-1 text-[10px] font-extrabold tracking-wider text-secondary">
                    APPROVED
                  </div>
                </div>
              </div>

              {/* Properties Panel */}
              <div className="col-span-2 border-l border-border bg-surface p-2 sm:p-3">
                <div className="mb-4 h-2 w-14 rounded bg-border" />

                <div className="space-y-3">
                  <div className="h-8 rounded-md border border-border bg-background" />
                  <div className="h-8 rounded-md border border-border bg-background" />
                  <div className="h-8 rounded-md border border-border bg-background" />
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-text-secondary">
            Semua urusan PDF, lebih mudah dalam satu tempat.
          </p>
        </div>
      </div>
    </section>
  );
}
