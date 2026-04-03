// Custom flags that aren't in the flag-icons package
const customFlags = {
  hi: true, // Hawaiian flag
};

// Renders a country flag using flag-icons CSS, or a custom SVG for special cases
export default function Flag({ code, size = '1.5em', className = '', style = {} }) {
  if (!code) return null;

  if (customFlags[code]) {
    // Render custom flags as a span matching flag-icons sizing exactly
    return (
      <span
        className={className}
        style={{
          display: 'inline-block',
          position: 'relative',
          fontSize: size,
          width: '1.333333em',
          lineHeight: '1em',
          height: '1em',
          backgroundSize: 'contain',
          backgroundPosition: '50%',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${import.meta.env.BASE_URL}flags/${code}.svg)`,
          borderRadius: '3px',
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
