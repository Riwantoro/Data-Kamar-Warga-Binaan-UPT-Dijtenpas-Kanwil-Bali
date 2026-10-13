import React, { useState, useMemo } from "react";
import './App.css';
import InmateSearch from './components/InmateSearch';
import { Building2, Clock, MapPin, Moon, Shield, Sun } from 'lucide-react';
import logo from './logo.png';
import inmatesData from './components/wbp.json';

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
  const totalData = selectedUpt.available ? kerobokanStats.totalData : 0;
  const lastUpdate = selectedUpt.available ? kerobokanStats.lastUpdate : '-';
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
              <span className="stat-label">Total Data</span>
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
              <span className="stat-label">Last Update</span>
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
              <span className={`upt-status${upt.available ? ' is-ready' : ''}`}>{upt.available ? 'Data tersedia' : 'Segera tersedia'}</span>
            </button>
          ))}
        </div>
      </section>

      <main>
        {selectedUpt.available ? (
          <InmateSearch query={query} isLoading={false} handleInputChange={handleInputChange} />
        ) : (
          <section className="upt-empty-state">
            <div className="upt-empty-icon"><Building2 size={28} /></div>
            <p className="upt-eyebrow">{selectedUpt.region}</p>
            <h2>{selectedUpt.name}</h2>
            <p>Data untuk UPT ini belum tersedia. Fitur pencarian akan aktif setelah sumber datanya ditambahkan.</p>
          </section>
        )}
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
