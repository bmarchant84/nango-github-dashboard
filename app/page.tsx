"use client"

import Nango from '@nangohq/frontend';
import { useState } from 'react';

export default function Home() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    const response = await fetch('/api/session-token', { method: 'POST' });
    const { sessionToken } = await response.json();
    const nango = new Nango();

    const connect = nango.openConnectUI({ onEvent: async(event) => {
      if (event.type === 'connect') {
      const reposResponse = await fetch('/api/github/repos');
      const reposData = await reposResponse.json();
      setRepos(reposData);
      }

      console.log('Nango event:', event);
    }});
    connect.setSessionToken(sessionToken);
  }
  return (
    <div>
      <h1>Nango GitHub Dashboard</h1>
      <button onClick={handleConnect} className="bg-green-500 text-white px-4 py-2 rounded">
        Connect GitHub
      </button>
      {repos.map((repo) => (
      <div key={repo.id}>
      {repo.name}
      </div>
))}
    </div>
  );
}