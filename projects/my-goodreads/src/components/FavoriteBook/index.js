import Radium from 'radium';
import React, { Component } from 'react';

function FavoriteBook(props) {
  let styles = {
    base: {
      alignSelf: 'center',
      color: '#e3f6f5',
      display: 'grid',
      gridAutoFlow: 'row',
      margin: '25px 0',
      gridTemplateRows: '150px 70px 40px',
      justifyItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.base}>
      <img src={props.data.getElementsByTagName('image_url')[0].textContent} />
      <h4>{props.data.getElementsByTagName('title')[0].textContent}</h4>
      <p>by {props.data.getElementsByTagName('author')[0].getElementsByTagName('name')[0].textContent}</p>
    </div>
  );
}

export default FavoriteBook;
