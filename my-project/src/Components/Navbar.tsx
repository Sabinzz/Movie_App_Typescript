import React, { useContext, useEffect, useState, useRef } from 'react'
import NavImg from '../assets/Nav.png'
import { Icon } from '@iconify/react'
import axios from 'axios'
import ContentSection from './ContentSection'
import { movieContext } from '../Context/MovieContext'
import { toast } from 'react-toastify'
import { useDebounce } from '../Hook/useDebounce'

const Navbar = () => {
  const searchContext = useContext(movieContext)
  const apiKey = import.meta.env.VITE_API_KEY

  if (!searchContext) {
    throw new Error("cant search")
  }

  const {
    movieName,
    setmovieName,
    page,
    setpage,
    mode,
    setloading,
    theme,
    toggleTheme,
    movieDetail, setmovieDetail, setmode, setselectedGenre, setselectedYear, setisOlder 
  } = searchContext

  const [error, seterror] = useState<string | null>(null)
  const [openSearch, setOpenSearch] = useState(false)
  
  // Track previous debounced name to prevent duplicate calls
  const previousDebouncedName = useRef('')

  const debouncedMovieName = useDebounce(movieName, 600)

  // Handle search query changes with debounce
  useEffect(() => {
    if (mode !== "search") return
    
    // Don't make API call if the debounced name hasn't actually changed
    if (previousDebouncedName.current === debouncedMovieName) return
    
    previousDebouncedName.current = debouncedMovieName
    
    if (!debouncedMovieName.trim() || debouncedMovieName.trim().length < 2) {
      // If search is cleared, reset to home mode
      if (debouncedMovieName.trim() === "") {
        setmode("home")
      }
      return
    }

    // Reset to page 1 and make API call
    if (page !== 1) {
      setpage(1)
    } else {
      handleMovieApi()
    }
  }, [debouncedMovieName])

  // Handle page changes
  useEffect(() => {
    if (mode !== "search") return
    if (!debouncedMovieName.trim() || debouncedMovieName.trim().length < 2) return
    
    // Only make API call if we have a valid search term
    handleMovieApi()
  }, [page])

  const handleMovieApi = async () => {
    if (!debouncedMovieName.trim()) return
    
    setloading(true)
    seterror(null)

    try {
      const res = await axios.get(
        'https://api.themoviedb.org/3/search/movie',
        {
          params: {
            api_key: apiKey,
            query: debouncedMovieName,
            page: page
          },
        }
      )

      const movies = res.data.results

      const detailedMovies = await Promise.all(
        movies.map(async (movie: any) => {
          const detailRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}`,
            {
              params: {
                api_key: apiKey
              },
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
      seterror('Unable to fetch movies...')
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
                className='border h-11 text-black w-72 outline-none rounded-full border-black bg-(--elements) placeholder:text-(--text) hover:placeholder:text-black pl-12 pr-5 hover:bg-white transition-all duration-500'
                placeholder='Enter keywords...'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  setmovieName(value)
                  
                  if (value.trim() === "") {
                    setmode("home")  
                    return
                  }
                 
                  if (mode !== "search") {
                    setmode("search")
                    setselectedYear(null)
                    setisOlder(false)
                    setselectedGenre([])
                  }
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
                const value = e.target.value
                setmovieName(value)
                
                if (value.trim() === "") {
                  setmode("home")  
                  return
                }
                 
                if (mode !== "search") {
                  setmode("search")
                  setselectedYear(null)
                  setisOlder(false)
                  setselectedGenre([])
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setOpenSearch(false) 
                }
              }}
            />

            <Icon
              icon="charm:search"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
              fontSize={20}
              onClick={() => {
                handleMovieApi()
                setOpenSearch(false)
              }}
            />

            <Icon
              icon="mdi:close"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black cursor-pointer"
              fontSize={22}
              onClick={() => {
                setOpenSearch(false)
                setmovieName("")
              }}
            />
          </div>
        </div>
      )}

      <div>
        <ContentSection movieDetail={movieDetail} />
      </div>
    </div>
  )
}

export default Navbar