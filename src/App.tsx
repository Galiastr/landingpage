import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { projects, type Project } from './projects'
import { portfolioPresets, presetFromLocation, projectIdFromPath, projectsForPreset, type PresetSlug } from './portfolioPresets'

type FilterGroup = 'engagement' | 'genre' | 'platforms' | 'capabilities'

type FilterState = Record<FilterGroup, string>
const emptyFilters: FilterState = { engagement: 'All', genre: 'All', platforms: 'All', capabilities: 'All' }

const Arrow = () => <svg aria-hidden="true" viewBox="0 0 18 18"><path d="M4 14 14 4M6 4h8v8" /></svg>
const Close = () => <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m5 5 10 10M15 5 5 15" /></svg>

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return <label className="filter-select">
    <span>{label}</span>
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option>All</option>
      {options.map(option => <option key={option}>{option}</option>)}
    </select>
  </label>
}

function ProjectCard({ project, onOpen, featured = false }: { project: Project; onOpen: () => void; featured?: boolean }) {
  return <article className={`project-card ${featured ? 'project-card--featured' : ''}`}>
    <button className="project-card__open" onClick={onOpen} aria-label={`Open ${project.title} case study`}>
      <span className="project-card__visual">
        <img src={project.image} alt="" loading={featured ? 'eager' : 'lazy'} style={{ objectPosition: project.imagePosition }} onError={e => { e.currentTarget.style.display = 'none' }} />
        <span className="project-card__index" aria-hidden="true">{projects.indexOf(project) + 1 < 10 ? '0' : ''}{projects.indexOf(project) + 1}</span>
        <span className="project-card__engagement">{project.engagement}</span>
      </span>
      <span className="project-card__body">
        <span className="project-card__kicker">{project.kicker}</span>
        <span className="project-card__title-row"><strong>{project.title}</strong><Arrow /></span>
        <span className="project-card__summary">{project.description}</span>
        <span className="tag-row">{[project.genre, ...project.platforms.slice(0, 2)].map(tag => <span key={tag}>{tag}</span>)}</span>
      </span>
    </button>
  </article>
}

function ProjectDialog({ project, projectContext, onClose, onNavigate }: { project: Project; projectContext: Project[]; onClose: () => void; onNavigate: (project: Project) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const media = project.media?.length ? project.media : [{ type: 'image' as const, src: project.image, alt: `${project.title} project artwork` }]
  const [activeMedia, setActiveMedia] = useState(0)
  const selectedMedia = media[activeMedia] ?? media[0]
  const projectIndex = projectContext.findIndex(item => item.id === project.id)
  const previousProject = projectContext.length > 1 ? projectContext[(projectIndex - 1 + projectContext.length) % projectContext.length] : null
  const nextProject = projectContext.length > 1 ? projectContext[(projectIndex + 1) % projectContext.length] : null

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const background = [...document.querySelectorAll<HTMLElement>('.site-header, main, footer')]
    background.forEach(element => { element.inert = true })
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), video[controls], iframe, [tabindex]:not([tabindex="-1"])')]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      background.forEach(element => { element.inert = false })
      window.removeEventListener('keydown', onKey)
      previousFocus?.focus()
    }
  }, [onClose])

  return <div className="dialog-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section ref={dialogRef} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <button ref={closeRef} className="dialog-close" onClick={onClose} aria-label="Close case study"><Close /></button>
      <div className="dialog-gallery">
        <p className="sr-only" aria-live="polite" aria-atomic="true">Showing {selectedMedia.type} {activeMedia + 1} of {media.length}</p>
        <div className="dialog-media">
          {selectedMedia.type === 'image' && <img src={selectedMedia.src} alt={selectedMedia.alt ?? `${project.title} screenshot ${activeMedia + 1}`} />}
          {selectedMedia.type === 'video' && <video key={selectedMedia.src} src={selectedMedia.src} poster={selectedMedia.poster} controls playsInline preload="metadata">Your browser does not support embedded video.</video>}
          {selectedMedia.type === 'youtube' && <iframe src={selectedMedia.src} title={`${project.title} video`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />}
        </div>
        {media.length > 1 && <div className="dialog-thumbnails" aria-label={`${project.title} media gallery`}>
          {media.map((item, index) => <button key={`${item.src}-${index}`} className={index === activeMedia ? 'is-active' : ''} onClick={() => setActiveMedia(index)} aria-label={`Show ${item.type} ${index + 1}`} aria-pressed={index === activeMedia}>
            {item.type === 'image' ? <img src={item.src} alt="" loading="lazy" /> : item.poster ? <img src={item.poster} alt="" loading="lazy" /> : <span>▶<small>Video</small></span>}
          </button>)}
        </div>}
      </div>
      <div className="dialog-content">
        <p className="eyebrow">{project.kicker}</p>
        <h2 id="dialog-title">{project.title}</h2>
        <p className="dialog-lede">{project.description}</p>
        <div className="dialog-section"><h3>My contribution</h3><p>{project.contribution}</p></div>
        <div className="dialog-meta">
          <div><span>Engagement</span><strong>{project.engagement}</strong></div>
          <div><span>Platforms</span><strong>{project.platforms.join(' · ')}</strong></div>
          <div><span>Focus</span><strong>{project.capabilities.slice(0, 2).join(' · ')}</strong></div>
        </div>
        <div className="dialog-tags">{project.capabilities.map(tag => <span key={tag}>{tag}</span>)}</div>
        {!!project.storeLinks?.length && <div className="store-links"><h3>Available on</h3><div>
          {project.storeLinks?.map(link => <a key={`${link.platform}-${link.url}`} href={link.url} target="_blank" rel="noreferrer">{link.platform}<Arrow /></a>)}
        </div></div>}
        <p className="release-status"><span>Release status</span><strong>{project.releaseStatus ?? (project.storeLinks?.length ? 'Released' : 'Unpublished')}</strong></p>
        {previousProject && nextProject && <nav className="project-navigation" aria-label="Project navigation">
          <button onClick={() => onNavigate(previousProject)} aria-label={`Previous project: ${previousProject.title}`}><span>Previous project</span><strong>← {previousProject.title}</strong></button>
          <button onClick={() => onNavigate(nextProject)} aria-label={`Next project: ${nextProject.title}`}><span>Next project</span><strong>{nextProject.title} →</strong></button>
        </nav>}
      </div>
    </section>
  </div>
}

