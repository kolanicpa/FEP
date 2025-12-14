const Card = ({ title, children }) => (
  <div
    style={{
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(148, 163, 184, 0.25)',
      borderRadius: 14,
      padding: '18px 20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
    }}
  >
    {title ? (
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, color: '#f8fafc' }}>{title}</span>
      </div>
    ) : null}
    {children}
  </div>
)

export { Card }
