const PETAL_PATHS = [
  "M12 23C6 19 3 13 5 7c1-3 4-4 5.500-3L12 6.500 13.500 4c1.500-1 4.500 0 5.500 3 2 6-1 12-7 16Z",
  "M12 23C8 19 6 13 7.500 7c.7-2.500 2.500-3.500 3.500-2.500L12 6l1.200-1.800c1.300-.7 2.800.8 3.300 3.300 1 5.500-.5 11.500-4.500 15.500Z",
];

type Petal = {
  top: string;
  left: string;
  size: number;
  rotate: number;
  opacity: number;
  shape: 0 | 1;
};

// Kept off the title and the date row, where text sits on the header.
const HEADER_PETALS: Petal[] = [
  { top: "6%", left: "28%", size: 18, rotate: 35, opacity: 0.6, shape: 0 },
  { top: "12%", left: "62%", size: 14, rotate: -40, opacity: 0.5, shape: 1 },
  { top: "28%", left: "12%", size: 13, rotate: 100, opacity: 0.45, shape: 1 },
  { top: "26%", left: "78%", size: 20, rotate: 150, opacity: 0.55, shape: 0 },
  { top: "84%", left: "86%", size: 22, rotate: 65, opacity: 0.5, shape: 0 },
  { top: "90%", left: "44%", size: 12, rotate: -70, opacity: 0.4, shape: 1 },
];

// Mostly near the edges and low down, in the space below the content.
const PAGE_PETALS: Petal[] = [
  { top: "31%", left: "90%", size: 20, rotate: 25, opacity: 0.7, shape: 0 },
  { top: "40%", left: "-2%", size: 24, rotate: -35, opacity: 0.6, shape: 0 },
  { top: "53%", left: "88%", size: 15, rotate: 120, opacity: 0.6, shape: 1 },
  { top: "61%", left: "8%", size: 17, rotate: 70, opacity: 0.7, shape: 1 },
  { top: "68%", left: "74%", size: 30, rotate: -20, opacity: 0.65, shape: 0 },
  { top: "74%", left: "13%", size: 13, rotate: 160, opacity: 0.55, shape: 1 },
  { top: "79%", left: "48%", size: 19, rotate: 200, opacity: 0.6, shape: 0 },
  { top: "84%", left: "-3%", size: 28, rotate: 40, opacity: 0.6, shape: 0 },
  { top: "82%", left: "91%", size: 16, rotate: -65, opacity: 0.55, shape: 1 },
];

// Scattered along the top and the edges, clear of the headline.
const LANDING_PETALS: Petal[] = [
  { top: "4%", left: "34%", size: 20, rotate: 35, opacity: 0.7, shape: 0 },
  { top: "9%", left: "56%", size: 14, rotate: -40, opacity: 0.6, shape: 1 },
  { top: "14%", left: "2%", size: 16, rotate: 100, opacity: 0.6, shape: 1 },
  { top: "22%", left: "94%", size: 24, rotate: 150, opacity: 0.65, shape: 0 },
  { top: "62%", left: "-1%", size: 26, rotate: -35, opacity: 0.6, shape: 0 },
  { top: "74%", left: "96%", size: 18, rotate: 70, opacity: 0.6, shape: 1 },
  { top: "93%", left: "6%", size: 20, rotate: 200, opacity: 0.65, shape: 0 },
  { top: "96%", left: "42%", size: 14, rotate: 160, opacity: 0.55, shape: 1 },
  { top: "94%", left: "88%", size: 28, rotate: -20, opacity: 0.6, shape: 0 },
];

const PLACEMENTS = {
  header: HEADER_PETALS,
  page: PAGE_PETALS,
  landing: LANDING_PETALS,
};

/**
 * Decorative petals painted behind everything else in their container, which
 * must be its own stacking context (for example with `isolate`).
 */
export function Petals({ placement }: { placement: keyof typeof PLACEMENTS }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {PLACEMENTS[placement].map((petal) => (
        <svg
          key={`${petal.top}-${petal.left}`}
          viewBox="0 0 24 24"
          className="absolute fill-petal"
          style={{
            top: petal.top,
            left: petal.left,
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity,
            transform: `rotate(${petal.rotate}deg)`,
          }}
        >
          <path d={PETAL_PATHS[petal.shape]} />
        </svg>
      ))}
    </div>
  );
}
