// Custom flags that aren't in the flag-icons package
const customFlags = {
  hi: true, // Hawaiian flag
};

// Renders a country flag using flag-icons CSS, or a custom SVG for special cases
export default function Flag({ code, size = '1.5em', className = '', style = {} }) {
  if (!code) return null;

  if (customFlags[code]) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}flags/${code}.svg`}
        alt={code}
        className={className}
        style={{
          height: size,
          width: 'auto',
          borderRadius: '2px',
          display: 'inline-block',
          verticalAlign: 'middle',
          ...style,
        }}
      />
    );
  }

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
