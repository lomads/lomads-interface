import axios from 'axios';
import { get as _get } from 'lodash';
import axiosRetry from 'axios-retry';

var axiosConfig = axios.create({
	baseURL: `${process.env.REACT_APP_NODE_BASE_URL}/api/v1`,
	headers: {
		'Content-Type': 'application/json'
	}
});

axiosConfig.interceptors.request.use(
	(axiosConf) => {
		const token = localStorage.getItem('__lmds_web3_token');
		console.log('token :: ', token);
		if (token) axiosConf.headers.Authorization = token;
		return axiosConf;
	},
	error => Promise.reject(error)
);

const interceptor = axiosConfig.interceptors.response.use(
		response => response,
		error => {
				// TODO:: implement Global error response handler here
				console.log(error)
				if (_get(error, 'response.status', 500) !== 401) {
						return Promise.reject(error);
				} 
				axiosConfig.interceptors.response.eject(interceptor);
		}
);

// Retry for network errors.
axiosRetry(axiosConfig, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export default axiosConfig;
