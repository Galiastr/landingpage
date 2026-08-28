import { mediaFor } from './projectMedia'

export type MediaItem = {
  type: 'image' | 'video' | 'youtube'
  src: string
  poster?: string
  alt?: string
}

export type StoreLink = {
  platform: 'Steam' | 'Xbox' | 'PlayStation' | 'Nintendo Switch' | 'Google Play' | 'App Store' | 'Official site' | 'Kickstarter' | 'Epic Games Store'
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
  releaseStatus?: 'Released' | 'In development' | 'Legacy release' | 'Unpublished'
  internalSource?: string
  featured?: boolean
  hidden?: boolean
  evidence: 'CV + public source' | 'CV' | 'Owner-attested + publisher' | 'Team portfolio'
}

type ProjectInput = Omit<Project, 'image' | 'media'> & { fallbackImage?: string; coverImage?: string; extraMedia?: MediaItem[] }

function project(input: ProjectInput): Project {
  const { fallbackImage = '/projects/chase-the-sun.jpg', coverImage, extraMedia = [], ...data } = input
  const media = [...mediaFor(input.id), ...extraMedia]
  const cover = coverImage ?? media.find(item => item.type === 'image')?.src ?? fallbackImage
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
    releaseStatus: 'Unpublished',
    internalSource: 'https://cricketmanagerpro.com', featured: true, hidden: false, evidence: 'CV + public source'
  }),
  project({
    id: 'relentless', title: 'Relentless', kicker: 'Trading card game · Web3',
    description: 'A strategic digital trading-card game built around collectible, player-owned cards, deck construction, competitive play and a cross-platform marketplace. The Kickstarter campaign raised $321,606 from 1,693 backers.',
    contribution: 'Lead Game Programmer / Product Manager and Scrum Master, coordinating Art, Backend and Frontend across a 20+ person team.',
    engagement: 'Technical leadership', genre: 'Card game', platforms: ['PC', 'Mobile'], capabilities: ['Unity', 'Production', 'Web3', 'Leadership'],
    storeLinks: [
      { platform: 'Official site', url: 'https://loom.games/en/' },
      { platform: 'Kickstarter', url: 'https://www.kickstarter.com/projects/328862817/zombie-battleground-the-new-generation-of-ccg-tcg/' },
    ], releaseStatus: 'Legacy release',
    fallbackImage: '/projects/relentless.png', internalSource: 'https://loom.games/en/', featured: true, evidence: 'CV + public source'
    ,extraMedia: [
      { type: 'image', src: 'https://img.itch.zone/aW1hZ2UvMzQzNTQzLzIxMzcxOTYuanBn/original/yN6fVA.jpg' },
      { type: 'image', src: 'https://img.itch.zone/aW1hZ2UvMzQzNTQzLzE3MDQ0NjIuanBn/original/jk2ru2.jpg' },
      { type: 'image', src: 'https://img.itch.zone/aW1hZ2UvMzQzNTQzLzE3MDQ0NjMuanBn/original/iRa0GX.jpg' },
      { type: 'image', src: 'https://img.itch.zone/aW1hZ2UvMzQzNTQzLzE3MDQ0NjUuanBn/original/nenoCm.jpg' },
    ]
  }),
  project({
    id: 'christmas-sweeper-4', title: 'Christmas Sweeper 4', kicker: 'Casual F2P · Match-3',
    description: 'A Christmas-themed match-3 game with more than 1,000 levels, shaped boards, boosters, collectible gifts and seasonal mobile progression.',
    contribution: 'Lead Game Programmer / Product Manager, responsible for gameplay implementation, feature delivery, balancing and coordination of art and level content.',
    engagement: 'Full production', genre: 'Match-3', platforms: ['iOS', 'Android'], capabilities: ['Unity', 'Gameplay', 'F2P', 'Production'],
    storeLinks: [
      { platform: 'App Store', url: 'https://apps.apple.com/app/id1413442151' },
      { platform: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.smileygamer.christmassweeper4' },
    ], releaseStatus: 'Released',
    evidence: 'CV', fallbackImage: '/projects/chase-the-sun.jpg', internalSource: 'https://www.smileygamer.com/portfolio-item/03-christmas-sweeper-4/', extraMedia: [
      { type: 'video', src: '/projects/christmas-sweeper-4/video-1.mp4', poster: '/projects/christmas-sweeper-4/image-5.jpg' },
    ]
  }),
  project({
    id: 'idle-king', title: 'King Royale: Idle Tycoon RPG', kicker: 'Idle tycoon RPG · Mobile F2P',
    description: 'A mobile idle tycoon RPG about expanding a medieval kingdom, building an army, defeating bosses and rescuing the kidnapped princess.',
    contribution: 'CTO / Lead Unity Developer. Product and technical ownership across gameplay, architecture, balancing and rapid iteration.',
    engagement: 'Full production', genre: 'Idle Tycoon RPG', platforms: ['iOS', 'Android'], capabilities: ['Unity', 'F2P', 'Architecture', 'Leadership'],
    storeLinks: [
      { platform: 'App Store', url: 'https://apps.apple.com/us/app/king-royale-idle-tycoon-rpg/id1479539390' },
    ], releaseStatus: 'Released',
    evidence: 'CV', fallbackImage: '/projects/shopping-mall.jpg', coverImage: 'https://i3.ytimg.com/vi/vNDQMXJP8sw/hqdefault.jpg', internalSource: 'https://kingroyale.de/'
  }),
  project({
    id: 'the-longest-tale', title: 'The Longest Tale', kicker: 'Fantasy action RPG · Steam',
    description: 'A fantasy action RPG following four heroes through mythical realms, ancient ruins, dangerous encounters and arcane puzzles as they uncover a forgotten legend.',
    contribution: 'Lead Game Developer. Owned core gameplay mechanics and accelerated R&D for features, gameplay ideas and balancing.',
    engagement: 'Technical leadership', genre: 'Fantasy Action RPG', platforms: ['Steam'], capabilities: ['Unity', 'Gameplay', 'Rapid prototyping', 'Leadership'],
    storeLinks: [{ platform: 'Steam', url: 'https://store.steampowered.com/app/3507360/The_Longest_Tale/' }], releaseStatus: 'Released',
    evidence: 'CV', fallbackImage: '/projects/white-keep.jpg', internalSource: 'https://store.steampowered.com/app/3507360/The_Longest_Tale/'
  }),
  project({
    id: 'guardians-of-peace', title: 'The Guardians of Peace', kicker: 'Sci-fi action adventure · Multi-platform',
    description: 'A sci-fi action adventure about a young squire mastering seven energies, confronting the Darkling hordes and restoring peace to Hastina-Poora.',
    contribution: 'Lead Game Programmer / Product Manager. Organized production, established core architecture and managed a team of 10.',
    engagement: 'Technical leadership', genre: 'Sci-Fi Adventure RPG', platforms: ['Steam', 'Xbox', 'iOS', 'Android'], capabilities: ['Unity', 'Architecture', 'Production', 'Leadership'],
    storeLinks: [
      { platform: 'Steam', url: 'https://store.steampowered.com/app/1466620/The_Guardians_of_Peace/' },
      { platform: 'Xbox', url: 'https://www.xbox.com/en-US/games/store/the-guardians-of-peace/9pngj9grgk13' },
    ], releaseStatus: 'Released',
    evidence: 'CV', fallbackImage: '/projects/kingdom-jump.png', internalSource: 'https://playthegop.com/'
  }),
  project({
    id: 'manic-miner', title: 'Manic Miner', kicker: 'Classic title · Multi-platform port',
    description: 'A modern platform adaptation of the established classic for contemporary console and PC ecosystems.',
    contribution: 'Senior Console Porting Engineer / Technical Lead: platform adaptation, complex debugging, performance and memory optimization while preserving gameplay behavior.',
    engagement: 'Porting', genre: 'Platformer', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'Optimization', 'Certification', 'Debugging'],
    storeLinks: [{ platform: 'Steam', url: 'https://store.steampowered.com/app/4921770/MANIC_MINER/' }], releaseStatus: 'In development',
    coverImage: '/projects/manic-miner/image-6.jpg', fallbackImage: '/projects/manic-miner.jpg', internalSource: 'https://bbg-entertainment.com/game/manic-miner/', featured: true, evidence: 'Owner-attested + publisher'
  }),
  project({
    id: 'boulder-dash-40', title: 'Boulder Dash 40th Anniversary', kicker: 'Anniversary edition · Console porting',
    description: 'A modern anniversary release built around the long-running Boulder Dash franchise.',
    contribution: 'Console adaptation and technical leadership across platform-specific requirements, debugging, performance and memory constraints.',
    engagement: 'Porting', genre: 'Puzzle / Arcade', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'Optimization', 'Platform SDKs'],
    storeLinks: [
      { platform: 'Steam', url: 'https://store.steampowered.com/app/3124310/BOULDER_DASH_40th_Anniversary/' },
      { platform: 'Xbox', url: 'https://www.xbox.com/en-US/games/store/boulder-dash-40th-anniversary/9nf27s57jq02' },
      { platform: 'PlayStation', url: 'https://store.playstation.com/en-us/concept/10015438/' },
      { platform: 'Nintendo Switch', url: 'https://www.nintendo.com/us/store/products/boulder-dash-40th-anniversary-switch/' },
    ], releaseStatus: 'Released',
    fallbackImage: '/projects/boulder-dash-40.jpg', internalSource: 'https://bbg-entertainment.com/game/boulder-dash-40th-anniversary/', featured: true, evidence: 'Owner-attested + publisher'
  }),
  project({
    id: 'dynablaster', title: 'Dynablaster', kicker: 'Action classic · Console porting',
    description: 'A contemporary release of the maze-based action classic for modern platforms.',
    contribution: 'Existing-code adaptation, platform-specific issue resolution, optimization and release-focused technical work.',
    engagement: 'Porting', genre: 'Action / Arcade', platforms: ['Steam', 'Xbox', 'Nintendo Switch'], capabilities: ['Porting', 'Debugging', 'Optimization'],
    storeLinks: [
      { platform: 'Steam', url: 'https://store.steampowered.com/app/1489620/DYNABLASTER/' },
      { platform: 'Xbox', url: 'https://www.xbox.com/en-US/games/store/dynablaster/9nhn30d462n2' },
      { platform: 'Nintendo Switch', url: 'https://www.nintendo.com/us/store/products/dynablaster-switch/' },
    ], releaseStatus: 'Released',
    fallbackImage: '/projects/dynablaster.jpg', internalSource: 'https://bbg-entertainment.com/game/dynablaster/', evidence: 'Owner-attested + publisher'
  }),
  project({
    id: 'boulder-dash-deluxe', title: 'Boulder Dash Deluxe', kicker: 'Puzzle action · Multi-platform port',
    description: 'A polished Boulder Dash release combining classic cave exploration with contemporary presentation.',
    contribution: 'Porting engineering for console and PC targets, including production-code adaptation and platform requirements.',
    engagement: 'Porting', genre: 'Puzzle / Arcade', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'Platform SDKs', 'Optimization'],
    storeLinks: [
      { platform: 'Steam', url: 'https://store.steampowered.com/app/1221650/Boulder_Dash_Deluxe/' },
      { platform: 'Xbox', url: 'https://www.xbox.com/en-US/games/store/boulder-dash-deluxe/9p8tjvkn4z17' },
      { platform: 'PlayStation', url: 'https://store.playstation.com/en-us/product/UP7359-PPSA21744_00-0781041976365756' },
      { platform: 'Nintendo Switch', url: 'https://www.nintendo.com/us/store/products/boulder-dash-deluxe-switch/' },
    ], releaseStatus: 'Released',
    fallbackImage: '/projects/boulder-dash-deluxe.jpg', internalSource: 'https://bbg-entertainment.com/game/boulder-dash-deluxe/', evidence: 'Owner-attested + publisher'
  }),
  project({
    id: 'astrosmash', title: 'Astrosmash', kicker: 'Retro reimagining · Console porting',
    description: 'A modern version of the classic space shooter adapted for contemporary hardware.',
    contribution: 'Hands-on console porting, cross-platform debugging and performance work.',
    engagement: 'Porting', genre: 'Shooter / Arcade', platforms: ['Steam', 'Xbox', 'Nintendo Switch'], capabilities: ['Porting', 'Performance', 'Debugging'],
    storeLinks: [
      { platform: 'Steam', url: 'https://store.steampowered.com/app/2430580/ASTROSMASH/' },
      { platform: 'Xbox', url: 'https://www.xbox.com/en-US/games/store/astrosmash/9nlvftkqv50j' },
      { platform: 'Nintendo Switch', url: 'https://www.nintendo.com/us/store/products/astrosmash-switch/' },
    ], releaseStatus: 'Released',
    fallbackImage: '/projects/astrosmash.jpg', internalSource: 'https://bbg-entertainment.com/game/astrosmash/', evidence: 'Owner-attested + publisher'
  }),
  project({
    id: 'shark-shark', title: 'Shark! Shark!', kicker: 'Arcade reimagining · Console porting',
    description: 'A family-friendly modern take on the underwater arcade original.',
    contribution: 'Porting and platform adaptation, with focus on behavior parity, stability and performance.',
    engagement: 'Porting', genre: 'Family / Arcade', platforms: ['Steam', 'Xbox', 'Nintendo Switch'], capabilities: ['Porting', 'QA support', 'Optimization'],
    storeLinks: [
      { platform: 'Steam', url: 'https://store.steampowered.com/app/2410640/SHARK_SHARK/' },
      { platform: 'Xbox', url: 'https://www.xbox.com/en-US/games/store/shark-shark/9p052x824t3t' },
      { platform: 'Nintendo Switch', url: 'https://www.nintendo.com/us/store/products/shark-shark-switch/' },
    ], releaseStatus: 'Released',
    fallbackImage: '/projects/shark-shark.jpg', internalSource: 'https://bbg-entertainment.com/game/shark-shark/', evidence: 'Owner-attested + publisher'
  }),
  project({
    id: 'my-memory-of-us', title: 'My Memory of Us', kicker: 'Narrative adventure · Porting',
    description: 'A story-driven side-scrolling adventure presented through distinctive monochrome art direction.',
    contribution: 'Porting work represented in the GrandDevs team portfolio.',
    engagement: 'Porting', genre: 'Narrative adventure', platforms: ['PC', 'Console'], capabilities: ['Porting', 'Unity', 'Optimization'],
    storeLinks: [
      { platform: 'App Store', url: 'https://apps.apple.com/us/app/my-memory-of-us/id1474869488' },
      { platform: 'Nintendo Switch', url: 'https://www.nintendo.com/us/store/products/my-memory-of-us-switch/' },
    ],
    fallbackImage: '/projects/white-keep.jpg', internalSource: 'https://granddevs.com/index.php/portfolio-item/the-white-keep', featured: true, evidence: 'Team portfolio'
  }),
  project({
    id: 'einstein-brain-trainer', title: 'Einstein Brain Trainer', kicker: 'Educational · Brain training',
    description: 'A mobile brain-training game built around varied cognitive exercises and accessible daily sessions.',
    contribution: teamContribution, engagement: 'Co-development', genre: 'Educational', platforms: ['Android'], capabilities: ['Unity', 'Gameplay', 'UI/UX'],
    storeLinks: [{ platform: 'Google Play', url: 'https://play.google.com/store/apps/details?id=de.bbg.EinsteinHD&hl=en' }],
    evidence: 'Team portfolio', fallbackImage: '/projects/kids-fish.jpg', extraMedia: [
      { type: 'image', src: 'https://play-lh.googleusercontent.com/7PzUkiNdA955TdCo8-N7DbxNEmhAZiRYnMHyPQr_b51yFEiCUKhsf1MVpIoyXmRY7wHuU7ZSUkl9QrJUzVpi=w1052-h592', alt: 'Einstein Brain Trainer screenshot 1' },
      { type: 'image', src: 'https://play-lh.googleusercontent.com/4GlBy0CGbagP3cWpxsjG0oRjiQ6Na0GQTxXirsG7_6sm-8naUjMjmliCerwDCk9hVys1c7NZHNJSFLnQ0sM8bg=w1052-h592', alt: 'Einstein Brain Trainer screenshot 2' },
      { type: 'image', src: 'https://play-lh.googleusercontent.com/khlSyMuqAHfWKK6xMCu429hRmWk1Z4lefWj_rTzoDumjyuDtxtpFL0KiD3S4JsS-fGWvCt7_CJvNHUCqbxO1Ag=w1052-h592', alt: 'Einstein Brain Trainer screenshot 3' },
      { type: 'image', src: 'https://play-lh.googleusercontent.com/aHQcugcjDnrTYeMJME1hxeBz-ifawEnbamt6cVjsiunvMNYDf2FOvCpENjf7tP8-YOarustJ9ctkjzwe4XvFWA=w1052-h592', alt: 'Einstein Brain Trainer screenshot 4' },
    ]
  }),
  project({
    id: 'time-travel', title: 'Time Travel', kicker: 'Educational · Interactive experience',
    description: 'An educational interactive project using game mechanics to explore historical and cultural content.',
    contribution: teamDesignContribution, engagement: 'Co-development', genre: 'Educational', platforms: ['Interactive'], capabilities: ['Unity', 'Interactive media', 'Game design'], evidence: 'Team portfolio'
    , hidden: true
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

  project({
    id: 'fast-food-master-2025', title: 'Fast Food Master 2025', kicker: 'Windows-first simulation · multi-platform plan',
    description: 'A fast-food management sim being finished for Windows, with public storefront coverage for selected platforms and a broader multi-platform rollout planned.',
    contribution: 'Windows-first production and gameplay coordination; public store pages exist for some target platforms while wider platform planning continues.',
    engagement: 'Co-development', genre: 'Simulation', platforms: ['Windows', 'PlayStation', 'Xbox'], capabilities: ['Gameplay', 'Simulation', 'UI/UX'],
    storeLinks: [{ platform: 'Epic Games Store', url: 'https://store.epicgames.com/p/fast-food-master-2025-b938e0?lang=pl' }],
    releaseStatus: 'In development',
    coverImage: 'https://image.api.playstation.com/vulcan/ap/rnd/202503/0514/2ac519dc70bb9e9c6bb3ddaaae27a94dbbac5596a3c1e38a.jpg',
    internalSource: 'https://store.epicgames.com/p/fast-food-master-2025-b938e0?lang=pl', evidence: 'CV + public source'
  }),
  project({
    id: 'digging-a-hole-simulator', title: 'Digging A Hole Simulator', kicker: 'Windows-first adventure · console rollout',
    description: 'A darkly funny digging adventure being finished for Windows, with public release coverage on consoles as part of the wider platform plan.',
    contribution: 'Windows-first project work and port planning reflected in the portfolio; public release pages remain for selected targets.',
    engagement: 'Co-development', genre: 'Adventure', platforms: ['Windows', 'Nintendo Switch'], capabilities: ['Porting', 'Adventure', 'Puzzle'],
    storeLinks: [{ platform: 'Nintendo Switch', url: 'https://www.nintendo.com/us/store/products/digging-a-hole-simulator-switch/' }],
    releaseStatus: 'In development',
    coverImage: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/store/software/switch/70010000096598/771a90da55726358383b7bd422a8a0190d68424ec721920989803a94c0645062',
    internalSource: 'https://www.nintendo.com/us/store/products/digging-a-hole-simulator-switch/', evidence: 'CV + public source'
  }),
  project({
    id: 'schoolboy-escape', title: 'Schoolboy Escape', kicker: 'Windows-first adventure · multi-platform plan',
    description: 'A stealthy puzzle-adventure being finished for Windows, with additional platform releases planned where public store pages already exist.',
    contribution: 'Windows-first development and platform planning; public pages exist for some release targets, but not every platform is published yet.',
    engagement: 'Co-development', genre: 'Adventure', platforms: ['Windows', 'Nintendo Switch', 'Xbox'], capabilities: ['Adventure', 'Puzzle', 'Platform delivery'],
    storeLinks: [
      { platform: 'Nintendo Switch', url: 'https://www.nintendo.com/us/store/products/schoolboy-escape-switch/' },
      { platform: 'Xbox', url: 'https://www.xbox.com/pl-PL/games/store/schoolboy-escape-xbox-edition/9ngm3hrsk106' },
    ],
    releaseStatus: 'In development',
    coverImage: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/store/software/switch/70010000095962/d391e3450c167e8c3cee029474c0ff3761bdb35024da539140660bf4359ee586',
    internalSource: 'https://www.nintendo.com/us/store/products/schoolboy-escape-switch/', evidence: 'CV + public source'
  }),
  project({
    id: 'cyberpunk-hacker', title: 'Cyberpunk Hacker', kicker: 'Windows-first cyberpunk · multi-platform plan',
    description: 'A neon-drenched cyberpunk title being finished for Windows, with public store pages already covering several of the planned platforms.',
    contribution: 'Windows-first development and platform rollout planning; some platform releases are public already, while others remain in production.',
    engagement: 'Co-development', genre: 'Cyberpunk action', platforms: ['Windows', 'Nintendo Switch', 'Epic Games Store', 'Xbox'], capabilities: ['Action', 'Puzzle', 'Platform delivery'],
    storeLinks: [
      { platform: 'Nintendo Switch', url: 'https://www.nintendo.com/en-gb/Games/Nintendo-Switch-download-software/Cyberpunk-Hacker-2660907.html?srsltid=AfmBOoqXk4v_r5FkYC-bQDHRhm13hmgZqWJdpzCGhLucNExB0hvpssOk' },
      { platform: 'Epic Games Store', url: 'https://store.epicgames.com/p/cyberpunk-hacker-5cac5c' },
      { platform: 'Xbox', url: 'https://www.xbox.com/en-US/games/store/cyberpunk-hacker/9MSNXVRWFF6S' },
    ],
    releaseStatus: 'In development',
    coverImage: 'https://www.nintendo.com/eu/media/images/assets/nintendo_switch_games/cyberpunkhacker/2x1_CyberpunkHacker_image1280w.jpg',
    internalSource: 'https://www.nintendo.com/en-gb/Games/Nintendo-Switch-download-software/Cyberpunk-Hacker-2660907.html?srsltid=AfmBOoqXk4v_r5FkYC-bQDHRhm13hmgZqWJdpzCGhLucNExB0hvpssOk', evidence: 'CV + public source'
  }),
]
