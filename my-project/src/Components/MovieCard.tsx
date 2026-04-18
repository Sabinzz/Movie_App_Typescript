import { Icon } from '@iconify/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface MovieCardProps {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  runtime: number
  overview: string
    backdrop_path: string | null
}

interface cardProps {
  movieDetail: MovieCardProps
  onClose(): void
}

const MovieCard = ({ movieDetail, onClose }: cardProps) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null)

  const playTrailer = async (movieId: number) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos`,
        { params: { api_key: '50e506c1eb5aff5ab14c27ea3bebb47e' } }
      )
      const trailer = res.data.results.find(
        (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
      )
      setTrailerKey(trailer ? trailer.key : '')
    } catch (error) {
      console.error('Trailer fetch failed', error)
    }
  }

  useEffect(() => {
    if (trailerKey === '') toast.error('Trailer not found')
  }, [trailerKey])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex justify-center items-center backdrop-blur-sm z-50"
    >
      <div
      id='movieCardScroll'
        onClick={(e) => e.stopPropagation()}
        className="w-[80vw] sm:w-[69vw] h-[90vh] lg:h-[97vh] overflow-y-auto bg-[#020916] rounded-xl flex flex-col"
      >
        <div className="relative w-full flex-1">
          {trailerKey ? (
            <>
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                className="w-full h-full rounded-t-xl"
                allowFullScreen
                allow="autoplay"
              />
              <div
                onClick={() => setTrailerKey(null)}
                className="absolute  top-3 right-3 cursor-pointer bg-black/60 hover:bg-black/80 rounded-full p-1.5 transition-colors z-10"
              >
                <Icon icon="basil:cross-outline" color="white" fontSize={26} />
              </div>
            </>
          ) : (
            <>
             <img
  className="w-full h-full object-cover rounded-t-xl"
  src={
    movieDetail.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movieDetail.backdrop_path}`
      : movieDetail.poster_path
      ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
      : '/fallback.jpg'
  }
  alt={movieDetail.title}
/>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent rounded-t-xl" />
            </>
          )}

          <div
            onClick={onClose}
            className="absolute top-3 right-3 z-30 cursor-pointer bg-[#181818] rounded-full p-2"
          >
            <Icon icon="basil:cross-outline" color="white" fontSize={30} />
          </div>
        </div>

     
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-3 sm:px-5 py-4 bg-[#020916]">
          <button
            onClick={() => playTrailer(movieDetail.id)}
            className="flex items-center gap-1 px-3 sm:px-4 h-9 sm:h-10 bg-white text-black rounded-sm cursor-pointer font-semibold text-sm sm:text-lg whitespace-nowrap"
          >
            <Icon icon="mdi:play" fontSize={22} />
            Play Trailer
          </button>

          <button
            onClick={() => toast('Under Production!!!')}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer border-2 rounded-lg border-[#7A7A7A]"
          >
            <Icon icon="mdi-light:plus" color="white" fontSize={28} />
          </button>

          <button
            onClick={() => toast('Under Production!!!')}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer border-2 rounded-lg border-[#7A7A7A]"
          >
            <Icon icon="ei:like" color="white" fontSize={26} />
          </button>
        </div>

       
        <div className="px-3 sm:px-5 pb-5 text-white">
          <h1 className="text-xl sm:text-2xl font-semibold">{movieDetail.title}</h1>
          <div className="flex gap-3 text-zinc-400 mt-1 text-sm sm:text-base">
            <span>{movieDetail.release_date.split('-')[0]}</span>
            <span>{movieDetail.runtime}m</span>
          </div>
          <p className="mt-2 text-white leading-snug text-sm sm:text-base">{movieDetail.overview}</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard