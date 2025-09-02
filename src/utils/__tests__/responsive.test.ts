import { getResponsiveValue, mediaQueries } from '../responsive';

describe('getResponsiveValue', () => {
  it('should return correct value for mobile breakpoint', () => {
    const values = {
      mobile: 'mobile-value',
      tablet: 'tablet-value',
      desktop: 'desktop-value',
    };
    
    const result = getResponsiveValue(values, 'mobile');
    expect(result).toBe('mobile-value');
  });

  it('should fallback to desktop value if current breakpoint not found', () => {
    const values = {
      desktop: 'desktop-value',
    };
    
    const result = getResponsiveValue(values, 'mobile');
    expect(result).toBe('desktop-value');
  });

  it('should fallback through hierarchy if values not found', () => {
    const values = {
      tablet: 'tablet-value',
    };
    
    const result = getResponsiveValue(values, 'wide');
    expect(result).toBe('tablet-value');
  });
});

describe('mediaQueries', () => {
  it('should have correct media query strings', () => {
    expect(mediaQueries.mobile).toBe('@media (max-width: 480px)');
    expect(mediaQueries.tablet).toBe('@media (max-width: 768px)');
    expect(mediaQueries.desktop).toBe('@media (min-width: 1024px)');
    expect(mediaQueries.wide).toBe('@media (min-width: 1280px)');
    expect(mediaQueries.touch).toBe('@media (hover: none) and (pointer: coarse)');
    expect(mediaQueries.hover).toBe('@media (hover: hover) and (pointer: fine)');
  });
});