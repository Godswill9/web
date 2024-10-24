import React, { useEffect } from 'react';
import '../stylings/styles.css'; // Ensure this imports your relevant styles

const AnimatedMessage = ({ role }) => {
  useEffect(() => {
    const dots = document.querySelectorAll(`.${role} .dots div`);
    const interval = setInterval(() => {
      dots.forEach((dot) => {
        dot.classList.toggle('goUp');
        dot.classList.toggle('two');
        dot.classList.toggle('three');
      });
    }, 500);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [role]);

  return (
    <div className={role}>
      <div className={`${role}Inner`}>
        <div className="dots">
          <div className="goUp"></div>
          <div className="two"></div>
          <div className="three"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedMessage;
