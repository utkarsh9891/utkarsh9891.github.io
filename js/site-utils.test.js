import { describe, it, expect } from 'vitest';
import { isGithubPagesHost, isLikelyDevHost, resolveUrl, manifestUrl, iconSvg } from './site-utils.js';

describe('isGithubPagesHost', () => {
  it('returns true for github.io', () => {
    expect(isGithubPagesHost('github.io')).toBe(true);
  });

  it('returns true for user.github.io', () => {
    expect(isGithubPagesHost('utkarsh9891.github.io')).toBe(true);
  });

  it('returns false for localhost', () => {
    expect(isGithubPagesHost('localhost')).toBe(false);
  });

  it('returns false for random domain', () => {
    expect(isGithubPagesHost('example.com')).toBe(false);
  });

  it('handles empty/null', () => {
    expect(isGithubPagesHost('')).toBe(false);
    expect(isGithubPagesHost(null)).toBe(false);
    expect(isGithubPagesHost(undefined)).toBe(false);
  });

  it('is case insensitive', () => {
    expect(isGithubPagesHost('Utkarsh9891.GitHub.IO')).toBe(true);
  });
});

describe('isLikelyDevHost', () => {
  it('returns true for localhost', () => {
    expect(isLikelyDevHost('localhost')).toBe(true);
  });

  it('returns true for 127.0.0.1', () => {
    expect(isLikelyDevHost('127.0.0.1')).toBe(true);
  });

  it('returns true for [::1]', () => {
    expect(isLikelyDevHost('[::1]')).toBe(true);
  });

  it('returns true for 0.0.0.0', () => {
    expect(isLikelyDevHost('0.0.0.0')).toBe(true);
  });

  it('returns true for empty hostname', () => {
    expect(isLikelyDevHost('')).toBe(true);
  });

  it('returns true for .local hostnames', () => {
    expect(isLikelyDevHost('mypc.local')).toBe(true);
    expect(isLikelyDevHost('macbook.local')).toBe(true);
  });

  it('returns true for 192.168.x.x', () => {
    expect(isLikelyDevHost('192.168.1.1')).toBe(true);
    expect(isLikelyDevHost('192.168.0.100')).toBe(true);
  });

  it('returns true for 10.x.x.x', () => {
    expect(isLikelyDevHost('10.0.0.1')).toBe(true);
    expect(isLikelyDevHost('10.255.255.255')).toBe(true);
  });

  it('returns true for 172.16-31.x.x', () => {
    expect(isLikelyDevHost('172.16.0.1')).toBe(true);
    expect(isLikelyDevHost('172.31.255.255')).toBe(true);
  });

  it('returns false for 172.32.x.x (outside range)', () => {
    expect(isLikelyDevHost('172.32.0.1')).toBe(false);
  });

  it('returns false for public domains', () => {
    expect(isLikelyDevHost('example.com')).toBe(false);
    expect(isLikelyDevHost('utkarsh9891.github.io')).toBe(false);
  });

  it('handles null/undefined', () => {
    expect(isLikelyDevHost(null)).toBe(true); // empty string after toLowerCase
    expect(isLikelyDevHost(undefined)).toBe(true);
  });
});

describe('resolveUrl', () => {
  it('returns href if present', () => {
    expect(resolveUrl({ href: 'https://example.com' }, 'https://origin.com')).toBe('https://example.com');
  });

  it('builds URL from origin + path', () => {
    expect(resolveUrl({ path: 'candlescan' }, 'https://utkarsh9891.github.io')).toBe('https://utkarsh9891.github.io/candlescan');
  });

  it('strips leading slash from path', () => {
    expect(resolveUrl({ path: '/candlescan' }, 'https://origin.com')).toBe('https://origin.com/candlescan');
  });

  it('handles empty path', () => {
    expect(resolveUrl({}, 'https://origin.com')).toBe('https://origin.com/');
  });

  it('handles empty origin', () => {
    expect(resolveUrl({ path: 'app' }, '')).toBe('/app');
  });
});

describe('manifestUrl', () => {
  it('returns apps.json on GitHub Pages', () => {
    expect(manifestUrl('utkarsh9891.github.io', null)).toBe('apps.json');
  });

  it('returns apps.json on public domain', () => {
    expect(manifestUrl('example.com', null)).toBe('apps.json');
  });

  it('returns apps.json on localhost without ?local=1', () => {
    const params = new URLSearchParams('');
    expect(manifestUrl('localhost', params)).toBe('apps.json');
  });

  it('returns apps.local.json on localhost with ?local=1', () => {
    const params = new URLSearchParams('local=1');
    expect(manifestUrl('localhost', params)).toBe('apps.local.json');
  });

  it('returns apps.local.json on localhost with ?local=true', () => {
    const params = new URLSearchParams('local=true');
    expect(manifestUrl('localhost', params)).toBe('apps.local.json');
  });

  it('returns apps.json on GitHub Pages even with ?local=1', () => {
    const params = new URLSearchParams('local=1');
    expect(manifestUrl('utkarsh9891.github.io', params)).toBe('apps.json');
  });
});

describe('iconSvg', () => {
  it('returns SVG for known icons', () => {
    expect(iconSvg('sync')).toContain('<svg');
    expect(iconSvg('github')).toContain('<svg');
    expect(iconSvg('candle')).toContain('<svg');
  });

  it('returns github SVG for unknown icon', () => {
    const github = iconSvg('github');
    expect(iconSvg('unknown')).toBe(github);
    expect(iconSvg('')).toBe(github);
  });

  it('each icon is unique', () => {
    const sync = iconSvg('sync');
    const github = iconSvg('github');
    const candle = iconSvg('candle');
    expect(sync).not.toBe(github);
    expect(github).not.toBe(candle);
  });
});
