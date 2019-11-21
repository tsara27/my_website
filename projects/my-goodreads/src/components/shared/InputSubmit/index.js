import React from 'react';

function InputSubmit(props) {
  return (
    <button className="button is-link" {...props}>
      {props.children}
    </button>
  );
}

export default InputSubmit;
