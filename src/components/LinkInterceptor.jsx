import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LinkInterceptor({ children }) {
  const navigate = useNavigate();
  const handleClick = (event) => {
    const element = event.target;
    if (element.tagName === 'A' && element.href) {
      event.preventDefault();
      const href = element.getAttribute('href');
      if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
        window.location.href = href;
      } else {
        navigate(href);
      }
    }
  };

  return (
    <div onClick={handleClick} className="sff-link-intercept">
      {children}
    </div>
  );
};