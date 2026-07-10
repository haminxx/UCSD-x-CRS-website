import Image from "next/image";
import Link from "next/link";

const exploreLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us/" },
  { name: "Program", href: "/program/" },
];

const connectLinks = [
  { name: "Sponsors", href: "/sponsors/" },
  { name: "Recruitment", href: "/recruitment/" },
  { name: "Contact", href: "/contact/" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/crs_ucsd/?utm_source=ig_web_button_share_sheet",
    icon: InstagramIcon,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/ucsd-crs",
    icon: LinkedInIcon,
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="UCSD x CRS home" className="inline-block">
              <Image
                src="/images/ucsd-x-crs-logo-light.png"
                alt="UCSD x CRS"
                width={171}
                height={256}
                className="h-10 w-auto object-contain md:h-11"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Student-led racing and engineering at UC San Diego, competing in
              the Collegiate Racing Series.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="text-white/60 transition-colors duration-200 hover:text-white"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3 lg:justify-items-start lg:gap-10">
            <div>
              <p className="text-sm font-medium text-white">Explore</p>
              <ul className="mt-4 space-y-3">
                {exploreLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-white">Connect</p>
              <ul className="mt-4 space-y-3">
                {connectLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="text-sm font-medium text-white">Follow</p>
              <ul className="mt-4 space-y-3">
                {socialLinks.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 pt-8">
          <div className="flex flex-col gap-4 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
            <p>
              © 2026 University of California, San Diego x Collegiate Racing
              Series. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                href="#"
                className="transition-colors duration-200 hover:text-white"
              >
                Terms and Conditions
              </Link>
              <Link
                href="#"
                className="transition-colors duration-200 hover:text-white"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
