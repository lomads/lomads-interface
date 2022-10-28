import { get as _get, find as _find } from 'lodash';

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const CONTRIBUTOR: Array<string> = ['project.view', 'project.view.own',  'members.view'];
const ACTIVE_CONTRIBUTOR: Array<string> = [...CONTRIBUTOR, 'project.view.archives', 'project.create', 'project.delete', 'project.archive', 'project.member.add', 'project.member.edit', 'project.link.add'];
const CORE_CONTRIBUTOR: Array<string> = [...ACTIVE_CONTRIBUTOR, 'project.view.all', 'transaction.view', 'members.add', 'notification.view']
const ADMIN: Array<string> = [...CORE_CONTRIBUTOR, 'settings', 'transaction.send', 'members.edit', 'members.delete'];

const permissions: any = { ADMIN, ACTIVE_CONTRIBUTOR, CORE_CONTRIBUTOR, CONTRIBUTOR, "": [] }

const can = (role: string , permission: string) => {
    return permissions[role].indexOf(permission) > -1
}

const useRole = (DAO: any, account: string | undefined) => {
    if(DAO && account) {
        let role = _get(_find(DAO.members, m => m.member.wallet.toLowerCase() === account?.toLowerCase()), 'role', '')
        return { 
            myRole: role, 
            displayRole: capitalizeFirstLetter(role.replace('_', ' ').toLowerCase()),
            permissions: permissions[role],
            can
        }
    }
    return { myRole: '', displayRole: '', permissions: [], can }
}

export default useRole
