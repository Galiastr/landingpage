import type { Project } from './projects'

export type PresetSlug = 'home' | 'porting' | 'arcades' | 'mobile' | 'multiplayer' | 'leadership' | 'educational'

export type PortfolioPreset = {
  slug: PresetSlug
  path: string
  label: string
  title: string
  description: string
  projectIds: string[]
  seoTitle: string
  seoDescription: string
}

export const portfolioPresets: Record<PresetSlug, PortfolioPreset> = {
  home: {
    slug: 'home', path: '/', label: 'Selected', title: 'Selected case studies',
    description: 'A focused cross-section of production ownership, technical leadership and multi-platform delivery.',
    projectIds: ['cricket-manager-pro', 'relentless', 'manic-miner'],
    seoTitle: 'Stanislav Sorokin — Senior Unity Developer & Technical Lead',
    seoDescription: 'Senior Unity Developer and Technical Lead with 18+ years in production, mobile games, multiplayer systems and console porting.',
  },
  porting: {
    slug: 'porting', path: '/porting', label: 'Porting', title: 'Console & PC porting',
    description: 'Unity games adapted for PlayStation, Xbox, Nintendo Switch and Steam with release-focused debugging and optimization.',
    projectIds: ['manic-miner', 'boulder-dash-40', 'astrosmash'],
    seoTitle: 'Unity Console Porting — PlayStation, Xbox, Switch & Steam | Stanislav Sorokin',
    seoDescription: 'Selected Unity console and PC porting work for PlayStation, Xbox, Nintendo Switch and Steam.',
  },
  arcades: {
    slug: 'arcades', path: '/arcades', label: 'Arcades', title: 'Arcade games & classic franchises',
    description: 'Modern adaptations and releases built around established arcade mechanics and recognizable game franchises.',
    projectIds: ['boulder-dash-40', 'dynablaster', 'shark-shark'],
    seoTitle: 'Unity Arcade Games & Classic Franchise Development | Stanislav Sorokin',
    seoDescription: 'Selected Unity arcade game adaptations and modern releases, including Boulder Dash, Dynablaster and Shark! Shark!',
  },
  mobile: {
    slug: 'mobile', path: '/mobile', label: 'Mobile', title: 'Mobile games built for market',
    description: 'Production-ready mobile games spanning live sports, idle economies, seasonal content and connected play.',
    projectIds: ['cricket-manager-pro', 'idle-king', 'christmas-sweeper-4'],
    seoTitle: 'Senior Unity Mobile Game Developer | Stanislav Sorokin',
    seoDescription: 'Selected Unity mobile game development across iOS, Android, free-to-play systems, live products and technical leadership.',
  },
  multiplayer: {
    slug: 'multiplayer', path: '/multiplayer', label: 'Multiplayer', title: 'Connected & multiplayer games',
    description: 'Online game systems, competitive play and connected experiences built for durable production use.',
    projectIds: ['cricket-manager-pro', 'crash-io', 'sudoku-social'],
    seoTitle: 'Unity Multiplayer Game Development | Stanislav Sorokin',
    seoDescription: 'Selected Unity multiplayer and connected-game work across mobile, real-time action and cross-play systems.',
  },
  leadership: {
    slug: 'leadership', path: '/leadership', label: 'Leadership', title: 'Technical leadership in production',
    description: 'Hands-on Unity leadership across architecture, gameplay, multidisciplinary teams and product delivery.',
    projectIds: ['cricket-manager-pro', 'relentless', 'the-longest-tale'],
    seoTitle: 'Unity Technical Lead & Lead Game Developer | Stanislav Sorokin',
    seoDescription: 'Selected technical leadership work across Unity architecture, gameplay, production management and multidisciplinary teams.',
  },
  educational: {
    slug: 'educational', path: '/educational', label: 'Educational', title: 'Educational & interactive experiences',
    description: 'Games and interactive products designed around learning, accessibility and meaningful player feedback.',
    projectIds: ['applemat', 'einstein-brain-trainer', 'kids-fish'],
    seoTitle: 'Unity Educational Games & Interactive Experiences | Stanislav Sorokin',
    seoDescription: 'Selected Unity educational games and interactive learning experiences for mobile and installations.',
  },
}

const slugs = new Set<PresetSlug>(Object.keys(portfolioPresets) as PresetSlug[])

export function presetFromLocation(location: Pick<Location, 'pathname' | 'hash'>): PortfolioPreset {
  const hashSlug = location.hash.replace(/^#\/?/, '').split('/')[0].toLowerCase() as PresetSlug
  if (slugs.has(hashSlug) && hashSlug !== 'home') return portfolioPresets[hashSlug]
  const pathSlug = location.pathname.replace(/^\/+|\/+$/g, '').split('/')[0].toLowerCase() as PresetSlug
  return slugs.has(pathSlug) ? portfolioPresets[pathSlug] : portfolioPresets.home
}

export function projectIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/project\/([^/]+)\/?$/)
  if (!match) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return null
  }
}

export function projectsForPreset(preset: PortfolioPreset, projects: Project[]): Project[] {
  return preset.projectIds.map(id => projects.find(project => project.id === id)).filter((project): project is Project => Boolean(project))
}
