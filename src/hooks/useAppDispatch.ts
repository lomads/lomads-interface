import { useDispatch } from 'react-redux'
import { AppDispatch } from 'App'

export const useAppDispatch = () => useDispatch<AppDispatch>()