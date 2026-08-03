import { ArrowUpRight } from 'lucide-react'
import type { SVGProps } from 'react'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14.2 8.1h2.1V4.7c-.4-.1-1.6-.2-3-.2-3 0-5 1.8-5 5.1v2.9H5v3.8h3.3V24h4v-7.7h3.3l.5-3.8h-3.8V10c0-1.1.3-1.9 1.9-1.9Z" />
    </svg>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect width="17" height="17" x="3.5" y="3.5" rx="5" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="3.7" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" />
    </svg>
  )
}

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61578821186138',
    icon: FacebookIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/winetourfest/',
    icon: InstagramIcon,
  },
]

export function SocialPage() {
  usePageMeta('Social', 'Canali social ufficiali Wine Tour Fest.')

  return (
    <div className="space-y-6">
      <PublicHeader back title="Social" />

      <section className="rounded-lg border border-wine-900/10 bg-[#f6f2e8] px-5 py-8 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-gold-700">Wine Tour Fest</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-stone-950">Social</h1>
        <p className="mx-auto mt-5 max-w-72 text-lg font-semibold leading-7 text-olive-700">
          Seguici sui canali ufficiali per aggiornamenti, foto e momenti del festival.
        </p>
      </section>

      <section className="grid gap-3">
        {socialLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-24 items-center justify-between gap-4 rounded-lg border border-stone-200 bg-[#f6f2e8] p-5 text-left shadow-sm"
          >
            <span className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-wine-700 text-cream-50">
                <item.icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <span className="text-2xl font-black text-wine-900">{item.label}</span>
            </span>
            <ArrowUpRight className="h-6 w-6 text-gold-700" aria-hidden="true" />
          </a>
        ))}
      </section>
    </div>
  )
}
