import React, { memo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AddCardIcon from '@mui/icons-material/AddCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { Accordion, useAccordionButton } from 'react-bootstrap';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import BadgeIcon from '@mui/icons-material/Badge';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';


const VerticalNav = memo(() => {
  const location = useLocation();
  const adminType = localStorage.getItem('adminType');

  // Define the menu items based on admin type
  const menuItems = [
    {
      path: '/dashboard/sales-list',
      name: 'Total Sales',
      icon: <AddCardIcon />,
    },
    {
      path: '/dashboard/create-invoice',
      name: 'Generate Invoice',
      icon: <ReceiptIcon />,
    },
    {
      path: '/auth/logout',
      name: 'Logout',
      icon: (
        <svg
          width="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.4"
            d="M2 6.447C2 3.996 4.03024 2 6.52453 2H11.4856C13.9748 2 16 3.99 16 6.437V17.553C16 20.005 13.9698 22 11.4744 22H6.51537C4.02515 22 2 20.01 2 17.563V16.623V6.447Z"
            fill="currentColor"
          ></path>
          <path
            d="M21.7787 11.4548L18.9329 8.5458C18.6388 8.2458 18.1655 8.2458 17.8723 8.5478C17.5802 8.8498 17.5811 9.3368 17.8743 9.6368L19.4335 11.2298H17.9386H9.54826C9.13434 11.2298 8.79834 11.5748 8.79834 11.9998C8.79834 12.4258 9.13434 12.7698 9.54826 12.7698H19.4335L17.8743 14.3628C17.5811 14.6628 17.5802 15.1498 17.8723 15.4518C18.0194 15.6028 18.2113 15.6788 18.4041 15.6788C18.595 15.6788 18.7868 15.6028 18.9329 15.4538L21.7787 12.5458C21.9199 12.4008 21.9998 12.2048 21.9998 11.9998C21.9998 11.7958 21.9199 11.5998 21.7787 11.4548Z"
            fill="currentColor"
          ></path>
        </svg>
      ),
    },
  ];

  // Filter menu items based on admin type
  const filteredMenuItems = menuItems.filter((menuItem) => {
    if (adminType === 'MASTER') {
      return true;
    } else if (adminType === 'SUB') {
      return menuItem.name !== 'Client Admin' && menuItem.name !== 'Admin' && menuItem.name !== 'Employee' && menuItem.name !== 'offer Email';
    }
    else if (adminType === 'CLIENT' || adminType === 'TRIAL') {
      return menuItem.name !== 'Client Admin';
    }
    return true;
  });

  const [activeMenu, setActiveMenu] = useState('');
  const [expandedSubMenus, setExpandedSubMenus] = useState({});

  useEffect(() => {
    const currentPath = location.pathname;
    setActiveMenu(currentPath);
  }, [location.pathname]);

  const handleSubMenuClick = (path) => {
    setExpandedSubMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const CustomToggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey);

    return (
      <span onClick={decoratedOnClick}>
        {children}
      </span>
    );
  }
  return (
    <div className='navbar-nav-container'>
      <Accordion as="ul" className="navbar-nav iq-main-menu">
        {filteredMenuItems.map((menuItem, index) => (
          <li key={index} className={`nav-item ${activeMenu === menuItem.path ? 'active' : ''}`}>
            {menuItem.subMenu ? (
              <CustomToggle eventKey={index}>
                <Link
                  className={`nav-link dropdown-toggle ${activeMenu === menuItem.path ? 'active' : ''}`}
                  to={menuItem.path}
                  onClick={() => {
                    setActiveMenu(menuItem.path);
                    handleSubMenuClick(menuItem.path);
                  }}
                >
                  {menuItem.icon}
                  <span className="item-name">{menuItem.name}</span>
                </Link>
              </CustomToggle>
            ) : (
              <Link
                className={`nav-link ${activeMenu === menuItem.path ? 'active' : ''}`}
                to={menuItem.path}
                onClick={() => setActiveMenu(menuItem.path)}
              >
                {menuItem.icon}
                <span className="item-name">{menuItem.name}</span>
              </Link>
            )}

            {menuItem.subMenu && (
              <Accordion.Collapse eventKey={index} in={expandedSubMenus[menuItem.path]}>
                <ul className="iq-submenu">
                  {menuItem.subMenu.map((subMenuItem, subIndex) => (
                    <li
                      key={subIndex}
                      className={`nav-item ${activeMenu === subMenuItem.path ? 'active' : ''}`}
                    >
                      <Link
                        className={`nav-link ${activeMenu === subMenuItem.path ? 'active' : ''}`}
                        to={subMenuItem.path}
                        onClick={() => setActiveMenu(subMenuItem.path)}
                      >
                        {subMenuItem.icon}
                        <span className="item-name">{subMenuItem.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Accordion.Collapse>
            )}
          </li>
        ))}
        <li>
          <hr className="hr-horizontal" />
        </li>
      </Accordion>
    </div>
  );
});

export default VerticalNav