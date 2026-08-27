import { mediaFor } from './projectMedia'

export type MediaItem = {
  type: 'image' | 'video' | 'youtube'
  src: string
  poster?: string
  alt?: string
}

export type StoreLink = {
  platform: 'Steam' | 'Xbox' | 'PlayStation' | 'Nintendo Switch' | 'Google Play' | 'App Store' | 'Official site'
  url: string
}

export type Project = {
  id: string
  title: string
  kicker: string
  description: string
  contribution: string
  engagement: 'Full production' | 'Co-development' | 'Porting' | 'Technical leadership'
  genre: string
  platforms: string[]
  capabilities: string[]
  image: string
  imagePosition?: string
  media?: MediaItem[]
  storeLinks?: StoreLink[]
  internalSource?: string
  featured?: boolean
  evidence: 'CV + public source' | 'CV' | 'Owner-attested + publisher' | 'Team portfolio'
}

type ProjectInput = Omit<Project, 'image' | 'media'> & { fallbackImage?: string }

function project(input: ProjectInput): Project {
  const { fallbackImage = '/projects/chase-the-sun.jpg', ...data } = input
  const media = mediaFor(input.id)
  const cover = media.find(item => item.type === 'image')?.src ?? fallbackImage
  return { ...data, image: cover, media: media.length ? media : [{ type: 'image', src: cover }] }
}

const teamContribution = 'Game development contribution as part of the GrandDevs team; exact personal scope can be expanded with owner-approved production details.'
const teamDesignContribution = 'Game development and design contribution as part of the GrandDevs team; exact personal scope can be expanded with owner-approved production details.'

