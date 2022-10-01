import React from "react";
import "../../styles/pages/StartSafe.css";
import "../../styles/Global.css";
import SafeButton from "UIpack/SafeButton";
import { useNavigate } from "react-router-dom";

const StartSafe = () => {
	const navigate = useNavigate();
	const createNewSafe = () => {
		navigate("/newsafe");
	};
	const importExistingSafe = () => {
		navigate("/addsafe");
	};
	return (
		<>
			<div className="StartSafe">
				<div className="headerText">3/3 DAO Treasury</div>
				<div className="buttonArea">
					<div>
						<SafeButton
							title="CREATE NEW SAFE"
							titleColor="#C94B32"
							bgColor="#FFFFFF"
							height={55}
							width={225}
							fontsize={20}
							fontweight={400}
							onClick={createNewSafe}
							disabled={false}
						/>
					</div>
					<div className="centerText">or</div>
					<div>
						<SafeButton
							title="ADD EXISTING SAFE"
							titleColor="#C94B32"
							bgColor="#FFFFFF"
							height={55}
							width={225}
							fontsize={20}
							fontweight={400}
							onClick={importExistingSafe}
							disabled={false}
						/>
					</div>
				</div>
				<div className="infoText">
					Powered By{" "}
					<a href="https://gnosis-safe.io/" className="link">
						Gnosis Safe
					</a>
				</div>
			</div>
		</>
	);
};

export default StartSafe;
