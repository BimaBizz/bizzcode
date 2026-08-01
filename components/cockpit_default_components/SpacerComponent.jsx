export default function SpacerComponent({ data }) {
  const size = Math.min(Math.max(Number(data.size || 1), 1), 8);
  return <div style={{ height: `${size}rem` }} aria-hidden="true" />;
}
