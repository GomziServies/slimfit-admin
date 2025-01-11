import React, { useEffect, memo, Fragment } from 'react'


//SimpleRouter 
// import SimpleRouter from '../../router/simple-router'

// store
import { Outlet } from 'react-router-dom'
import { Button } from 'react-bootstrap';
import SettingOffCanvas from '../../components/setting/SettingOffCanvas';

const Simple = memo((props) => {
    return (
        <Fragment>
            <div id="loading">
            </div>
            <div className="wrapper">
                <Outlet />
            </div>
            <SettingOffCanvas name={true} />
        </Fragment>
    )
})

export default Simple
