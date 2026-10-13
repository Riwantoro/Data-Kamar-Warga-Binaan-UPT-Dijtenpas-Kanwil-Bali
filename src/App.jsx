import React, { useState, useMemo } from "react";
import './App.css';
import InmateSearch from './components/InmateSearch';
import { Building2, Clock, LockKeyhole, LogOut, MapPin, Moon, Shield, Sun, User } from 'lucide-react';
import logo from './logo.png';
import loginLogo from './assets/logo1.png';
import inmatesData from './components/wbp.json';

const USERS = ['Ditjenpas Kanwil Bali'];
const LOGIN_PASSWORD = '12345678';
const UPTS = [
  { id: 'kerobokan', name: 'Lapas Kelas IIA Kerobokan', region: 'Kabupaten Badung', available: true, capacity: 1470 },
  { id: 'narkotika-bangli', name: 'Lapas Narkotika Kelas IIA Bangli', region: 'Kabupaten Bangli' },
  { id: 'singaraja', name: 'Lapas Kelas IIB Singaraja', region: 'Kabupaten Buleleng' },
  { id: 'karangasem', name: 'Lapas Kelas IIB Karangasem', region: 'Kabupaten Karangasem' },
  { id: 'tabanan', name: 'Lapas Kelas IIB Tabanan', region: 'Kabupaten Tabanan' },
  { id: 'perempuan-denpasar', name: 'Lapas Perempuan Kelas IIA Denpasar', region: 'Kota Denpasar / Badung' },
  { id: 'negara', name: 'Rutan Kelas IIB Negara', region: 'Kabupaten Jembrana' },
  { id: 'rutan-bangli', name: 'Rutan Kelas IIB Bangli', region: 'Kabupaten Bangli' },
  { id: 'klungkung', name: 'Rutan Kelas IIB Klungkung', region: 'Kabupaten Klungkung' },
  { id: 'gianyar', name: 'Rutan Kelas IIB Gianyar', region: 'Kabupaten Gianyar' },
  { id: 'lpka-karangasem', name: 'LPKA Kelas II Karangasem', region: 'Kabupaten Karangasem' },
];

