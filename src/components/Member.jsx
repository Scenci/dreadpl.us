import React from 'react';
import './Member.css';

import tankIcon from '../images/tank.png';
import healingIcon from '../images/healer.png';
import dpsIcon from '../images/damage.png';

const roleIconMapping = {
  TANK: tankIcon,
  HEALING: healingIcon,
  DPS: dpsIcon,
};

const getRoleIcon = (role) => {
  return roleIconMapping[role] || '';
};

const scoreColorMapping = {
  '3450.0': '#ff8000',
  '3290.0': '#f9753c',
  '3170.0': '#f26b5b',
  '3050.0': '#ea6078',
  '2930.0': '#df5693',
  '2810.0': '#d24cad',
  '2690.0': '#c242c8',
  '2570.0': '#ad38e3',
  '2430.0': '#9544eb',
  '2310.0': '#7c55e7',
  '2190.0': '#5e62e3',
  '2070.0': '#316cdf',
  '1905.0': '#2d79d4',
  '1785.0': '#4787c4',
  '1665.0': '#5496b5',
  '1545.0': '#5ca5a5',
  '0.0': 'white',
};

const getScoreColor = (score) => {
  const scoreRange = Object.keys(scoreColorMapping).find((range) => score > parseFloat(range));
  return scoreRange ? scoreColorMapping[scoreRange] : 'white';
};

//Member Component Starts Here!
const Member = ({ id, character, onMemberClick, onRemoveMember, hideRemoveBtn }) => {
  const displayCharacter = character;
  const roleIcon = getRoleIcon(displayCharacter.active_spec_role);

  const score = displayCharacter.mythic_plus_scores_by_season[0].scores.all;

  const color = getScoreColor(score);
  const scoreStyle = {
    color: color,
    fontWeight: 'bold',
  };

  return (
    <div className="member" style={{ '--score-color': color }} onClick={() => onMemberClick(character)}>


      <img src={displayCharacter.thumbnail_url} alt={`${displayCharacter.name} thumbnail`} className="member-image" />
      <h3 className="member-name">{displayCharacter.name}</h3>
      <img src={roleIcon} alt={displayCharacter.active_spec_role} className="member-role-icon" />
      <p className="member-class-spec"> {displayCharacter.class}</p>
      <p className="member-spec"> {displayCharacter.active_spec_name}</p>
      <p className="member-score" style={scoreStyle}>{score}</p>

      <button
        className="redirect-btn"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the onMemberClick event
          e.preventDefault(); // Prevent default link behavior
          window.open(displayCharacter.profile_url, "_blank");
        }}
      >
        <img
          src={require('../images/redirect.png')}
          alt="Raider IO"
          className="redirect-icon"
        />
      </button>

      {!hideRemoveBtn && (
        <button
          className="remove-member-btn"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the onMemberClick event
            e.preventDefault(); // Prevent default link behavior
            onRemoveMember(id);
          }}
        >
          Hide
        </button>
      )}
    </div>
  );
};


export default Member;
