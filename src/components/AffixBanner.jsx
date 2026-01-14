import React from 'react';
import './AffixBanner.css';


const affixColorMapping = {
    //Alternating by Week
    'Fortified': '#F07900',
    'Tyrannical': '#F07900',
    
    'Xal\'atath\'s Bargain: Pulsar':'#54b4e7',
    'Xal\'atath\'s Bargain: Devour':'#0096FF',
    'Xal\'atath\'s Guile':'#268050',

    '': 'white'
  };


const parseAffixes = (affixesString) => {
    affixesString = affixesString + '';
    return affixesString.split(`, `).map(affix => affix.trim());
};


//component starts here
const AffixBanner = ({ affixes }) => {
    const affixNames = parseAffixes(affixes);

    return(
            <div className="affix-header" style={{ backgroundColor: 'transparent' }}> 
                {affixNames.reduce((acc, affix, index) => {

            acc.push(
                <span key={affix} style={{ color: affixColorMapping[affix], marginLeft: '6px', marginRight:'6px'}}>
                {affix}
                </span>
            );

            if (index !== affixNames.length - 1) {
                acc.push(' ');
            }
            return acc;
            }, [])}
            </div>  

    );

};

export default AffixBanner;