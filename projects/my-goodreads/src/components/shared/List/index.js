import React from 'react';

function List(props) {
  return (
    <li {...props}>
      {props.children}
    </li>
  );
}

export default List;
