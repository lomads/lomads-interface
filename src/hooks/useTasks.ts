import react, { useEffect, useMemo } from 'react'
import { filter as _filter, get as _get, find as _find, orderBy as _orderBy, uniqBy as _uniqBy, sortBy as _sortBy} from 'lodash'
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import { getCurrentUser } from 'state/dashboard/actions';

export default (rawTasks: Array<any>) => {
    const dispatch = useAppDispatch()
    const { account } = useWeb3React();
    const { DAO, user } = useAppSelector((state) => state.dashboard);

    useEffect(() => {
        if(!user) {
            dispatch(getCurrentUser({}))
        }
    }, [user])

    const canApply =(task: any) => {
        if(task.contributionType === 'open') {
            let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if(user) {
                if (task?.validRoles.length > 0) {
                    let myDiscordRoles: any = []
                    const discRoles = _get(user, 'discordRoles', {})
                    Object.keys(discRoles).forEach(key => {
                        myDiscordRoles = [...myDiscordRoles, ...discRoles[key]]
                    })
                    let index = task?.validRoles.findIndex((item:any) => item.toLowerCase() === user.role.toLowerCase() || myDiscordRoles.indexOf(item) > -1);
                    return index > -1 ? true : false
                } else {
                    return true;
                }
            }
        }
        return false
    }

    const isOthersApproved = (task: any) => {
        if (task) {
            let user = _find(_get(task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() !== account?.toLowerCase() && m.status === 'approved')
            if (user)
                return true
            return false
        }
        return false;
    };

    const taskApplicationCount = (task:any) => {
        if (task) {
            if (task.taskStatus === 'open' && task.isSingleContributor) {
                let applications = _get(task, 'members', []).filter((m:any) => (m.status !== 'rejected' && m.status !== 'submission_accepted' && m.status !== 'submission_rejected'))
                if (applications)
                    return applications.length
            }
        }
        return 0;
    };

    const taskSubmissionCount = (task: any) => {
        if (task) {
            if ((task.contributionType === 'open' && !task.isSingleContributor) || task.contributionType === 'assign') {
                let submissions = _get(task, 'members', [])?.filter((m:any) => m.submission && (m.status !== 'submission_accepted' && m.status !== 'submission_rejected'))
                if (submissions)
                    return submissions.length
            }
            return 0
        }
        return 0;
    };
    
    const parsedTasks = useMemo(() => {
        if(account && user) {
            let tasks = _filter(rawTasks, rt => !rt.deletedAt && !rt.archivedAt && !rt.draftedAt);
            let manage = _filter(tasks, tsk => tsk.reviewer === user._id)
            manage = manage.map(t => {
                let tsk = { ...t, notification: 0 };
                if (((t.contributionType === 'open' && !t.isSingleContributor) || t.contributionType === 'assign') && taskSubmissionCount(t) > 0) {
                    tsk['notification'] = 1
                } else {
                    if (taskApplicationCount(t) > 0) {
                        tsk['notification'] = 1
                    }
                }
                return tsk
            })
            manage = _orderBy(manage, ['notification', mt => moment(mt.updatedAt).unix()], ['desc', 'desc'])
     
            let myTask = _orderBy(_filter(tasks, tsk => {
                return tsk.reviewer !== user._id && 
                canApply(tsk) && 
                ( 
                    tsk.contributionType === 'open' && tsk.isSingleContributor && !isOthersApproved(tsk) ||
                    tsk.contributionType === 'open' && !tsk.isSingleContributor || 
                    _find(tsk.members, m => m.member.wallet.toLowerCase() === account.toLowerCase())
                )
            }), (mt: any) => moment(mt.updatedAt).unix(), 'desc');
            let drafts = rawTasks.filter(task => !task.deletedAt && !task.archivedAt && task.draftedAt !== null && (task.creator === user._id || task.provider === 'Github' || task.provider === 'Trello'))
            let allTasks = _uniqBy([...manage, ...tasks], t => t._id)
            return { tasks, manage, myTask, drafts, allTasks  }
        }
        return { tasks: [], manage: [], myTask: [], drafts: [], allTasks: [] }
    }, [rawTasks, account, user])

    return { parsedTasks, canApply }

}