import './index.css'
import React, { useEffect, useState} from "react";
import { get as _get } from 'lodash';
import PROJECT_ICON from 'assets/svg/project-icon.svg'
import TASK_ICON from 'assets/svg/taskicon.svg'
import USER_ICON from 'assets/svg/user-icon.svg'
import TRANSACTION_ICON from "assets/svg/sendTokenOutline.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from 'state/hooks';
import axiosHttp from 'api'
import { useWeb3React } from "@web3-react/core";
import { getCurrentUser } from "state/dashboard/actions";
import moment from 'moment';
import { beautifyHexToken } from 'utils'

export default ({ isHelpIconOpen }) => {

	const { daoURL } = useParams();
    const { user, DAO,  DAOLoading } = useAppSelector((state) => state.dashboard);
	const { provider, account, chainId, connector } = useWeb3React();
    const [myNotifications, setMyNotifications] = useState([])
    const [timeline, setTimeline] = useState([])
    let navigate = useNavigate();
    
    const dispatch = useAppDispatch();

	useEffect(() => {
		if (account && chainId && (!user || (user && user.wallet.toLowerCase() !== account.toLowerCase()))) {
			dispatch(getCurrentUser({}))
		}
	}, [account, chainId, user])

    useEffect(() => {
        if(user && DAO && DAO.url === daoURL) {
            axiosHttp.get(`notification?dao=${_get(DAO, '_id', '')}&limit=20`)
            .then(res => {
                setMyNotifications(res.data.data)
            })
            axiosHttp.get(`notification?timeline=1&dao=${_get(DAO, '_id', '')}&limit=10`)
            .then(res => {
                setTimeline(res.data.data)
            })
        }
    }, [DAO, daoURL, user])

    const loadNotification = notification => {
        if(notification.model === 'Project') {
            if(notification.type === 'project:member.invited' || notification.type === 'project:member.added'){
                if(notification.to && notification.to._id === user._id)
                    return 'You are <span class="bold">invited</span>'
                if(_get(notification, 'to.name', "") && _get(notification, 'to.name', "") !== "")
                    return `${_get(notification, 'to.name', "")} has been <span class="bold">invited</span> to ${ _get(notification, 'project.name', '') }`
                return `${beautifyHexToken(_get(notification, 'to.wallet', ""))} has been <span class="bold">invited </span> to ${ _get(notification, 'project.name', '') }`
            } else if (notification.type === 'project:created') {
                return `${ _get(notification, "project.name", "") } <span class="bold">created</span>`
            } else if (notification.type === 'project:deleted') {
                return `${ _get(notification, "project.name", "") } <span class="bold">deleted</span>`
            } else if (notification.type === 'project:member:removed') {
                return notification.notification
            }
        } else if(notification.model === 'Task') {
            if(notification.type === 'task:member.assigned'){
                if(notification.to._id === user._id)
                    return 'You are <span class="bold">Assigned</span>'
            } else if(notification.type === 'task:member.submission.rejected' || notification.type === 'task:member.submission.approve'){
                if(notification.to && notification.to._id === user._id)
                    return notification.type === 'task:member.submission.rejected' ? 'Submission <span class="bold">rejected</span>' : 'Submission <span class="bold">approved</span>'
            }
            else if(notification.type === 'task:paid'){
                if(notification.to && notification.to._id === user._id)
                    return `Paid for <span class="bold">${notification.title}</span>`
            }
            return notification.notification
        } else {
            return notification.notification
        }
    }

    const navigateTo = notification => {
        if(notification.model === 'Project') {
            if(!_get(notification, 'project.deletedAt', null) && !_get(notification, 'project.archivedAt', null)) {
                navigate(`/${DAO.url}/project/${_get(notification, 'project._id', '')}`)
            }
        } else if(notification.model === 'Task') {
            if(!_get(notification, 'task.deletedAt', null) && !_get(notification, 'task.archivedAt', null)) {
                navigate(`/${DAO.url}/task/${_get(notification, 'task._id', '')}`)
            }
        }
    }

    const getIcon = (notification, userIcon = true) => {
        if(notification.model === 'Task'){
            if(notification.type.indexOf('member') > -1 && userIcon)
                return USER_ICON
            return TASK_ICON
        }  else if(notification.model === 'Project'){
            if(notification.type.indexOf('member') > -1 && userIcon)
                return USER_ICON
            return PROJECT_ICON
        }  else if(notification.model === 'Transaction'){
            return TRANSACTION_ICON
        } else {
            if(userIcon)
                return USER_ICON
        }
    }

    if(myNotifications.length == 0){
        return (
            <div className='notifications no-content'>
                <div className='my_notifications'>
                    <div className='list-container' style={{justifyContent:'center'}}>
                        <div className='no-action-list'>
                            <span>NO ACTION NOTIFICATION YET</span>
                        </div>
                    </div>
                </div>
                <div className='timeline_notifications'>
                    <div className='list-container'>
                        <div className='notification-item'>
                            <div className='notification-item__container'>
                                <div className='left-section'>
                                    <img className='icon'></img>
                                    <div className='title'>{_get(DAO,'name','')} is created!</div>
                                </div>
                                <div className='date'>10/03</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } 

    return (
        <div className="notifications">
            <div className='my_notifications' style={isHelpIconOpen ? {overflow: 'hidden'} : {}}>
                {isHelpIconOpen && <div className="help-card">
                    Find important personnal notifications here.
				</div>}
                <div className='list-container'>
                    {
                        myNotifications.map(notification => {
                            return (
                                <div onClick={() => navigateTo(notification)} key={notification._id} className='notification-item'>
                                    <div className='notification-item__container'>
                                        <div className='notification-item__container-header'>
                                            <img className='icon' src={getIcon(notification, false)} ></img>
                                            <div className='title'>{ _get(notification, 'title', '') }</div>
                                            <div className='date'>{ moment.utc(notification.createdAt).local().format('MM/DD') }</div>
                                        </div>
                                        <div className='notification-item__container-notification' dangerouslySetInnerHTML={{ __html: loadNotification(notification) }}></div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='timeline_notifications'>
                <div className='list-container'>
                    {
                        timeline.map((notification, i) => {
                            return (
                                <>
                                    <div onClick={() => navigateTo(notification)} key={notification._id} className='notification-item'>
                                        <div className='notification-item__container'>
                                            <div className='left-section'>
                                                <img className='icon' src={getIcon(notification)} ></img>
                                                <div className='title' dangerouslySetInnerHTML={{ __html: loadNotification(notification) }}></div>
                                            </div>
                                            <div className='date'>{ moment.utc(notification.createdAt).local().format('MM/DD') }</div>
                                        </div>
                                    </div>
                                    <div className='dash'></div>
                                </>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}