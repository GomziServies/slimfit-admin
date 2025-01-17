import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Protect = ({ children }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const authorization = localStorage.getItem("authorization");

	useEffect(() => {
		if (!authorization) {
			navigate("/auth/sign-in");
		} else if (authorization && location.pathname === "/") {
			navigate("/dashboard/sales-list");
		}
	}, [authorization, location.pathname, navigate]);

	if (!authorization) {
		return null;
	}

	return <>{children}</>;
};

export default Protect;
