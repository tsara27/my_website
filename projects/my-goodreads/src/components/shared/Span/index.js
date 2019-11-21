import React from 'react';

function Span(props) {
  return (
    <span {...props}>
      {props.children}
    </span>
  );
}

export default Span;
