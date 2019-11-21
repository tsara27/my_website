import React from 'react';

function AlertSuccess(props) {
  return (
    <article className="message is-success">
      <div className="message-body">
        {props.children}
      </div>
    </article>
  );
}

export default AlertSuccess;
