// eslint-disable-next-line no-unused-vars
import { LandingLayout, RootLayout } from 'layouts';
import LoginPage from 'views/Login';
import ElementsPage from 'views/Elements';
import CreateOrganization from 'views/Create-Organization';
import InviteGang from 'views/Invite-Gang';
import StartSafe from 'views/Start-Safe';
import CreateSafe from 'views/Create-Safe';
import AddExistingSafe from 'views/Add-Existing-Safe';
import DAOLive from 'views/DAO-Live';
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
	}
];
