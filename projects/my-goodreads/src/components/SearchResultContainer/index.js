import Radium from 'radium';
import React, { Component } from 'react';
import FavoriteBook from '../FavoriteBook';

function SearchResultContainer(props) {
  let styles = {
    base: {
      color: '#e3f6f5',
      display: 'grid',
      gridAutoFlow: 'dense',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gridGap: '30px',
      maxWidth: '960px',
      margin: '0 auto'
    },
    container: {
      borderBottom: '1px solid #454161',
      padding: '50px'
    },
    header: {
      maxWidth: '960px',
      margin: '0 auto',
      padding: '0 50px 50px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Search Results</h1>
      <div style={styles.base}>
        {
          props.resultData.map((value, index) => {
            return <FavoriteBook key={index} data={value}></FavoriteBook>
          })
        }
      </div>
    </div>
  );
}

export default Radium(SearchResultContainer);
