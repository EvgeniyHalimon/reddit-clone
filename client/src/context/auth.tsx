import Axios from 'axios'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { User } from '../types'

interface State {
  authenticated: boolean
  user: User | undefined
  loading: boolean
}

interface Action {
  type: string
  payload: any
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true,
})

const DispatchContext = createContext(null)

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case 'LOGIN':
        console.log('LOGIN');
      return {
        ...state,
        authenticated: true,
        user: payload,
      }
    case 'LOGOUT':
        console.log('LOGOUT');
      return { ...state, authenticated: false, user: null }
    case 'STOP_LOADING':
        console.log('STOP_LOADING');
      return { ...state, loading: false }
    default:
        console.log('DEFAULT');
      return state
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  })

  const dispatch = (type: string, payload?: any) => defaultDispatch({ type, payload })

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await Axios.get('/auth/me')
        dispatch('LOGIN', res.data)
      } catch (err) {
        console.log(err)
      } finally {
        dispatch('STOP_LOADING')
      }
    }
    loadUser()
  }, [state.authenticated])

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)