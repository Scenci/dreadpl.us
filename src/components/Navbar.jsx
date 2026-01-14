import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './Navbar.css';


const Navbar = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expansion, setExpansion] = useState('Midnight');
  const [season, setSeason] = useState('Preseason');

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const res = await axios.get('https://raider.io/api/v1/mythic-plus/season-index');
        const seasons = res?.data?.seasons;
        if (Array.isArray(seasons) && seasons.length > 0) {
          const current = seasons.find(s => s.is_current || s.isCurrent) || seasons[0];
          if (current?.name) {
            const parts = current.name.split(':').map(s => s.trim());
            if (parts[0]) setExpansion(parts[0]);
            if (parts[1]) setSeason(parts[1]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch season data', err);
      }
    };
    fetchSeason();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <a href="/" className="nav-logo" data-text="Dread+">Dread+</a>

      <div className="nav-banner-container">
    <div className="nav-banner">
      <h1 >
        {`${expansion}: ${season}`}
      </h1>
    </div>
  </div>



      <ul className="nav-links">
      <li className="nav-item-dropdown">
          <button onClick={toggleDropdown} className="nav-dropdown-button">
            Useful Links
          </button>
          {dropdownOpen && (
            <ul className="nav-dropdown">
                <li>
                <a href="https://keystone-calculator.com" target="_blank" rel="noreferrer">
                  Keystone Calculator
                </a>
              </li>
              <li>
                <a href="https://raider.io/" target="_blank" rel="noreferrer">
                  RaiderIO
                </a>
              </li>
              <li>
                <a href="https://www.warcraftlogs.com/" target="_blank" rel="noreferrer">
                  Warcraft Logs
                </a>
              </li>
              <li>
                <a href="https://www.raidbots.com/simbot" target="_blank" rel="noreferrer">
                  RAIDBOTS Simming
                </a>
              </li>
            </ul>
          )}
        </li>
        <li className="nav-item-playlists">
          <Link to="/playlists" className="nav-dropdown-button">Playlists</Link>
        </li>
        <li className="nav-item-about">
        <ScrollLink
            activeClass="active"
            to="about"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            >About
          </ScrollLink>
        </li>
       
      </ul>
    </nav>
  );
};

export default Navbar;
