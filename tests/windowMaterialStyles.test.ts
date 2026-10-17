import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../src/styles/${path}`, import.meta.url), 'utf8');

describe('window material styles', () => {
  test('every see-through rule is scoped to a native window material', () => {
    const selectors = [...read('theme-window-material.css').matchAll(/([^{}]+)\{[^}]*\}/g)]
      .flatMap(([, selector]) => selector.split(/,(?![^(]*\))/).map((part) => part.trim()));
    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) expect(selector.startsWith(':root[data-window-material]')).toBe(true);
  });

  test('material rules load after the backdrop rules they override', () => {
    const imports = [...read('index.css').matchAll(/@import '\.\/(theme-[a-z-]+\.css)'/g)].map(([, file]) => file);
    expect(imports.indexOf('theme-window-material.css')).toBeGreaterThan(imports.indexOf('theme-backdrop.css'));
  });
});
