import { useContext, useState, useRef, useEffect } from 'react'
import MovieCard from './MovieCard'
import Page from '../Pagination/Page'
import { movieContext } from '../Context/MovieContext'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  runtime: number
  overview: string
  backdrop_path: string | null
}

interface Props {
  movieDetail: Movie[]
}

const ShowMovie = ({ movieDetail }: Props) => {
  const [showMovieCard, setshowMovieCard] = useState<Movie | null>(null)
  const [visibleCount, setVisibleCount] = useState(16)

  const showMovieContext = useContext(movieContext)
  if (!showMovieContext) throw new Error("Context error")

  const { loading, setpage, mode, movieName } = showMovieContext

  const loaderRef = useRef<HTMLDivElement | null>(null)
  const isFetchingRef = useRef(false)

  // Reset when new data (search / mode change)
  useEffect(() => {
    setVisibleCount(16)
  }, [movieName, mode])

  // Infinite scroll
  useEffect(() => {
    if (mode !== "home") return

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]

        if (target.isIntersecting && !loading && !isFetchingRef.current) {
          isFetchingRef.current = true

          // increase visible movies by 16
          setVisibleCount((prev) => prev + 16)

          // fetch next page (optional, keep if needed)
          setpage((prev: number) => prev + 1)
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      }
    )

    const el = loaderRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [loading, mode])

  useEffect(() => {
    if (!loading) {
      isFetchingRef.current = false
    }
  }, [loading])

  // only show multiples of 16
  const visibleMovies = movieDetail.slice(0, visibleCount)
console.log("movieDetail:", movieDetail.length)
console.log("visibleMovies:", visibleMovies.length)
  return (
    <div className="w-full min-h-screen">

      {/* No results */}
      {movieDetail.length === 0 && !loading && mode === "search" && movieName.trim().length >= 2 && (
        <div className="text-center mt-10 text-(--text)">
          No movies found for "<span className="font-semibold">{movieName}</span>"
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 px-5 mt-10">

        {/* Skeleton */}
        {loading && movieDetail.length === 0
          ? Array.from({ length: 16 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-2/3 bg-gray-500 rounded-xl mt-5"></div>
                <div className="h-4 bg-gray-500 mt-3 w-3/4 rounded"></div>
                <div className="h-4 bg-gray-500 mt-2 w-1/2 rounded"></div>
              </div>
            ))

          : visibleMovies.map((movie) => (
              <div className="rounded-lg" key={movie.id}>
                <div className="relative">
                  <img
                    onClick={() => setshowMovieCard(movie)}
                    className="aspect-2/3 w-full object-cover rounded-xl mt-5 hover:brightness-50 hover:scale-105 cursor-pointer transition"
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/fallback.jpg"
                    }
                    alt={movie.title}
                  />

                  <div className="bg-white text-black w-8 h-5 pl-1.5 rounded-sm absolute top-2 right-2">
                    <p className="text-sm font-semibold">HD</p>
                  </div>
                </div>

                <h1 className="text-(--text) mt-3 line-clamp-1">
                  {movie.title}
                </h1>

                <div className="flex justify-between">
                  <div className="flex gap-2 mt-2">
                    <h2 className="text-[#565C67]">
                      {movie.release_date
                        ? movie.release_date.split("-")[0]
                        : "N/A"}
                    </h2>

                    <h1 className="text-[#565C67]">.</h1>

                    <h2 className="text-[#565C67]">
                      {movie.runtime ? `${movie.runtime}m` : "N/A"}
                    </h2>
                  </div>

                  <div className="border border-[#565C67] rounded-sm mt-2 px-1">
                    <p className="text-[#565C67] text-sm">Movie</p>
                  </div>
                </div>
              </div>
            ))}
                
      </div>
      {showMovieCard && (
          <MovieCard
            movieDetail={showMovieCard}
            onClose={() => setshowMovieCard(null)}
          />
        )}

      {/* Loader */}
      <div ref={loaderRef} className="h-16 w-full flex justify-center items-center">
        {loading && movieDetail.length > 0 && (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {/* Pagination */}
      {movieDetail && (mode === "search" || mode === "filter") && <Page />}
    </div>
  )
}

export default ShowMovie