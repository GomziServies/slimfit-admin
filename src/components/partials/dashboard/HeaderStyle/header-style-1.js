import React, { useEffect, Fragment, memo, useState } from 'react'
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CustomToggle from '../../../dropdowns'
import { useSelector } from 'react-redux'
import * as SettingSelector from '../../../../store/setting/selectors'
import axiosInstance from '../../../../js/api'

//img
import avatars1 from '../../../../assets/images/avatars/01.png'

// logo
import Logo from '../../components/logo'

const Header = memo((props) => {
  const navbarHide = useSelector(SettingSelector.navbar_show)
  const headerNavbar = useSelector(SettingSelector.header_navbar)
  const [userData, setUserData] = useState({
    full_name: '',
    type: '',
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/get-profile')
        if (response.data.status === 200) {
          const { full_name, type } = response.data.data;

          localStorage.setItem('adminType', type);

          setUserData({ full_name, type });
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const minisidebar = () => {
    document.getElementsByTagName('ASIDE')[0].classList.toggle('sidebar-mini')
  }
  return (
    <Fragment>
      <Navbar
        expand="lg"
        variant="light"
        className={`nav iq-navbar ${headerNavbar} ${navbarHide.join(' ')}`}
      >
        <Container fluid className="navbar-inner">
          <Link to="/dashboard/sales-list" className="navbar-brand">
            <Logo color={true} />
          </Link>
          {/* <div
            className="sidebar-toggle"
            data-toggle="sidebar"
            data-active="true"
            onClick={minisidebar}
          >
            <i className="icon">
              <svg width="20px" height="20px" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"
                />
              </svg>
            </i>
          </div> */}
          <Navbar.Toggle aria-controls="navbarSupportedContent">
            <span className="navbar-toggler-icon">
              <span className="mt-2 navbar-toggler-bar bar1"></span>
              <span className="navbar-toggler-bar bar2"></span>
              <span className="navbar-toggler-bar bar3"></span>
            </span>
          </Navbar.Toggle>
          <Navbar.Collapse id="navbarSupportedContent">
            <Nav
              as="ul"
              className="mb-2 ms-auto navbar-list mb-lg-0 align-items-center"
            >
              <Dropdown as="li" className="nav-item">
                <Dropdown.Toggle
                  as={CustomToggle}
                  variant=" nav-link py-0 d-flex align-items-center"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={avatars1}
                    alt="User-Profile"
                    className="theme-color-default-img img-fluid avatar avatar-50 avatar-rounded"
                  />
                  <div className="caption ms-3 d-none d-md-block ">
                    <h6 className="mb-0 caption-title">{userData.full_name}</h6>
                    <p className="mb-0 caption-sub-title">{userData.type}</p>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <Dropdown.Item href="/dashboard/admin-profile">
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="/auth/logout">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Fragment>
  )
})

export default Header