const App = () => {
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem('riwantoro-user');
    return USERS.find((user) => user.toLowerCase() === savedUser?.toLowerCase()) || null;
  });
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [selectedUptId, setSelectedUptId] = useState(() => localStorage.getItem('riwantoro-upt') || 'kerobokan');
  const selectedUpt = UPTS.find((upt) => upt.id === selectedUptId) || UPTS[0];

  const kerobokanStats = useMemo(() => {
    const dateKey = Object.keys(inmatesData)[0];
    const rawList = dateKey ? inmatesData[dateKey] : [];
    const total = Math.max((rawList?.length || 0) - 1, 0);

    const formatDateKey = (key) => {
      if (!key) return "-";
      const parts = key.split("_");
      if (parts.length !== 3) return key;
      const [day, month, year] = parts;
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const monthIndex = Number(month) - 1;
      const monthLabel = months[monthIndex] || month;
      return `${day} ${monthLabel} ${year}`;
    };

    return {
      totalData: total,
      lastUpdate: formatDateKey(dateKey),
    };
  }, []);
  const totalData = kerobokanStats.totalData;
  const lastUpdate = kerobokanStats.lastUpdate;
  const overcapacity = selectedUpt.capacity
    ? Math.max(0, ((totalData - selectedUpt.capacity) / selectedUpt.capacity) * 100)
    : null;

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle("dark-mode", newDarkMode);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const username = USERS.find((user) => user.toLowerCase() === credentials.username.trim().toLowerCase());
    if (!username || credentials.password !== LOGIN_PASSWORD) {
      setLoginError('Username atau password tidak sesuai.');
      return;
    }
    localStorage.setItem('riwantoro-user', username);
    setLoggedInUser(username);
    setLoginError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('riwantoro-user');
    setLoggedInUser(null);
    setCredentials({ username: '', password: '' });
  };

  if (!loggedInUser) {
    return (
      <div className="login-page">
        <div className="login-card">
          <img src={loginLogo} alt="Data Kamar Warga Binaan" className="login-logo" />
          <div className="login-heading">
            <p className="login-eyebrow">Ditjenpas Kanwil Bali</p>
            <h1>Data Kamar Warga Binaan</h1>
            <p>Masuk untuk mengakses data warga binaan.</p>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <label>
              <span>Username</span>
              <div className="login-input"><User size={18} /><input autoComplete="username" value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} placeholder="Masukkan username" required /></div>
            </label>
            <label>
              <span>Password</span>
              <div className="login-input"><LockKeyhole size={18} /><input type="password" autoComplete="current-password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} placeholder="Masukkan password" required /></div>
            </label>
            {loginError && <p className="login-error" role="alert">{loginError}</p>}
            <button className="login-button" type="submit">Masuk ke Tracker</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Animated Background Elements */}
      <div className="bg-decoration">
        <div className="circle-1"></div>
        <div className="circle-2"></div>
        <div className="circle-3"></div>
      </div>

      <header className="App-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-wrapper">
              <img src={logo} alt="Logo" className="App-logo" />
            </div>
            <div className="title-section">
              <h1>Data Kamar Warga Binaan</h1>
              <p className="subtitle">UPT Ditjenpas Kanwil Bali</p>
            </div>
          </div>
          <button className="toggle-mode-btn" onClick={toggleDarkMode}>
            {darkMode ? (
              <>
                <Sun size={18} />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={18} />
                <span>Dark</span>
              </>

      
            )}
          </button>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <Shield size={20} />
            <div>
              <span className="stat-label">{selectedUpt.available ? 'Total Data' : 'Data Contoh'}</span>
              <span className="stat-value">{totalData.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <Building2 size={20} />
            <div>
              <span className="stat-label">Kapasitas</span>
              <span className="stat-value">{selectedUpt.capacity ? `${selectedUpt.capacity.toLocaleString('id-ID')} orang` : 'Belum diatur'}</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <Shield size={20} />
            <div>
              <span className="stat-label">Overkapasitas</span>
              <span className="stat-value">{overcapacity === null ? 'Belum diatur' : `${overcapacity.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`}</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <Clock size={20} />
            <div>
              <span className="stat-label">{selectedUpt.available ? 'Last Update' : 'Tanggal Data Contoh'}</span>
              <span className="stat-value">{lastUpdate}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="upt-picker" aria-labelledby="upt-picker-title">
        <div className="upt-picker-heading">
          <div><span className="upt-eyebrow">Pilih unit kerja</span><h2 id="upt-picker-title">Lokasi UPT</h2></div>
          <Building2 size={24} aria-hidden="true" />
        </div>
        <div className="upt-grid">
          {UPTS.map((upt) => (
            <button key={upt.id} className={`upt-card${selectedUpt.id === upt.id ? ' is-selected' : ''}`} onClick={() => {
              setSelectedUptId(upt.id);
              localStorage.setItem('riwantoro-upt', upt.id);
              setQuery('');
            }} aria-pressed={selectedUpt.id === upt.id}>
              <span className="upt-card-icon"><Building2 size={19} /></span>
              <span className="upt-card-copy"><strong>{upt.name}</strong><small><MapPin size={13} />{upt.region}</small></span>
              <span className={`upt-status${upt.available ? ' is-ready' : ''}`}>{upt.available ? 'Data tersedia' : 'Contoh Kerobokan'}</span>
            </button>
          ))}
        </div>
      </section>

      {!selectedUpt.available && (
        <aside className="demo-data-notice" role="note">
          <strong>Data contoh Kerobokan.</strong> Data Lapas Kerobokan ditampilkan untuk {selectedUpt.name}; ini bukan data resmi UPT tersebut.
        </aside>
      )}

      <div className="user-session">
        <span>Masuk sebagai <strong>{loggedInUser}</strong></span>
        <button onClick={handleLogout}><LogOut size={16} /> Keluar</button>
      </div>

      <main>
        <InmateSearch query={query} isLoading={false} handleInputChange={handleInputChange} />
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <div className="footer-badge">
            <Shield size={16} />
            <span>Data Kamar Warga Binaan</span>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-info">
            <p>All rights RiwantoroTech</p>
          </div>
        </div>
        <div className="footer-wave"></div>
      </footer>
    </div>
  );
};

export default App;
