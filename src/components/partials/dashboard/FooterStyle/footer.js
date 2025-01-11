import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-body">
                <div className="right-panel">
                    ©
                    <span className="text-gray">
                    Design and Developed 
                    </span> by <Link to="https://gcsconsultant.com/">Fitit Official</Link>.
                </div>
            </div>
        </footer>
    )
}

export default Footer
