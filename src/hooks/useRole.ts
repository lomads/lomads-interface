import { get as _get, find as _find } from 'lodash';

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const CONTRIBUTOR: Array<string> = [
    'members.edit', 
    'project.view', 
    'project.view.own', 
    'project.member.view',
    'project.task.view.inproject',
    'project.links.view.inproject',
    'members.view'
];

const ACTIVE_CONTRIBUTOR: Array<string> = [
    ...CONTRIBUTOR, 
    'project.view.archives', 
    'project.create', 
    'project.edit.creator',
    'project.archive.creator', 
    'project.delete.creator', 
    'project.member.add.creator', 
    'project.member.edit.creator', 
    'project.link.add.creator',
    'project.task.view.creator',
    'project.links.view.creator'
];

const CORE_CONTRIBUTOR: Array<string> = [
    ...ACTIVE_CONTRIBUTOR, 
    'project.edit', 
    'project.view.all', 
    'project.create', 
    'project.archive', 
    'project.delete', 
    'project.member.add', 
    'project.member.edit', 
    'project.link.add',
    'project.task.view',
    'project.links.view',
    'transaction.view', 
    'members.add', 
    'notification.view', 
    'task.create', 
    'task.create.sweat'
]
const ADMIN: Array<string> = [...CORE_CONTRIBUTOR, 'settings', 'members.delete', 'task.edit', 'task.delete', 'task.close'];

const permissions: any = { ADMIN, ACTIVE_CONTRIBUTOR, CORE_CONTRIBUTOR, CONTRIBUTOR, "": [] }

const can = (role: string , permission: string) => {
    return permissions[role].indexOf(permission) > -1
}

const useRole = (DAO: any, account: string | undefined) => {
    if(DAO && account) {
        let role = _get(_find(DAO.members, m => m.member.wallet.toLowerCase() === account?.toLowerCase()), 'role', '')
        let isSafeOwner = _find(_get(DAO, 'safe.owners'), (m: any) => m.wallet.toLowerCase() === account.toLowerCase());
        return { 
            myRole: role, 
            displayRole: capitalizeFirstLetter(role.replace('_', ' ').toLowerCase()),
            permissions: permissions[role],
            can,
            isSafeOwner
        }
    }
    return { myRole: '', displayRole: '', permissions: [], can, isSafeOwner: false }
}

export default useRole
