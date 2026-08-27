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
  url: string
  featured?: boolean
  evidence: 'CV + public source' | 'CV' | 'Owner-attested + publisher' | 'Team portfolio'
}

export const projects: Project[] = [
  {
    id: 'cricket-manager-pro', title: 'Cricket Manager Pro', kicker: 'Sports management · Live product',
    description: 'A mobile cricket-management game built from MVP through production and market launch.',
    contribution: 'CTO / Lead Unity Developer. Product and technical ownership across gameplay, balancing, feature priorities, architecture and rapid iteration with multidisciplinary teams.',
    engagement: 'Full production', genre: 'Sports management', platforms: ['iOS', 'Android'], capabilities: ['Unity', 'Gameplay', 'Architecture', 'LiveOps', 'Leadership'],
    image: 'https://cricketmanagerpro.com/wp-content/uploads/2023/02/slide-home.png', url: 'https://cricketmanagerpro.com', featured: true, evidence: 'CV + public source'
  },
  {
    id: 'relentless', title: 'Relentless', kicker: 'Trading card game · Web3',
    description: 'A digital trading-card game with player-owned cards, a marketplace and cross-platform ambitions.',
    contribution: 'Lead Game Programmer / Product Manager and Scrum Master, coordinating Art, Backend and Frontend across a 20+ person team.',
    engagement: 'Technical leadership', genre: 'Card game', platforms: ['PC', 'Mobile'], capabilities: ['Unity', 'Production', 'Web3', 'Leadership'],
    image: '/projects/relentless.png', url: 'https://loom.games/en/', featured: true, evidence: 'CV + public source'
  },
  {
    id: 'manic-miner', title: 'Manic Miner', kicker: 'Classic title · Multi-platform port',
    description: 'Modern platform adaptation of an established classic for current console and PC ecosystems.',
    contribution: 'Senior Console Porting Engineer / Technical Lead: platform adaptation, complex debugging, performance and memory optimization while preserving gameplay behavior.',
    engagement: 'Porting', genre: 'Platformer', platforms: ['Steam', 'Xbox', 'PS5', 'Nintendo Switch'], capabilities: ['Porting', 'Optimization', 'Certification', 'Debugging'],
    image: '/projects/manic-miner.jpg', url: 'https://bbg-entertainment.com/game/manic-miner/', featured: true, evidence: 'Owner-attested + publisher'
  },
  {
    id: 'boulder-dash-40', title: 'Boulder Dash 40th Anniversary', kicker: 'Anniversary edition · Console porting',
    description: 'A modern anniversary release built around the long-running Boulder Dash franchise.',
    contribution: 'Console adaptation and technical leadership across platform-specific requirements, debugging, performance and memory constraints.',
    engagement: 'Porting', genre: 'Puzzle / Arcade', platforms: ['Steam', 'Xbox', 'PS5', 'Nintendo Switch'], capabilities: ['Porting', 'Optimization', 'Platform SDKs'],
    image: '/projects/boulder-dash-40.jpg', url: 'https://bbg-entertainment.com/game/boulder-dash-40th-anniversary/', featured: true, evidence: 'Owner-attested + publisher'
  },
  {
    id: 'dynablaster', title: 'Dynablaster', kicker: 'Action classic · Console porting',
    description: 'A contemporary release of the maze-based action classic for modern platforms.',
    contribution: 'Existing-code adaptation, platform-specific issue resolution, optimization and release-focused technical work.',
    engagement: 'Porting', genre: 'Action / Arcade', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'Debugging', 'Optimization'],
    image: '/projects/dynablaster.jpg', url: 'https://bbg-entertainment.com/game/dynablaster/', evidence: 'Owner-attested + publisher'
  },
  {
    id: 'boulder-dash-deluxe', title: 'Boulder Dash Deluxe', kicker: 'Puzzle action · Multi-platform port',
    description: 'A polished Boulder Dash release combining classic cave exploration with contemporary presentation.',
    contribution: 'Porting engineering for console and PC targets, including production-code adaptation and platform requirements.',
    engagement: 'Porting', genre: 'Puzzle / Arcade', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'Platform SDKs', 'Optimization'],
    image: '/projects/boulder-dash-deluxe.jpg', url: 'https://bbg-entertainment.com/game/boulder-dash-deluxe/', evidence: 'Owner-attested + publisher'
  },
  {
    id: 'astrosmash', title: 'Astrosmash', kicker: 'Retro reimagining · Console porting',
    description: 'A modern version of the classic space shooter adapted for contemporary hardware.',
    contribution: 'Hands-on console porting, cross-platform debugging and performance work.',
    engagement: 'Porting', genre: 'Shooter / Arcade', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'Performance', 'Debugging'],
    image: '/projects/astrosmash.jpg', url: 'https://bbg-entertainment.com/game/astrosmash/', evidence: 'Owner-attested + publisher'
  },
  {
    id: 'shark-shark', title: 'Shark! Shark!', kicker: 'Arcade reimagining · Console porting',
    description: 'A family-friendly modern take on the underwater arcade original.',
    contribution: 'Porting and platform adaptation, with focus on behavior parity, stability and performance.',
    engagement: 'Porting', genre: 'Family / Arcade', platforms: ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'], capabilities: ['Porting', 'QA support', 'Optimization'],
    image: '/projects/shark-shark.jpg', url: 'https://bbg-entertainment.com/game/shark-shark/', evidence: 'Owner-attested + publisher'
  },
  {
    id: 'white-keep', title: 'My Memory of Us', kicker: 'Narrative adventure · Porting',
    description: 'A story-driven side-scrolling adventure presented through distinctive monochrome art direction.',
    contribution: 'Porting work represented in the GrandDevs team portfolio.',
    engagement: 'Porting', genre: 'Narrative adventure', platforms: ['PC', 'Console'], capabilities: ['Porting', 'Unity', 'Optimization'],
    image: '/projects/white-keep.jpg', url: 'https://granddevs.com/index.php/portfolio-item/the-white-keep', featured: true, evidence: 'Team portfolio'
  },
  {
    id: 'kids-fish', title: 'Kids Fish', kicker: 'Educational game · Design & development',
    description: 'A colorful learning experience built around aquatic environments and age-appropriate interaction.',
    contribution: 'Development and game design as part of the GrandDevs team.',
    engagement: 'Co-development', genre: 'Educational', platforms: ['Mobile'], capabilities: ['Unity', 'Game design', 'UI/UX'],
    image: '/projects/kids-fish.jpg', url: 'https://granddevs.com/index.php/portfolio-item/kids-fish/', evidence: 'Team portfolio'
  },
  {
    id: 'applemat', title: "Ecki's Cube Cosmos", kicker: 'Research-backed math learning',
    description: 'A mathematics learning game for children, with adaptive difficulty and progress tracking for educational use.',
    contribution: 'Unity development contribution through the GrandDevs team on the AppLeMat project.',
    engagement: 'Co-development', genre: 'Educational', platforms: ['Android'], capabilities: ['Unity', 'Adaptive gameplay', 'UI/UX'],
    image: '/projects/kids-fish.jpg', url: 'https://play.google.com/store/apps/details?id=com.wegesrand.AppLeMat&hl=pl', evidence: 'Team portfolio'
  },
  {
    id: 'kingdom-jump', title: 'Kingdom Jump', kicker: 'Mobile platformer',
    description: 'A swing-and-jump platform adventure through a stylized fantasy kingdom.',
    contribution: 'Game development contribution represented in the GrandDevs team portfolio.',
    engagement: 'Co-development', genre: 'Platformer', platforms: ['Mobile'], capabilities: ['Unity', 'Gameplay', 'Animation'],
    image: '/projects/kingdom-jump.png', url: 'https://granddevs.com/index.php/portfolio-item/kingdom-jump', evidence: 'Team portfolio'
  },
  {
    id: 'crash-io', title: 'Crash.io', kicker: 'Real-time multiplayer action',
    description: 'Vehicle combat in a shared post-apocalyptic arena with dozens of simultaneous players.',
    contribution: 'Game development contribution represented in the GrandDevs team portfolio.',
    engagement: 'Co-development', genre: 'IO / Multiplayer', platforms: ['Mobile'], capabilities: ['Unity', 'Multiplayer', 'Gameplay'],
    image: '/projects/crash-io.png', url: 'https://granddevs.com/index.php/portfolio-item/crash-io', featured: true, evidence: 'Team portfolio'
  },
  {
    id: 'sudoku-social', title: 'Sudoku Social', kicker: 'Cross-play puzzle game',
    description: 'Classic Sudoku with global leaderboards, friend challenges, themes and account-based cross-play.',
    contribution: 'Development contribution represented in the GrandDevs team portfolio.',
    engagement: 'Co-development', genre: 'Puzzle', platforms: ['Android', 'iOS'], capabilities: ['Unity', 'Online features', 'UI/UX'],
    image: '/projects/sudoku-social.png', url: 'https://granddevs.com/index.php/portfolio-item/sudoku-social/', featured: true, evidence: 'Team portfolio'
  },
  {
    id: 'hajwala', title: 'Hajwala', kicker: 'Mobile racing & drifting',
    description: 'A vehicle simulation and drifting game focused on car culture, customization and competitive play.',
    contribution: 'Development contribution represented in the GrandDevs team portfolio.',
    engagement: 'Co-development', genre: 'Racing', platforms: ['Mobile'], capabilities: ['Unity', 'Vehicle physics', 'Optimization'],
    image: '/projects/hajwala.png', url: 'https://granddevs.com/index.php/portfolio-item/hajwala', evidence: 'Team portfolio'
  },
  {
    id: 'save-dan', title: 'Save Dan', kicker: 'Mobile action shooter',
    description: 'A survival shooter built around escalating zombie encounters and varied weapon play.',
    contribution: 'Development contribution represented in the GrandDevs team portfolio.',
    engagement: 'Co-development', genre: 'Shooter', platforms: ['iOS', 'Android'], capabilities: ['Unity', 'Gameplay', 'Mobile optimization'],
    image: '/projects/save-dan.png', url: 'https://granddevs.com/index.php/portfolio-item/save-dan', evidence: 'Team portfolio'
  },
  {
    id: 'audio-driver', title: 'Audio Driver', kicker: 'Rhythm-based driving',
    description: 'A mobile driving concept where rhythm and player timing shape the experience.',
    contribution: 'Development contribution represented in the GrandDevs team portfolio.',
    engagement: 'Co-development', genre: 'Rhythm', platforms: ['Mobile'], capabilities: ['Unity', 'Audio systems', 'Gameplay'],
    image: '/projects/chase-the-sun.jpg', url: 'https://granddevs.com/index.php/portfolio-item/audio-driver', evidence: 'Team portfolio'
  },
  {
    id: 'friends-quest', title: 'Friends Quest', kicker: 'Underwater endless runner',
    description: 'An underwater runner with upgradeable abilities, character variety and colorful environments.',
    contribution: 'Development contribution represented in the GrandDevs team portfolio.',
    engagement: 'Co-development', genre: 'Endless runner', platforms: ['Mobile'], capabilities: ['Unity', 'Gameplay', 'Content systems'],
    image: '/projects/friends-quest.png', url: 'https://granddevs.com/index.php/portfolio-item/friends-quest/', evidence: 'Team portfolio'
  },
  {
    id: 'chase-the-sun', title: 'Chase the Sun', kicker: 'Hyper-casual mobile game',
    description: 'A compact, immediately readable mobile game built for rapid sessions and iteration.',
    contribution: 'Development and design as part of the GrandDevs team.',
    engagement: 'Co-development', genre: 'Hyper-casual', platforms: ['Mobile'], capabilities: ['Unity', 'Rapid prototyping', 'Game design'],
    image: '/projects/chase-the-sun.jpg', url: 'https://granddevs.com/index.php/portfolio-item/chase-the-sun', evidence: 'Team portfolio'
  }
]
