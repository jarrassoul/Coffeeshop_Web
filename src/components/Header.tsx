import CartButton from "@/components/CartButton";

const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#about", label: "About" },
  { href: "#visit", label: "Visit" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-amber-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="text-lg font-bold tracking-tight text-stone-800"
        >
          Date &amp; Maple Cafe
        </a>
        <nav className="flex items-center gap-6 text-sm font-medium text-stone-600">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-amber-700"
            >
              {link.label}
            </a>
          ))}
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
