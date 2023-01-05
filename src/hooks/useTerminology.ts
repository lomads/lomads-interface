import { get as _get, find as _find } from 'lodash'
import { DEFAULT_ROLES, WORKSPACE_OPTIONS, TASK_OPTIONS } from "constants/terminology";

const useTerminology = (terminology: any) => {
    const transformWorkspace = () => {
        if(terminology)
            return _get(terminology, 'workspace', _find(WORKSPACE_OPTIONS, wo => wo.value === 'WORKSPACE'))
        return _find(WORKSPACE_OPTIONS, wo => wo.value === 'WORKSPACE')
    }
    const transformTask = () => {
        if(terminology)
        return _get(terminology, 'task', _find(TASK_OPTIONS, to => to.value === 'TASK'))
        return _find(TASK_OPTIONS, to => to.value === 'TASK')
    }
    const transformRole = (r: string) => {
        let role = r ? r : 'role4'
        if(terminology)
            return _get(terminology, `roles.${role}`, _get(DEFAULT_ROLES, role))
        return  _get(DEFAULT_ROLES, role)
    }

    return { transformWorkspace, transformTask, transformRole }

}

export default useTerminology