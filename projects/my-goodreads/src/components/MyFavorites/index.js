import Radium from 'radium';
import React, { Component, useState, useEffect } from 'react';
import Axios from 'axios';
import FavoriteBook from '../FavoriteBook';

function MyFavorites(props) {
  let styles = {
    base: {
      color: '#e3f6f5',
      display: 'grid',
      gridAutoFlow: 'dense',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gridGap: '30px'
    }
  };

  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    populateBooks();
  }, []);

  async function populateBooks() {
    let books_isbn = ['1250301696', '0439206472', '0060566213', '9791273669', '9789830998046'];
    let books = [];
    let i = 0;
    for (i; i < books_isbn.length; i++) {
      const response = await Axios.get('https://www.goodreads.com/search/index.xml?key=oReOMp1kUkxEq21hms4w&q=' + books_isbn[i]);
      const data = await response.data;

      books.push(new DOMParser().parseFromString(data, 'application/xml'));
    }
    return setFavoriteBooks(books);
  }

  return (
    <div>
      <h1>My Favorite Books</h1>
      <div style={styles.base}>
        {
          favoriteBooks.map((value, index) => {
            return <FavoriteBook key={index} data={value}></FavoriteBook>
          })
        }
      </div>
    </div>
  );
}

export default Radium(MyFavorites);
