import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import * as d3 from 'd3';
import './loadingScreen.css';
import './App.css';
import Navbar from './components/Navbar';
import Member from './components/Member';
import teamMembers from './teamMembers';
import MemberDetails from './components/MemberDetails';
import useDocumentTitle from './useDocumentTitle';
import DungeonBreakdown from './components/DungeonBreakdown';


import About from './components/About';
import AffixBanner from './components/AffixBanner';
import ClockBanner from './components/ClockBanner';
import Footer from './components/Footer';

import Analytics from './pages/Analytics';

import Playlists from './pages/Playlists';

import BlackHole from './components/BlackHole';



function App() {
  const [characters, setCharacters] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [dungeonData, setDungeonData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [affixes, setAffixes] = useState([]);
  const [dbdVisible, setDBDVisible] = useState(false);


  useDocumentTitle('Dread Mythic+');

  //Fetching Dungeon Data per Member TODO COMBINE
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const promises = teamMembers.map(async (defaultCharacter) => {
          const result = await axios(
            `https://raider.io/api/v1/characters/profile?region=us&realm=${defaultCharacter.server}&name=${defaultCharacter.name}&fields=mythic_plus_scores_by_season%3Acurrent%2Cmythic_plus_best_runs%3Aall%2Cmythic_plus_alternate_runs%3Aall`
          );

          const combinedData = {
            character: result.data,
            mythic_plus_best_runs: result.data.mythic_plus_best_runs,
            mythic_plus_alternate_runs: result.data.mythic_plus_alternate_runs,
          };

          return combinedData;
        });

        const results = await Promise.all(promises);
        // Process the results and update the state here

        setCharacters(results.map(result => result.character));
        setDungeonData(results);

      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    const fetchAffixes = async () => {
      try {
        const response = await axios.get('https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=en');
        setAffixes(response.data.title);


      } catch (error) {
        console.error("Error fetching affixes:", error);
      }
    };


    fetchTeamMembers();
    fetchAffixes();


    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);


  const handleMemberClick = (name, realm) => {
    if (selectedMember && name === selectedMember.name && realm === selectedMember.realm) {
      setSelectedMember(null);
      setDBDVisible(false);
    } else {
      setSelectedMember({ name, realm });
      setDBDVisible(true);
    }

  };

  /* I may want this for a future iteration... cookie storage and add/remove
  const handleCharacterSearch = (newCharacter) => {
    setCharacters((prevCharacters) => [...prevCharacters, newCharacter]);
  };
  */

  const handleRemoveMember = (name, realm) => {
    const prevCharacters = characters.filter(
      (character) => character.name !== name || character.realm !== realm
    );
    const prevDungeonData = dungeonData.filter(
      (data) => data.character.name !== name || data.character.realm !== realm
    );

    setCharacters(prevCharacters);
    setDungeonData(prevDungeonData);
  };


  console.log('App.js dungeonData:', dungeonData);

  return (
    <BrowserRouter>
      <BlackHole />

      <div className="page-container">
        <Routes>
          <Route path="/"
            element={
              <>
                {isLoading ? (
                  <div className="loading-screen">
                    <div className="lds-ring-container">
                      <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="App">
                      <Navbar />
                      <div className="content">
                        <div className="affix-container">
                          {/*<ClockBanner/>*/}
                          {/*<AffixBanner affixes={affixes} />*/}
                          {console.log(affixes)}
                        </div>
                        <div className="members-container">
                          {characters
                            .sort((a, b) => {
                              const aScore = a.mythic_plus_scores_by_season[0].scores.all;
                              const bScore = b.mythic_plus_scores_by_season[0].scores.all;
                              return bScore - aScore;
                            })
                            .map((character, index) => (
                              <Member
                                key={`${character.name}-${character.realm}`}
                                id={index}
                                character={character}
                                onMemberClick={() => handleMemberClick(character.name, character.realm)}
                                onRemoveMember={() => handleRemoveMember(character.name, character.realm)}
                                hideRemoveBtn={dbdVisible}
                              />
                            ))}
                        </div>


                        {selectedMember && dbdVisible && (
                          <MemberDetails
                            dungeonData={dungeonData}
                            character={selectedMember}
                          />
                        )}
                      </div>
                    </div>
                    <main>
                      <DungeonBreakdown
                        dungeonData={dungeonData.slice().sort((a, b) => {
                          const aScore = a.character.mythic_plus_scores_by_season[0].scores.all;
                          const bScore = b.character.mythic_plus_scores_by_season[0].scores.all;
                          return bScore - aScore;
                        })}
                      />





                    </main>
                    <div className="about">
                      <About ></About>
                    </div>
                    <div className="footer">
                      <Footer />
                    </div>
                  </>
                )}
              </>
            }
          />

          <Route
            path="/playlists"
            element={
              <>
                <Navbar />
                <Playlists />
                <Footer />
              </>
            }
          />

          {/*<Route path="analytics"
          element={<Analytics />}
      />*/}

        </Routes>
      </div>
    </BrowserRouter>
  );
}


export default App;