import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../App'

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector