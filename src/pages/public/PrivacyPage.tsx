import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { publicRoutes } from '../../utils/routes'

const sections = [
  {
    title: 'Titolare del trattamento',
    paragraphs: [
      'Wine Tour Fest - Lizzano (TA).',
      "Per informazioni relative al trattamento dei dati personali e possibile contattare l'organizzazione attraverso i recapiti ufficiali dell'evento.",
    ],
  },
  {
    title: 'Quali dati raccogliamo',
    paragraphs: ['Durante l’utilizzo della web app possono essere raccolti dati tecnici necessari al funzionamento della piattaforma.'],
    list: ['dati tecnici di navigazione', 'indirizzo IP', 'informazioni sul dispositivo e sul browser', 'dati statistici anonimi relativi all’utilizzo della piattaforma'],
    footer: 'Qualora siano presenti moduli di contatto o iscrizione potranno essere richiesti nome e cognome, indirizzo e-mail, numero di telefono ed eventuali informazioni inserite volontariamente dall’utente.',
  },
  {
    title: 'Finalita del trattamento',
    list: ['consentire il corretto funzionamento della web app', 'fornire informazioni sull’evento', 'gestire eventuali richieste inviate dagli utenti', 'elaborare statistiche anonime di utilizzo', 'migliorare l’esperienza di navigazione'],
  },
  {
    title: 'Base giuridica',
    paragraphs: ['Il trattamento dei dati avviene ai sensi dell’art. 6 del GDPR.'],
    list: ['esecuzione di un servizio richiesto dall’utente', 'consenso dell’interessato, ove necessario', 'legittimo interesse del titolare al corretto funzionamento della piattaforma'],
  },
  {
    title: 'Conservazione dei dati',
    paragraphs: ['I dati personali sono conservati esclusivamente per il tempo necessario al raggiungimento delle finalita indicate e nel rispetto degli obblighi di legge.'],
  },
  {
    title: 'Cookie',
    paragraphs: [
      'La web app utilizza cookie tecnici necessari al funzionamento del servizio.',
      'Qualora vengano utilizzati strumenti di analisi come Google Analytics, tali cookie saranno gestiti nel rispetto della normativa vigente e, ove previsto, previo consenso dell’utente.',
    ],
  },
  {
    title: 'Servizi di terze parti',
    paragraphs: ['La piattaforma puo utilizzare servizi esterni che trattano i dati secondo le rispettive informative sulla privacy.'],
    list: ['Google Analytics', 'Google Maps', 'Supabase', 'Vercel'],
  },
  {
    title: 'Sicurezza',
    paragraphs: ['Sono adottate adeguate misure tecniche e organizzative per proteggere i dati personali da accessi non autorizzati, perdita o divulgazione.'],
  },
  {
    title: 'Diritti dell’utente',
    paragraphs: ['L’utente puo esercitare in qualsiasi momento i diritti previsti dagli articoli 15-22 del GDPR.'],
    list: ['accesso ai dati', 'rettifica', 'cancellazione', 'limitazione del trattamento', 'opposizione', 'portabilita dei dati', 'revoca del consenso'],
  },
  {
    title: 'Modifiche alla presente informativa',
    paragraphs: ['La presente informativa potra essere aggiornata in qualsiasi momento. Eventuali modifiche saranno pubblicate su questa pagina.'],
  },
]

function PrivacyAccordionItem({ section, defaultOpen = false }: { section: typeof sections[number], defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="overflow-hidden rounded-lg bg-white text-left shadow-sm">
      <button type="button" onClick={() => setOpen((current) => !current)} className="flex min-h-16 w-full items-center justify-between gap-3 px-5 py-4 text-left">
        <span className="text-lg font-bold leading-tight text-stone-950">{section.title}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-wine-700 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open ? (
        <div className="space-y-3 border-t border-stone-200 px-5 pb-5 pt-4">
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-6 text-stone-600">{paragraph}</p>
          ))}
          {section.list ? (
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-stone-600">
              {section.list.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ) : null}
          {section.footer ? <p className="text-sm leading-6 text-stone-600">{section.footer}</p> : null}
        </div>
      ) : null}
    </section>
  )
}

export function PrivacyPage() {
  usePageMeta('Privacy', 'Informativa privacy e cookie Wine Tour Fest.')

  return (
    <div className="space-y-5">
      <PublicHeader back title="Privacy" />
      <SectionHeader eyebrow="Privacy e cookie" title="Informativa sulla Privacy" description="Ultimo aggiornamento: 1 agosto 2026" />

      <section className="space-y-4 rounded-lg bg-white p-5 text-left shadow-sm">
        <p className="text-base font-semibold leading-7 text-stone-700">Benvenuto nella web app del Wine Tour Fest di Lizzano.</p>
        <p className="text-sm leading-6 text-stone-600">
          La presente informativa descrive le modalita di raccolta, utilizzo e protezione dei dati personali degli utenti che visitano la web app, nel rispetto del Regolamento (UE) 2016/679 (GDPR).
        </p>
      </section>

      {sections.map((section, index) => <PrivacyAccordionItem key={section.title} section={section} defaultOpen={index === 0} />)}

      <section className="space-y-3 rounded-lg border border-wine-700/25 bg-white p-5 text-left shadow-sm">
        <h2 className="text-lg font-bold leading-tight text-stone-950">Utilizzo dei QR Code</h2>
        <p className="text-sm leading-6 text-stone-600">
          I QR Code presenti nella web app hanno esclusivamente la funzione di consentire l’accesso rapido alle pagine informative dedicate alle cantine partecipanti e ai contenuti dell’evento.
        </p>
        <p className="text-sm font-bold leading-6 text-stone-950">
          La semplice scansione di un QR Code non comporta la raccolta di dati personali dell’utente.
        </p>
        <p className="text-sm leading-6 text-stone-600">
          Non vengono registrati nominativi, indirizzi e-mail, numeri di telefono o altri dati identificativi. Durante la navigazione possono essere raccolti esclusivamente dati tecnici anonimi o pseudonimizzati, quali indirizzo IP, tipo di dispositivo, browser utilizzato e informazioni statistiche di accesso, necessari al corretto funzionamento della piattaforma e all’analisi aggregata dell’utilizzo della web app.
        </p>
      </section>

      <Link className="inline-flex min-h-11 items-center font-semibold text-wine-700" to={publicRoutes.home}>Torna alla home</Link>
    </div>
  )
}
