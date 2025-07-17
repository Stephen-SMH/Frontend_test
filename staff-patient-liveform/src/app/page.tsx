// src/app/page.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [patientId, setPatientId] = useState('');

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to the Real-Time Patient Form Demo</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2>Enter Patient Form</h2>
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '1rem' }}
        />
        <Link href={`/patient/${patientId}`}>
          <button disabled={!patientId} style={{ padding: '0.5rem 1rem' }}>
            Go to Patient Form
          </button>
        </Link>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Staff Monitoring</h2>
        <Link href="/staff">
          <button style={{ padding: '0.5rem 1rem' }}>
            View Staff Dashboard
          </button>
        </Link>
      </section>
    </main>
  );
}
