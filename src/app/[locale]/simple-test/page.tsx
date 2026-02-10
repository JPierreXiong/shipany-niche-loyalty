export default function SimplePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>✅ Simple Test Page</h1>
      <p>If you can see this, the server is working!</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  );
}





