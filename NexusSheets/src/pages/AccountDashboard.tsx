import React, { useRef, useState, useEffect } from "react";
import api from "../utils/api";
// import AccountInfo from "../components/AccountInfo";

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'security', label: 'Security' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'characters', label: 'Characters' },
  { key: 'campaigns', label: 'Campaigns' },
];

const AccountDashboard: React.FC = () => {
  // Load user info from localStorage (mocked for now)
  const email = localStorage.getItem('nexus_auth_email');
  const token = localStorage.getItem('nexus_auth_token');
  // Mocked user object for demo
  const [user, setUser] = useState(email ? {
    username: email.split('@')[0],
    displayName: 'Display Name',
    email,
    password: '',
    profilePicture: '',
    bio: '',
    timeZone: 'UTC',
    preferredLanguage: 'English',
    privacy: 'public',
    notifications: {
      email: true,
      inApp: true,
    },
    joined: token ? new Date(parseInt(atob(token).split(':')[1])).toLocaleDateString() : '2025-01-01',
  } : null);
  const [profileChanged, setProfileChanged] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const handleLogout = async () => {
    const email = localStorage.getItem('nexus_auth_email');
    if (email) {
      try {
        await api.logout(email);
      } catch (e) {
        // ignore and fall back to local
      }
    }
    localStorage.removeItem('nexus_auth_token');
    localStorage.removeItem('nexus_auth_email');
    window.location.reload();
  };
  // Handler for importing character JSON
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Character management
  const [characters, setCharacters] = useState<any[]>([]);
  useEffect(() => {
    if (!email) return;
    let mounted = true;
    // Try backend first
    api.getUserCharacters(email).then((res) => {
      if (!mounted) return;
      // backend returns list of UUIDs — frontend stores full character objects locally; try to map
      if (Array.isArray(res)) {
        // try to load local characters and filter by IDs
        const local = JSON.parse(localStorage.getItem(`nexus_chars_${email}`) || '[]');
        const filtered = local.filter((c: any) => res.includes(c.id) || res.includes(c.id));
        setCharacters(filtered);
      }
    }).catch(() => {
      // fallback to localStorage
      const chars = localStorage.getItem(`nexus_chars_${email}`);
      if (mounted) setCharacters(chars ? JSON.parse(chars) : []);
    });
    return () => { mounted = false; };
  }, [email]);

  const saveCharacters = (chars: any[]) => {
    if (!email) return;
    localStorage.setItem(`nexus_chars_${email}`, JSON.stringify(chars));
    setCharacters(chars);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!data.id) data.id = 'char_' + Math.random().toString(36).substr(2, 9);
        data.imported = true;
        const updated = [...characters, data];
        saveCharacters(updated);
        alert("Imported character: " + (data.name || JSON.stringify(data)));
      } catch {
        alert("Invalid character JSON file.");
      }
    };
    reader.readAsText(file);
  };
  const handleCreateCharacter = () => {
    if (!email) {
      alert("You must be signed in to create a character.");
      return;
    }
    window.location.href = '/choose-game';
  };
  if (!email) {
    return (
      <div style={{ maxWidth: 400, margin: '5rem auto', padding: '2rem', background: 'var(--color-bg-dark)', borderRadius: 16, color: 'var(--color-text-main)', textAlign: 'center', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24, color: 'var(--color-primary)' }}>Sign In Required</h1>
        <p style={{ marginBottom: 24 }}>You must be signed in to view your account dashboard.</p>
        <a href="/auth" style={{ display: 'inline-block', padding: '0.7em 2em', borderRadius: 6, background: 'var(--color-primary)', color: 'var(--color-bg-mid)', fontWeight: 700, textDecoration: 'none', fontSize: '1.1rem' }}>
          Sign In / Sign Up
        </a>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '80vh',
      maxWidth: 1000,
      margin: '2rem auto',
      background: 'var(--color-bg-dark)',
      borderRadius: 16,
      boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
      color: 'var(--color-text-main)'
    }}>
      {/* Sidebar Tabs */}
      <div style={{
        minWidth: 180,
        borderRight: '1px solid var(--color-bg-mid)',
        padding: '2rem 0',
        background: 'var(--color-bg-dark)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1.5rem 1.5rem', color: 'var(--color-primary)' }}>Account</h2>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? 'var(--color-bg-mid)' : 'none',
              color: activeTab === tab.key ? 'var(--color-primary)' : 'inherit',
              border: 'none',
              borderLeft: activeTab === tab.key ? '4px solid var(--color-primary)' : '4px solid transparent',
              textAlign: 'left',
              padding: '0.7em 1.5em',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              outline: 'none',
              borderRadius: 0,
              transition: 'background 0.2s, color 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '2.5rem 2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24, color: 'var(--color-primary)' }}>Account Dashboard</h1>
        {/* ...existing tab content... */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: 500 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Profile</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#333', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {user && user.profilePicture ? (
                    <img src={user.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#aaa', fontSize: 36 }}>👤</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => {
                        setUser(u => u ? { ...u, profilePicture: ev.target?.result as string } : u);
                        setProfileChanged(true);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label htmlFor="avatar-upload" style={{ cursor: 'pointer', color: '#38bdf8', fontSize: 14, marginTop: 6 }}>Change Image</label>
              </div>
              <div>
                {user && (
                  <>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>@{user.username}</div>
                    <div style={{ color: '#aaa', fontSize: '0.95rem' }}>{user.email}</div>
                  </>
                )}
              </div>
            </div>
            <label style={{ display: 'block', marginBottom: 8 }}>Display Name</label>
            {user && (
              <input type="text" value={user.displayName} style={{ width: '100%', marginBottom: 16 }}
                onChange={e => {
                  setUser(u => u ? { ...u, displayName: e.target.value } : u);
                  setProfileChanged(true);
                }} />
            )}
            <label style={{ display: 'block', marginBottom: 8 }}>Bio / About Me</label>
            {user && (
              <textarea value={user.bio} style={{ width: '100%', minHeight: 60, marginBottom: 16 }}
                onChange={e => {
                  setUser(u => u ? { ...u, bio: e.target.value } : u);
                  setProfileChanged(true);
                }} />
            )}
            <label style={{ display: 'block', marginBottom: 8 }}>Time Zone</label>
            {user && (
              <input type="text" value={user.timeZone} style={{ width: '100%', marginBottom: 16 }}
                onChange={e => {
                  setUser(u => u ? { ...u, timeZone: e.target.value } : u);
                  setProfileChanged(true);
                }} />
            )}
            <label style={{ display: 'block', marginBottom: 8 }}>Preferred Language</label>
            {user && (
              <input type="text" value={user.preferredLanguage} style={{ width: '100%', marginBottom: 16 }}
                onChange={e => {
                  setUser(u => u ? { ...u, preferredLanguage: e.target.value } : u);
                  setProfileChanged(true);
                }} />
            )}
            {profileChanged && (
              <button style={{ marginTop: 12, padding: '0.5em 1.2em', borderRadius: 6, background: 'var(--color-primary)', color: 'var(--color-bg-mid)', fontWeight: 700, border: 'none', fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => { setProfileChanged(false); alert('Profile saved (demo only)'); }}>
                Save Changes
              </button>
            )}
          </div>
        )}
        {/* ...rest of tab content unchanged... */}
        {activeTab === 'security' && (
          <div style={{ maxWidth: 500 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Security</h2>
            <label style={{ display: 'block', marginBottom: 8 }}>Email Address</label>
            {user && (
              <input type="email" value={user.email} style={{ width: '100%', marginBottom: 16 }}
                onChange={e => setUser(u => u ? { ...u, email: e.target.value } : u)} />
            )}
            <label style={{ display: 'block', marginBottom: 8 }}>Password</label>
            {user && (
              <input type="password" value={user.password} style={{ width: '100%', marginBottom: 16 }}
                onChange={e => setUser(u => u ? { ...u, password: e.target.value } : u)} />
            )}
            <button style={{ marginTop: 12, padding: '0.5em 1.2em', borderRadius: 6, background: 'var(--color-primary)', color: 'var(--color-bg-mid)', fontWeight: 700, border: 'none', fontSize: '1rem', cursor: 'pointer' }}
              onClick={() => alert('Security info saved (demo only)')}>Save Changes</button>
          </div>
        )}
        {activeTab === 'privacy' && (
          <div style={{ maxWidth: 500 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Privacy Settings</h2>
            <label style={{ display: 'block', marginBottom: 8 }}>Profile Visibility</label>
            {user && (
              <select value={user.privacy} style={{ width: '100%', marginBottom: 16 }}
                onChange={e => setUser(u => u ? { ...u, privacy: e.target.value } : u)}>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
              </select>
            )}
            <button style={{ marginTop: 12, padding: '0.5em 1.2em', borderRadius: 6, background: 'var(--color-primary)', color: 'var(--color-bg-mid)', fontWeight: 700, border: 'none', fontSize: '1rem', cursor: 'pointer' }}
              onClick={() => alert('Privacy settings saved (demo only)')}>Save Changes</button>
          </div>
        )}
        {activeTab === 'notifications' && (
          <div style={{ maxWidth: 500 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Notification Preferences</h2>
            <label style={{ display: 'block', marginBottom: 8 }}>Email Alerts
              {user && (
                <input type="checkbox" checked={user.notifications.email} style={{ marginLeft: 8 }}
                  onChange={e => setUser(u => u ? { ...u, notifications: { ...u.notifications, email: e.target.checked } } : u)} />
              )}
            </label>
            <label style={{ display: 'block', marginBottom: 8, marginTop: 16 }}>In-App Notifications
              {user && (
                <input type="checkbox" checked={user.notifications.inApp} style={{ marginLeft: 8 }}
                  onChange={e => setUser(u => u ? { ...u, notifications: { ...u.notifications, inApp: e.target.checked } } : u)} />
              )}
            </label>
            <button style={{ marginTop: 12, padding: '0.5em 1.2em', borderRadius: 6, background: 'var(--color-primary)', color: 'var(--color-bg-mid)', fontWeight: 700, border: 'none', fontSize: '1rem', cursor: 'pointer' }}
              onClick={() => alert('Notification preferences saved (demo only)')}>Save Changes</button>
          </div>
        )}
        {activeTab === 'characters' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Your Characters</h2>
            {/* ...existing character list code... */}
            <div style={{ display: 'flex', gap: '1rem', margin: '12px 0' }}>
              <button onClick={handleCreateCharacter} style={{ padding: '0.5em 1.2em', borderRadius: 6, background: 'var(--color-primary)', color: 'var(--color-bg-mid)', fontWeight: 700, border: 'none', fontSize: '1rem', cursor: 'pointer' }}>Create Character</button>
              <button onClick={handleImportClick} style={{ padding: '0.5em 1.2em', borderRadius: 6, background: 'var(--color-primary)', color: 'var(--color-bg-mid)', fontWeight: 700, border: 'none', fontSize: '1rem', cursor: 'pointer' }}>Import Character (JSON)</button>
              <input type="file" accept="application/json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
            <ul style={{ marginTop: 8, marginLeft: 24 }}>
              {characters.length === 0 ? (
                <li>No characters yet. Create or import one!</li>
              ) : (
                characters.map((char) => {
                  const displayName = char.data && char.data.name && typeof char.data.name === 'string' && char.data.name.trim() !== '' ? char.data.name : char.name;
                  return (
                    <li key={char.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600 }}>{displayName}</span> (ID: {char.id})
                      <button style={{ marginLeft: 12, fontSize: '0.95em', padding: '0.2em 0.8em', borderRadius: 5, border: '1px solid var(--color-primary)', background: 'var(--color-bg-mid)', color: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => {
                        const data = JSON.stringify(char, null, 2);
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${char.name || 'character'}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}>Export JSON</button>
                      <button style={{ fontSize: '0.95em', padding: '0.2em 0.8em', borderRadius: 5, border: '1px solid var(--color-primary)', background: 'var(--color-bg-mid)', color: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => {
                        window.location.href = `/character/${char.game}?charId=${char.id}`;
                      }}>Edit</button>
                      <button style={{ fontSize: '0.95em', padding: '0.2em 0.8em', borderRadius: 5, border: '1px solid #e57373', background: 'var(--color-bg-mid)', color: '#e57373', cursor: 'pointer' }} onClick={() => {
                        if (window.confirm(`Delete character '${char.name}'? This cannot be undone.`)) {
                          const updated = characters.filter((c) => c.id !== char.id);
                          saveCharacters(updated);
                        }
                      }}>Delete</button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
        {activeTab === 'campaigns' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Your Campaigns</h2>
            <ul style={{ marginTop: 8, marginLeft: 24 }}>
              <li>No campaigns yet. Create or join one!</li>
            </ul>
          </div>
        )}
        {/* Log Out button always visible */}
        <div style={{ marginTop: 32 }}>
          <button onClick={handleLogout} style={{ padding: '0.5em 1.5em', borderRadius: 6, background: 'var(--color-primary)', color: 'var(--color-bg-mid)', fontWeight: 700, border: 'none', fontSize: '1rem', cursor: 'pointer' }}>Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
