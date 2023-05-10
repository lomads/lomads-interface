import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
    Drawer, Box, Typography
} from '@mui/material';
import IconButton from 'muiComponents/IconButton';
import { makeStyles } from '@mui/styles';
import TotalAccess from "../assets/images/drawer-icons/StatusAccess.svg";
import ViewOnly from "../assets/images/drawer-icons/StatusViewOnly.svg";
import CloseSVG from 'assets/svg/close-new.svg'
import { useAppSelector, useAppDispatch } from "state/hooks";
import { get as _get, find as _find } from 'lodash';
import axiosHttp from 'api'
import { updateDao, updateDaoLinks, storeGithubIssues, deleteDaoLink } from 'state/dashboard/actions';
import AddDiscordLink from 'components/AddDiscordLink';
import { setDAO, resetStoreGithubIssuesLoader, resetDeleteDaoLinkLoader,resetUpdateDAOLoader,resetUpdateDaoLinksLoader } from "state/dashboard/reducer";
import AddGithubLink from "components/AddGithubLink";
import TextInput from "muiComponents/TextInput";
import ReactS3Uploader from 'components/ReactS3Uploader';
import { LeapFrog } from "@uiball/loaders";
import { nanoid } from "@reduxjs/toolkit";
import { useDropzone } from 'react-dropzone'
import uploadIcon from '../../assets/svg/ico-upload.svg';
import LoginGithub from 'react-login-github';
import Switch from "muiComponents/Switch";
import { title } from "process";
import useGithubAuth from "hooks/useGithubAuth";

const useStyles = makeStyles((theme: any) => ({
    tableHead: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        padding: '10px 0'
    },
    tableHeadBox: {
        width: '165px',
        display: 'flex',
        alignitems: 'center',
        justifyContent: 'center',
    },
    tableRow: {
        width: '100%',
        height: '65px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableRowFirstBox: {
        width: '260px',
        height: '100%',
        padding: '0 15px',
        display: 'flex',
        alignItems: 'center',
        borderRight: '1px solid #76808D22'
    },
    tableRowBox: {
        width: '165px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRight: '1px solid #76808D22'
    },
}));

