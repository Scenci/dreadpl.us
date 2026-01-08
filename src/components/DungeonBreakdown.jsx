import React, { useState } from 'react';
import './DungeonBreakdown.css';

const DungeonBreakdown = ({ dungeonData, setKeyLevels }) => {

  const [highlightedDungeon, setHighlightedDungeon] = useState(null);
  const [highlightedColumnType, setHighlightedColumnType] = useState(null);

  const dungeons = [
    "BH",
    "FH",
    "HOI",
    "NL",
    "NELT",
    "UNDR",
    "VP",
    "ULD"
  ];


  const handleClick = (dungeonName, columnType) => {
    setHighlightedDungeon(dungeonName);
    setHighlightedColumnType(columnType);
  };


  const handleLoadData = (data) => {
    console.log("load data: ", data);
    const tyrannicalBestRuns = filterDungeonsByType(data.mythic_plus_best_runs, 'Tyrannical');
    const fortifiedBestRuns = filterDungeonsByType(data.mythic_plus_best_runs, 'Fortified');
    const tyrannicalAlternateRuns = filterDungeonsByType(data.mythic_plus_alternate_runs, 'Tyrannical');
    const fortifiedAlternateRuns = filterDungeonsByType(data.mythic_plus_alternate_runs, 'Fortified');

    const tyrannicalRuns = tyrannicalBestRuns.concat(tyrannicalAlternateRuns);
    const fortifiedRuns = fortifiedBestRuns.concat(fortifiedAlternateRuns);

    const newKeyLevels = dungeons.reduce((acc, dungeon) => {
      const tyrannicalRun = tyrannicalRuns.find(run => run.short_name === dungeon);
      const fortifiedRun = fortifiedRuns.find(run => run.short_name === dungeon);
      acc[dungeon] = [
        tyrannicalRun ? tyrannicalRun.mythic_level : '',
        fortifiedRun ? fortifiedRun.mythic_level : ''
      ];
      return acc;
    }, {});

    setKeyLevels(newKeyLevels);
  };

  function filterDungeonsByType(dungeonRuns = [], type) {
    return dungeonRuns
      .filter((run) => run.affixes.some((affix) => affix.name === type))
      .map((run) => ({ ...run, columnType: type }));
  };

  return (
    <div className="dungeon-breakdown-container">
      <h2 className="dungeon-breakdown-title">Dungeon Breakdown</h2>
      <div className="dungeon-breakdown-grid">
        {dungeonData.map((data, index) => {
          const bestRuns = data.mythic_plus_best_runs || [];
          const altRuns = data.mythic_plus_alternate_runs || [];
          const allRuns = bestRuns.concat(altRuns);

          const tyrannicalRuns = filterDungeonsByType(allRuns, 'Tyrannical');
          const fortifiedRuns = filterDungeonsByType(allRuns, 'Fortified');
          //console.log("data DB Breakdown: ",data);

          return (
            <div key={index} className="member-dungeons">
              <div className="member-name">{data.character.name}</div>
              <div className="run-types">
                <div className="fortified-runs">
                  <h3>Fortified</h3>
                  <ul>
                    {fortifiedRuns.map((run, i) => (
                      <div key={i} className={`dungeon-info ${run.dungeon === highlightedDungeon &&
                          run.columnType === highlightedColumnType
                          ? 'highlight'
                          : ''
                        }`}
                        onClick={() => handleClick(run.dungeon, run.columnType)}>
                        <span className="fdungeon-name">{run.short_name}</span>
                        <span className="fdungeon-level">+{run.mythic_level}</span>
                      </div>
                    ))}
                  </ul>
                </div>
                <div className="tyrannical-runs">
                  <h3>Tyrannical</h3>
                  <ul>
                    {tyrannicalRuns.map((run, i) => (
                      <div key={i} className={`dungeon-info ${run.dungeon === highlightedDungeon &&
                          run.columnType === highlightedColumnType
                          ? 'highlight'
                          : ''
                        }`}
                        onClick={() => handleClick(run.dungeon, run.columnType)}>
                        <span className="tdungeon-name">{run.short_name}</span>
                        <span className="tdungeon-level">+{run.mythic_level}</span>

                      </div>
                    ))}
                  </ul>
                </div>


              </div>
              <div className="button-container-load">
                <button onClick={() => handleLoadData(data)}>Load Calculator</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

};

export default DungeonBreakdown;
