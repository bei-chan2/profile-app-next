import Link from "next/link";

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/qa", label: "Q&A" },
  { href: "/help", label: "ヘルプ窓口" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3 md:px-10">
        <Link href="/" className="text-sm font-bold tracking-wide">
          べいちゃん
        </Link>
        <nav>
          <ul className="flex items-center gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
