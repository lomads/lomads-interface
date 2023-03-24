import react, { useMemo } from 'react'
import { filter as _filter, get as _get, find as _find, orderBy as _orderBy, uniqBy as _uniqBy} from 'lodash'
import { useAppSelector } from 'state/hooks';
import { useWeb3React } from '@web3-react/core';
import moment from 'moment';

export default (rawTasks: Array<any>) => {

    const { account } = useWeb3React();
    const { DAO, user } = useAppSelector((state) => state.dashboard);

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
    
    const parsedTasks = useMemo(() => {
        if(account && user) {
            let tasks = _filter(rawTasks, rt => !rt.deletedAt && !rt.archivedAt && !rt.draftedAt);
            let manage = _filter(tasks, tsk => tsk.reviewer === user._id)
            let manageN = _orderBy(_filter(manage, (m:any) => moment(m.deadline).isSameOrAfter(moment())), t => moment(t.deadline).unix(), 'asc')
            let manageO = _orderBy(_filter(manage, (m:any) => moment(m.deadline).isBefore(moment())), t => moment(t.deadline).unix(), 'desc')
            manage = [...manageN, ...manageO]
            let myTask = _orderBy(_filter(tasks, tsk => {
                return tsk.reviewer !== user._id && 
                canApply(tsk) && 
                ( 
                    tsk.contributionType === 'open' && tsk.isSingleContributor && !isOthersApproved(tsk) ||
                    tsk.contributionType === 'open' && !tsk.isSingleContributor || 
                    _find(tsk.members, m => m.member.wallet.toLowerCase() === account.toLowerCase())
                )
            }), (mt: any) => moment(mt.deadline).unix(), 'desc');
            let drafts = rawTasks.filter(task => !task.deletedAt && !task.archivedAt && task.draftedAt !== null && (task.creator === user._id || task.provider === 'Github' || task.provider === 'Trello'))
            let allTaskN = _orderBy(_filter([...manage, ...tasks], (m:any) => moment(m.deadline).isSameOrAfter(moment())), t => moment(t.deadline).unix(), 'asc')
            let allTaskO = _orderBy(_filter([...manage, ...tasks], (m:any) => moment(m.deadline).isBefore(moment())), t => moment(t.deadline).unix(), 'desc')
            let allTasks = _uniqBy([...allTaskN, ...allTaskO], t => t._id)
            return { tasks, manage, myTask, drafts, allTasks  }
        }
        return { tasks: [], manage: [], myTask: [], drafts: [], allTasks: [] }
    }, [rawTasks, account])

    return { parsedTasks, canApply }

}