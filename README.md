# TheGame - Phaser 3 Platformer

A simple platformer game built with Phaser 3, TypeScript, and Vite.

## Features

### Game Modes

- **Menu System**: Start screen with Play and Quit options
- **Level Selection**: Choose between multiple levels
- **Multiple Levels**: Two platformer levels with tilemap-based design
- **Pause Menu**: Press ESC to pause, with Resume and Restart options

### Player Controls

- **Movement**:
  - ⬅️ Left Arrow: Move left
  - ➡️ Right Arrow: Move right
  - ⬆️ Up Arrow: Jump
  - ESC: Pause/Resume game

### Advanced Mechanics

- **Improved Jump System**:
  - **Coyote Time**: 120ms grace period after leaving a platform to still jump
  - **Jump Buffer**: 120ms window before landing to register jump input
  - **Variable Jump Height**: Release jump key early for shorter jumps
- **Physics**:
  - Arcade physics with gravity
  - World bounds to keep player on screen
  - Camera following player

### UI Features

- **HUD**: Shows current level number and death count
- **Death Counter**: Tracks deaths per playthrough
- **Level Progression**: Complete levels by reaching the right edge

## Development

### Setup

```bash
npm ci
```

### Dev

```bash
npm run dev
```

Open your browser and navigate to http://localhost:5173

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Test

```bash
npm run test        # single run
npm run test:watch  # watch mode
npm run coverage    # with coverage report
```

### Lint

```bash
npm run lint        # check
npm run lint -- --fix # auto-fix
```

### Format

```bash
npm run format      # format all files
```

## Technical Details

- **Game Size**: 800x600 pixels
- **Physics Engine**: Arcade Physics
- **Player Gravity**: 300
- **Player Size**: 32x48 pixels (red rectangle)
- **Tile Size**: 50x50 pixels
- **Map Format**: Tiled JSON format
- **Build Tool**: Vite
- **Language**: TypeScript (strict mode)
- **Testing**: Vitest with jsdom
- **Linting**: ESLint (flat config) + Prettier
- **Git Hooks**: Husky + lint-staged

## Adding Custom Maps

To add your own custom levels:

1. Create a new tilemap JSON file in `public/assets/maps/` (e.g., `level3.json`)
2. Follow the Tiled JSON format used by `level1.json` and `level2.json`
3. Use tile index `1` for platforms, `0` for empty space
4. Update `LevelSelectScene.ts` to add a button for the new level
5. The tileset image is located at `public/assets/tiles.png` (64x64 pixels)

### Map Format

- **Width**: 26 tiles (1300 pixels)
- **Height**: 12 tiles (600 pixels)
- **Tile Size**: 50x50 pixels
- **Format**: Orthogonal tilemap
- **Layer**: Single "ground" layer for platforms

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
