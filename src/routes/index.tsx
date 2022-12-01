// eslint-disable-next-line no-unused-vars
import { LandingLayout, RootLayout } from 'layouts';
import LoginPage from 'views/Login';
import ElementsPage from 'views/Elements';

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
		path: '/elements',
		exact: true,
		layout: RootLayout,
		private: false,
		component: ElementsPage
	},
];
