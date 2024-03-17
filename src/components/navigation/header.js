
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { changeDrawerState } from 'store/slices/drawer';
import ProfileSection from 'ui-component/profileSection/index'

import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();

  const {islogged} = useSelector((state) => state.auth);
  const { open } = useSelector((state) => state.drawer);

  const handleDrawerOpen = () => {
    dispatch(changeDrawerState(!open));
  };

  
  return (
    <nav className="bg-white py-4">
      <div className="flex justify-between items-center px-5">
        <div className="text-2xl font-bold text-gray-700 flex">
          <img src="/BPNLogo2.png" className="h-10" />
          <Link className="mt-1" to="/">BeyondPills</Link>
          {location.pathname.includes("/panel") && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </div>
        <div className="flex space-x-4">
          <Link to="/">Home</Link>
          <Link to="/details" className="text-gray-600 hover:text-gray-800">Our Programs</Link>

          <a href="#" className="text-gray-600 hover:text-gray-800">
            Blog
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            Contact
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            Terms &amp; Conditions
          </a>
        </div>
        {islogged ? (
          <ProfileSection />
        ) : (
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md">
            Login
          </Link>
        )}

      </div>
    </nav>
  );

}

export default Header;
