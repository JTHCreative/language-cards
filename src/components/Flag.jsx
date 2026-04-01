// Renders a country flag using flag-icons CSS (SVG-based, works on all platforms)
export default function Flag({ code, size = '1.5em', className = '', style = {} }) {
  if (!code) return null;
  return (
    <span
      className={`fi fi-${code} ${className}`}
      style={{
        fontSize: size,
        borderRadius: '3px',
        ...style,
      }}
    />
  );
}
