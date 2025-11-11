# TheGame - Phaser 3 Platformer

A simple platformer game built with Phaser 3, TypeScript, and Vite.

## Features

- **Player Controls**: Use arrow keys to move and jump
  - ⬅️ Left Arrow: Move left
  - ➡️ Right Arrow: Move right
  - ⬆️ Up Arrow: Jump (when on ground or wall)
- **Physics**: Arcade physics with gravity
- **Platform**: Green platform at the bottom where the player can land
- **Wall Jump**: Jump from walls for advanced movement

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
- **Platform Size**: 800x40 pixels (green rectangle)
- **Build Tool**: Vite
- **Language**: TypeScript (strict mode)
- **Testing**: Vitest with jsdom
- **Linting**: ESLint (flat config) + Prettier
- **Git Hooks**: Husky + lint-staged

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
