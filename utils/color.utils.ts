export function generateBrandColor(brand: string, index: number) {

  // Predefined distinct colors for first 10 brands (using HSL for consistency)
  const distinctColors = [
    { h: 0, s: 85, l: 50 },    // Vivid Red
    { h: 210, s: 85, l: 50 },  // Strong Blue
    { h: 120, s: 85, l: 45 },  // Vibrant Green
    { h: 48, s: 90, l: 50 },   // Golden Yellow
    { h: 280, s: 85, l: 50 },  // Deep Purple
    { h: 15, s: 85, l: 50 },   // Coral Pink
    { h: 130, s: 85, l: 45 },  // Turquoise
    { h: 325, s: 85, l: 50 },  // Hot Pink
    { h: 240, s: 85, l: 50 },  // Royal Blue
    { h: 270, s: 85, l: 50 },  // Very Blue
  ];

  let hue, saturation, lightness;

  if (index < distinctColors.length) {
    // Use predefined distinct colors for first 10 brands
    hue = distinctColors[index].h;
    saturation = distinctColors[index].s;
    lightness = distinctColors[index].l;
  } else {
    // Use golden ratio for remaining brands
    hue = (index * 137.5) % 360;
    // Alternate between different saturation/lightness for better distinction
    saturation = index % 2 === 0 ? 75 : 85;
    lightness = 45 + (index % 3) * 5; // Varies between 45-55%
  }

  return {
    border: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    background: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`,
  };
}

export function getBrandColors(brands: string[]) {
  return brands.reduce((acc, brand, index) => {
    acc[brand] = generateBrandColor(brand, index);
    return acc;
  }, {} as Record<string, { border: string; background: string }>);
} 