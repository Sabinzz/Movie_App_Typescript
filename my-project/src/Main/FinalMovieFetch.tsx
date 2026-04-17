import { Icon } from '@iconify/react'
import { useContext, useEffect } from 'react'
import { movieContext } from '../Context/MovieContext'
import axios from 'axios'

const FinalMovieFetch = () => {
  const finalContext = useContext(movieContext)
  if (!finalContext) throw new Error("can fetch")

  const {
    isOlder,
    loading,
    mode,
    setloading,
    page,
    setpage,
    selectedGenre,
    selectedYear,
    setmovieDetail,
    setmode
  } = finalContext

  // 🔥 HOME fetch (infinite scroll)
  useEffect(() => {
    if (mode !== "home") return
    fetchMovies()
  }, [page])

  // 🔥 FILTER fetch
  useEffect(() => {
    if (mode !== "filter") return
    setpage(1)
    fetchMovies()
  }, [selectedGenre, selectedYear, isOlder])

  // 🔥 Reset to home once on mount
  useEffect(() => {
    setmode("home")
  }, [])

  const handleScroll = () => {
    if (loading) return
    if (mode !== "home") return

    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setpage((prev) => prev + 1)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mode, loading])

  // ✅ SINGLE CLEAN FETCH FUNCTION
  async function fetchMovies() {
    setloading(true)

    const genreQuery = selectedGenre.join(",")

    const params: any = {
      api_key: "50e506c1eb5aff5ab14c27ea3bebb47e",
      page: page,
    }

    if (genreQuery) params.with_genres = genreQuery

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
              params: {
                api_key: "50e506c1eb5aff5ab14c27ea3bebb47e",
              },
            }
          )

          return {
            ...movie,
            runtime: detailRes.data.runtime,
          }
        })
      )

      // ✅ IMPORTANT: correct append logic
      if (mode === "home" && page > 1) {
        setmovieDetail((prev: any) => [...prev, ...detailedMovies])
      } else {
        setmovieDetail(detailedMovies)
      }

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
            setpage(1)
            fetchMovies()
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