import { PropsWithChildren, useEffect } from 'react'
import { ensureToken } from './utils/auth'
import './app.scss'

function App({ children }: PropsWithChildren) {
  useEffect(() => {
    ensureToken().catch(() => {})
  }, [])

  return children
}

export default App
