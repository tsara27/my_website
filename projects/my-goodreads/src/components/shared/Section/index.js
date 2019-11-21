import React from 'react';

function Section(props) {
  return (
    <section {...props}>
      {props.children}
    </section>
  );
}

export default Section;
