import React, { useState, useEffect, Component } from 'react';
import Radium from 'radium';
import Axios from 'axios';

function InputText(props) {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  function handleEnterKey(e) {
    if (e.key === 'Enter') {
      searchBooks(searchValue).then((response) => setSearchResult(response));
    }
  }

  useEffect(() => {
    props.callbackSearchResult(searchResult);
  }, [searchResult]);

  function handleValueSearch(e) {
    setSearchValue(e.target.value);
  }

  async function searchBooks(value) {
    const response = await Axios.get('https://www.goodreads.com/search/index.xml?key=oReOMp1kUkxEq21hms4w&q=' + value);

    try {
      const data = await response.data;
      let parsedResponse = new DOMParser().parseFromString(data, 'application/xml');
      let results = parsedResponse.getElementsByTagName('results')[0].children;
      return results;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <input type="text" style={styles.base} placeholder={props.placeholder} name={props.name} onKeyDown={handleEnterKey} onChange={handleValueSearch}>
      {props.children}
    </input>
  );
}

let styles = {
  base: {
    background: '#272343',
    border: '1px solid #454161',
    borderRadius: '15px',
    color: '#646082',
    fontSize: '14px',
    height: '15px',
    padding: '10px',
    WebkitAppereance: 'none',
    width: '50%',

    ":focus": {
      border: '1px solid #487AF0',
      boxShadow: 'none',
      outline: 'none',
      WebkitAppereance: 'none'
    }
  }
};

export default Radium(InputText);
