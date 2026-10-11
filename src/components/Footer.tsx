export default function Footer() {
  return (
    <footer id="visit" className="border-t border-amber-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-10 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
        <p>123 Maple Street, Your City</p>
        <div className="flex items-center gap-4">
          <p>Open daily, 7:00 AM – 6:00 PM</p>
          <p className="text-stone-400">
            &copy; {new Date().getFullYear()} Date &amp; Maple Cafe
          </p>
        </div>
      </div>
    </footer>
  );
}
