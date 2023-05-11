import React, { useState } from 'react';
import "./MythicPlusCalculator.css";

const MythicPlusCalculator = ({keyLevels, setKeyLevels}) => {

  const [error, setError] = useState("");

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

  const generateInitialUnderPercentageState = () => {
    const initialState = {};
  
    dungeons.forEach((dungeon) => {
      initialState[dungeon] = { 0: 0.05, 1: 0.05 };
    });
  
    return initialState;
  };

  //Really important State Set here
  const [underPercentageState, setUnderPercentageState] = useState(generateInitialUnderPercentageState());

  const getScoreColor = (score) => {
    const scoreRange = Object.keys(scoreColorMapping).find((range) => score > parseFloat(range));
    return scoreRange ? scoreColorMapping[scoreRange] : 'white';
  };

  const handleInputChange = (dungeon, index, value) => {
    if (value > 35) {
      setError("You wish");
      return;
    } else if( value < 0 ) {
      setError("Key Values must be greater than or equal to 11");
      return;
    }else{
        setError("");
    }
    
    const newKeyLevels = { ...keyLevels };
    if (!newKeyLevels[dungeon]) {
      newKeyLevels[dungeon] = ['', ''];
    }
    newKeyLevels[dungeon][index] = value;
    setKeyLevels(newKeyLevels);
  };

  
  const calculateTimeBonus = (underPercentage) => {
    var timeBonus = 5;
    if(underPercentage >= 0.4){
      return timeBonus;
    } else if(underPercentage >= 0.2){
      timeBonus = 5 * underPercentage / 0.4;
      return timeBonus;
    } else {
        timeBonus = 5 * Math.min(underPercentage / 0.4 , 1);
        return timeBonus;
      }
    };
    

  const calculateMPS = (keyLevel1, keyLevel2, underPercentage1, underPercentage2) => {
    if (isNaN(keyLevel1) || isNaN(keyLevel2)) {
      return 0;
    }
    const TimeBonus1 = calculateTimeBonus(underPercentage1);
    const TimeBonus2 = calculateTimeBonus(underPercentage2);
  
    const higherKey = Math.max(keyLevel1, keyLevel2);
    const lowerKey = Math.min(keyLevel1, keyLevel2);
    const bestKey = ((100 + (higherKey - 10) * 7) + TimeBonus1) * 1.5;
    const alternateKey = ((100 + (lowerKey - 10) * 7) + TimeBonus2) * 0.5;
    return (bestKey + alternateKey).toFixed(2);
  };
  
  const calculateTotalMPS = () => {
    let total = 0;
    for (const dungeon in keyLevels) {
      total += parseFloat(calculateMPS(
        keyLevels[dungeon] ? keyLevels[dungeon][0] : "",
        keyLevels[dungeon] ? keyLevels[dungeon][1] : "",
        underPercentageState[dungeon] ? underPercentageState[dungeon][0] : 0.05,
        underPercentageState[dungeon] ? underPercentageState[dungeon][1] : 0.05
      ));
    }
    return isNaN(total.toFixed(2)) ? "Please Enter your Keys" : total.toFixed(2);
  };

  const handleToggleClick = (dungeon, index) => {
    setUnderPercentageState((prevState) => {
      const currentValue = (prevState[dungeon] && prevState[dungeon][index]) || 0.05;
      const nextValue = (currentValue === 0.05) ? 0.2 : ((currentValue === 0.2) ? 0.4 : 0.05);
      return {
        ...prevState,
        [dungeon]: {
          ...prevState[dungeon],
          [index]: nextValue,
        },
      };
    });
  };

  //variable text for the timing bonus buttons, based on the underPercentage value currently set on button
  const getCustomText = (value) => {
    if (value === 0.05) {
      return '+1';
    } else if (value === 0.2) {
      return '+2';
    } else {
      return '+3';
    }
  };

//RenderInputPairs Starts Here
const renderInputPairs = () => {
  return (
    <div className="dungeon-grid">
      <div className="header-row">
        <div className="dungeon-name"></div>
        <div className="tyrannical-column">
          <label>Fortified&#8239;&#8239;&thinsp;&thinsp;&thinsp;&thinsp;&#8239;&#8239;&#8239;</label>
        </div>
        <div className="fortified-column">
          <label>Tyrannical</label>
        </div>
        <div className="sum-display"></div>
      </div>
      {dungeons.map((dungeon, i) => (
        <div key={i} className="dungeon-row">
          <div className="dungeon-name">{dungeon}</div>
          <div className="fortified-column">
        <button className="toggle-button" onClick={() => handleToggleClick(dungeon, 1)}>
        {getCustomText((underPercentageState[dungeon] && underPercentageState[dungeon][1]) || 0.05)}
        </button>
            <input
              id={`input-${i + 8}`}
              type="number"
              value={keyLevels[dungeon] ? keyLevels[dungeon][1] : ''}
              onChange={(e) => handleInputChange(dungeon, 1, e.target.value)}
              className="small-input"
            />
          </div>
          <div className="tyrannical-column">
        <button className="toggle-button" onClick={() => handleToggleClick(dungeon, 0)}>
        {getCustomText((underPercentageState[dungeon] && underPercentageState[dungeon][0]) || 0.05)}
        </button>
        <input
              id={`input-${i}`}
              type="number"
              value={keyLevels[dungeon] ? keyLevels[dungeon][0] : ''}
              onChange={(e) => handleInputChange(dungeon, 0, e.target.value)}
              className="small-input"
            />
          </div>
          
          <div className="sum-display">
        ={" "}
        {calculateMPS(
          keyLevels[dungeon] ? keyLevels[dungeon][0] : "",
          keyLevels[dungeon] ? keyLevels[dungeon][1] : "",
          underPercentageState[dungeon] ? parseFloat(underPercentageState[dungeon][0]) : 0.05,
          underPercentageState[dungeon] ? parseFloat(underPercentageState[dungeon][1]) : 0.05
        )}
      </div>
        </div>
      ))}
    </div>
  );
};

  

  
  return (
    <div className="mythic-plus-calculator">
      <h2>
        <u>Mythic Plus Calculator</u>
      </h2>
      {renderInputPairs()}
      {error && <p className="error-message">{error}</p>}
      <div>
     
        <h3 style={{ color: 'white' }}>Approximate Mythic Plus Score:
        <span 
          style={{ color: isNaN(calculateTotalMPS()) ? '#ed5b45' : getScoreColor(calculateTotalMPS()) }}> {calculateTotalMPS()}</span></h3>
      </div>
    </div>
  );
};

export default MythicPlusCalculator;
