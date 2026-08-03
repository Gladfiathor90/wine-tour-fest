import { type FormEvent, useState } from 'react'
import { Mail, Phone, Send, Wrench } from 'lucide-react'
import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { usePageMeta } from '../../hooks/usePageMeta'

const contactTopics = ['Area tecnica', 'Cantine', 'Servizi comunali', 'Artisti', 'Informazioni', 'Altro']

const initialContactForm = {
  name: '',
  email: '',
  phone: '',
  topic: 'Area tecnica',
  message: '',
}

type ContactFormField = keyof typeof initialContactForm

export function ContactsPage() {
  const [contactForm, setContactForm] = useState(initialContactForm)

  usePageMeta('Contatti', 'Contatti ufficiali e supporto Wine Tour Fest.')

  const updateContactForm = (field: ContactFormField, value: string) => {
    setContactForm((current) => ({ ...current, [field]: value }))
  }

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const subject = `Wine Tour Fest - ${contactForm.topic}`
    const body = [
      `Categoria: ${contactForm.topic}`,
      `Nome: ${contactForm.name}`,
      `Email: ${contactForm.email}`,
      contactForm.phone ? `Telefono: ${contactForm.phone}` : '',
      '',
      contactForm.message,
    ].filter(Boolean).join('\n')

    window.location.href = `mailto:winetourfest@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="space-y-5">
      <PublicHeader back title="Contatti" />
      <SectionHeader eyebrow="Supporto" title="Contatti" description="Contatti ufficiali, segnalazioni e supporto per la Web App Wine Tour Fest." />

      <section className="rounded-lg border border-stone-200 bg-[#f6f2e8] p-5 text-center shadow-sm">
        <h2 className="text-xl font-bold leading-tight text-stone-950">Wine Tour Fest</h2>
        <div className="mt-4 grid gap-2 text-sm font-semibold text-stone-600">
          <a href="mailto:winetourfest@gmail.com" className="inline-flex min-h-10 items-center justify-center gap-2">
            <Mail className="h-4 w-4 text-wine-700" aria-hidden="true" />
            winetourfest@gmail.com
          </a>
          <a href="tel:0999558603" className="inline-flex min-h-10 items-center justify-center gap-2">
            <Phone className="h-4 w-4 text-wine-700" aria-hidden="true" />
            099 9558603
          </a>
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-[#f6f2e8] p-5 shadow-sm">
        <h2 className="text-xl font-bold leading-tight text-stone-950">Scrivici</h2>
        <form className="mt-5 grid gap-4" onSubmit={handleContactSubmit}>
          <label className="grid gap-2 text-sm font-bold text-stone-800">
            Nome e cognome
            <input
              required
              className="min-h-12 rounded-md border border-stone-300 bg-white px-4 text-base font-semibold text-stone-900 outline-none transition focus:border-wine-700 focus:ring-2 focus:ring-wine-700/20"
              type="text"
              value={contactForm.name}
              onChange={(event) => updateContactForm('name', event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-stone-800">
            Email
            <input
              required
              className="min-h-12 rounded-md border border-stone-300 bg-white px-4 text-base font-semibold text-stone-900 outline-none transition focus:border-wine-700 focus:ring-2 focus:ring-wine-700/20"
              type="email"
              value={contactForm.email}
              onChange={(event) => updateContactForm('email', event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-stone-800">
            Telefono
            <input
              className="min-h-12 rounded-md border border-stone-300 bg-white px-4 text-base font-semibold text-stone-900 outline-none transition focus:border-wine-700 focus:ring-2 focus:ring-wine-700/20"
              type="tel"
              value={contactForm.phone}
              onChange={(event) => updateContactForm('phone', event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-stone-800">
            Motivo del contatto
            <select
              className="min-h-12 rounded-md border border-stone-300 bg-white px-4 text-center text-base font-semibold text-stone-900 outline-none transition focus:border-wine-700 focus:ring-2 focus:ring-wine-700/20"
              value={contactForm.topic}
              onChange={(event) => updateContactForm('topic', event.target.value)}
            >
              {contactTopics.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold text-stone-800">
            Messaggio
            <textarea
              required
              className="min-h-36 resize-y rounded-md border border-stone-300 bg-white px-4 py-3 text-base font-semibold leading-6 text-stone-900 outline-none transition focus:border-wine-700 focus:ring-2 focus:ring-wine-700/20"
              value={contactForm.message}
              onChange={(event) => updateContactForm('message', event.target.value)}
            />
          </label>

          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-sm" type="submit">
            <Send className="h-4 w-4" aria-hidden="true" />
            Invia
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-stone-200 bg-[#f6f2e8] p-5 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-wine-700 text-cream-50">
          <Wrench className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-bold leading-tight text-stone-950">Supporto tecnico app</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-6 text-stone-600">
          Per problemi tecnici, malfunzionamenti o segnalazioni relative alla Web App scrivi a:
        </p>
        <a href="mailto:info@tarantatech.it" className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-bold text-white">
          <Mail className="h-4 w-4" aria-hidden="true" />
          info@tarantatech.it
        </a>
      </section>
    </div>
  )
}
