# TheGame - Phaser 3 Platformer

A simple platformer game built with Phaser 3.

## Features

- **Player Controls**: Use arrow keys to move and jump
  - ⬅️ Left Arrow: Move left
  - ➡️ Right Arrow: Move right
  - ⬆️ Up Arrow: Jump (only when on ground)
- **Physics**: Arcade physics with gravity
- **Platform**: Green platform at the bottom where the player can land

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cimoun/TheGame.git
cd TheGame
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:8080
```

## Game Controls

- **Arrow Left**: Move player left (velocity: -160)
- **Arrow Right**: Move player right (velocity: 160)
- **Arrow Up**: Jump (velocity: -330) - only works when player is on the ground
- **No keys pressed**: Player stops horizontal movement

## Technical Details

- **Game Size**: 800x600 pixels
- **Physics Engine**: Arcade Physics
- **Player Gravity**: 300
- **Player Size**: 32x48 pixels (red rectangle)
- **Platform Size**: 800x40 pixels (green rectangle)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
