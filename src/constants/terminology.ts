export const WORKSPACE_OPTIONS = [
	{
		value: 'WORKSPACE',
		label: 'Workspace',
		labelPlural: 'Workspaces',
	},
	{
		value: 'PROJECT',
		label: 'Project',
		labelPlural: 'Projects',
	},
	{
		value: 'POD',
		label: 'Pod',
		labelPlural: 'Pods',
	},
	{
		value: 'DEPARTMENT',
		label: 'Department',
		labelPlural: 'Departments',
	},
	{
		value: 'FUNCTION',
		label: 'Function',
		labelPlural: 'Functions',
	},
	{
		value: 'GUILD',
		label: 'Guild',
		labelPlural: 'Guilds',
	}
]

export const TASK_OPTIONS = [
	{
		value: 'TASK',
		label: 'Task',
		labelPlural: 'Tasks',
	},
	{
		value: 'BOUNTY',
		label: 'Bounty',
		labelPlural: 'Bounties',
	}
]

export const DEFAULT_ROLES = {
    "role1" : {
        "label": 'Admin',
        "value": 'ADMIN',
        "permissions": ["*"]
    },
    "role2" : {
        "label": 'Core Contributor',
        "value": 'CORE_CONTRIBUTOR',
        "permissions": ["*"]
    },
    "role3" : {
        "label": 'Active Contributor',
        "value": 'ACTIVE_CONTRIBUTOR',
        "permissions": ["*"]
    },
    "role4" : {
        "label": 'Contributor',
        "value": 'CONTRIBUTOR',
        "permissions": ["*"]
    },
}