

import { ToastContainer } from 'react-toastify'

import MovieContext from './Context/MovieContext'
import BossPage from './Main/BossPage'

function App() {
  
  return (<>
  <MovieContext>
   <BossPage/>
   </MovieContext>
   <ToastContainer/>
   
   </>
  )
}

export default App
