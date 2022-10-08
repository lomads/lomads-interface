import React, { useEffect } from "react";
import "../../styles/pages/DAOSuccess.css";
import "../../styles/Global.css";
import lomadslogodark from "../../assets/svg/lomadslogodark.svg";
import GroupEnjoy from "../../assets/svg/GroupEnjoy.svg";
import { colors } from "assets/colors";
import { Colorstype } from "types/UItype";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { loadDao } from 'state/dashboard/actions';

const DAOsuccess = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [searchParams, setSearchParams] = useSearchParams();
	const { DAOList } = useAppSelector((state) => state.dashboard);

	useEffect(() => {
		dispatch(loadDao({}))
	}, [])

	const handleClick = async () => {
		const dao = searchParams.get("dao")
		navigate(`/${dao}`);
	};

	useEffect(() => {
		setTimeout(() => {
			const dao = searchParams.get("dao")
			navigate(`/${dao}`);
		}, 3000);
	}, []);

	return (
		<>
			<div className="DAOsuccess">
				<div className="itemsGroup">
					<div className="logo">
						<img src={lomadslogodark} alt="logo" />
					</div>
					<div className="congrats">Well done!</div>
					<div className="header">Your DAO is live</div>
					<div className="redirectText" onClick={handleClick}>
						you will be redirected to the dashboard in a few seconds
					</div>
					<img src={GroupEnjoy} alt="Congrats" className="groupenjoy" />
				</div>
				<img src={GroupEnjoy} alt="Congrats" className="groupenjoy" />

				{colors.map((result: Colorstype) => {
					return (
						<div
							className="colors"
							style={{
								backgroundColor: result.backgroudColor,
								left: result.left,
								right: result.right,
								top: result.top,
								bottom: result.bottom,
								transform: result.transform,
							}}
						></div>
					);
				})}
			</div>
		</>
	);
};

export default DAOsuccess;
