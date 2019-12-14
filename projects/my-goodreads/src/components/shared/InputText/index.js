import React from 'react';
import Radium from 'radium';

function InputText(props) {
  return (
    <input type="text" style={styles.base} placeholder={props.placeholder} name={props.name} {...props}>
      {props.children}
    </input>
  );
}

let styles = {
  base: {
    background: '#272343',
    border: '1px solid #454161',
    borderRadius: '15px',
    color: '#646082',
    fontSize: '14px',
    height: '15px',
    padding: '10px',
    WebkitAppereance: 'none',
    width: '50%',

    ':focus': {
      border: '1px solid #487AF0',
      boxShadow: 'none',
      outline: 'none',
      WebkitAppereance: 'none'
    }
  }
};

export default Radium(InputText);