function App() {
  const initialProject = projects.find(project => project.id === projectIdFromPath(window.location.pathname)) ?? null
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const [search, setSearch] = useState('')
  const [, setRouteVersion] = useState(0)
  const [selected, setSelected] = useState<Project | null>(initialProject)
  const [selectedContext, setSelectedContext] = useState<Project[]>(projects)
  const historyReturnPath = projectIdFromPath(window.location.pathname) ? (window.history.state as { returnPath?: string } | null)?.returnPath : null
  const presetLocation = historyReturnPath ? new URL(historyReturnPath, window.location.origin) : window.location
  const preset = presetFromLocation(presetLocation)
  const returnPathRef = useRef(historyReturnPath ?? preset.path)
  const featuredProjects = useMemo(() => projectsForPreset(preset, projects), [preset])
  const options = useMemo(() => ({
    engagement: [...new Set(projects.map(p => p.engagement))].sort(),
    genre: [...new Set(projects.map(p => p.genre))].sort(),
    platforms: [...new Set(projects.flatMap(p => p.platforms))].sort(),
    capabilities: [...new Set(projects.flatMap(p => p.capabilities))].sort(),
  }), [])
  const results = useMemo(() => projects.filter(project => {
    const query = search.trim().toLowerCase()
    const searchable = [project.title, project.description, project.contribution, project.genre, ...project.platforms, ...project.capabilities].join(' ').toLowerCase()
    return (!query || searchable.includes(query)) &&
      (filters.engagement === 'All' || project.engagement === filters.engagement) &&
      (filters.genre === 'All' || project.genre === filters.genre) &&
      (filters.platforms === 'All' || project.platforms.includes(filters.platforms)) &&
      (filters.capabilities === 'All' || project.capabilities.includes(filters.capabilities))
  }), [filters, search])
  const activeFilterCount = Object.values(filters).filter(v => v !== 'All').length + (search.trim() ? 1 : 0)

  const openProject = useCallback((project: Project, context: Project[]) => {
    const returnPath = projectIdFromPath(window.location.pathname) ? returnPathRef.current : `${window.location.pathname}${window.location.hash}`
    returnPathRef.current = returnPath
    setSelected(project)
    setSelectedContext(context)
    window.history.pushState({ portfolioModal: true, returnPath }, '', `/project/${encodeURIComponent(project.id)}`)
    setRouteVersion(version => version + 1)
  }, [])

  const navigateProject = useCallback((project: Project) => {
    setSelected(project)
    window.history.replaceState({ portfolioModal: true, returnPath: returnPathRef.current }, '', `/project/${encodeURIComponent(project.id)}`)
    setRouteVersion(version => version + 1)
  }, [])

  const closeProject = useCallback(() => {
    setSelected(null)
    window.history.replaceState({}, '', returnPathRef.current)
    setRouteVersion(version => version + 1)
  }, [])

  const navigatePreset = useCallback((slug: PresetSlug) => {
    const nextPreset = portfolioPresets[slug]
    returnPathRef.current = nextPreset.path
    window.history.pushState({}, '', nextPreset.path)
    setRouteVersion(version => version + 1)
  }, [])

  useEffect(() => {
    const syncRoute = () => {
      const projectId = projectIdFromPath(window.location.pathname)
      const returnPath = (window.history.state as { returnPath?: string } | null)?.returnPath
      if (returnPath) returnPathRef.current = returnPath
      else if (!projectId) returnPathRef.current = `${window.location.pathname}${window.location.hash}`
      setSelected(projects.find(project => project.id === projectId) ?? null)
      if (!projectId) setSelectedContext(projects)
      setRouteVersion(version => version + 1)
    }
    window.addEventListener('popstate', syncRoute)
    window.addEventListener('hashchange', syncRoute)
    return () => {
      window.removeEventListener('popstate', syncRoute)
      window.removeEventListener('hashchange', syncRoute)
    }
  }, [])

  useEffect(() => {
    const canonicalPath = selected ? `/project/${selected.id}` : preset.path
    const title = selected ? `${selected.title} — Unity Project | Stanislav Sorokin` : preset.seoTitle
    const description = selected ? `${selected.description} ${selected.contribution}` : preset.seoDescription
    document.title = title
    const setMeta = (selector: string, value: string) => document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value)
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://stanislavsorokin.com${canonicalPath}`)
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', `https://stanislavsorokin.com${canonicalPath}`)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
    const schemaId = 'portfolio-structured-data'
    let schema = document.getElementById(schemaId) as HTMLScriptElement | null
    if (!schema) {
      schema = document.createElement('script')
      schema.id = schemaId
      schema.type = 'application/ld+json'
      document.head.appendChild(schema)
    }
    schema.textContent = JSON.stringify(selected ? {
      '@context': 'https://schema.org', '@type': 'CreativeWork', name: selected.title,
      description: selected.description, url: `https://stanislavsorokin.com${canonicalPath}`,
      creator: { '@type': 'Person', name: 'Stanislav Sorokin', jobTitle: 'Senior Unity Developer and Technical Lead' },
      keywords: [selected.genre, ...selected.platforms, ...selected.capabilities].join(', '),
    } : {
      '@context': 'https://schema.org', '@type': 'ProfilePage', name: title,
      url: `https://stanislavsorokin.com${canonicalPath}`, description,
      mainEntity: { '@type': 'Person', name: 'Stanislav Sorokin', jobTitle: 'Senior Unity Developer and Technical Lead',
        knowsAbout: ['Unity', 'C#', 'Console game porting', 'PlayStation development', 'Xbox development', 'Nintendo Switch development', 'Steam releases', 'Mobile game development', 'Multiplayer games', 'Technical leadership'] },
    })
  }, [preset, selected])

  return <>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Stanislav Sorokin — home"><span>SS</span><strong>Stanislav Sorokin</strong></a>
      <nav aria-label="Primary navigation"><a href="#work">Work</a><a href="#expertise">Expertise</a><a href="#contact">Contact</a></nav>
      <a className="availability" href="mailto:stansorokin14@gmail.com"><span className="availability__dot" aria-hidden="true"></span><span className="availability__full">Available for selected projects</span><span className="availability__compact">Available</span></a>
    </header>

    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__main">
          <p className="eyebrow">Senior Unity Developer · Technical Lead</p>
          <h1 id="hero-title"><span className="sr-only">Senior Unity Developer and Technical Lead — </span>Games built to play.<br/><em>Systems built to ship.</em></h1>
          <p className="hero__lede">18+ years turning ambitious game ideas into production-ready Unity experiences — from mobile F2P and multiplayer to console porting.</p>
          <div className="hero__actions"><a className="primary-button" href="#featured-work">View featured case studies</a><a className="text-link" href="mailto:stansorokin14@gmail.com">Discuss a project <Arrow /></a></div>
        </div>
        <aside className="hero__rail" aria-label="Core expertise">
          <div><span>01</span><strong>Unity production</strong><p>Gameplay, architecture, tools, optimization</p></div>
          <div><span>02</span><strong>Console delivery</strong><p>PlayStation, Xbox, Nintendo Switch, Steam</p></div>
          <div><span>03</span><strong>Technical leadership</strong><p>From rapid prototype to shipped product</p></div>
        </aside>
      </section>

      <section id="featured-work" className="featured-showcase" aria-labelledby="featured-title">
        <div className="featured-showcase__heading">
          <div><p className="eyebrow">Curated portfolio</p><h2 id="featured-title">{preset.title}</h2></div>
          <p>{preset.description}</p>
        </div>
        <nav className="featured-presets" aria-label="Featured portfolio views">
          {(Object.keys(portfolioPresets) as PresetSlug[]).filter(slug => ['home', 'porting', 'arcades', 'mobile', 'leadership'].includes(slug)).map(slug => {
            const item = portfolioPresets[slug]
            return <a key={slug} href={item.path} className={preset.slug === slug ? 'is-active' : ''} aria-current={preset.slug === slug ? 'page' : undefined} onClick={event => { event.preventDefault(); navigatePreset(slug) }}>{item.label}</a>
          })}
        </nav>
        <div className="featured" aria-label={`${preset.title} projects`}>
          {featuredProjects.map((project, index) => <ProjectCard key={project.id} project={project} featured={index === 0} onOpen={() => openProject(project, featuredProjects)} />)}
        </div>
      </section>

      <section id="work" className="work-section" aria-labelledby="work-title">
        <div className="section-heading"><div><p className="eyebrow">Selected work / 2007—2026</p><h2 id="work-title">Project archive</h2></div><p>Filter by delivery model, genre, platform or capability. Every project opens into a focused contribution view.</p></div>
        <div className="filter-bar">
          <label className="search-field"><span>Search projects</span><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Title, technology, genre…" /></label>
          {(Object.keys(filters) as FilterGroup[]).map(group => <FilterSelect key={group} label={group === 'platforms' ? 'Platform' : group === 'capabilities' ? 'Capability' : group[0].toUpperCase() + group.slice(1)} value={filters[group]} options={options[group]} onChange={value => setFilters(current => ({ ...current, [group]: value }))} />)}
          {activeFilterCount > 0 && <button className="clear-filters" onClick={() => { setFilters(emptyFilters); setSearch('') }}>Clear {activeFilterCount}</button>}
        </div>
        <div className="results-line" aria-live="polite"><span>{results.length} project{results.length === 1 ? '' : 's'}</span><span>Curated from CV, publisher and team portfolio sources</span></div>
        {results.length ? <div className="project-grid">{results.map(project => <ProjectCard key={project.id} project={project} onOpen={() => openProject(project, results)} />)}</div> : <div className="empty-state"><h3>No exact match.</h3><p>Clear one or more filters to broaden the archive.</p><button onClick={() => { setFilters(emptyFilters); setSearch('') }}>Reset filters</button></div>}
      </section>

      <section id="expertise" className="expertise" aria-labelledby="expertise-title">
        <div className="section-heading section-heading--light"><div><p className="eyebrow">How I work</p><h2 id="expertise-title">Hands-on depth.<br/>Lead-level range.</h2></div><p>Useful when the challenge crosses gameplay, production, platforms and people — not just one isolated feature.</p></div>
        <div className="expertise-grid">
          <article><span>01</span><h3>Unity & C# production</h3><p>Gameplay systems, UI, animation, Cinemachine, VFX, shaders, ScriptableObjects, debugging and performance.</p></article>
          <article><span>02</span><h3>Rapid product iteration</h3><p>Playable prototypes, mechanic variations, balancing experiments and production-ready feature delivery.</p></article>
          <article><span>03</span><h3>Tools & automation</h3><p>Custom Editors, Inspectors and EditorWindows, plus AI-agent workflows for analysis, documentation and R&D.</p></article>
          <article><span>04</span><h3>Connected experiences</h3><p>Mirror and Photon networking, Node.js simulation, AWS persistence, mobile, console, AR and VR.</p></article>
        </div>
      </section>

      <section id="contact" className="contact" aria-labelledby="contact-title">
        <p className="eyebrow">Start a conversation</p>
        <h2 id="contact-title">Need senior Unity delivery<br/>without the hand-holding?</h2>
        <p>Available for technical leadership, co-development, focused production support and multi-platform porting.</p>
        <a className="contact-email" href="mailto:stansorokin14@gmail.com">stansorokin14@gmail.com <Arrow /></a>
        <div className="contact-meta"><span>Gdańsk, Poland</span><span>Remote · Worldwide</span><span>English · Ukrainian · Polish</span></div>
      </section>
    </main>

    <footer><span>© {new Date().getFullYear()} Stanislav Sorokin</span><span>Senior Unity Developer / Technical Lead</span><a href="#top">Back to top ↑</a></footer>
    {selected && <ProjectDialog key={selected.id} project={selected} projectContext={selectedContext} onClose={closeProject} onNavigate={navigateProject} />}
  </>
}

export default App
