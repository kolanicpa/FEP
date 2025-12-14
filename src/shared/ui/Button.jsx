const styles = {
  base: {
    border: '1px solid transparent',
    borderRadius: 12,
    padding: '10px 16px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  },
  solid: {
    background: 'linear-gradient(135deg, #60a5fa, #7c3aed)',
    color: '#0b1120',
    boxShadow: '0 10px 30px rgba(94, 92, 255, 0.35)',
  },
  ghost: {
    background: 'rgba(255, 255, 255, 0.04)',
    color: '#e2e8f0',
    border: '1px solid rgba(148, 163, 184, 0.35)',
  },
}

const Button = ({ children, variant = 'solid', ...props }) => {
  const variantStyles = variant === 'ghost' ? styles.ghost : styles.solid
  const disabledStyles = props.disabled
    ? { opacity: 0.6, cursor: 'not-allowed', boxShadow: 'none' }
    : {}
  return (
    <button
      style={{ ...styles.base, ...variantStyles, ...disabledStyles }}
      onMouseDown={(event) => event.currentTarget.blur()}
      onMouseEnter={(event) =>
        props.disabled
          ? null
          : (event.currentTarget.style.transform = 'translateY(-1px)')
      }
      onMouseLeave={(event) =>
        props.disabled ? null : (event.currentTarget.style.transform = 'translateY(0)')
      }
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }
