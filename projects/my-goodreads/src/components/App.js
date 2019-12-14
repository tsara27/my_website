import React, { Component } from 'react';
import Header from './Header';
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
      </div>
    )
  }
}

export default App;
