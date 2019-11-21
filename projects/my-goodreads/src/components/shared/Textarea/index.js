import React from 'react';

function Textarea(props) {
  return (
    <textarea className="textarea" {...props}>
      {props.children}
    </textarea>
  );
}

export default Textarea;

