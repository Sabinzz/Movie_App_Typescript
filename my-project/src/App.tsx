

import { ToastContainer } from 'react-toastify'

import MovieContext from './Context/MovieContext'
import BossPage from './Main/BossPage'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
  window.scrollTo(0, 0)
}, [])
  
  return (<>
  <MovieContext>
   <BossPage/>
   </MovieContext>
   <ToastContainer/>
   
   </>
  )
}

export default App
