import { describe, it, expect } from 'vitest';
import { cn } from '../lib/utils.js';

describe('cn – class name utility', () => {
  it('joins multiple truthy string arguments with a space', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('filters out falsy values (false, null, undefined, 0, empty string)', () => {
    expect(cn('foo', false, null, undefined, 0, '', 'bar')).toBe('foo bar');
  });

  it('returns an empty string when all values are falsy', () => {
    expect(cn(false, null, undefined)).toBe('');
  });

  it('returns the single class when only one argument is provided', () => {
    expect(cn('only-class')).toBe('only-class');
  });

  it('returns empty string when called with no arguments', () => {
    expect(cn()).toBe('');
  });

  it('handles conditional class patterns', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active');
  });

  it('preserves duplicate class names (no deduplication)', () => {
    expect(cn('foo', 'foo')).toBe('foo foo');
  });

  it('handles numeric zero as falsy', () => {
    expect(cn(0)).toBe('');
  });

  it('handles array-like spread usage', () => {
    const classes = ['card', 'rounded', 'shadow'];
    expect(cn(...classes)).toBe('card rounded shadow');
  });
});
