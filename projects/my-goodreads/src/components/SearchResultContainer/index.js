import Radium from 'radium';
import React, { Component, useState, useEffect } from 'react';
import FavoriteBook from '../FavoriteBook';

function SearchResultContainer(props) {
  let styles = {
    base: {
      color: '#e3f6f5',
      display: 'grid',
      gridAutoFlow: 'dense',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gridGap: '30px'
    },
    header: {
      marginLeft: '70px'
    }
  };

  return (
    <div>
      <h1 style={styles.header}>Search Results</h1>
      <div style={styles.base}>
        {
        }
      </div>
    </div>
  );
}

export default Radium(SearchResultContainer);
