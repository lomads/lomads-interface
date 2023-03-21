    import React from 'react';
    import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
    import {
        Drawer, Box, Typography, Paper,TextField
    } from '@mui/material';
    import Button from 'muiComponents/Button';
    import Switch from "muiComponents/Switch";
    import SimpleLoadButton from "UIpack/SimpleLoadButton";

    import CloseSVG from 'assets/svg/close-new.svg'
    import PlusSVG from 'assets/svg/plus.svg'
    import OD from "assets/images/drawer-icons/OD.svg";
    import palette from 'muiTheme/palette';
    import { makeStyles } from '@mui/styles';
    import { isValidUrl } from "utils";

    import Dropzone from 'muiComponents/Dropzone';
    import { IsideModalNew } from "types/DashBoardType";
    import IconButton  from "UIpack/IconButton";


    import { default as MuiIconButton } from 'muiComponents/IconButton'
    import { Image, Input, Textarea } from "@chakra-ui/react";
    import { useAppSelector } from "state/hooks";
    import { useCallback, useEffect, useRef, useState } from "react";
    import { get as _get, find as _find } from 'lodash';
    import { useDispatch } from "react-redux";
    import axiosHttp from 'api'
    import { updateDao, updateDaoLinks, storeGithubIssues, deleteDaoLink } from 'state/dashboard/actions';
    import AddDiscordLink from 'components/AddDiscordLink';
    import { setDAO, resetStoreGithubIssuesLoader, resetDeleteDaoLinkLoader } from "state/dashboard/reducer";
    import AddGithubLink from "components/AddGithubLink";

    import TextInput from "muiComponents/TextInput";

    import ReactS3Uploader from 'components/ReactS3Uploader';
    import { LeapFrog } from "@uiball/loaders";
    import { nanoid } from "@reduxjs/toolkit";
    import { useDropzone } from 'react-dropzone'
    import uploadIcon from '../../assets/svg/ico-upload.svg';

    import LoginGithub from 'react-login-github';
    import { title } from "process";
    import useGithubAuth from "hooks/useGithubAuth";
    import { AppDispatch } from 'state';
    import toggleOrganisationDetailsModal from 'pages/NewPages/Settings.jsx';


    const useStyles = makeStyles((theme: any) => ({
        organisationDetails:
        {
            display:"flex", 
            flexDirection:"column", 
            marginBottom:'35px',
            marginTop:'87px',
            alignItems:"center"
        },
        organisationDetailsText:
        {
            color: palette.primary.main, 
            fontSize: '30px', 
            fontWeight: 400
        },
        heading:
        {
            marginBottom:'35px', 
            paddingLeft:'86px',
            paddingRight:'90px'
        },
        optionalHeading:
        {
            borderRadius: '100px',
            backgroundColor:'rgba(118, 128, 141, 0.05)',
            fontSize: '16px !important',
            fontWeight: '700 !important',
            border:'0px solid rgba(118, 128, 141, 0.05)', 
            width:'141px',
            textAlign :'center'
        },
        dropzoneContainer:
        {
            display:"flex" ,
            flexDirection:"row" ,
            justifyContent:"flex-start",
            alignItems:"center",
            marginTop:'17px'
        },
        borderContainer:
        {
        border:'2px solid #C94B32',
        width:'208px',
        margin:'auto',
        marginBottom:'35px'
        },
        addLinksContainer:
        {
            width:"456px",
            height:'115px',
            marginLeft:'58px',
            marginRight:'61px',
            padding:'0 22px'
        } 
    }));

    export default ({ open, onClose }: { open: boolean, onClose: any }) => {
        const classes = useStyles();

        //const [panels, setPanels] = useState<any>([]);
        const[url,setUrl] = useState<string>("");
        const[linkTitle,setLinkTitle] = useState<string>("");
        const[link,setLink] = useState<string>("");

        const githubRef = useRef();
        const { DAO, updateDaoLoading, updateDaoLinksLoading, storeGithubIssuesLoading, deleteDaoLinkLoading } = useAppSelector((state) => state.dashboard);
        const [name, setName] = useState(_get(DAO, 'name', ''));
        const [oUrl, setOUrl] = useState(_get(DAO, 'url', ''));
        const [description, setDescription] = useState(_get(DAO, 'description', ''));
        const [daoLinks, setDaoLinks] = useState(_get(DAO, 'links', []));
        const [image, setImage] = useState(_get(DAO, 'image', ''));
        const [droppedfiles, setDroppedfiles] = useState([]);
        const [uploadLoading, setUploadLoading] = useState(false);
        const [pullIssues, setPullIssues] = useState(false);
        const [importRoles, setImportRoles] = useState(false);
        const [isAuthenticating, setIsAuthenticating] = useState(false);
        const { onResetAuth } = useGithubAuth();
        const dispatch = useDispatch<AppDispatch>();

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
            if (updateDaoLoading === false) {
                onClose();
            }
        }, [updateDaoLoading]);
        
        useEffect(() => {
            if (deleteDaoLinkLoading === false) {
                dispatch(resetDeleteDaoLinkLoader);
            }
        }, [deleteDaoLinkLoading])
        
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
        	dispatch(updateDao({ url: DAO?.url, payload: { name, description, image } }));
        	// dispatch(updateDaoLinks({ url: DAO?.url, payload: { links: daoLinks } }))
            //onClose();
        }
        
        const addNewLink = (e:any) => {
            let errorCount = 0;
            for (var i = 0; i < daoLinks.length; i++) {
                const title = daoLinks[i].title;
                const link = daoLinks[i].link;
                if (title === '') {
                    errorCount += 1;
                    document.getElementById(`title${i}`)!.innerHTML = 'Please enter title'
                }
                else if (link === '') {
                    errorCount += 1;
                    document.getElementById(`link${i}`)!.innerHTML = 'Please enter link'
                }
            }
            if (errorCount === 0) {
                console.log("DAO links : ", daoLinks);
                // dispatch(updateDaoLinks({ url: DAO?.url, payload: { links: daoLinks } }))
            }
        }
        
        const deleteLink = (response:any, item:any) => {
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
                    let links = daoLinks.filter((l:any) => !(l.title === item.title && l.link === item.link))
                    setDaoLinks(links);
                }
            }
            else {
                let links = daoLinks.filter((l:any) => !(l.title === item.title && l.link === item.link))
                setDaoLinks(links);
            }
        }
        
        const handleOnServerAdded = (serverId:any) => {
            if (importRoles) {
                axiosHttp.post(`discord/guild/${serverId}/sync-roles`, { daoId: _get(DAO, '_id') })
                    .then(res => {
                        addLink()
                    })
            } else {
                addLink()
            }
        }
        
        const onDrop = useCallback((acceptedFiles:any) => { setDroppedfiles(acceptedFiles) }, [])
        
        const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false })
        
        const getSignedUploadUrl = (file:any, callback:any) => {
            console.log(file)
            const filename = `DAOThumbnail/${nanoid(32)}.${file.type.split('/')[1]}`
            return axiosHttp.post(`utility/upload-url`, { key: filename, mime: file.type }).then(res => callback(res.data))
        }
        
        const onUploadProgress = (progress:any, message:any, file:any) => { }
        
        const onUploadError = (error:any) => { setDroppedfiles([]); setUploadLoading(false) }
        
        const onUploadStart = (file:any, next:any) => { setUploadLoading(true); return next(file); }
        
        const onFinish = (finish:any) => {
            setDroppedfiles([])
            setUploadLoading(false);
            var arr = finish.signedUrl.split('?');
            console.log("image : ", arr[0]);
            setImage(arr[0]);
        }
        
        const onSuccess = (response:any) => {
            setIsAuthenticating(true);
            const repoInfo = extractGitHubRepoPath(link);
            console.log("repo info : ", repoInfo);
            axiosHttp.get(`utility/getGithubAccessToken?code=${response.code}&repoInfo=${repoInfo}`)
                .then((res) => {
                    if (res.data) {
                        console.log("response : ", res.data);
                        // check if issues has been previously pulled --- inside DAO object
                        const githubOb = _get(DAO, 'github', null);
        
                        if (githubOb) {
                            console.log("githubOb : ", githubOb);
                            if (_get(DAO, `github.${repoInfo}`, null)) {
                                console.log("exists")
                                const e = document.getElementById('error-msg');
                                e!.innerHTML = 'Repository already added';
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
        
        const extractGitHubRepoPath = (url:any) => {
            if (!url) return null;
            const match = url.match(
                /^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
            );
            if (!match || !(match.groups?.owner && match.groups?.name)) return null;
            return `${match.groups.owner}/${match.groups.name}`;
        }
        
        const handleGithub = (token:any, repoInfo:any) => {
            axiosHttp.get(`utility/get-issues?token=${token}&repoInfo=${repoInfo}&daoId=${_get(DAO, '_id', null)}`)
                .then((result) => {
                    console.log("issues : ", result.data);
                    if (result.data.message === 'error') {
                        console.log("Not allowed");
                        const e = document.getElementById('error-msg');
                        e!.innerHTML = 'Please check repository for ownership or typography error';
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
        
        const onFailure = (response:any) => console.error("git res : ", response);



        return (
            <Drawer
                PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
                sx={{ zIndex: 99999 }}
                anchor={'right'}
                open={open}
                onClose={() => onClose()}>
                <Box sx={{ width: 575, flex:1,paddingBottom: '100px', borderRadius: '20px 0px 0px 20px' }}>
                    <MuiIconButton sx={{ position: 'fixed', right:'27px' , top: '36px', borderRadius:'0px'}} onClick={() => onClose()}>
                        <img src={CloseSVG} style={{width:"15px" , height:"15px"}} />
                    </MuiIconButton>
                    <Box className={classes.organisationDetails}>
                        <img src={OD}  />
                        <Typography my={2} style={{ color: palette.primary.main, fontSize: '30px', fontWeight: 400 }}>Organisation Details</Typography>
                    </Box>

                    
                    <Box className={classes.heading}>
                        <Typography  style={{
                                        color: '#76808d',
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        lineHeight: '18px'
                                    }}>Name</Typography>
                        <TextInput placeholder="Fashion Fusion"  sx={{ marginTop:'10px'}} fullWidth />
                    </Box>
                    <Box className={classes.heading}>
                        <Typography  style={{
                                        color: '#76808d',
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        lineHeight: '18px'
                                    }}>Description</Typography>
                        <TextInput placeholder="DAO description"  sx={{ marginTop:'10px'}} fullWidth multiline rows={4}/>
                    </Box>
                    <Box className={classes.heading}>
                        <Typography  style={{
                                        color: '#76808d',
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        lineHeight: '18px'
                                    }}>Organisation's URL</Typography>
                        <TextInput placeholder="https://app.loamads.xyz/Name" sx={{marginTop:'10px'}} fullWidth />
                    </Box>

                    <Box className={classes.heading}>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography  style={{
                                        color: '#76808d',
                                        fontSize: '16px',
                                        fontWeight: 700
                                    }}>Import Thumbnail</Typography>
                            <Box >
                                            Optional
                            </Box>
                        </Box>
                        <Box className={classes.dropzoneContainer}>
                                        <Dropzone value={url} onUpload={(value:any)=>
                                        {
                                            setUrl(value);
                                                //console.log(value);
                                        }}></Dropzone>
                                        <Typography style={{
                                        color: 'rgba(118, 128, 141, 0.5)',
                                        fontSize: '16px',
                                        fontWeight: 400,
                                        lineHeight: '16px',
                                        width:'147px',
                                        marginLeft:'13px'
                                    }}>Accepted formats: jpg, svg or png</Typography>
                        </Box>
                    </Box>

                    <Box className={classes.borderContainer}>
                    </Box>

                    <Box className={classes.addLinksContainer}>
                            <Typography style={{
                                        color: '#76808d',
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        lineHeight: '18px',marginBottom:'10px'}}>Add links</Typography>
                                    <Box display="flex" flexDirection="row" marginBottom="10px" justifyContent="space-between" alignItems="center">
                                        <TextInput placeholder="Homepage" sx={ {width:"144px" ,marginRight:'12px'}} value={linkTitle} onChange={(e:any)=>setLinkTitle(e.target.value)}
                                        ></TextInput>
                                        <TextInput placeholder="http//discord..." sx={{width:"193px",marginRight:'13px',height:"50px"}} value={link} onChange={(e:any)=>setLink(e.target.value)} 
                                        ></TextInput>
                                        {/* <IconButton sx={{width:'50px', height:'50px',borderRadius:'5px',backGround:'rgba(27, 43, 65, 0.2)'}}>
                                        <img src={PlusSVG} style={{width:"15px" , height:"15px"}} /> */}
                                        {/* </IconButton> */}
                                        {link && link.indexOf('discord.') > -1 ?
                                        <AddDiscordLink
                                    renderButton={<IconButton
                                        className="addButton"
                                        Icon={<AiOutlinePlus style={{ height: 30, width: 30 }} />}
                                        height={40}
                                        width={40}
                                        bgColor={(linkTitle.length > 0 && isValidUrl(link))
                                            ? "#C94B32"
                                            : "rgba(27, 43, 65, 0.2)"} />}
                                    onGuildCreateSuccess={handleOnServerAdded}
                                    accessControl={true}
                                    link={link} title={undefined} desc={undefined} roleName={undefined} okButton={undefined} onLinkError={undefined}/>
                                        :
                                        <>
                                            {console.log(link)}
                                            {

                                                link && link.indexOf('github.') > -1 && pullIssues
                                                    ?
                                                    <>
                                                        {
                                                            // isAuthenticating
                                                            // 	?
                                                            // 	<button className="githubAddButton active" disabled>
                                                            // 		<LeapFrog size={20} color="#FFF" />
                                                            // 	</button>
                                                            // 	:
                                                            // <LoginGithub
                                                            // 	clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
                                                            // 	scope="repo user admin:repo_hook admin:org"
                                                            // 	onSuccess={onSuccess}
                                                            // 	onFailure={onFailure}
                                                            // 	className={linkTitle.length > 0 && isValidUrl(link) ? "githubAddButton active" : "githubAddButton"}
                                                            // 	buttonText="+"
                                                            // />
                                                            <AddGithubLink onSuccess={onSuccess} title={linkTitle} link={link} desc={undefined} roleName={undefined} accessControl={undefined} okButton={undefined} onGuildCreateSuccess={undefined} innerRef={undefined} renderButton={undefined} />
                                                        }
                                                    </>
                                                    :
                                                    <IconButton
                                                        className="addButton"
                                                        Icon={<AiOutlinePlus style={{ height: 30, width: 30 }} />}
                                                        height={40}
                                                        width={40}
                                                        onClick={() => addLink()}
                                                        bgColor={
                                                            (linkTitle.length > 0 && isValidUrl(link))
                                                                ? "#C94B32"
                                                                : "rgba(27, 43, 65, 0.2)"
                                                        }
                                                    />
                                            }
                                        </>
                                    }
                                    </Box>
                                    {
                                    link && link.indexOf('github.') > -1
                                        ?
                                        <Box>
                                            <Switch sx={{marginBottom:'30px'}} checked={pullIssues} onChange={() => setPullIssues(prev => !prev)} label="IMPORT ISSUES" />
                                        </Box>
                                        :
                                        <>
                                            {
                                                link && link.indexOf('discord.') > -1
                                                    ?
                                                    <Box ml={2} my={2}>
                                                        <Switch checked={importRoles} onChange={() => setImportRoles(prev => !prev)} label="IMPORT ROLES" />
                                                    </Box>
                                                    :
                                                    null
                                            }
                                        </>
                                }
                                {/* <span className="error-msg" id="error-msg"></span> */}
                                {daoLinks.length > 0 &&
                                    <Box
                                        style={{
                                            marginTop: "9px",
                                            padding: "9px 20px 9px 20px",
                                            backgroundColor: "#edf2f7",
                                            color: "#718096",
                                            borderRadius: "5px",
                                            justifyContent: 'space-between'
                                        }}>
                                        {daoLinks.map((item:any, index:any) => {
                                            return (
                                                <Box
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        marginTop: "9px",
                                                        color: "#718096",
                                                        justifyContent: 'space-between'
                                                    }}>
                                                    <Box
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row"
                                                        }}
                                                    >
                                                        <Box width="50%">{item.title.length > 7 ? item.title.substring(0, 7) + "..." : item.title}</Box>
                                                        <Box width="50%" style={{
                                                            paddingLeft: 8,
                                                            width: 250,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>{item.link}</Box>
                                                    </Box>
                                                    {
                                                        item.link && item.link.indexOf('github.') > -1
                                                            ?
                                                            <AddGithubLink
                                                                renderButton={
                                                                        <AiOutlineClose style={{ height: 15, width: 15 }} />
                                                                        
                                                                }
                                                                onSuccess={(res: any) => deleteLink(res, item)}
                                                                validate={false}
                                                                link={item.link} title={undefined} desc={undefined} roleName={undefined} accessControl={undefined} okButton={undefined} onGuildCreateSuccess={undefined} innerRef={undefined}														/>
                                                            :
                                                            <Box
                                                                className="deleteButton"
                                                                onClick={() => {
                                                                    deleteLink(null, item);
                                                                }}
                                                            >
                                                                <AiOutlineClose style={{ height: 15, width: 15 }} />
                                                            </Box>

                                                    }
                                                </Box>
                                            )
                                        })}
                                    </Box>
                                }
                    </Box>
                    {/* <Box style={{ background: 'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)', width: '567px', position: 'fixed', bottom: 0, borderRadius: '0px 0px 0px 20px', padding: "30px 0 20px" }}> */}
                                     <Box style={{ background: 'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)', width: '567px', position: 'fixed', bottom: 0, borderRadius: '0px 0px 0px 20px', padding: "30px 0 20px" }}>
							<Box display="flex" mt={4} width={380} style={{ margin: '0 auto' }} flexDirection="row" justifyContent="space-between">
								<Button onClick={onClose} sx={{ width:'169px',height: '50px',fontSize:'20px' }} fullWidth variant='outlined' size="small"  >Cancel</Button>
								<SimpleLoadButton
                                            title={`SAVE CHANGES`}
                                            height={50}
                                            width={184}
                                            fontsize={20}
                                            fontweight={400}
                                            onClick={saveChanges}
                                            bgColor={"#C94B32"}
                                            condition={updateDaoLoading?updateDaoLoading:false}
                                        />
                                {/* <Button onClick={() => saveChanges()} sx={{ ml: 1 }} fullWidth variant='contained' size="small">Save</Button> */}
							</Box>
					</Box>
                </Box>
            </Drawer>
        )
    }