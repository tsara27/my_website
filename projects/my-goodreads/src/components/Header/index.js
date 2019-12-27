import Radium from 'radium';
import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <header style={styles.base}>
        {this.props.children}
      </header>
    );
  }
}

let styles = {
  base: {
    color: '#e3f6f5',
    height: '75px',
    borderBottom: '1px solid #454161',
    display: 'grid',
    alignItems: 'center',
    justifyItems: 'center'
  }
};

export default Radium(Header);
