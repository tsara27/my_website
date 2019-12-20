import Radium from 'radium';
import React, { Component } from 'react';

class Main extends Component {
  render() {
    return (
      <main style={styles.base} {...this.props}>
        {this.props.children}
      </main>
    );
  }
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

export default Radium(Main);
