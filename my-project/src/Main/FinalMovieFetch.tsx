
import { useContext, useEffect } from 'react'
import { movieContext } from '../Context/MovieContext'
import axios from 'axios'

const FinalMovieFetch = () => {
  const apiKey = import.meta.env.API_KEY
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
   
    mode
  } = finalContext

 
  useEffect(() => {
    if (mode === "search") return;
    fetchMovies()
  }, [page, selectedGenre, selectedYear, isOlder,mode])

  useEffect(() => {
  if (mode !== "search") {
    setmovieDetail([])  
    setpage(1)
  }
}, [mode])

  async function fetchMovies() {
    if (loading) return

    setloading(true)

    const params: any = {
      api_key: apiKey,
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
              params: { api_key: apiKey },
            }
          )

          return {
            ...movie,
            runtime: detailRes.data.runtime,
          }
        })
      )

    
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
    
    </div>
  )
}

export default FinalMovieFetch