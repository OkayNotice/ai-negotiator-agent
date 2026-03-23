export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#10b981' }}>🟢 ANCI is Live</h1>
      <p>The AI Negotiation Commerce Infrastructure foundation is deployed successfully.</p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>System Status:</h2>
        <ul>
          <li><strong>Layer 1 (Frontend):</strong> Online</li>
          <li><strong>Layer 2 (AI Engine):</strong> Awaiting deployment</li>
          <li><strong>Layer 3 (Database):</strong> Awaiting deployment</li>
        </ul>
      </div>
    </main>
  )
}
