import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Add this line
import Cookies from 'js-cookie'; // Add this line
import './CharacterSearch.css';

const CharacterSearch = (props) => {
  const [searchText, setSearchText] = useState('');
  const [searchCategory, setSearchCategory] = useState('Frostmane');

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  const onCharacterSearch = async (query) => {
    try {
      const result = await axios(`https://raider.io/api/v1/characters/profile?region=us&realm=${searchCategory}&name=${searchText}`);
      props.onCharacterSearch(result.data);
      Cookies.set('characterData', result.data, { expires: 7 }); // Store the character data in a cookie
      console.log(result);
    } catch (error) {
      console.error('Error fetching character data:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Search Text:', searchText);
    console.log('Search Category:', searchCategory);

    onCharacterSearch(searchCategory, searchText);
  };

  return (
    <div className="search-elements-wrapper">
      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="searchCategory" className="search-label">Realm:</label>
        <select value={searchCategory} onChange={handleCategoryChange} className="search-select">
        <option value="Ner'zhul">Ner'zhul</option>
            <option value="Frostmane">Frostmane</option>
            <option value="Cairne">Cairne</option>
            <option value="Cenarius">Cenarius</option>
            <option value="Perenolde">Perenolde</option>
            <option value="Tortheldrin">Tortheldrin</option>
            <option value="Tichondrius">Tichondrius</option>
            <option value="Mal'ganis">Mal'ganis</option>
            <option value="Illidan">Illidan</option>
        </select>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          className="search-input"
          placeholder="Character Name"
        />
        <button type="submit" className="search-btn">Search Character</button>
      </form>
    </div>
  );
};

export default CharacterSearch;
