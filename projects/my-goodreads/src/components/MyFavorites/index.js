import Radium from 'radium';
import React, { Component, useState } from 'react';
import { each } from 'lodash';
import Axios from 'axios';

function MyFavorites(props) {
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  fetchBooks();
  return (
    <div style={styles.base}>
      {props.children}
    </div>
  );
}

let styles = {
  base: {
    color: '#e3f6f5',
    borderBottom: '1px solid #454161',
    display: 'grid',
    gridAutoFlow: 'row',
    alignItems: 'center',
    justifyItems: 'center'
  }
};

let fetchBooks = () => {
  let books_isbn = ['1250301696', '0439206472', '0060566213', '9791273669', '9789830998046'];

  _.each(books_isbn, function (isbn) {
    Axios.get('https://www.goodreads.com/search/index.xml?key=oReOMp1kUkxEq21hms4w&q=' + isbn)
      .then(function (response) {
        setFavoriteBooks(favoriteBooks.push(response));
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
  });
}

export default Radium(MyFavorites);
