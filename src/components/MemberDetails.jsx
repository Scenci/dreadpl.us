import React, { useEffect, useState } from 'react';
import './MemberDetails.css';

// Calculator function (unchanged)
const calculateMPS = (keyLevel1, keyLevel2) => {
  if (isNaN(keyLevel1) || isNaN(keyLevel2)) return "";
  const UP = 5 * Math.min(0.05 / 0.4, 1);
  const higherKey = Math.max(keyLevel1, keyLevel2);
  const lowerKey = Math.min(keyLevel1, keyLevel2);
  const bestKey = ((100 + (higherKey - 10) * 7) + UP) * 1.5;
  const alternateKey = ((100 + (lowerKey - 10) * 7) + UP) * 0.5;
  return (bestKey + alternateKey).toFixed(2);
};

// Normalize strings for comparison (case-insensitive, trimmed)
const normalize = (str) => str?.toLowerCase().trim() || '';

// Find lowest alternate run and highest best run, safely
const findLowestAlternateHighestBest = (dungeonData, character) => {
  if (!character?.name || !character?.realm) return null;

  const characterData = dungeonData.find(
    data =>
      normalize(data.character?.name) === normalize(character.name) &&
      normalize(data.character?.realm) === normalize(character.realm)
  );
  if (!characterData) return { lowestAlternate: null, highestBest: null, newScore: null };

  const altRuns  = characterData.mythic_plus_alternate_runs || [];
  const bestRuns = characterData.mythic_plus_best_runs      || [];

  const lowestAlternate = altRuns.length
    ? altRuns.reduce((min, run) => (run.score < min.score ? run : min), { score: Infinity })
    : null;

  const highestBest = bestRuns.length
    ? bestRuns.reduce((max, run) => (run.score > max.score ? run : max), { score: -Infinity })
    : null;

  const newScore =
    lowestAlternate && highestBest
      ? calculateMPS(highestBest.mythic_level, lowestAlternate.mythic_level)
      : null;

  return { lowestAlternate, highestBest, newScore };
};

// Find highest best run for a specific dungeon
const findHighestKeyForDungeon = (dungeonData, character, dungeon) => {
  if (!character?.name || !character?.realm) return null;
  const characterData = dungeonData.find(
    data =>
      normalize(data.character?.name) === normalize(character.name) &&
      normalize(data.character?.realm) === normalize(character.realm)
  );
  if (!characterData) return null;
  return characterData.mythic_plus_best_runs?.find(run => run.short_name === dungeon) || null;
};

// Score table builder (unchanged)
const calculateScoreTable = (lowestAlternate, highestBestSameDungeon, highestBest) => {
  const table = [];
  const diff = highestBest.mythic_level - lowestAlternate.mythic_level;
  for (let i = 1; i <= diff; i++) {
    const newLevel = lowestAlternate.mythic_level + i;
    const newScore = calculateMPS(highestBestSameDungeon.mythic_level, newLevel);
    const baseScore = (lowestAlternate.score * 0.5) + (highestBestSameDungeon.score * 1.5);
    const delta = (newScore - baseScore).toFixed(2);
    table.push({ increment: i, newLevel, delta });
  }
  return table;
};

const MemberDetails = ({ dungeonData, character }) => {
  const { lowestAlternate, highestBest } = findLowestAlternateHighestBest(dungeonData, character);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, [character]);

  // **EARLY RETURN** if we have no data
  if (!lowestAlternate || !highestBest) {
    return (
      <div className={`member-details ${isRendered ? 'slide-down' : ''}`}>
        <h2>{character.name}</h2>
        <p>No Mythic+ runs available for this member this season.</p>
      </div>
    );
  }

  // Safe to use lowestAlternate.short_name now
  const highestBestSameDungeon = findHighestKeyForDungeon(
    dungeonData,
    character,
    lowestAlternate.short_name
  );

  const scoreTable = calculateScoreTable(lowestAlternate, highestBestSameDungeon, highestBest);

  return (
    <div className={`member-details ${isRendered ? 'slide-down' : ''}`}>
      <h2>{character.name}</h2>

      <p className="best-key">
        Best Key: {highestBest.short_name} +{highestBest.mythic_level}
      </p>
      <p className="lowest-key">
        Lowest Key: {lowestAlternate.short_name} +{lowestAlternate.mythic_level}
      </p>

      <div className="score-table">
        <h3>Lowest Key Improvements</h3>
        <div className="score-table-header">
          <span>Dungeon</span>
          <span>Score Improvement</span>
        </div>
        {scoreTable.map((row, idx) => (
          <div key={idx} className="score-table-row">
            <span>
              {lowestAlternate.short_name} +{row.newLevel}
            </span>
            <span>+{row.delta} points</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberDetails;
