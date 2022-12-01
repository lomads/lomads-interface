import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../App'

export const useAppDispatch = () => useDispatch<AppDispatch>()