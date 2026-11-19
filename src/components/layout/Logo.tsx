/** Logo B: 科 with a Tomato offset shadow under sunrise rays. */
export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true" focusable="false">
      <text x="33" y="50" fontSize="30" textAnchor="middle" fontFamily="var(--font-zh)" fontWeight="700" fill="#F2462E">科</text>
      <text x="29" y="46" fontSize="30" textAnchor="middle" fontFamily="var(--font-zh)" fontWeight="700" fill="currentColor">科</text>
      <path d="M6 54H54M30 13V5M16 16L11 10M44 16L49 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
