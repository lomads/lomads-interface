import { get as _get, find as _find } from 'lodash';
import useTerminology from './useTerminology';

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const role4: Array<string> = [
    'members.edit', 
    'project.view', 
    'project.view.own', 
    'project.member.view',
    'project.milestone.view.inproject',
    'project.task.view.inproject',
    'project.links.view.inproject',
    'members.view'
];

const role3: Array<string> = [
    ...role4, 
    'project.view.archives', 
    'project.create', 
    'project.edit.creator',
    'project.share.creator', 
    'project.archive.creator', 
    'project.review.creator',
    "project.milestone.update.creator",
    'project.delete.creator', 
    'project.member.add.creator', 
    'project.member.edit.creator', 
    'project.link.add.creator',
    'project.task.view.creator',
    'project.links.view.creator'
];

const role2: Array<string> = [
    ...role3, 
    //'settings',
    //'settings.roles_permissions',
    //'settings.integration',
    'project.edit', 
    'project.share', 
    'project.view.all', 
    'project.create', 
    'project.archive', 
    'project.review',
    "project.milestone.update",
    'project.delete', 
    'project.member.add', 
    'project.member.edit', 
    'project.link.add',
    'project.milestone.view',
    'project.task.view',
    'project.links.view',
    'transaction.view', 
    'members.add', 
    'notification.view', 
    'task.create', 
    'task.create.sweat'
]
const role1: Array<string> = [...role2, 'settings', 'settings.*', 'members.delete', 'task.edit', 'task.share', 'task.delete', 'task.close'];

const permissions: any = { "role1": role1, "role2": role2, "role3" : role3, "role4": role4, "": [] }

const can = (role: string , permission: string) => {
    return _get(permissions, role, []).indexOf(permission) > -1
}

const useRole = (DAO: any, account: string | undefined) => {
    const { transformRole } = useTerminology(_get(DAO, 'terminologies'))
    if(DAO && account) {
        let role = _get(_find(DAO.members, m => m.member.wallet.toLowerCase() === account?.toLowerCase()), 'role', '')
        let isSafeOwner = _find(_get(DAO, 'safe.owners'), (m: any) => m.wallet.toLowerCase() === account.toLowerCase());
        return { 
            myRole: role, 
            displayRole: _get(transformRole(role), 'label', ''),
            permissions: permissions[role],
            can,
            isSafeOwner
        }
    }
    return { myRole: '', displayRole: '', permissions: [], can, isSafeOwner: false }
}

export default useRole
