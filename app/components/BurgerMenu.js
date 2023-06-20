import React, { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const BurgerMenu = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
 
    <div className='relative '>
      <button className="relative text-white md:hidden" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <Menu isOpen={isMenuOpen} right width={ 300 } className="relative p-4 bg-blue-900 bg-opacity-75 top-60">
        {children}
      </Menu>
    </div>
  );
};

export default BurgerMenu;
