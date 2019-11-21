import React from 'react';

function Label(props) {
  return (
    <label className="label" {...props}>
      {props.children}
    </label>
  );
}

export default Label;
