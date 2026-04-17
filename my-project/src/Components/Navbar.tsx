import React, { useContext, useEffect, useState } from 'react'
import NavImg from '../assets/Nav.png'
import { Icon } from '@iconify/react'
import axios from 'axios'
import ContentSection from './ContentSection'
import { movieContext } from '../Context/MovieContext'
import { toast } from 'react-toastify'

const Navbar = () => {
  const searchContext = useContext(movieContext)

  if (!searchContext) {
    throw new Error("shit cant search")
  }

  const {
    movieName,
    setmovieName,
    page,
    setpage,
    mode,
    setloading,
    theme,
    toggleTheme
  } = searchContext

  const context = useContext(movieContext)
  if (!context) {
    throw new Error("useMovieContext must be used inside MovieContextProvider")
  }

  const { movieDetail, setmovieDetail,setmode } = context

  const [error, seterror] = useState<string | null>(null)
  const [openSearch, setOpenSearch] = useState(false) // ✅ mobile search state

useEffect(() => {
  if (mode !== "search") return
  
  if (!movieName.trim()) {
    // User cleared search, switch back to home mode
    setmode("home")
    setpage(1)
    setmovieDetail([])
    return
  }

  const delayDebounce = setTimeout(() => {
    handleMovieApi()
  }, 500) // wait 500ms after user stops typing

  return () => clearTimeout(delayDebounce)
}, [movieName,page])

  const handleMovieApi = async () => {
    if (!movieName.trim()) return
    setloading(true)
    seterror(null)

    try {
      const res = await axios.get(
        'https://api.themoviedb.org/3/search/movie',
        {
          params: {
            api_key: '50e506c1eb5aff5ab14c27ea3bebb47e',
            query: movieName,
            page: page
          }
        }
      )

      const movies = res.data.results

      const detailedMovies = await Promise.all(
        movies.map(async (movie: any) => {
          const detailRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}`,
            {
              params: {
                api_key: '50e506c1eb5aff5ab14c27ea3bebb47e'
              }
            }
          )

          return {
            ...movie,
            runtime: detailRes.data.runtime
          }
        })
      )

      setmovieDetail(detailedMovies)
      setloading(false)
      seterror(null)

    } catch (error) {
      setloading(false)
      seterror('Unable to fetch movies. Please check your connection and try again.')
    }
  }

  return (
    <div>
     
      <div className='w-full h-20 bg-(--surface) text-white'>
        <div className='flex justify-between items-center h-full'>

      
          <div>
            <img className={`h-8 ml-10 object-cover ${theme==='light'? 'invert' : ''}`} src={NavImg} alt="" />
          </div>

        
          <div className='flex items-center gap-5 mr-5 md:mr-10'>

       
            <button
              onClick={toggleTheme}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 
              ${theme === 'dark' ? 'bg-[#3F454E]' : 'bg-[#c1c4c9]'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center
                ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}
              >
                <Icon
                  icon={theme === 'dark' ? 'mdi:weather-night' : 'mingcute:sun-line'}
                  className="text-black"
                  fontSize={14}
                />
              </div>
            </button>

        
            <div className="md:hidden text-(--text)">
              <Icon
                icon="charm:search"
                fontSize={24}
                className="cursor-pointer"
                onClick={() => setOpenSearch(true)}
              />
            </div>

           
            <div className='relative group hidden md:block'>
              <input
                value={movieName}
                type="text"
                className='border h-11 text-black w-72 outline-none rounded-full border-black bg-(--elements) placeholder:text-(--text) hover:placeholder:text-black pl-12 pr-5 hover:bg-white  transition-all duration-500'
                placeholder='Enter keywords...'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setmovieName(e.target.value)
                  setmode("search")
                  setpage(1)
                  setmovieDetail([])
                }}
              
              />

              <Icon
                icon="charm:search"
                className='absolute top-1/2 left-4 -translate-y-1/2 text-(--text) group-hover:text-black transition-colors duration-200'
                fontSize={20}
               
              />
            </div>

     
            <div
              onClick={() => toast("Under Production!!!!")}
              className='hidden md:flex items-center gap-1.5 cursor-pointer'
            >
              <div className='h-8 w-8 bg-(--elements) flex items-center justify-center rounded-full'>
                <Icon icon="mdi:user" className='text-(--text)' fontSize={18} />
              </div>
              <h1 className='text-(--text)'>Login</h1>
            </div>

          </div>
        </div>
      </div>

      {error && (
        <div className="mx-10 mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {openSearch && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start pt-5 px-4">

          <div className="w-full relative">
            <input
              value={movieName}
              type="text"
              autoFocus
              placeholder="Search movies..."
              className="w-full h-12 rounded-full pl-12 pr-12 outline-none text-black bg-white"
              onChange={(e) => {
                setmovieName(e.target.value)
                setmode("search")
                setpage(1)
                setmovieDetail([])
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleMovieApi()
                  setOpenSearch(false)
                }
              }}
            />

            {/* SEARCH ICON */}
            <Icon
              icon="charm:search"
              className="absolute  left-4 top-1/2 -translate-y-1/2 text-black"
              fontSize={20}
              onClick={() => {
                handleMovieApi()
                setOpenSearch(false)
              }}
            />

            {/* CLOSE ICON */}
            <Icon
              icon="mdi:close"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black cursor-pointer"
              fontSize={22}
              onClick={() => setOpenSearch(false)}
            />
          </div>

        </div>
      )}

      {/* CONTENT */}
      <div>
        <ContentSection movieDetail={movieDetail} />
      </div>
    </div>
  )
}

export default Navbar