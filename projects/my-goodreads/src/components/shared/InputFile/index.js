import React from 'react';

function InputFile(props) {
  return (
    <input className="file-input" type="file" name={props.name} {...props} />
  );
}

export default InputFile;
