import React from 'react';

function AlertDanger(props) {
  return (
    <article className="message is-danger">
      <div className="message-body">
        {props.children}
      </div>
    </article>
  );
}

export default AlertDanger;
