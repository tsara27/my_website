import React, { Component } from 'react';
import Header from './Header';
import Main from './Main';
import MyFavorites from './MyFavorites';
import InputText from './shared/InputText';


class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header>
          <InputText placeholder="Search book title, author, or ISBN" />
        </Header>
        <Main>
          <MyFavorites />
        </Main>
      </div>
    )
  }
}

export default App;
