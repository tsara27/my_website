import React from 'react';

function Link(props) {
  return (
    <a {...props}>
      {props.children}
    </a>
  );
}

export default Link;
