import React from 'react';

function InputText(props) {
  return (
    <input type="text" id={props.id} placeholder={props.placeholder} name={props.name} {...props}>
      {props.children}
    </input>
  );
}

export default InputText;
