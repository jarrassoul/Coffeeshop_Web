import MenuGrid from "@/components/MenuGrid";

export default function Home() {
  return (
    <div
      id="top"
      className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black"
    >
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16">
        <section className="flex flex-col gap-4">
          <span className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Freshly roasted, daily
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
            Great coffee, made simply.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            From single-origin pour overs to buttery croissants, everything is
            prepared in-house. Browse the menu and order at the counter.
          </p>
        </section>

        <section id="menu" className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Menu
          </h2>
          <MenuGrid />
        </section>

        <section id="about" className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            About us
          </h2>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            We are a neighborhood coffeeshop obsessed with quality. Our beans
            are roasted in small batches and our pastries are baked every
            morning, so every cup and bite is at its best.
          </p>
        </section>
      </main>
    </div>
  );
}
