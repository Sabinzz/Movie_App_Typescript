import { Icon } from '@iconify/react'
import { useContext, useEffect } from 'react'
import { movieContext } from '../Context/MovieContext'
import axios from 'axios'

const FinalMovieFetch = () => {
  const finalContext = useContext(movieContext)
  if (!finalContext) throw new Error("Context not found")

  const {
    isOlder,
    loading,
    setloading,
    page,
    selectedGenre,
    selectedYear,
    setmovieDetail,
    setpage,
    setmode,
    mode
  } = finalContext

  // ✅ SINGLE SOURCE OF FETCH (FIXED)
  useEffect(() => {
    fetchMovies()
  }, [page, selectedGenre, selectedYear, isOlder,mode])

  useEffect(() => {
  setmovieDetail([])   // 🔥 clear old results when mode changes
  setpage(1)
}, [mode])

  async function fetchMovies() {
    if (loading) return

    setloading(true)

    const params: any = {
      api_key: "50e506c1eb5aff5ab14c27ea3bebb47e",
      page: page,
    }

    if (selectedGenre.length) {
      params.with_genres = selectedGenre.join(",")
    }

    if (isOlder) {
      params["primary_release_date.lte"] = "2022-01-01"
    } else if (selectedYear) {
      params.primary_release_year = selectedYear
    }

    try {
      const res = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        { params }
      )

      const movies = res.data.results

      const detailedMovies = await Promise.all(
        movies.map(async (movie: any) => {
          const detailRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}`,
            {
              params: { api_key: "50e506c1eb5aff5ab14c27ea3bebb47e" },
            }
          )

          return {
            ...movie,
            runtime: detailRes.data.runtime,
          }
        })
      )

      // ✅ FIXED: Append for infinite scroll in home mode, replace for filters
     setmovieDetail((prev: any[]) => {
  const existingIds = new Set(prev.map(m => m.id))
  const filtered = detailedMovies.filter(m => !existingIds.has(m.id))

  return mode === "home" && page > 1
    ? [...prev, ...filtered]
    : filtered
})

    } catch (error) {
      console.error("Fetch failed", error)
    } finally {
      setloading(false)
    }
  }

  return (
    <div>
      <div className='relative'>
        <button
          onClick={() => {
            setmode("filter")
            setpage(1) // 🔥 important reset trigger
          }}
          className='h-7 w-22 pl-5 text-[#212529] rounded-xl bg-[#79C142]'
        >
          Filter
        </button>

        <Icon
          className='absolute top-1 left-3 text-black translate-y-0.5'
          icon="lucide:search"
        />
      </div>
    </div>
  )
}

export default FinalMovieFetch