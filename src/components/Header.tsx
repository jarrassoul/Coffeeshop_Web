const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#about", label: "About" },
  { href: "#visit", label: "Visit" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/[.08] bg-white/80 backdrop-blur dark:border-white/[.145] dark:bg-black/60">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="text-lg font-semibold tracking-tight">
          Coffeeshop
        </a>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
