import { describe, it, expect, vi } from 'vitest';
import PlayScene from './PlayScene';

describe('PlayScene', () => {
  it('should be defined and have correct key', () => {
    const scene = new PlayScene();
    expect(scene).toBeDefined();
    expect(scene).toBeInstanceOf(PlayScene);
  });

  it('should have PlayScene as scene key', () => {
    const scene = new PlayScene();
    expect(scene.sys?.settings.key).toBe('PlayScene');
  });

  it('should have preload method', () => {
    const scene = new PlayScene();
    expect(typeof scene.preload).toBe('function');
  });

  it('should have create method', () => {
    const scene = new PlayScene();
    expect(typeof scene.create).toBe('function');
  });

  it('should have update method', () => {
    const scene = new PlayScene();
    expect(typeof scene.update).toBe('function');
  });

  it('should call preload without errors', () => {
    const scene = new PlayScene();
    expect(() => scene.preload()).not.toThrow();
  });

  describe('create method', () => {
    it('should create game objects when create is called', () => {
      const scene = new PlayScene();

      // Mock the necessary Phaser scene methods
      scene.add = {
        rectangle: vi.fn(() => ({
          body: {
            setGravityY: vi.fn(),
          },
        })),
      } as any;

      scene.physics = {
        add: {
          existing: vi.fn(),
          collider: vi.fn(),
        },
      } as any;

      scene.input = {
        keyboard: {
          createCursorKeys: vi.fn(() => ({
            left: { isDown: false },
            right: { isDown: false },
            up: { isDown: false },
          })),
        },
      } as any;

      scene.create();

      // Verify rectangles were created (platform + 2 walls + player = 4)
      expect(scene.add.rectangle).toHaveBeenCalledTimes(4);

      // Verify physics was added
      expect(scene.physics.add.existing).toHaveBeenCalled();

      // Verify colliders were created
      expect(scene.physics.add.collider).toHaveBeenCalledTimes(3);
    });
  });

  describe('update method', () => {
    let scene: PlayScene;
    let mockPlayer: any;
    let mockCursors: any;

    beforeEach(() => {
      scene = new PlayScene();

      // Mock player with body
      mockPlayer = {
        body: {
          setVelocityX: vi.fn(),
          setVelocityY: vi.fn(),
          touching: {
            down: false,
            left: false,
            right: false,
          },
        },
      };

      // Mock cursors
      mockCursors = {
        left: { isDown: false },
        right: { isDown: false },
        up: { isDown: false },
      };

      // Assign mocks to scene
      (scene as any).player = mockPlayer;
      (scene as any).cursors = mockCursors;
    });

    it('should move player left when left arrow is pressed', () => {
      mockCursors.left.isDown = true;
      scene.update();
      expect(mockPlayer.body.setVelocityX).toHaveBeenCalledWith(-160);
    });

    it('should move player right when right arrow is pressed', () => {
      mockCursors.right.isDown = true;
      scene.update();
      expect(mockPlayer.body.setVelocityX).toHaveBeenCalledWith(160);
    });

    it('should stop player when no arrows are pressed', () => {
      scene.update();
      expect(mockPlayer.body.setVelocityX).toHaveBeenCalledWith(0);
    });

    it('should make player jump when up is pressed and touching ground', () => {
      mockCursors.up.isDown = true;
      mockPlayer.body.touching.down = true;
      scene.update();
      expect(mockPlayer.body.setVelocityY).toHaveBeenCalledWith(-330);
    });

    it('should make player wall jump from left wall', () => {
      mockCursors.up.isDown = true;
      mockPlayer.body.touching.left = true;
      scene.update();
      expect(mockPlayer.body.setVelocityY).toHaveBeenCalledWith(-250);
      expect(mockPlayer.body.setVelocityX).toHaveBeenCalledWith(200);
    });

    it('should make player wall jump from right wall', () => {
      mockCursors.up.isDown = true;
      mockPlayer.body.touching.right = true;
      scene.update();
      expect(mockPlayer.body.setVelocityY).toHaveBeenCalledWith(-250);
      expect(mockPlayer.body.setVelocityX).toHaveBeenCalledWith(-200);
    });
  });
});
