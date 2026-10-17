import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';

const directory = new URL('../src-tauri/capabilities/', import.meta.url);
const capabilities = readdirSync(directory).filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(new URL(file, directory), 'utf8')) as {
    windows: string[];
    platforms?: string[];
    permissions: string[];
  });

const granted = (platform: string, permission: string) => capabilities.some((capability) =>
  capability.windows.includes('main')
  && (!capability.platforms || capability.platforms.includes(platform))
  && capability.permissions.includes(permission));

describe('frontend titlebar capabilities', () => {
  for (const platform of ['windows', 'macOS']) {
    test(`${platform} drag regions can move and zoom the main window`, () => {
      expect(granted(platform, 'core:window:allow-start-dragging')).toBe(true);
      expect(granted(platform, 'core:window:allow-internal-toggle-maximize')).toBe(true);
    });
  }

  test('Linux keeps native decorations without drag permissions', () => {
    expect(granted('linux', 'core:window:allow-start-dragging')).toBe(false);
  });
});
