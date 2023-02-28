import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import _ from 'lodash';
import lomadsfulllogo from "../../assets/svg/lomadsfulllogo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import SimpleButton from "UIpack/SimpleButton";
import SimpleInputField from "UIpack/SimpleInputField";
import "../../styles/Global.css";
import "../../styles/pages/NameDAO.css";
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import { setDAOList } from 'state/dashboard/reducer';
import { updateDaoAddress, updateDaoImage, updateDaoName } from "state/flow/reducer";
import { LeapFrog } from "@uiball/loaders";
import axiosHttp from '../../api'
import ReactS3Uploader from 'components/ReactS3Uploader';
import { nanoid } from "@reduxjs/toolkit";
import { useDropzone } from 'react-dropzone'
import uploadIcon from '../../assets/svg/ico-upload.svg';
const { debounce } = require('throttle-debounce');

const NameDAO = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const [DAOListLoading, setDAOListLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<any>({});
	const [urlCheckLoading, setUrlCheckLoading] = useState<any>(false);
	const refSafeName = useRef<string>("");
	const daoName = useAppSelector((state) => state.flow.daoName);
	const daoAddress = useAppSelector((state) => state.flow.daoAddress);
	const { DAOList } = useAppSelector((state) => state.dashboard);

	const [image, setImage] = useState<any>(null);
	const [droppedfiles, setDroppedfiles] = useState([]);
	const [uploadLoading, setUploadLoading] = useState<boolean>(false);

	useEffect(() => {
		dispatch(updateDaoName(""))
		dispatch(updateDaoAddress(""))
	}, [])

	const navigate = useNavigate();
	const handleClick = () => {
		let terrors: any = {};
		if (!daoName) {
			terrors.daoName = " * DAO name is required.";
		}
		if (!daoAddress) {
			terrors.daoAddress = " * DAO Address is required.";
		}
		if (_.isEmpty(terrors)) {
			handleNavigate();
		} else {
			setErrors(terrors);
		}
	};

	// useEffect(() => {
	//   if(location.pathname.indexOf('namedao') > -1) {
	//     if(DAOList.length == 0) {
	//       setDAOListLoading(true)
	//       axiosHttp.get("dao").then(res => { 
	//         setDAOList(res.data) 
	//         if(res.data.length > 0)
	//           navigate(`/${_.get(res.data, '[0].url')}`)
	//       })
	//       .finally(() => setDAOListLoading(false))
	//     }
	//   }
	// }, [DAOList])

	const checkAvailability = (e: any) => {
		if (e.target.value && e.target.value !== "") {
			setUrlCheckLoading(true)
			axiosHttp.get(`dao/${e.target.value.replace(/ /g, "-").toLowerCase()}`)
				.then(res => {
					if (!res.data) {
						dispatch(updateDaoAddress(process.env.REACT_APP_URL + "/" + e.target.value.replace(/ /g, "-").toLowerCase()))
					} else {
						let rand = Math.floor(1000 + Math.random() * 9000);
						axiosHttp.get(`dao/${e.target.value.replace(/ /g, "-").toLowerCase() + '-' + rand}`)
							.then(result => {
								rand = Math.floor(1000 + Math.random() * 9000);
								dispatch(updateDaoAddress(process.env.REACT_APP_URL + "/" + e.target.value.replace(/ /g, "-").toLowerCase() + '-' + rand))
							})
							.catch(err => {
								dispatch(updateDaoAddress(process.env.REACT_APP_URL + "/" + e.target.value.replace(/ /g, "-").toLowerCase() + '-' + rand))
							})
					}
				})
				.catch(err => {
					dispatch(updateDaoAddress(process.env.REACT_APP_URL + "/" + e.target.value.replace(/ /g, "-").toLowerCase()))
				})
				.finally(() => setUrlCheckLoading(false))
		} else {
			dispatch(updateDaoAddress(""))
		}
	}

	const checkAvailabilityAsync = useRef(_.debounce(checkAvailability, 500)).current

	const handleNavigate = () => {
		console.log("esfsffsf");
		daoName.length >= 1 && navigate("/invitegang");
	};
	const handleDaoName = (event: any) => {
		refSafeName.current = event.target.value.replace(/[^a-z0-9 ]/gi, "");
		dispatch(updateDaoName(refSafeName.current.toString()));
	};

	const onDrop = useCallback((acceptedFiles: any) => { setDroppedfiles(acceptedFiles) }, [])

	const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false })

	const getSignedUploadUrl = (file: any, callback: any) => {
		console.log(file)
		const filename = `DAOThumbnail/${nanoid(32)}.${file.type.split('/')[1]}`
		return axiosHttp.post(`utility/upload-url`, { key: filename, mime: file.type }).then(res => callback(res.data))
	}

	const onUploadProgress = (progress: any, message: any, file: any) => { }

	const onUploadError = (error: any) => { setDroppedfiles([]); setUploadLoading(false) }

	const onUploadStart = (file: any, next: any) => { setUploadLoading(true); return next(file); }

	const onFinish = (finish: any) => {
		setDroppedfiles([])
		setUploadLoading(false);
		var arr = finish.signedUrl.split('?');
		console.log("image : ", arr[0]);
		dispatch(updateDaoImage(arr[0]));
		setImage(arr[0]);
	}

	return (
		<>
			{DAOListLoading ?
				<div style={{ backgroundColor: '#FFF', height: '100vh', zIndex: 99999, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<div className="logo">
						<img src={lomadsfulllogo} alt="" />
					</div>
					<LeapFrog size={50} color="#C94B32" />
				</div> : null
			}
			<div className="NameDAO">
				<div className="headerText">1/3 Name of your Organisation</div>
				<div className="centerCard">
					<div>
						<div>
							<div className="inputFieldTitle">Name Your Organisation</div>
							<SimpleInputField
								className="inputField"
								height={50}
								width={460}
								placeholder="Epic Organisation"
								value={daoName}
								onchange={(event) => {
									checkAvailabilityAsync(event)
									handleDaoName(event);
								}}
								isInvalid={errors.daoName}
							/>
						</div>
						<div>
							<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
								<div className="inputFieldTitle" style={{ marginRight: '16px' }}>Organisation address</div>
								{urlCheckLoading && <LeapFrog size={20} color="#C94B32" />}
							</div>
							<SimpleInputField
								className="inputField"
								height={50}
								width={460}
								disabled
								value={daoAddress}
								placeholder="https://app.lomads.xyz/Name_of_the_Organisation"
								onchange={(e) => {
									dispatch(updateDaoAddress(e.target.value));
								}}
								isInvalid={errors.daoAddress}
							/>
						</div>
						<div>
							<div className="inputFieldTitle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Import Thumbnail  <div className='option-div'>
								Optional
							</div></div>
							<div className="image-picker-wrapper">
								<div className="image-picker-container">
									{
										image
											?
											<div style={{ position: 'relative', width: '100%', height: '100%' }}>
												<div onClick={() => { setImage(null); dispatch(updateDaoImage(null)); }} style={{ cursor: 'pointer' }}>
													<img style={{ width: 18, height: 18, position: 'absolute', right: 8, top: 8, opacity: 0.7 }} src={require('../../assets/images/close.png')} />
												</div>
												<img src={image} alt="selected-token-icon" className="selected-img" />
											</div>
											:
											<div {...getRootProps()}>
												<ReactS3Uploader
													droppedfiles={droppedfiles}
													getSignedUrl={getSignedUploadUrl}
													accept="image/png,image/jpeg,image/jpg"
													className={{ display: 'none' }}
													onProgress={onUploadProgress}
													onError={onUploadError}
													preprocess={onUploadStart}
													onFinish={onFinish}
													multiple
													uploadRequestHeaders={{
													}}
													contentDisposition="auto"
												/>
												<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
													{uploadLoading ?
														<LeapFrog size={24} color="#C94B32" /> :
														<>
															<img src={uploadIcon} alt="upload-icon" />
															<p>Choose <br /> or drag an image</p>
															<span>maximum size 2mb</span>
														</>
													}
												</div>

												<input {...getInputProps()} />
											</div>

									}
								</div>
								<p className="text">Accepted formats:<br />jpg, svg or png</p>
							</div>
						</div>
					</div>
				</div>
				<div className="createName">
					<SimpleButton
						className="button"
						title="CREATE PUBLIC ADDRESS"
						height={50}
						fontsize={20}
						disabled={urlCheckLoading}
						fontweight={400}
						onClick={handleClick}
						bgColor={daoName.length >= 1 || !urlCheckLoading ? "#C94B32" : "rgba(27, 43, 65, 0.2)"}
					/>
				</div>
			</div>
		</>
	);
};

export default NameDAO;
