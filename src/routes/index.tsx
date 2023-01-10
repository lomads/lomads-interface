// eslint-disable-next-line no-unused-vars
import { CreateNewLayout, LandingLayout, RootLayout, SettingsLayout } from 'layouts';
import LoginPage from 'views/Login';
import ElementsPage from 'views/Elements';
import CreateOrganization from 'views/Create-Organization';
import InviteGang from 'views/Invite-Gang';
import StartSafe from 'views/Start-Safe';
import CreateSafe from 'views/Create-Safe';
import AddExistingSafe from 'views/Add-Existing-Safe';
import DAOLive from 'views/DAO-Live';
import Dashboard from 'views/Dashboard';
import Settings from 'views/Settings-DAO';
import CreateProject from 'views/Create-Project';
export default [
	// {
	// 	path: '/',
	// 	exact: true,
	// 	layout: BaseLayout,
	// 	private: true,
    // 	component: () => <Redirect to='/dashboard' />
	// },
	{
		path: '/login',
		exact: true,
		layout: LandingLayout,
		private: false,
		component: LoginPage
	},
	{
		path: '/',
		exact: true,
		layout: RootLayout,
		private: false,
		component: ElementsPage
	},
	{
		path:'/create-organization',
		exact: true,
		layout: LandingLayout,
		private: false,
		component: CreateOrganization
	},
	{
		path:'/invitegang',
		exact: true,
		layout: LandingLayout,
		private: false,
		component: InviteGang
	},
	{
		path: '/startsafe',
		exact: true,
		layout: LandingLayout,
		private: false,
		component: StartSafe
	},
	{
		path: '/newsafe',
		exact: true,
		layout: LandingLayout,
		private: false,
		component: CreateSafe
	},
	{
		path:'/addsafe',
		exact: true,
		layout: LandingLayout,
		private: false,
		component: AddExistingSafe
	},
	{
		path: '/success',
		exact: true,
		layout: LandingLayout,
		private: false,
		component: DAOLive
	},
	{
		path: '/dashboard',
		exact: true,
		layout: RootLayout,
		private: false,
		component: Dashboard
	},
	{
		path: '/settings',
		exact: true,
		layout: SettingsLayout,
		private: false,
		component: Settings
	},
	{
		path: '/createProject',
		exact: true,
		layout: CreateNewLayout,
		private: false,
		component: CreateProject
	}
];
