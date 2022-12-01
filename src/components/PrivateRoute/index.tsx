import React, { useEffect, useState } from 'react';
import { pick as _pick, get as _get } from 'lodash';
import { Navigate } from 'react-router-dom';
import { useAppDispatch } from 'hooks/useAppDispatch';
import FullScreenLoader from 'components/FullScreenLoader';

const PrivateRoute = (props: any) => {
	const dispatch = useAppDispatch()
	return props.orRender;
};
export default PrivateRoute;