export default ({ open, onClose }: { open: boolean, onClose: any }) => {
    const classes = useStyles();
	const { DAO, updateDaoLoading, updateDaoLinksLoading, storeGithubIssuesLoading, deleteDaoLinkLoading } = useAppSelector((state) => state.dashboard);
	const [name, setName] = useState(_get(DAO, 'name', ''));
	const [oUrl, setOUrl] = useState(_get(DAO, 'url', ''));
	const [description, setDescription] = useState(_get(DAO, 'description', ''));
	const [daoLinks, setDaoLinks] = useState(_get(DAO, 'links', []));
	const [linkTitle, setLinkTitle] = useState("");
	const [link, setLink] = useState("");
	const [image, setImage] = useState(_get(DAO, 'image', ''));
	const [droppedfiles, setDroppedfiles] = useState([]);
	const [uploadLoading, setUploadLoading] = useState(false);
	const [pullIssues, setPullIssues] = useState(false);
	const [importRoles, setImportRoles] = useState(false);
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const { onResetAuth } = useGithubAuth();
	const dispatch = useAppDispatch()

	useEffect(() => {
		setDaoLinks(_get(DAO, 'links', []));
	}, [DAO])

	useEffect(() => {
		if (storeGithubIssuesLoading === false) {
			dispatch(resetStoreGithubIssuesLoader());
			setIsAuthenticating(false);
			addLink();
		}
	}, [storeGithubIssuesLoading]);

	useEffect(() => {
		if (deleteDaoLinkLoading === false) {
			dispatch(resetDeleteDaoLinkLoader());
		}
	}, [deleteDaoLinkLoading])

	useEffect(() => {
		if (updateDaoLoading === false && updateDaoLinksLoading === false) {
			dispatch(resetUpdateDAOLoader());
			dispatch(resetUpdateDaoLinksLoader());
			onClose();
		}
	}, [updateDaoLoading,updateDaoLinksLoading])

	const addLink = useCallback(() => {
		if (!linkTitle || !link || (linkTitle && linkTitle === '') || (link && link === ''))
			return;
		let tempLink = link
		if (tempLink.indexOf('https://') === -1 && tempLink.indexOf('http://') === -1) {
			tempLink = 'https://' + link;
		}
		setDaoLinks([...daoLinks, { title: linkTitle, link: tempLink }]);
		setLinkTitle("")
		setLink("")

	}, [link, linkTitle]);

	const saveChanges = () => {
		console.log("save...",daoLinks)
		dispatch(updateDao({ url: DAO?.url, payload: { name, description, image } }))
		dispatch(updateDaoLinks({ url: DAO?.url, payload: { links: daoLinks } }))
	}

	const addNewLink = (e: any) => {
		let errorCount = 0;
		for (var i = 0; i < daoLinks.length; i++) {
			const title = daoLinks[i].title;
			const link = daoLinks[i].link;
			if (title === '') {
				errorCount += 1;
                const title = document.getElementById(`title${i}`)
                if(title){
                    title.innerHTML = 'Please enter title'
                }
			}
			else if (link === '') {
				errorCount += 1;
                const link = document.getElementById(`link${i}`)
                if(link){
                    link.innerHTML = 'Please enter link'
                }
			}
		}
		if (errorCount === 0) {
			console.log("DAo links : ", daoLinks);
			// dispatch(updateDaoLinks({ url: DAO?.url, payload: { links: daoLinks } }))
		}
	}

	const deleteLink = (response: any, item: any) => {
		if (item.link.indexOf('github.') > -1) {
			let repoInfo = extractGitHubRepoPath(item.link);
			let ob = _get(DAO, `github.${repoInfo}`, null)
			if (ob) {
				axiosHttp.get(`utility/getGithubAccessToken?code=${response.code}&repoInfo=${repoInfo}`)
					.then((res) => {
						if (res.data) {
							dispatch(deleteDaoLink({ url: DAO?.url, payload: { link: item, repoInfo, webhookId: ob.webhookId, token: res.data.access_token } }))
						}
						else {
							console.log("No res : Something went wrong");
						}
						onResetAuth();
					})
					.catch((e) => {
						onResetAuth()
						console.log("error : ", e);
					})

			}
			else {
				// no import issues github link
				let links = daoLinks.filter((l: any) => !(l.title === item.title && l.link === item.link))
				setDaoLinks(links);
			}
		}
		else {
			let links = daoLinks.filter((l: any) => !(l.title === item.title && l.link === item.link))
			setDaoLinks(links);
		}
	}

	const handleOnServerAdded = (serverId: any) => {
		if (importRoles) {
			axiosHttp.post(`discord/guild/${serverId}/sync-roles`, { daoId: _get(DAO, '_id') })
				.then(res => {
					addLink()
				})
		} else {
			addLink()
		}
	}

	const onDrop = useCallback((acceptedFiles: any) => { setDroppedfiles(acceptedFiles) }, [])

	const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false })

	const getSignedUploadUrl = (file: any, callback: any) => {
		console.log(file)
		const filename = `DAOThumbnail/${nanoid(32)}.${file.type.split('/')[1]}`
		return axiosHttp.post(`utility/upload-url`, { key: filename, mime: file.type }).then(res => callback(res.data))
	}

	//const onUploadProgress = (progress, message: string, file: string) => { }

	const onUploadError = () => { setDroppedfiles([]); setUploadLoading(false) }

	const onUploadStart = (file: string, next: any) => { setUploadLoading(true); return next(file); }

	const onFinish = (finish: any) => {
		setDroppedfiles([])
		setUploadLoading(false);
		var arr = finish.signedUrl.split('?');
		console.log("image : ", arr[0]);
		setImage(arr[0]);
	}

	const onSuccess = (response: any) => {
		setIsAuthenticating(true);
		const repoInfo = extractGitHubRepoPath(link);
		console.log("repo info : ", repoInfo);
		axiosHttp.get(`utility/getGithubAccessToken?code=${response.code}&repoInfo=${repoInfo}`)
			.then((res: any) => {
				if (res.data) {
					console.log("response : ", res.data);
					// check if issues has been previously pulled --- inside DAO object
					const githubOb = _get(DAO, 'github', null);

					if (githubOb) {
						console.log("githubOb : ", githubOb);
						if (_get(DAO, `github.${repoInfo}`, null)) {
							console.log("exists")
							const errorMsg = document.getElementById('error-msg');
                            if(errorMsg){
							    errorMsg.innerHTML = 'Repository already added';
                            }
							setIsAuthenticating(false);
							return;
						}
						else {
							console.log("doesnt exists")
							handleGithub(res.data.access_token, repoInfo);
						}
					}
					else {
						console.log("githubOb doesnt exists");
						handleGithub(res.data.access_token, repoInfo);
					}
				}
				else {
					alert("No res : Something went wrong");
					setIsAuthenticating(false);
				}
				onResetAuth();
			})
			.catch((e) => {
				onResetAuth()
				console.log("error : ", e);
				alert("Something went wrong");
				setIsAuthenticating(false);
			})
	}

	const extractGitHubRepoPath = (url: string) => {
		if (!url) return null;
		const match = url.match(
			/^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
		);
		if (!match || !(match.groups?.owner && match.groups?.name)) return null;
		return `${match.groups.owner}/${match.groups.name}`;
	}

	const handleGithub = (token: string, repoInfo: string|null) => {
		axiosHttp.get(`utility/get-issues?token=${token}&repoInfo=${repoInfo}&daoId=${_get(DAO, '_id', null)}`)
			.then((result: any) => {
				console.log("issues : ", result.data);
				if (result.data.message === 'error') {
					console.log("Not allowed");
					const e = document.getElementById('error-msg');
                    if(e) {
					    e.innerHTML = 'Please check repository for ownership or typography error';
                    }
                    setIsAuthenticating(false);
					return;
				}
				else {
					console.log("Allowed to pull and store issues")
					dispatch(storeGithubIssues({
						payload:
						{
							daoId: _get(DAO, '_id', null),
							issueList: result.data.data,
							token,
							repoInfo,
							linkOb: { title: linkTitle, link: link }
						}
					}));
				}
			})
	}

	const onFailure = (response: any) => console.error("git res : ", response);

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            sx={{ zIndex: 99999 }}
            anchor={'right'}
            open={open}
            onClose={() => onClose()}>
            <Box sx={{ width: 575, flex: 1, paddingBottom: '80px', paddingLeft: '40px', borderRadius: '20px 0px 0px 20px' }}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => onClose()}>
                    <img src={CloseSVG} />
                </IconButton>
            </Box>
        </Drawer>
    )
}