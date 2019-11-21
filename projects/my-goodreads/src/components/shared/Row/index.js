import React from 'react';

function Row(props) {
  return (
    <div className="columns" {...props}>
      {props.children}
    </div>
  );
}

export default Row;