export const projects: Project[] = [
  project({
    id: 'cricket-manager-pro', title: 'Cricket Manager Pro', kicker: 'Sports management · Live product',
    description: 'A mobile cricket-management game built from MVP through production and market launch.',
    contribution: 'CTO / Lead Unity Developer. Product and technical ownership across gameplay, balancing, feature priorities, architecture and rapid iteration with multidisciplinary teams.',
    engagement: 'Full production', genre: 'Sports management', platforms: ['iOS', 'Android'], capabilities: ['Unity', 'Gameplay', 'Architecture', 'LiveOps', 'Leadership'],
    internalSource: 'https://cricketmanagerpro.com', featured: true, evidence: 'CV + public source'
  }),
  project({
    id: 'relentless', title: 'Relentless', kicker: 'Trading card game · Web3',
    description: 'A digital trading-card game with player-owned cards, a marketplace and cross-platform ambitions.',
    contribution: 'Lead Game Programmer / Product Manager and Scrum Master, coordinating Art, Backend and Frontend across a 20+ person team.',
    engagement: 'Technical leadership', genre: 'Card game', platforms: ['PC', 'Mobile'], capabilities: ['Unity', 'Production', 'Web3', 'Leadership'],
    fallbackImage: '/projects/relentless.png', internalSource: 'https://loom.games/en/', featured: true, evidence: 'CV + public source'
  }),
  project({
    id: 'christmas-sweeper-4', title: 'Christmas Sweeper 4', kicker: 'Casual F2P · Match-3',
    description: 'A long-running Christmas-themed match-3 game with seasonal progression and mobile free-to-play systems.',
    contribution: 'Lead Game Programmer / Product Manager. Led production across gameplay implementation, feature delivery, balancing and art/content coordination.',
    engagement: 'Full production', genre: 'Match-3', platforms: ['iOS', 'Android'], capabilities: ['Unity', 'Gameplay', 'F2P', 'Production'],
    evidence: 'CV', fallbackImage: '/projects/chase-the-sun.jpg', internalSource: 'https://www.smileygamer.com/portfolio-item/03-christmas-sweeper-4/'
  }),
  project({
    id: 'idle-king', title: 'Idle King / King Royale', kicker: 'Idle tycoon · Mobile F2P',
    description: 'A mobile idle/tycoon game developed from MVP evolution through production and market launch.',
    contribution: 'CTO / Lead Unity Developer. Product and technical ownership across gameplay, architecture, balancing and rapid iteration.',
    engagement: 'Full production', genre: 'Idle / Tycoon', platforms: ['iOS', 'Android'], capabilities: ['Unity', 'F2P', 'Architecture', 'Leadership'],
    evidence: 'CV', fallbackImage: '/projects/shopping-mall.jpg', internalSource: 'https://kingroyale.de/'
  }),
  project({
    id: 'the-longest-tale', title: 'The Longest Tale', kicker: 'Adventure · Steam production',
    description: 'A PC game project developed with a focus on production-ready core gameplay and rapid feature prototyping.',
    contribution: 'Lead Game Developer. Owned core gameplay mechanics and accelerated R&D for features, gameplay ideas and balancing.',
    engagement: 'Technical leadership', genre: 'Adventure', platforms: ['Steam'], capabilities: ['Unity', 'Gameplay', 'Rapid prototyping', 'Leadership'],
    evidence: 'CV', fallbackImage: '/projects/white-keep.jpg', internalSource: 'https://store.steampowered.com/app/3507360/The_Longest_Tale'
  }),
  project({
    id: 'guardians-of-peace', title: 'The Guardians of Peace', kicker: 'Action adventure · Team leadership',
    description: 'A Steam game project developed by a multidisciplinary team across programming, art and animation.',
    contribution: 'Lead Game Programmer / Product Manager. Organized production, established core architecture and managed a team of 10.',
    engagement: 'Technical leadership', genre: 'Action adventure', platforms: ['Steam'], capabilities: ['Unity', 'Architecture', 'Production', 'Leadership'],
    evidence: 'CV', fallbackImage: '/projects/kingdom-jump.png', internalSource: 'https://playthegop.com/'
  }),
  project({
    id: 'manic-miner', title: 'Manic Miner', kicker: 'Classic title · Multi-platform port',
    description: 'A modern platform adaptation of the established classic for contemporary console and PC ecosystems.',
    contribution: 'Senior Console Porting Engineer / Technical Lead: platform adaptation, complex debugging, performance and memory optimization while preserving gameplay behavior.',
    engagement: 'Porting', genre: 'Platformer', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'Optimization', 'Certification', 'Debugging'],
    fallbackImage: '/projects/manic-miner.jpg', internalSource: 'https://bbg-entertainment.com/game/manic-miner/', featured: true, evidence: 'Owner-attested + publisher'
  }),
  project({
    id: 'boulder-dash-40', title: 'Boulder Dash 40th Anniversary', kicker: 'Anniversary edition · Console porting',
    description: 'A modern anniversary release built around the long-running Boulder Dash franchise.',
    contribution: 'Console adaptation and technical leadership across platform-specific requirements, debugging, performance and memory constraints.',
    engagement: 'Porting', genre: 'Puzzle / Arcade', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'Optimization', 'Platform SDKs'],
    fallbackImage: '/projects/boulder-dash-40.jpg', internalSource: 'https://bbg-entertainment.com/game/boulder-dash-40th-anniversary/', featured: true, evidence: 'Owner-attested + publisher'
  }),
  project({
    id: 'dynablaster', title: 'Dynablaster', kicker: 'Action classic · Console porting',
    description: 'A contemporary release of the maze-based action classic for modern platforms.',
    contribution: 'Existing-code adaptation, platform-specific issue resolution, optimization and release-focused technical work.',
    engagement: 'Porting', genre: 'Action / Arcade', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'Debugging', 'Optimization'],
    fallbackImage: '/projects/dynablaster.jpg', internalSource: 'https://bbg-entertainment.com/game/dynablaster/', evidence: 'Owner-attested + publisher'
  }),
  project({
    id: 'boulder-dash-deluxe', title: 'Boulder Dash Deluxe', kicker: 'Puzzle action · Multi-platform port',
    description: 'A polished Boulder Dash release combining classic cave exploration with contemporary presentation.',
    contribution: 'Porting engineering for console and PC targets, including production-code adaptation and platform requirements.',
    engagement: 'Porting', genre: 'Puzzle / Arcade', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'Platform SDKs', 'Optimization'],
    fallbackImage: '/projects/boulder-dash-deluxe.jpg', internalSource: 'https://bbg-entertainment.com/game/boulder-dash-deluxe/', evidence: 'Owner-attested + publisher'
  }),
  project({
    id: 'astrosmash', title: 'Astrosmash', kicker: 'Retro reimagining · Console porting',
    description: 'A modern version of the classic space shooter adapted for contemporary hardware.',
    contribution: 'Hands-on console porting, cross-platform debugging and performance work.',
    engagement: 'Porting', genre: 'Shooter / Arcade', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'Performance', 'Debugging'],
    fallbackImage: '/projects/astrosmash.jpg', internalSource: 'https://bbg-entertainment.com/game/astrosmash/', evidence: 'Owner-attested + publisher'
  }),
  project({
    id: 'shark-shark', title: 'Shark! Shark!', kicker: 'Arcade reimagining · Console porting',
    description: 'A family-friendly modern take on the underwater arcade original.',
    contribution: 'Porting and platform adaptation, with focus on behavior parity, stability and performance.',
    engagement: 'Porting', genre: 'Family / Arcade', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'QA support', 'Optimization'],
    fallbackImage: '/projects/shark-shark.jpg', internalSource: 'https://bbg-entertainment.com/game/shark-shark/', evidence: 'Owner-attested + publisher'
  }),
  project({
    id: 'my-memory-of-us', title: 'My Memory of Us', kicker: 'Narrative adventure · Porting',
    description: 'A story-driven side-scrolling adventure presented through distinctive monochrome art direction.',
    contribution: 'Porting work represented in the GrandDevs team portfolio.',
    engagement: 'Porting', genre: 'Narrative adventure', platforms: ['PC', 'Console'], capabilities: ['Porting', 'Unity', 'Optimization'],
    fallbackImage: '/projects/white-keep.jpg', internalSource: 'https://granddevs.com/index.php/portfolio-item/the-white-keep', featured: true, evidence: 'Team portfolio'
  }),
  project({
    id: 'einstein-brain-trainer', title: 'Einstein Brain Trainer', kicker: 'Educational · Brain training',
    description: 'A mobile brain-training game built around varied cognitive exercises and accessible daily sessions.',
    contribution: teamContribution, engagement: 'Co-development', genre: 'Educational', platforms: ['Android'], capabilities: ['Unity', 'Gameplay', 'UI/UX'],
    storeLinks: [{ platform: 'Google Play', url: 'https://play.google.com/store/apps/details?id=de.bbg.EinsteinHD&hl=en' }],
    evidence: 'Team portfolio', fallbackImage: '/projects/kids-fish.jpg'
  }),
  project({
    id: 'time-travel', title: 'Time Travel', kicker: 'Educational · Interactive experience',
    description: 'An educational interactive project using game mechanics to explore historical and cultural content.',
    contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Educational', platforms: ['Interactive installation'], capabilities: ['Unity', 'Interactive media', 'Game design'], evidence: 'Team portfolio'
  }),
  project({
    id: 'brams', title: 'Brams', kicker: 'Educational · Interactive learning',
    description: 'A designed interactive experience represented in the GrandDevs educational portfolio.',
    contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Educational', platforms: ['Interactive'], capabilities: ['Unity', 'UI/UX', 'Game design'], evidence: 'Team portfolio'
  }),
  project({
    id: 'kids-fish', title: 'Kids Fish', kicker: 'Educational game · Design & development',
    description: 'A colorful learning experience built around aquatic environments and age-appropriate interaction.',
    contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Educational', platforms: ['Mobile'], capabilities: ['Unity', 'Game design', 'UI/UX'],
    fallbackImage: '/projects/kids-fish.jpg', evidence: 'Team portfolio'
  }),
  project({
    id: 'applemat', title: "Ecki's Cube Cosmos (AppLeMat)", kicker: 'Research-backed math learning',
    description: 'A mathematics learning game for children, with adaptive difficulty and progress tracking for educational use.',
    contribution: 'Unity development contribution through the GrandDevs team on the AppLeMat project.',
    engagement: 'Co-development', genre: 'Educational', platforms: ['Android'], capabilities: ['Unity', 'Adaptive gameplay', 'UI/UX'],
    storeLinks: [{ platform: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.wegesrand.AppLeMat&hl=en' }],
    evidence: 'Team portfolio'
  }),
  project({ id: 'kingdom-jump', title: 'Kingdom Jump', kicker: 'Mobile platformer', description: 'A swing-and-jump platform adventure through a stylized fantasy kingdom.', contribution: teamContribution, engagement: 'Co-development', genre: 'Platformer', platforms: ['Mobile'], capabilities: ['Unity', 'Gameplay', 'Animation'], fallbackImage: '/projects/kingdom-jump.png', evidence: 'Team portfolio' }),
  project({ id: 'chase-the-sun', title: 'Chase the Sun', kicker: 'Hyper-casual mobile game', description: 'A compact mobile game built for immediately readable play and rapid sessions.', contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Hyper-casual', platforms: ['Mobile'], capabilities: ['Unity', 'Rapid prototyping', 'Game design'], fallbackImage: '/projects/chase-the-sun.jpg', evidence: 'Team portfolio' }),
  project({ id: 'tricky-trip', title: 'Tricky Trip', kicker: 'Hyper-casual · Mobile', description: 'A short-session mobile game focused on timing, readable interactions and escalating challenge.', contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Hyper-casual', platforms: ['Mobile'], capabilities: ['Unity', 'Gameplay', 'Rapid prototyping'], evidence: 'Team portfolio' }),
  project({ id: 'bouncy-fall', title: 'Bouncy Fall', kicker: 'Hyper-casual · Physics', description: 'A physics-led casual concept designed around responsive movement and replayable short sessions.', contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Hyper-casual', platforms: ['Mobile'], capabilities: ['Unity', 'Physics', 'Game design'], evidence: 'Team portfolio' }),
  project({ id: 'tube', title: 'Tube', kicker: 'Hyper-casual · Mobile', description: 'A compact arcade concept developed for simple controls, clear feedback and rapid iteration.', contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Hyper-casual', platforms: ['Mobile'], capabilities: ['Unity', 'Gameplay', 'Rapid prototyping'], evidence: 'Team portfolio' }),
  project({ id: 'ball-machine', title: 'Ball Machine', kicker: 'Hyper-casual · Physics', description: 'A mobile physics game built around interacting balls, machines and chain reactions.', contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Hyper-casual', platforms: ['Mobile'], capabilities: ['Unity', 'Physics', 'Game design'], evidence: 'Team portfolio' }),
  project({ id: 'ball-breaker', title: 'Ball Breaker', kicker: 'Hyper-casual · Arcade', description: 'A mobile arcade game designed around tactile ball mechanics and fast progression.', contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Hyper-casual', platforms: ['Mobile'], capabilities: ['Unity', 'Gameplay', 'VFX'], evidence: 'Team portfolio' }),
  project({ id: 'flappy-attack', title: 'Flappy Attack', kicker: 'Hyper-casual · Arcade', description: 'A one-touch mobile action concept combining obstacle navigation with attack mechanics.', contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Hyper-casual', platforms: ['Mobile'], capabilities: ['Unity', 'Gameplay', 'Rapid prototyping'], evidence: 'Team portfolio' }),
  project({ id: 'clumsy-walk', title: 'Clumsy Walk', kicker: 'Hyper-casual · Character physics', description: 'A character-driven casual game built around intentionally awkward movement and timing.', contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Hyper-casual', platforms: ['Mobile'], capabilities: ['Unity', 'Character physics', 'Animation'], evidence: 'Team portfolio' }),
  project({ id: 'crash-io', title: 'Crash.io', kicker: 'Real-time multiplayer action', description: 'Vehicle combat in a shared post-apocalyptic arena with dozens of simultaneous players.', contribution: teamContribution, engagement: 'Co-development', genre: 'IO / Multiplayer', platforms: ['Mobile'], capabilities: ['Unity', 'Multiplayer', 'Gameplay'], fallbackImage: '/projects/crash-io.png', featured: true, evidence: 'Team portfolio' }),
  project({ id: 'zombie-attack', title: 'Zombie Attack', kicker: 'IO · Survival action', description: 'A multiplayer survival-action concept centered on escalating zombie encounters.', contribution: teamContribution, engagement: 'Co-development', genre: 'IO / Multiplayer', platforms: ['Mobile'], capabilities: ['Unity', 'Multiplayer', 'Gameplay'], evidence: 'Team portfolio' }),
  project({ id: 'shopping-mall', title: 'Shopping Mall', kicker: 'Idle · Tycoon', description: 'A mobile idle/tycoon concept built around developing and expanding a shopping-mall business.', contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Idle / Tycoon', platforms: ['Mobile'], capabilities: ['Unity', 'Economy systems', 'Game design'], fallbackImage: '/projects/shopping-mall.jpg', evidence: 'Team portfolio' }),
  project({ id: 'save-dan', title: 'Save Dan', kicker: 'Mobile action shooter', description: 'A survival shooter built around escalating zombie encounters and varied weapon play.', contribution: teamContribution, engagement: 'Co-development', genre: 'Shooter', platforms: ['iOS', 'Android'], capabilities: ['Unity', 'Gameplay', 'Mobile optimization'], fallbackImage: '/projects/save-dan.png', evidence: 'Team portfolio' }),
  project({ id: 'audio-driver', title: 'Audio Driver', kicker: 'Rhythm-based driving', description: 'A mobile driving concept where rhythm and player timing shape the experience.', contribution: teamContribution, engagement: 'Co-development', genre: 'Rhythm', platforms: ['Mobile'], capabilities: ['Unity', 'Audio systems', 'Gameplay'], evidence: 'Team portfolio' }),
  project({ id: 'beat-the-beats', title: 'Beat the Beats', kicker: 'Rhythm · Music game', description: 'A rhythm-led game concept developed around music synchronization, timing and visual feedback.', contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Rhythm', platforms: ['Mobile'], capabilities: ['Unity', 'Audio systems', 'VFX'], evidence: 'Team portfolio' }),
  project({ id: 'bad-day-at-zoo', title: 'A Bad Day at Zoo', kicker: 'Endless runner · Mobile', description: 'A character-led endless runner set around a chaotic day at the zoo.', contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Endless runner', platforms: ['Mobile'], capabilities: ['Unity', 'Gameplay', 'Animation'], evidence: 'Team portfolio' }),
  project({ id: 'dragon-escape', title: 'Dragon Escape', kicker: 'Endless runner · Fantasy', description: 'A fantasy endless-runner experience built around escaping danger through nighttime environments.', contribution: teamContribution, engagement: 'Co-development', genre: 'Endless runner', platforms: ['Mobile'], capabilities: ['Unity', 'Gameplay', 'VFX'], evidence: 'Team portfolio' }),
  project({ id: 'air-battles', title: 'Air Battles', kicker: 'Endless action · Flight', description: 'A mobile aerial action concept centered on rapid navigation and combat encounters.', contribution: teamContribution, engagement: 'Co-development', genre: 'Endless runner', platforms: ['Mobile'], capabilities: ['Unity', 'Gameplay', 'Optimization'], evidence: 'Team portfolio' }),
  project({ id: 'asgard-escape', title: 'Asgard Escape', kicker: 'Endless runner · Mythology', description: 'A mythology-themed mobile runner developed with production and visual-design support.', contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Endless runner', platforms: ['Mobile'], capabilities: ['Unity', 'Gameplay', 'Game design'], evidence: 'Team portfolio' }),
  project({ id: 'friends-quest', title: 'Friends Quest', kicker: 'Underwater endless runner', description: 'An underwater runner with upgradeable abilities, character variety and colorful environments.', contribution: teamContribution, engagement: 'Co-development', genre: 'Endless runner', platforms: ['Mobile'], capabilities: ['Unity', 'Gameplay', 'Content systems'], fallbackImage: '/projects/friends-quest.png', evidence: 'Team portfolio' }),
  project({ id: 'hajwala', title: 'Hajwala', kicker: 'Mobile racing & drifting', description: 'A vehicle simulation and drifting game focused on car culture, customization and competitive play.', contribution: teamContribution, engagement: 'Co-development', genre: 'Racing', platforms: ['Mobile'], capabilities: ['Unity', 'Vehicle physics', 'Optimization'], fallbackImage: '/projects/hajwala.png', evidence: 'Team portfolio' }),
  project({ id: 'sudoku-social', title: 'Sudoku Social', kicker: 'Cross-play puzzle game', description: 'Classic Sudoku with global leaderboards, friend challenges, themes and account-based cross-play.', contribution: teamContribution, engagement: 'Co-development', genre: 'Puzzle', platforms: ['Android', 'iOS'], capabilities: ['Unity', 'Online features', 'UI/UX'], fallbackImage: '/projects/sudoku-social.png', featured: true, evidence: 'Team portfolio' }),
  project({ id: 'ido-soccer', title: 'Ido Soccer', kicker: 'Gamified sport · Connected fitness', description: 'A gamified training experience where real walking, running or cycling controls an online avatar.', contribution: teamContribution, engagement: 'Co-development', genre: 'Sports / Fitness', platforms: ['iOS'], capabilities: ['Unity', 'Real-time systems', 'Gamification'], evidence: 'Team portfolio' }),
]
