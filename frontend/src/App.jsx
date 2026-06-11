import React, { useState } from 'react';
import { Mic, Loader2, CheckCircle } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // Quick test function to trigger an API call straight to main.py port 8000
  const triggerTestUpload = async () => {
    setLoading(true);
    setResponse(null);

    // Create a dummy 1-second silent audio data structure blob to test the connection
    const dummyBlob = new Blob(["mock-audio-data"], { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('file', dummyBlob, 'test_recording.wav');

    try {
      const res = await fetch('http://localhost:8000/v1/stt', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      alert("Cannot connect to backend server! Make sure main.py is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0d0b21', color: 'white', minHeight: 'screen', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', backgroundColor: '#191635', padding: '30px', borderRadius: '20px', border: '1px solid #3b0764' }}>
        <Mic size={40} color="#06b6d4" style={{ marginBottom: '15px' }} />
        <h1 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>STT Basic Setup</h1>
        <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '20px' }}>Testing full-stack communication infrastructure.</p>
        
        <button 
          onClick={triggerTestUpload}
          disabled={loading}
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(to right, #06b6d4, #3b82f6)', color: 'white', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
        >
          {loading ? 'Transcribing...' : 'Test Backend Connection'}
        </button>

        {response && (
          <div style={{ marginTop: '20px', backgroundColor: '#0d0b21', padding: '15px', borderRadius: '10px', textAlign: 'left', border: '1px solid #22c55e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
              <CheckCircle size={14} /> Connection Successful!
            </div>
            <p style={{ margin: '0', fontSize: '14px', color: '#e4e4e7' }}>"{response.text}"</p>
            <small style={{ color: '#71717a', display: 'block', marginTop: '5px' }}>Detected Language: {response.language}</small>
          </div>
        )}
      </div>
    </div>
  );
}