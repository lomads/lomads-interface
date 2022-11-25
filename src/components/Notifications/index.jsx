import './index.css'
import React, { useEffect, useState} from "react";
import { get as _get } from 'lodash';
import PROJECT_ICON from 'assets/svg/project-icon.svg'
import USER_ICON from 'assets/svg/user-icon.svg'
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from 'state/hooks';
import axiosHttp from 'api'
import { useWeb3React } from "@web3-react/core";
import { getCurrentUser } from "state/dashboard/actions";
import moment from 'moment';
import { beautifyHexToken } from 'utils'

export default () => {

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
            axiosHttp.get(`notification?dao=${_get(DAO, '_id', '')}&limit=10`)
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
                if(notification.to._id === user._id)
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
        }
    }

    const navigateTo = notification => {
        if(notification.model === 'Project') {
            console.log(_get(notification, 'project', null))
            if(!_get(notification, 'project.deletedAt', null) && !_get(notification, 'project.archivedAt', null)) {
                navigate(`/${DAO.url}/project/${_get(notification, 'project._id', '')}`)
            }
        }
    }

    if(myNotifications.length == 0 && timeline.length == 0)
        return null

    return (
        <div className="notifications">
            <div className='my_notifications'>
                <div className='list-container'>
                    {
                        myNotifications.map(notification => {
                            return (
                                <div onClick={() => navigateTo(notification)} key={notification._id} className='notification-item'>
                                    <div className='notification-item__container'>
                                        <div className='notification-item__container-header'>
                                            <img className='icon' src={PROJECT_ICON} ></img>
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
                                                <img className='icon' src={USER_ICON} ></img>
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