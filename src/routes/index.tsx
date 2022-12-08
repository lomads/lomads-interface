// eslint-disable-next-line no-unused-vars
import { LandingLayout, RootLayout } from 'layouts';
import LoginPage from 'views/Login';
import ElementsPage from 'views/Elements';
import CreateOrganization from 'views/Create-Organization';
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
	}
];
