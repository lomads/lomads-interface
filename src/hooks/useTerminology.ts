import { get as _get, find as _find } from 'lodash'
import { DEFAULT_ROLES, WORKSPACE_OPTIONS, TASK_OPTIONS } from "constants/terminology";

const useTerminology = (terminology: any) => {
    console.log(terminology)
    const transformWorkspace = () => {
        if(terminology)
            return terminology?.workspace
        return _find(WORKSPACE_OPTIONS, wo => wo.value === 'WORKSPACE')
    }
    const transformTask = () => {
        if(terminology)
            return terminology?.task
        return _find(TASK_OPTIONS, to => to.value === 'TASK')
    }
    const transformRole = (role: string) => {
        if(terminology)
            return _get(terminology, `roles.${role}`)
        return  _get(DEFAULT_ROLES, role)
    }

    return { transformWorkspace, transformTask, transformRole }

}

export default useTerminology