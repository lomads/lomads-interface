import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppState } from 'App'

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector