import React from 'react';

function Column(props) {
  return (
    <div className={`column${props.className === undefined ? '' : ` ${props.className}`}`}>
      {props.children}
    </div>
  );
}

export default Column;
