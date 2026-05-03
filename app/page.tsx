"use client"

import Nango from '@nangohq/frontend';
import { useState } from 'react';

export default function Home() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  async function handleConnect() {
    const response = await fetch('/api/session-token', { method: 'POST' });
    const { sessionToken } = await response.json();
    const nango = new Nango();

    const connect = nango.openConnectUI({
      onEvent: async (event) => {
        if (event.type === 'connect') {
          setConnected(true);
          setLoading(true);
          const reposResponse = await fetch('/api/github/repos');
          const reposData = await reposResponse.json();
          setRepos(reposData);
          setLoading(false);
        }
        console.log('Nango event:', event);
      },
    });
    connect.setSessionToken(sessionToken);
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#e4e4e4',
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      padding: '0',
    }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        .repo-card {
          background: #111111;
          border: 1px solid #222;
          border-radius: 6px;
          padding: 20px;
          transition: border-color 0.2s, transform 0.2s;
          cursor: default;
        }
        .repo-card:hover {
          border-color: #00ff88;
          transform: translateY(-2px);
        }
        .connect-btn {
          background: transparent;
          border: 1px solid #00ff88;
          color: #00ff88;
          padding: 12px 28px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.08em;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s, color 0.2s;
          text-transform: uppercase;
        }
        .connect-btn:hover {
          background: #00ff88;
          color: #0a0a0a;
        }
        .lang-badge {
          display: inline-block;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 20px;
          border: 1px solid #333;
          color: #888;
          font-family: 'IBM Plex Mono', monospace;
          letter-spacing: 0.05em;
        }
        .repo-link {
          color: #00ff88;
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 0.05em;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .repo-card:hover .repo-link {
          opacity: 1;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeInUp 0.4s ease forwards;
        }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{
        borderBottom: '1px solid #1a1a1a',
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: connected ? '#00ff88' : '#444',
            animation: connected ? 'none' : 'pulse 2s infinite',
          }} />
          <span style={{ fontSize: '13px', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            nango <span style={{ color: '#333' }}>/</span> github-dashboard
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#333', letterSpacing: '0.08em' }}>
          {connected ? `${repos.length} repos synced` : 'not connected'}
        </span>
      </header>

      {/* Hero */}
      <section style={{
        padding: '80px 48px 64px',
        borderBottom: '1px solid #1a1a1a',
      }}>
        <p style={{ fontSize: '11px', color: '#00ff88', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
          powered by Nango but built by Ben Marchant
        </p>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: '600',
          color: '#f0f0f0',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          fontFamily: "'IBM Plex Sans', sans-serif",
          marginBottom: '24px',
        }}>
          GitHub Repository<br />
          <span style={{ color: '#333' }}>Dashboard</span>
        </h1>
        <p style={{ fontSize: '14px', color: '#555', maxWidth: '480px', lineHeight: '1.7', marginBottom: '36px', fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Connect your GitHub account through Nango — no tokens in your code, no OAuth plumbing, just a connection ID.
        </p>

        {!connected && (
          <button className="connect-btn" onClick={handleConnect}>
            ↗ Connect GitHub
          </button>
        )}

        {connected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00ff88' }} />
            <span style={{ fontSize: '12px', color: '#00ff88', letterSpacing: '0.08em' }}>CONNECTED</span>
          </div>
        )}
      </section>

      {/* Loading */}
      {loading && (
        <div style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#444', letterSpacing: '0.15em', animation: 'pulse 1.5s infinite' }}>
            FETCHING REPOS VIA NANGO PROXY...
          </p>
        </div>
      )}

      {/* Repo Grid */}
      {!loading && repos.length > 0 && (
        <section style={{ padding: '48px' }}>
          <p style={{ fontSize: '11px', color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px' }}>
            repositories — {repos.length} found
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {repos.map((repo: any, i: number) => (
              <div
                key={repo.id}
                className="repo-card fade-in"
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#e0e0e0', letterSpacing: '-0.01em' }}>
                    {repo.name}
                  </span>
                  {repo.html_url && (
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-link">
                      ↗ view
                    </a>
                  )}
                </div>

                {repo.description && (
                  <p style={{
                    fontSize: '12px', color: '#555', lineHeight: '1.6',
                    marginBottom: '16px', fontFamily: "'IBM Plex Sans', sans-serif",
                  }}>
                    {repo.description}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto', flexWrap: 'wrap' }}>
                  {repo.language && (
                    <span className="lang-badge">{repo.language}</span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span style={{ fontSize: '11px', color: '#555' }}>★ {repo.stargazers_count}</span>
                  )}
                  {repo.private && (
                    <span style={{ fontSize: '10px', color: '#555', border: '1px solid #222', padding: '2px 6px', borderRadius: '3px' }}>private</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      </div>
    </main>
  );
}