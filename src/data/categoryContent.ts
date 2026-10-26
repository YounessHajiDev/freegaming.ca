export interface CategoryContent {
  intro: string
  lookFor: string
}

/** Editorial copy shown on /category/:slug pages. */
export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  'puzzle-games': {
    intro: 'Puzzle games reward patience more than reflexes. This section collects sorting puzzles, match-3 boards, word searches, jigsaws, physics brain-teasers and logic grids that you can pause and pick up again whenever you like. Most of them start with gentle tutorial levels and ramp up slowly, which makes them a good fit for short breaks as well as longer sessions.',
    lookFor: 'If you are new to the genre, start with colour-sort and match-3 titles: they use a single tap or click and teach the core idea in the first level. Logic and physics puzzles take longer to master, so check the "How to play" notes on each game page before you begin.',
  },
  'racing-games': {
    intro: 'Racing games put you behind the wheel of cars, motorbikes, trucks and the occasional bathtub. You will find lap-based circuit racers, endless highway runners, drift challenges, parking tests and stunt tracks with ramps and loops. Some focus on realistic handling while others are pure arcade fun with boosts and power-ups.',
    lookFor: 'Most racers use the arrow keys or W A S D on desktop and on-screen pedals on mobile. If a game feels slippery, look for a handbrake or drift key in its instructions — it usually makes tight corners much easier.',
  },
  'sports-games': {
    intro: 'Our sports section covers football (soccer), basketball, hockey, golf, tennis, bowling, archery and more. Many are quick "one more shot" games built around timing a single swing or kick, while others are full matches against a computer opponent or a friend on the same keyboard.',
    lookFor: 'Timing-based sports games reward short, controlled inputs — tap rather than hold. Two-player sports titles usually split the keyboard (W A S D versus the arrow keys), so check the controls before inviting a friend.',
  },
  'shooting-games': {
    intro: 'Shooting games range from cartoon target ranges and bubble shooters to arcade tank battles and top-down survival arenas. The browser titles here keep violence stylised and avoid gore, focusing on aiming, timing and choosing the right upgrade between rounds.',
    lookFor: 'Desktop players usually aim with the mouse; on phones, look for drag-to-aim or a virtual joystick. If a game has an upgrade shop, spending early coins on reload speed or accuracy tends to pay off more than raw damage.',
  },
  'card-games': {
    intro: 'Card games bring classic table games to the browser: solitaire variants such as Klondike, Spider and FreeCell, plus memory-matching, blackjack-style practice games and casual deck builders. No real money is ever involved — every game here is played for fun only.',
    lookFor: 'Solitaire games normally support both drag-and-drop and tap-to-move. Use the undo button liberally while you learn a new variant; most of these games do not penalise you for it.',
  },
  'strategy-games': {
    intro: 'Strategy games ask you to plan ahead: defend a base with towers, manage resources, expand territory, or out-think an opponent turn by turn. Sessions tend to be longer than in other categories, and many games save your progress in the browser so you can return later.',
    lookFor: 'In tower-defence titles, cover the longest stretch of the path first and upgrade a few towers rather than building many weak ones. Clearing your browser data will usually reset saved progress.',
  },
  'arcade-games': {
    intro: 'Arcade games are built for instant fun: simple controls, short rounds and a high score to beat. This category includes endless runners, block breakers, snake-style games, jumpers and retro-inspired classics that you can learn in seconds.',
    lookFor: 'Arcade games are a good pick on mobile because most use a single tap or swipe. If you keep losing early, watch the first few seconds of a round — many games speed up on a fixed rhythm you can learn.',
  },
  'adventure-games': {
    intro: 'Adventure games mix exploration, light puzzles and platforming. Expect hand-drawn worlds, escape rooms, side-scrolling quests and short story-driven levels where you collect items, open doors and avoid traps on the way to the exit.',
    lookFor: 'Many adventure games hide collectibles off the main path, so it pays to explore. Escape-room titles often require combining two items in the inventory — try dragging one onto the other.',
  },
  'multiplayer-games': {
    intro: 'Multiplayer games let you play with or against other people. Some are local two-player games where you share one keyboard with a friend, while others connect you to online opponents through the game developer\'s own servers.',
    lookFor: 'For same-keyboard games, one player typically uses W A S D and the other uses the arrow keys. Online multiplayer games are run by their publishers, so availability can vary by time of day.',
  },
  'thinking-games': {
    intro: 'Thinking games are calmer than action titles and focus on memory, logic and planning: number puzzles, mazes, connect-the-dots, block sliding, quiz-style challenges and brain-training mini games. They are popular with players of all ages.',
    lookFor: 'If you get stuck, many thinking games include a hint button or let you restart a level instantly. Short sessions spread over a few days often work better than grinding one hard level.',
  },
  'action-games': {
    intro: 'Action games are fast and reflex-driven: platformers, fighting games, stickman battles, obstacle courses ("obbies") and dodging challenges. Rounds are often short and difficult, with checkpoints so you can retry quickly.',
    lookFor: 'Learn the jump and dash timing on the first level before pushing for speed. Most action games support keyboard on desktop and on-screen buttons on mobile; a few are keyboard-only and say so in their instructions.',
  },
  'casual-games': {
    intro: 'Casual games are easy to start and relaxing to play: idle clickers, cooking and dress-up games, simple simulations, colouring and satisfying "ASMR" style tasks. They are designed for a few minutes at a time with no pressure.',
    lookFor: 'Idle and clicker games keep progressing while the tab is open, so they work well in the background. Simulation games usually explain their goals in a short tutorial — follow it once and the rest becomes intuitive.',
  },
  'io-games': {
    intro: '.io games are lightweight online arena games where you start small and grow by collecting points or outlasting other players. Snake-style growers, territory painters and battle arenas are the most common types.',
    lookFor: 'Most .io games use only the mouse or a single swipe to steer. Staying near the edges early on and avoiding crowded areas until you are larger is a reliable way to survive longer.',
  },
  'other-games': {
    intro: 'This section collects games that do not fit neatly into one genre: creative tools, rhythm games, quirky experiments, educational games for kids and hybrid titles that mix several styles.',
    lookFor: 'Because the games here are so varied, check the "How to play" notes and tags on each game page to see what kind of experience it offers before you start.',
  },
}
