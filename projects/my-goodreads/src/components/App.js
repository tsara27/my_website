import React, { Component } from 'react';
import Header from './Header';
import Main from './Main';
import MyFavorites from './MyFavorites';
import InputText from './shared/InputText';
import SearchResultContainer from './SearchResultContainer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResult: []
    }
  }

  searchResultCallback = (childData) => {
    this.setState({ searchResult: childData });
  }

  render() {
    let resultContainer;

    if (this.state.searchResult.length > 0) {
      resultContainer = <SearchResultContainer resultData={this.state.searchResult} />;
    }

    return (
      <div>
        <Header>
          <InputText callbackSearchResult={this.searchResultCallback} placeholder="Search book title, author, or ISBN" />
        </Header>
        <Main>
          {resultContainer}
          <MyFavorites />
        </Main>
      </div>
    )
  }
}

export default App;
