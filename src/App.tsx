import { useAtom } from 'jotai'
import { Login } from './Login/Login'
import { userDataAtom } from './atoms/userDataAtom'
import { Menu } from './components/Menu/Menu'
import useFlowBiteLoader from './hooks/Flowbite/useFlowBiteLoader'
import { Home } from './home/Home'

function App() {
  useFlowBiteLoader()
  const [userData,] = useAtom(userDataAtom)
  return (
    <>
      {
        userData.login ? <>
          <Menu />
          <Home />
        </> : <Login />
      }
    </>
  )
}

export default App