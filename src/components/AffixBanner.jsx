import React from 'react';
import './AffixBanner.css';


const affixColorMapping = {
    //Alternating by Week
    'Fortified': '#F07900',
    'Tyrannical': '#F07900',

    //Easy
    'Volcanic': '#3dff00',
    'Storming': '#3dff00',
    'Bolstering': '#3dff00',

    //Medium
    'Explosive': '#F07900',
    'Spiteful': '#F07900',
    'Grievous': '#F07900',
    'Bursting': '#F07900',

    //Hard
    'Raging': '#FF0037',
    'Quaking': '#FF0037',
    'Sanguine': '#FF0037',


    //Purple (Special - Season 2)
    'Incorporeal': '#A020F0',
    'Afflicted' : '#A020F0',
    'Entangling': '#A020F0',

    //Seasonal
    'Thundering':'#3399dd',

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
            <div className="affix-header" style={{ backgroundColor: '#282a36' }}> 
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