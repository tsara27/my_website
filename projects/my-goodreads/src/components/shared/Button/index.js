import Radium from 'radium';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import color from 'color';

class Button extends Component {
  static propTypes = {
    kind: PropTypes.oneOf(['primary', 'warning']).isRequired
  };

  render() {
    return (
      <button style={[styles.base, styles[this.props.kind]]} {...this.props}>
        {this.props.children}
      </button>
    );
  }
}

let styles = {
  base: {
    color: '#fff',
    borderRadius: 2,
    border: 'none',
    padding: '5px 10px',

    ':hover': {
      background: color('#0074d9').alpha(0.5).lighten(0.5)
    }
  },

  primary: {
    background: '#272343'
  },

  warning: {
    background: '#FF4136'
  },

  secondary: {
    background: '#e3f6f5'
  }
};

export default Radium(Button);
