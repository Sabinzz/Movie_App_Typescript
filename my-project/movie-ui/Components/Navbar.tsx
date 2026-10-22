import React, { useContext, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import navLight from '../assets/cinenest-light.png'
import navDark from '../assets/cinenest-dark.png'
import { Icon } from '@iconify/react'
import axios from 'axios'
import ContentSection from './ContentSection'
import { movieContext } from '../Context/MovieContext'
import { useDebounce } from '../Hook/useDebounce'

const Navbar = () => {
  const searchContext = useContext(movieContext)
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

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
    movieDetail, setmovieDetail, setmode, setdisplayMode, setselectedGenre, setselectedYear, setisOlder
  } = searchContext

  const [error, seterror] = useState<string | null>(null)
  const [openSearch, setOpenSearch] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [displaySearchName, setDisplaySearchName] = useState("")
  const [profile, setProfile] = useState<{
    userId: string
    email: string
    name: string
  } | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState("")
  // Track previous debounced name to prevent duplicate calls
  const previousDebouncedName = useRef('')
  const debouncedMovieName = useDebounce(movieName, 500)

  useEffect(() => {
    fetch("/api/me")
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load your profile")
        return res.json()
      })
      .then((user) => setProfile(user))
      .catch(() => setProfileError("Your profile could not be loaded."))
      .finally(() => setProfileLoading(false))
  }, [])

  useEffect(() => {
    if (!profileOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false)
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [profileOpen])

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
    } finally {
      window.location.href = "/"
    }
  }
 

  useEffect(() => {
    if (mode !== "search") return
 
    if (!debouncedMovieName.trim() || debouncedMovieName.trim().length < 2) {
      if (debouncedMovieName.trim() === "") { 
          previousDebouncedName.current = ""
      }
      return
    }
    if (previousDebouncedName.current === debouncedMovieName) return
    previousDebouncedName.current = debouncedMovieName
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
const handleGoHome = () => {
  setmode("home")
  setdisplayMode("home")
  setmovieName("")
  setselectedGenre([])
  setselectedYear(null)
  setisOlder(false)
  setpage(1)
  setmovieDetail([]) // optional but recommended
  setDisplaySearchName("")
}


  const handleMovieApi = async () => {
    const searchTerm = debouncedMovieName.trim()
    if (!searchTerm) return
    
    setloading(true)
    seterror(null)

    try {
      const res = await axios.get(
        'https://api.themoviedb.org/3/search/movie',
        {
          params: {
            api_key: apiKey,
            query: searchTerm,
            page: page,
              include_adult: false, 
          },
        }
      )

    const movies = res.data.results.filter((m: any) => !m.adult) 

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
         console.log("API returned:", detailedMovies.length)
console.log("After slice:", detailedMovies.slice(0,16).length)

      setmovieDetail(detailedMovies)
      setdisplayMode("search")
      setDisplaySearchName(searchTerm)
      setloading(false)
      seterror(null)

    } catch (error) {
      setloading(false)
      seterror('Unable to fetch movies...')
    }
  }
console.log("navbar debouncedMovieName:", debouncedMovieName)
  return (
    <div>
      <div className='w-full h-22 bg-(--surface) text-white'>
        <div className='flex justify-between items-center h-full gap-20'>
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleGoHome}
              aria-label="CineNest home"
              className="ml-4 cursor-pointer sm:ml-8"
            >
              <Image
                src={theme === 'light' ? navLight : navDark}
                alt="CineNest"
                priority
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </button>
          </div>

          <div className='flex items-center gap-3 sm:gap-5 mr-4 sm:mr-8'>
            <button
              onClick={toggleTheme}
              className={`w-14 h-7 flex cursor-pointer items-center rounded-full p-1 transition-all duration-300 
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
                
                  
                  // if (value.trim() === "") {
                    
                   
                  //     previousDebouncedName.current = "" 
                  //   return
                  // }
                 
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

            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              aria-label="Open profile"
              title="Profile"
              className="flex min-w-0 cursor-pointer items-center gap-2 rounded-full p-1.5 text-(--text) transition-colors hover:bg-(--elements) sm:rounded-xl sm:px-2.5 sm:py-2"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--elements)">
                <Icon icon="mdi:user" className="text-(--text)" fontSize={19} />
              </span>
              <span className="hidden min-w-0 text-left sm:flex sm:flex-col">
                <span className="max-w-36 truncate text-sm font-semibold leading-5">
                  {profile?.name || (profileLoading ? "Loading profile" : "My profile")}
                </span>
              </span>
            </button>
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
              
                
                // if (value.trim() === "") {
                //   setmode("home")  
                //   return
                // }
                 
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

      {profileOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setProfileOpen(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-(--surface) text-(--text) shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--elements)">
                  <Icon icon="mdi:account-circle" fontSize={30} />
                </span>
                <div>
                  <h2 id="profile-title" className="text-lg font-semibold">Your profile</h2>
                  <p className="text-sm text-(--text-muted)">CineNest account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                aria-label="Close profile"
                className="cursor-pointer rounded-full p-2 text-(--text-muted) transition-colors hover:bg-(--elements) hover:text-(--text)"
              >
                <Icon icon="mdi:close" fontSize={20} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              {profileLoading ? (
                <p className="py-4 text-center text-sm text-(--text-muted)">Loading your profile…</p>
              ) : profileError ? (
                <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {profileError}
                </p>
              ) : profile ? (
                <>
                  <ProfileRow label="Name" value={profile.name || "CineNest member"} />
                  <ProfileRow label="Email" value={profile.email} />
                </>
              ) : null}
            </div>

            <div className="border-t border-white/10 px-6 py-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
              >
                <Icon icon="mdi:logout" fontSize={18} />
                Sign out
              </button>
            </div>
          </section>
        </div>
      )}

      <div>
        <ContentSection movieDetail={movieDetail} searchMovieName={displaySearchName} />
      </div>
    </div>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/10 px-4 py-3">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-(--text-muted)">{label}</p>
      <p className="break-all text-sm font-medium">{value}</p>
    </div>
  )
}

export default Navbar
