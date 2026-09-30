import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, MouseEvent as ReactMouseEvent } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Asterisk, Menu, X } from 'lucide-react'

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const unsplash = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

/** Responsive image props for an Unsplash photo id. */
const picture = (id: string, sizes: string) => ({
  src: unsplash(id, 1400),
  srcSet: [640, 1024, 1600, 2000].map((w) => `${unsplash(id, w)} ${w}w`).join(', '),
  sizes,
})

type RevealProps = { 'data-reveal': string; style: CSSProperties }

/** Scroll-reveal props with an optional stagger delay. */
const reveal = (delay = 0): RevealProps => ({
  'data-reveal': '',
  style: { transitionDelay: `${delay}ms` },
})

/** Full-bleed column rules — the editorial grid, drawn in one line of CSS. */
const gridLines = (color: string) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 bg-[length:25%_100%] md:bg-[length:16.6667%_100%]"
    style={{ backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px)` }}
  />
)

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'studio', label: 'Studio' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
] as const

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4'

const HERO_FALLBACK = 'photo-1524504388940-b1c1722653e1'

type Project = {
  id: string
  index: string
  name: string
  category: string
  summary: string
  services: string[]
  year: string
  photoId: string
  alt: string
  tint: string
  badge: string
  tone: string
  brief: string
  approach: string
  result: string
  deliverables: string[]
}

const PROJECTS: Project[] = [
  {
    id: 'forma-objects',
    index: '01',
    name: 'Forma Objects',
    category: 'Brand identity / E-commerce',
    summary: 'A warmer point of view for objects made to last.',
    services: ['Brand identity', 'Packaging', 'E-commerce'],
    year: '2024',
    photoId: 'photo-1610701596007-11502861dcfa',
    alt: 'Sculptural ceramic vessels in warm clay and rust tones, lit like a still life.',
    tint: 'bg-signal/15 mix-blend-multiply',
    badge: 'bg-ink/85 text-ivory',
    tone: 'text-signal',
    brief:
      'Forma makes small-batch furniture and homeware in a converted warehouse in Red Hook. The work was already loved — the story wasn’t. Packaging, product pages and press each spoke a different language.',
    approach:
      'We built from a single point of view: objects should age into your life, not out of it. A wordmark with weight, a palette pulled from clay, rust and unbleached paper, and photography that treats every piece like a portrait.',
    result:
      'A storefront that reads like an editorial catalogue, packaging that feels like part of the object, and a system the team can extend season by season without losing the warmth.',
    deliverables: [
      'Brand strategy and positioning',
      'Wordmark and identity system',
      'Packaging and print',
      'Art direction',
      'Shopify storefront build',
      'Product page system',
    ],
  },
  {
    id: 'sonder-house',
    index: '02',
    name: 'Sonder House',
    category: 'Strategy / Digital experience',
    summary: 'A digital home for independent stays and slower travel.',
    services: ['Strategy', 'Digital experience', 'Design system'],
    year: '2025',
    photoId: 'photo-1449844908441-8829872d2607',
    alt: 'A small independent house among tall pines, lit by low morning sun.',
    tint: 'bg-ink/10',
    badge: 'bg-ivory/95 text-ink',
    tone: 'text-signal-700',
    brief:
      'Sonder House brings together independent homes along three coastlines. Bookings ran through listings that flattened exactly what made each house worth the drive.',
    approach:
      'We wrote a positioning around unhurried travel — fewer filters, more feeling — then designed a booking experience that behaves like a good guidebook: long light, quiet type, room to wander before you decide.',
    result:
      'A calmer path from first look to direct enquiry, and a design system the team can extend house by house as the collection grows.',
    deliverables: [
      'Positioning and messaging',
      'Content strategy',
      'Information architecture',
      'UX and interface design',
      'Design system',
      'Web build and launch support',
    ],
  },
  {
    id: 'open-field',
    index: '03',
    name: 'Open Field',
    category: 'Campaign / Art direction',
    summary: 'Making room for a more hopeful conversation about the outdoors.',
    services: ['Campaign', 'Art direction', 'Content'],
    year: '2023',
    photoId: 'photo-1470071459604-3b5ec3a7fe05',
    alt: 'Open hills under a wide sky at first light, mist lifting off the ridge.',
    tint: 'bg-ink/35 mix-blend-multiply',
    badge: 'bg-signal text-ink',
    tone: 'text-ink',
    brief:
      'Open Field is a public campaign about access to open land. The conversation around it had drifted into guilt and gloom, and the organisation needed a season of work that invited people back outside.',
    approach:
      'We art directed a spring of imagery around first light and open invitation, then built a type and layout system that behaves the same on a poster, a film title and a phone screen.',
    result:
      'One recognisable visual language across every channel — flexible enough for local organisers to use on their own, distinct enough to be spotted from across the street.',
    deliverables: [
      'Campaign concept',
      'Art direction',
      'Photography direction',
      'Motion and film guidance',
      'Social and out-of-home system',
      'Print toolkit',
    ],
  },
]

const SNAPSHOT = [
  { label: 'Based in', value: 'Brooklyn, NY · Working everywhere' },
  { label: 'Approach', value: 'Strategy, craft, collaboration' },
  { label: 'Good at', value: 'Making complex things feel clear' },
]

const SERVICES = [
  {
    number: '01',
    title: 'Brand foundations',
    desc: 'Positioning, naming, voice, and strategy.',
    type: 'Brand identity',
  },
  {
    number: '02',
    title: 'Visual identity',
    desc: 'Art direction, identity systems, and guidelines.',
    type: 'Brand identity',
  },
  {
    number: '03',
    title: 'Digital experiences',
    desc: 'Websites, e-commerce, and digital products.',
    type: 'Digital experience',
  },
  {
    number: '04',
    title: 'Campaigns & content',
    desc: 'Launch concepts, photography direction, and social systems.',
    type: 'Campaign',
  },
]

const PROCESS = [
  { number: '01', title: 'Listen', desc: 'Understand the ambition, audience, and real constraints.' },
  { number: '02', title: 'Frame', desc: 'Find the clear idea that gives the work direction.' },
  { number: '03', title: 'Make', desc: 'Build, test, and refine the identity or experience.' },
  { number: '04', title: 'Release', desc: 'Prepare the work to meet the world with confidence.' },
]

const PROJECT_TYPES = ['Brand identity', 'Digital experience', 'Campaign', 'Something else']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type FieldKey = 'name' | 'email' | 'projectType' | 'message'
type Errors = Partial<Record<FieldKey, string>>

const EMPTY_FORM = { name: '', email: '', projectType: '', message: '' }

/* -------------------------------------------------------------------------- */
/*  Focus containment                                                          */
/* -------------------------------------------------------------------------- */

/** Traps Tab focus inside a container, closes on Escape, restores prior focus. */
const setupTrap = (container: HTMLElement, onClose: () => void) => {
  const previouslyFocused = document.activeElement as HTMLElement | null

  const items = () =>
    Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.getClientRects().length > 0,
    )

  const first = items()[0]
  ;(first ?? container).focus({ preventScroll: true })

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== 'Tab') return

    const list = items()
    if (list.length === 0) return
    const firstEl = list[0]
    const lastEl = list[list.length - 1]
    const active = document.activeElement as HTMLElement | null

    if (event.shiftKey) {
      if (active === firstEl || !container.contains(active)) {
        event.preventDefault()
        lastEl.focus()
      }
    } else if (active === lastEl || !container.contains(active)) {
      event.preventDefault()
      firstEl.focus()
    }
  }

  document.addEventListener('keydown', onKeydown, true)
  const previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  return () => {
    document.removeEventListener('keydown', onKeydown, true)
    document.body.style.overflow = previousOverflow
    previouslyFocused?.focus?.({ preventScroll: true })
  }
}

/* -------------------------------------------------------------------------- */
/*  App                                                                        */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState<Errors>({})
  const [serviceNote, setServiceNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [year] = useState(() => new Date().getFullYear())

  const menuRef = useRef<HTMLDivElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const statusRef = useRef<HTMLDivElement | null>(null)
  const prefilledRef = useRef('')

  /* ------------------------------ header state ---------------------------- */

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* --------------------------- scroll reveals ----------------------------- */

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-line]'),
    )
    const showAll = () => targets.forEach((el) => el.classList.add('is-visible'))

    if (typeof IntersectionObserver === 'undefined' || prefersReduced()) {
      showAll()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  /* --------------------------- dialog containment ------------------------- */

  useEffect(() => {
    if (!menuOpen || !menuRef.current) return
    return setupTrap(menuRef.current, () => setMenuOpen(false))
  }, [menuOpen])

  // Keyed on "is open" rather than the project, so stepping between cases only
  // re-renders content — the trap, scroll lock, and focus stay put.
  const modalOpen = activeProject !== null

  useEffect(() => {
    if (!modalOpen || !modalRef.current) return
    return setupTrap(modalRef.current, () => setActiveProject(null))
  }, [modalOpen])

  /* -------------------------------- navigation ---------------------------- */

  const goTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = window.matchMedia('(min-width: 768px)').matches ? 80 : 64
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset)
    window.scrollTo({ top, behavior: prefersReduced() ? 'auto' : 'smooth' })
    window.setTimeout(
      () => el.focus({ preventScroll: true }),
      prefersReduced() ? 30 : 520,
    )
  }

  const onNavClick = (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    setMenuOpen(false)
    goTo(id)
  }

  const onServiceClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    service: (typeof SERVICES)[number],
  ) => {
    event.preventDefault()
    setMenuOpen(false)
    setServiceNote(service.title)

    const subject = `${service.title} inquiry — `
    // Only take over the message field when it is empty or holds a previous subject.
    const prefill = form.message.trim() === '' || form.message === prefilledRef.current
    setForm((prev) => ({
      ...prev,
      projectType: prev.projectType || service.type,
      message: prefill ? subject : prev.message,
    }))
    if (prefill) prefilledRef.current = subject

    goTo('contact')
    window.setTimeout(
      () => nameRef.current?.focus({ preventScroll: true }),
      prefersReduced() ? 40 : 540,
    )
  }

  const focusForm = (event: ReactMouseEvent<HTMLElement>) => {
    event.preventDefault()
    goTo('contact')
    window.setTimeout(
      () => nameRef.current?.focus({ preventScroll: true }),
      prefersReduced() ? 40 : 540,
    )
  }

  /* ------------------------------- case studies --------------------------- */

  const openProject = (project: Project) => {
    setActiveProject(project)
  }

  const stepProject = (direction: -1 | 1) => {
    setActiveProject((current) => {
      if (!current) return current
      const i = PROJECTS.findIndex((p) => p.id === current.id)
      const next = (i + direction + PROJECTS.length) % PROJECTS.length
      return PROJECTS[next]
    })
  }

  /* ---------------------------------- form -------------------------------- */

  const setField = (key: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next: Errors = {}
    if (!form.name.trim()) next.name = 'Please add your name.'
    if (!form.email.trim()) next.email = 'Please add your email.'
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'That email address doesn’t look right.'
    if (!form.projectType) next.projectType = 'Choose a project type.'
    if (form.message.trim().length < 12) {
      next.message = 'A sentence or two about the project helps us route your note.'
    }
    setErrors(next)

    const keys = Object.keys(next) as FieldKey[]
    if (keys.length > 0) {
      document.getElementById(`field-${keys[0]}`)?.focus()
      return
    }

    setSubmitted(true)
    window.setTimeout(() => statusRef.current?.focus({ preventScroll: true }), 40)
  }

  const resetForm = () => {
    setSubmitted(false)
    setForm(EMPTY_FORM)
    setErrors({})
    setServiceNote('')
    prefilledRef.current = ''
    window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 40)
  }

  /* --------------------------------- markup -------------------------------- */

  const solidHeader = scrolled || menuOpen
  // While a dialog is open, hide the page behind it from assistive technology —
  // aria-modal alone is not honoured by every screen reader.
  const dialogOpen = menuOpen || activeProject !== null
  const shell = 'mx-auto w-full max-w-shell px-5 sm:px-8 lg:px-12'
  const sectionPad = 'py-20 md:py-28 lg:py-36'

  const eyebrow = (text: string, tone = 'text-ivory/75') => (
    <p
      className={`flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] sm:text-[10px] sm:tracking-[0.28em] ${tone}`}
    >
      <Asterisk className="h-3 w-3 shrink-0 text-signal" aria-hidden="true" />
      {text}
    </p>
  )

  const fieldError = (key: FieldKey, message?: string) =>
    message ? (
      <p id={`field-${key}-error`} role="alert" className="mt-2 text-xs text-signal">
        {message}
      </p>
    ) : null

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* ------------------------------- header ------------------------------ */}
      <header
        aria-hidden={dialogOpen ? true : undefined}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          solidHeader
            ? 'border-ivory/10 bg-ink/95 backdrop-blur-md'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className={`${shell} flex h-16 items-center justify-between gap-6 md:h-20`}>
          <a
            href="#top"
            onClick={(e) => onNavClick(e, 'top')}
            className="font-display display-caps text-xl tracking-[0.14em] text-ivory md:text-2xl"
          >
            AUREL
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex lg:gap-9">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => onNavClick(e, link.id)}
                className="group relative py-2 text-[11px] uppercase tracking-[0.22em] text-ivory/75 transition-colors hover:text-ivory focus-visible:text-ivory"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={(e) => onNavClick(e, 'contact')}
            className="hidden items-center gap-2 border border-ivory/45 px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory hover:text-ink md:inline-flex"
          >
            Start a project
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-ivory md:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* ----------------------------- mobile menu ---------------------------- */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        tabIndex={-1}
        className={`fixed inset-0 z-[60] flex flex-col bg-ink transition-[opacity,visibility] duration-300 md:hidden ${
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className={`${shell} flex h-16 items-center justify-between md:h-20`}>
          <span className="font-display display-caps text-xl tracking-[0.14em] text-ivory">
            AUREL
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-ivory hover:text-signal"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className={`${shell} flex flex-1 flex-col justify-center gap-1`}>
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => onNavClick(e, link.id)}
              style={menuOpen ? { animationDelay: `${90 + i * 70}ms` } : undefined}
              className={`border-b border-ivory/10 py-4 font-display display-caps text-[clamp(2.25rem,13vw,3.25rem)] leading-none text-ivory transition-colors hover:text-signal ${
                menuOpen ? 'animate-fadeUp' : ''
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={`${shell} pb-10 pt-6`} style={menuOpen ? { animationDelay: '400ms' } : undefined}>
          <a
            href="#contact"
            onClick={(e) => onNavClick(e, 'contact')}
            className={`flex items-center justify-between gap-3 bg-signal px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-ink ${
              menuOpen ? 'animate-fadeUp' : ''
            }`}
          >
            Start a project
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-ivory/50">
            Brand / Digital / Direction
          </p>
        </div>
      </div>

      <main id="main" tabIndex={-1} aria-hidden={dialogOpen ? true : undefined}>
        {/* -------------------------------- hero ------------------------------ */}
        <section
          id="top"
          tabIndex={-1}
          className="relative isolate min-h-[100svh] overflow-hidden bg-ink"
        >
          {videoFailed ? (
            <div
              aria-hidden="true"
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${unsplash(HERO_FALLBACK, 1600)})` }}
            />
          ) : (
            <video
              className="absolute inset-0 z-0 h-full w-full animate-slowZoom object-cover"
              src={HERO_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              tabIndex={-1}
              onError={() => setVideoFailed(true)}
            />
          )}

          {/* contrast scrims */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] bg-gradient-to-b from-ink/85 via-ink/25 to-ink/95"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] bg-gradient-to-r from-ink/85 via-ink/30 to-ink/10"
          />
          <div
            aria-hidden="true"
            className="grain absolute inset-0 z-[1] opacity-[0.16] mix-blend-overlay"
          />
          {gridLines('rgba(244, 239, 230, 0.07)')}

          <div
            className={`${shell} relative z-10 flex min-h-[100svh] flex-col pb-6 pt-24 md:pt-28`}
          >
            {/* top row: eyebrow + corner label */}
            <div className="flex items-start justify-between gap-6">
              <span className="animate-fadeUp" style={{ animationDelay: '60ms' }}>
                {eyebrow('Independent creative studio · Est. 2016', 'text-ivory/85')}
              </span>
              <p
                className="hidden animate-fadeUp text-right text-[10px] uppercase tracking-[0.3em] text-ivory/70 sm:block"
                style={{ animationDelay: '640ms' }}
              >
                Brand / Digital / Direction
              </p>
            </div>

            {/* headline */}
            <div className="flex flex-1 items-end pt-14">
              <h1 className="font-display display-caps text-[clamp(3rem,11vw,9rem)] leading-[0.88] tracking-[0.01em] text-ivory">
                <span className="block animate-fadeUp" style={{ animationDelay: '140ms' }}>
                  Make the
                </span>
                <span className="block animate-fadeUp" style={{ animationDelay: '230ms' }}>
                  Feeling
                </span>
                <span className="block animate-fadeUp" style={{ animationDelay: '320ms' }}>
                  Visible<span className="text-signal">.</span>
                </span>
              </h1>
            </div>

            {/* supporting copy + actions */}
            <div className="mt-8 grid gap-7 border-t border-ivory/15 pt-6 md:grid-cols-12 md:items-end md:gap-8 lg:mt-12">
              <p
                className="animate-fadeUp max-w-md text-base leading-relaxed text-ivory/85 md:col-span-5 md:text-lg lg:col-span-4"
                style={{ animationDelay: '440ms' }}
              >
                We build expressive identities and digital places for ideas moving culture forward.
              </p>
              <div
                className="animate-fadeUp flex flex-col gap-3 sm:flex-row md:col-span-7 md:justify-end lg:col-span-8"
                style={{ animationDelay: '540ms' }}
              >
                <a
                  href="#work"
                  onClick={(e) => onNavClick(e, 'work')}
                  className="group inline-flex items-center justify-center gap-3 whitespace-nowrap bg-ivory px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-signal md:px-6 lg:px-7"
                >
                  Explore our work
                  <ArrowDown
                    className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
                <a
                  href="#contact"
                  onClick={(e) => onNavClick(e, 'contact')}
                  className="inline-flex items-center justify-center gap-3 whitespace-nowrap border border-ivory/45 px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory hover:text-ink md:px-6 lg:px-7"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* bottom row: mobile corner label + scroll cue */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/60 sm:hidden">
                Brand / Digital / Direction
              </p>
              <a
                href="#work"
                onClick={(e) => onNavClick(e, 'work')}
                className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ivory/70 transition-colors hover:text-ivory"
              >
                <ArrowDown
                  className="h-4 w-4 animate-cueBounce text-signal"
                  aria-hidden="true"
                />
                Scroll
              </a>
              <p className="hidden text-[10px] uppercase tracking-[0.3em] text-ivory/55 sm:block">
                Brooklyn, NY — Worldwide
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------- selected work ------------------------- */}
        <section id="work" tabIndex={-1} className="relative bg-ivory-50 text-ink">
          <div className={`${shell} ${sectionPad}`}>
            <div className="grid gap-6 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7" {...reveal(0)}>
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink/60">
                  <Asterisk className="h-3 w-3 shrink-0 text-signal-700" aria-hidden="true" />
                  (01) — Selected work
                </p>
                <h2 className="mt-5 font-display display-caps text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9]">
                  Selected work
                </h2>
              </div>
              <p
                className="max-w-md text-base leading-relaxed text-ink/70 md:col-span-5 md:pb-3 md:text-lg"
                {...reveal(120)}
              >
                A few collaborations made to move people, ideas, and businesses forward.
              </p>
            </div>

            <div className="mt-14 flex flex-col gap-16 md:mt-24 md:gap-28">
              {PROJECTS.map((project, i) => {
                const media = picture(project.photoId, '(min-width: 768px) 56vw, 100vw')
                const flipped = i % 2 === 1
                return (
                  <article key={project.id} className="grid gap-6 md:grid-cols-12 md:items-center md:gap-10">
                    <div
                      className={`md:col-span-7 ${flipped ? 'md:order-2' : ''}`}
                      {...reveal(0)}
                    >
                      <button
                        type="button"
                        onClick={() => openProject(project)}
                        aria-label={`View case study: ${project.name}`}
                        className="group relative block w-full overflow-hidden bg-ink-800 text-left"
                      >
                        <span className="block aspect-[4/3] overflow-hidden md:aspect-[5/4]">
                          <img
                            {...media}
                            alt={project.alt}
                            width={1400}
                            height={1120}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                          />
                        </span>
                        <span
                          aria-hidden="true"
                          className={`absolute inset-0 ${project.tint}`}
                        />
                        <span
                          className={`absolute left-0 top-0 flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-[0.25em] ${project.badge}`}
                        >
                          <span className={project.tone}>{project.index}</span>
                          {project.category}
                        </span>
                      </button>
                    </div>

                    <div
                      className={`flex flex-col gap-4 md:col-span-5 md:gap-6 ${
                        flipped ? 'md:order-1' : ''
                      }`}
                      {...reveal(120)}
                    >
                      <h3 className="font-display display-caps text-[clamp(2rem,4.4vw,3.5rem)] leading-[0.95]">
                        {project.name}
                      </h3>
                      <p className="max-w-md text-base leading-relaxed text-ink/75 md:text-lg">
                        {project.summary}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-ink/60">
                        {project.services.map((service, si) => (
                          <span key={service} className="flex items-center gap-3">
                            {si > 0 && (
                              <span className="h-px w-4 bg-ink/30" aria-hidden="true" />
                            )}
                            {service}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center justify-between gap-4 border-t border-ink/15 pt-5">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-ink/60">
                          {project.year}
                        </span>
                        <button
                          type="button"
                          onClick={() => openProject(project)}
                          className="group inline-flex items-center gap-2 border border-ink px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-ink hover:text-ivory"
                        >
                          View case
                          <ArrowUpRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------- studio ----------------------------- */}
        <section id="studio" tabIndex={-1} className="relative bg-ink text-ivory">
          {gridLines('rgba(244, 239, 230, 0.05)')}
          <div className={`${shell} relative ${sectionPad}`}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-mist" {...reveal(0)}>
              (02) — Studio
            </p>

            <div className="mt-8 grid gap-10 md:grid-cols-12 md:gap-12">
              <h2
                className="font-display display-caps text-[clamp(2.25rem,5.6vw,4.75rem)] leading-[0.92] md:col-span-7"
                {...reveal(60)}
              >
                <span className="block">Small by choice.</span>
                <span className="block text-mist">Wide in perspective.</span>
              </h2>

              <div className="flex flex-col gap-5 md:col-span-5 md:pt-2" {...reveal(180)}>
                <p className="text-base leading-relaxed text-ivory/85 md:text-lg">
                  AUREL is a close-knit independent team that partners directly with founders and
                  in-house teams, shaping clear strategies and distinctive creative work from first
                  thought to final detail.
                </p>
                <p className="text-base leading-relaxed text-ivory/60">
                  No account layers, no handoffs to strangers. The people you meet are the people
                  who make the work, and we keep the team deliberately small so the thinking stays
                  close to the craft. Trusted specialists join when a project genuinely needs them.
                </p>
              </div>
            </div>

            <dl className="mt-14 border-t border-ivory/15 md:mt-20">
              {SNAPSHOT.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 border-b border-ivory/15 py-5 md:grid-cols-12 md:items-baseline md:gap-6 md:py-7"
                  {...reveal(0)}
                >
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-mist md:col-span-3">
                    {row.label}
                  </dt>
                  <dd className="text-lg text-ivory md:col-span-9 md:text-xl">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ------------------------------ services ---------------------------- */}
        <section id="services" tabIndex={-1} className="relative bg-ivory-50 text-ink">
          <div className={`${shell} ${sectionPad}`}>
            <div className="grid gap-6 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7" {...reveal(0)}>
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink/60">
                  <Asterisk className="h-3 w-3 shrink-0 text-signal-700" aria-hidden="true" />
                  (03) — Services
                </p>
                <h2 className="mt-5 font-display display-caps text-[clamp(2.25rem,6vw,4.75rem)] leading-[0.92]">
                  What we bring to the table
                </h2>
              </div>
              <p
                className="max-w-md text-base leading-relaxed text-ink/70 md:col-span-5 md:pb-3 md:text-lg"
                {...reveal(120)}
              >
                The right mix for the next chapter of your brand.
              </p>
            </div>

            <div className="mt-12 border-b border-ink/15 md:mt-16">
              {SERVICES.map((service) => (
                <a
                  key={service.number}
                  href="#contact"
                  onClick={(e) => onServiceClick(e, service)}
                  className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-2 border-t border-ink/15 px-2 py-6 transition-colors duration-300 hover:bg-ink hover:text-ivory md:-mx-4 md:px-4 md:py-9"
                  {...reveal(0)}
                >
                  <span className="col-span-2 text-[11px] tracking-[0.2em] text-signal-700 group-hover:text-signal md:col-span-1">
                    {service.number}
                  </span>
                  <h3 className="col-span-8 font-display display-caps text-[clamp(1.5rem,2.8vw,2.25rem)] leading-none md:col-span-4">
                    {service.title === 'Campaigns & content' ? (
                      <>
                        Campaigns{' '}
                        <span className="font-sans text-[0.78em] font-semibold italic">&amp;</span>{' '}
                        content
                      </>
                    ) : (
                      service.title
                    )}
                  </h3>
                  <span className="col-span-2 self-center justify-self-end md:order-1 md:self-baseline">
                    <ArrowRight
                      className="h-5 w-5 text-ink/70 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-signal"
                      aria-hidden="true"
                    />
                  </span>
                  <p className="col-span-12 mt-1 text-sm leading-relaxed text-ink/70 group-hover:text-ivory/75 md:col-span-5 md:mt-0 md:text-base">
                    {service.desc}
                  </p>
                  <span className="sr-only">— enquire about this service</span>
                </a>
              ))}
            </div>

            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-ink/65">
              Selecting a service carries the subject into your project note.
            </p>
          </div>
        </section>

        {/* ------------------------------- process ---------------------------- */}
        <section id="process" tabIndex={-1} className="relative bg-ink-800 text-ivory">
          {gridLines('rgba(244, 239, 230, 0.05)')}
          <div className={`${shell} relative ${sectionPad}`}>
            <div className="grid gap-6 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7" {...reveal(0)}>
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-mist">
                  <Asterisk className="h-3 w-3 shrink-0 text-signal" aria-hidden="true" />
                  (04) — Process
                </p>
                <h2 className="mt-5 font-display display-caps text-[clamp(2.25rem,6vw,4.75rem)] leading-[0.92]">
                  How the work moves
                </h2>
              </div>
              <p
                className="max-w-md text-base leading-relaxed text-ivory/70 md:col-span-5 md:pb-3 md:text-lg"
                {...reveal(120)}
              >
                Four steps, repeated until the work is ready — with you in the room for all of them.
              </p>
            </div>

            <div className="mt-14 hidden md:block" aria-hidden="true">
              <div className="relative h-px w-full bg-ivory/15">
                <div className="absolute inset-0 origin-left bg-signal" data-reveal-line="" />
              </div>
            </div>

            <ol className="mt-10 grid gap-8 md:mt-8 md:grid-cols-4 md:gap-8">
              {PROCESS.map((step, i) => (
                <li
                  key={step.number}
                  className="border-t border-ivory/15 pt-5 md:border-t-0 md:pt-0"
                  {...reveal(i * 110)}
                >
                  <p className="text-[11px] tracking-[0.25em] text-signal">{step.number}</p>
                  <h3 className="mt-3 font-display display-caps text-[clamp(1.5rem,2.4vw,2rem)] leading-none">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/65 md:text-base">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------- contact ---------------------------- */}
        <section id="contact" tabIndex={-1} className="relative bg-signal text-ink">
          {gridLines('rgba(11, 11, 12, 0.12)')}
          <div className={`${shell} relative ${sectionPad}`}>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-ink/85" {...reveal(0)}>
                  (05) — Contact
                </p>
                <p
                  className="mt-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-ink"
                  {...reveal(60)}
                >
                  <Asterisk className="h-3 w-3 shrink-0" aria-hidden="true" />
                  Have a good one in mind?
                </p>
                <h2
                  className="mt-5 font-display display-caps text-[clamp(2.5rem,7vw,5rem)] leading-[0.9]"
                  {...reveal(120)}
                >
                  Let’s make it matter.
                </h2>
                <p
                  className="mt-6 max-w-md text-base leading-relaxed text-ink/90 md:text-lg"
                  {...reveal(180)}
                >
                  Tell us what you’re building, where it’s stuck, and what good would look like. We
                  take on a handful of projects each season — thoughtful notes get thoughtful
                  replies.
                </p>
                <button
                  type="button"
                  onClick={focusForm}
                  className="group mt-8 inline-flex items-center gap-3 bg-ink px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors duration-300 hover:bg-ivory hover:text-ink sm:px-7"
                  {...reveal(240)}
                >
                  Tell us about it
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>

                <div
                  className="mt-10 max-w-md border-t border-ink/30 pt-5"
                  {...reveal(300)}
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] text-ink/85">Studio</p>
                  <p className="mt-2 text-base text-ink">Brooklyn, NY · Working everywhere</p>
                  <p className="mt-1 text-sm text-ink/85">Brand / Digital / Direction</p>
                </div>
              </div>

              <div className="lg:col-span-7" {...reveal(140)}>
                {submitted ? (
                  <div
                    ref={statusRef}
                    tabIndex={-1}
                    role="status"
                    className="relative flex h-full flex-col justify-center bg-ink p-6 text-ivory sm:p-8 md:p-10"
                  >
                    <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-signal">
                      <Asterisk className="h-3 w-3" aria-hidden="true" />
                      Received
                    </p>
                    <h3 className="mt-4 font-display display-caps text-[clamp(1.75rem,3.4vw,2.75rem)] leading-none">
                      Thank you, {form.name.trim().split(' ')[0]}.
                    </h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-ivory/75">
                      Your note passed validation and is ready to send. This site is a portfolio
                      prototype, so nothing left your browser — no data was transmitted or stored.
                    </p>
                    <p className="mt-3 text-sm text-ivory/55">
                      {form.projectType} · {form.email.trim()}
                    </p>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="mt-8 inline-flex w-fit items-center gap-2 border border-ivory/45 px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors duration-300 hover:bg-ivory hover:text-ink"
                    >
                      Write another note
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <form
                    id="inquiry-form"
                    noValidate
                    onSubmit={onSubmit}
                    aria-labelledby="form-title"
                    className="relative overflow-hidden bg-ink p-6 text-ivory sm:p-8 md:p-10"
                  >
                    <h3 id="form-title" className="font-display display-caps text-2xl leading-none">
                      Project inquiry
                    </h3>
                    <p className="mt-2 text-sm text-ivory/60">
                      Four fields. Nothing stored, nothing subscribed.
                    </p>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="field-name"
                          className="block text-[10px] uppercase tracking-[0.28em] text-ivory/60"
                        >
                          Name
                        </label>
                        <input
                          id="field-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          ref={nameRef}
                          value={form.name}
                          onChange={(e) => setField('name', e.target.value)}
                          placeholder="Your name"
                          aria-invalid={errors.name ? true : undefined}
                          aria-describedby={errors.name ? 'field-name-error' : undefined}
                          className={`mt-2 w-full border-b bg-transparent py-3 text-base text-ivory placeholder:text-ivory/50 focus:border-signal ${
                            errors.name ? 'border-signal' : 'border-ivory/25'
                          }`}
                        />
                        {fieldError('name', errors.name)}
                      </div>

                      <div>
                        <label
                          htmlFor="field-email"
                          className="block text-[10px] uppercase tracking-[0.28em] text-ivory/60"
                        >
                          Email
                        </label>
                        <input
                          id="field-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={form.email}
                          onChange={(e) => setField('email', e.target.value)}
                          placeholder="you@studio.com"
                          aria-invalid={errors.email ? true : undefined}
                          aria-describedby={errors.email ? 'field-email-error' : undefined}
                          className={`mt-2 w-full border-b bg-transparent py-3 text-base text-ivory placeholder:text-ivory/50 focus:border-signal ${
                            errors.email ? 'border-signal' : 'border-ivory/25'
                          }`}
                        />
                        {fieldError('email', errors.email)}
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="field-projectType"
                          className="block text-[10px] uppercase tracking-[0.28em] text-ivory/60"
                        >
                          Project type
                        </label>
                        <select
                          id="field-projectType"
                          name="projectType"
                          required
                          value={form.projectType}
                          onChange={(e) => setField('projectType', e.target.value)}
                          aria-invalid={errors.projectType ? true : undefined}
                          aria-describedby={
                            errors.projectType ? 'field-projectType-error' : undefined
                          }
                          className={`mt-2 w-full border-b bg-ink-800 py-3 text-base text-ivory focus:border-signal ${
                            errors.projectType ? 'border-signal' : 'border-ivory/25'
                          }`}
                        >
                          <option value="">Select a project type</option>
                          {PROJECT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        {fieldError('projectType', errors.projectType)}
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="field-message"
                          className="block text-[10px] uppercase tracking-[0.28em] text-ivory/60"
                        >
                          About the project
                        </label>
                        <textarea
                          id="field-message"
                          name="message"
                          rows={4}
                          required
                          value={form.message}
                          onChange={(e) => setField('message', e.target.value)}
                          placeholder="What are you making, and when does it need to be in the world?"
                          aria-invalid={errors.message ? true : undefined}
                          aria-describedby={errors.message ? 'field-message-error' : undefined}
                          className={`mt-2 w-full resize-y border-b bg-transparent py-3 text-base leading-relaxed text-ivory placeholder:text-ivory/50 focus:border-signal ${
                            errors.message ? 'border-signal' : 'border-ivory/25'
                          }`}
                        />
                        {fieldError('message', errors.message)}
                      </div>
                    </div>

                    {serviceNote && (
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-ivory/15 px-4 py-3">
                        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-signal">
                          <Asterisk className="h-3 w-3 shrink-0" aria-hidden="true" />
                          Subject: {serviceNote} inquiry
                        </p>
                        <button
                          type="button"
                          onClick={() => setServiceNote('')}
                          className="flex h-8 w-8 items-center justify-center text-ivory/60 hover:text-ivory"
                          aria-label="Clear selected service subject"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="group mt-8 inline-flex w-full items-center justify-center gap-3 bg-signal px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-ivory sm:w-auto"
                    >
                      Send the note
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* -------------------------------- footer ------------------------------ */}
      <footer className="relative bg-ink text-ivory" aria-hidden={dialogOpen ? true : undefined}>
        <div className={`${shell} py-14 md:py-20`}>
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-6">
              <p className="font-display display-caps text-[clamp(2.75rem,10vw,6.5rem)] leading-none">
                AUREL<span className="text-signal">.</span>
              </p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/65 md:text-base">
                Independent by nature. Collaborative by design.
              </p>
            </div>

            <nav aria-label="Footer" className="md:col-span-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-mist">Index</p>
              <ul className="mt-4 flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => onNavClick(e, link.id)}
                      className="inline-flex py-1 text-sm text-ivory/75 transition-colors hover:text-signal"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="md:col-span-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-mist">Elsewhere</p>
              <ul className="mt-4 flex flex-col gap-2">
                <li>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-1 text-sm text-ivory/75 transition-colors hover:text-signal"
                  >
                    Instagram
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-1 text-sm text-ivory/75 transition-colors hover:text-signal"
                  >
                    LinkedIn
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-ivory/15 pt-6 text-[11px] uppercase tracking-[0.18em] text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} AUREL — Brooklyn, NY</p>
            <p className="text-ivory/60">Make the feeling visible.</p>
          </div>
        </div>
      </footer>

      {/* ----------------------------- case study modal ----------------------- */}
      {activeProject && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4 md:p-6">
          <div
            aria-hidden="true"
            onClick={() => setActiveProject(null)}
            className="absolute inset-0 bg-ink/85 backdrop-blur-sm"
          />
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            tabIndex={-1}
            className="animate-fadeUp relative flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden bg-ivory-50 text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-ink/15 px-5 py-3 md:px-8">
              <p className="truncate text-[10px] uppercase tracking-[0.28em] text-ink/60">
                {activeProject.index} — Case study · {activeProject.year}
              </p>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                aria-label="Close case study"
                className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-ink transition-colors hover:text-signal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-8 md:py-8">
              <div className="relative overflow-hidden bg-ink-800">
                <img
                  key={activeProject.photoId}
                  {...picture(
                    activeProject.photoId,
                    '(min-width: 768px) 64vw, calc(100vw - 40px)',
                  )}
                  alt={activeProject.alt}
                  width={1400}
                  height={875}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                  className="aspect-[16/10] w-full object-cover"
                />
                <span aria-hidden="true" className={`absolute inset-0 ${activeProject.tint}`} />
              </div>

              <h2
                id="case-title"
                className="mt-6 font-display display-caps text-[clamp(2rem,5vw,3.25rem)] leading-none"
              >
                {activeProject.name}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/75 md:text-lg">
                {activeProject.summary}
              </p>

              <dl className="mt-6 grid gap-5 border-y border-ink/15 py-5 sm:grid-cols-3">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.28em] text-ink/60">Year</dt>
                  <dd className="mt-1 text-sm text-ink">{activeProject.year}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.28em] text-ink/60">Services</dt>
                  <dd className="mt-1 text-sm text-ink">{activeProject.services.join(', ')}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.28em] text-ink/60">
                    Discipline
                  </dt>
                  <dd className="mt-1 text-sm text-ink">{activeProject.category}</dd>
                </div>
              </dl>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {[
                  { label: 'The brief', body: activeProject.brief },
                  { label: 'The approach', body: activeProject.approach },
                  { label: 'The result', body: activeProject.result },
                ].map((block) => (
                  <div key={block.label}>
                    <h3 className="text-[10px] uppercase tracking-[0.28em] text-signal-700">
                      {block.label}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">{block.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-ink/15 pt-6">
                <h3 className="text-[10px] uppercase tracking-[0.28em] text-ink/60">
                  Deliverables
                </h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {activeProject.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
                      <Asterisk
                        className="mt-1 h-3 w-3 shrink-0 text-signal-700"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 pt-6">
                <button
                  type="button"
                  onClick={() => stepProject(-1)}
                  className="group inline-flex items-center gap-2 border border-ink/40 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-ivory"
                >
                  <ArrowLeft
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                  Previous case
                </button>
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="inline-flex items-center gap-2 px-3 py-3 text-[11px] uppercase tracking-[0.18em] text-ink/70 transition-colors hover:text-signal"
                >
                  Close case study
                </button>
                <button
                  type="button"
                  onClick={() => stepProject(1)}
                  className="group inline-flex items-center gap-2 border border-ink/40 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-ivory"
                >
                  Next case
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
