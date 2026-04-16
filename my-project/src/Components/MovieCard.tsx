import { Icon } from '@iconify/react'
import axios from 'axios'
import  { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface MovieCardProps {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  runtime: number
  overview: string
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
        onClick={(e) => e.stopPropagation()}
        className="w-[65vw] max-h-[90vh] overflow-y-auto bg-[#020916] rounded-xl flex flex-col"
      >
        {/* Media area — poster or trailer */}
        <div className="relative w-full h-[55vh] shrink-0">
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
                className="absolute top-3 right-3 cursor-pointer bg-black/60 hover:bg-black/80 rounded-full p-1.5 transition-colors z-10"
              >
                <Icon icon="basil:cross-outline" color="white" fontSize={26} />
              </div>
            </>
          ) : (
            <>
              <img
                className="w-full h-full object-cover object-top rounded-t-xl"
                src={
                  movieDetail.poster_path
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

     
        <div className="flex items-center gap-3 px-5 py-4 bg-[#020916]">
          <button
            onClick={() => playTrailer(movieDetail.id)}
            className="flex items-center gap-1 px-4 h-10 bg-white text-black rounded-sm cursor-pointer font-semibold text-lg whitespace-nowrap"
          >
            <Icon icon="mdi:play" fontSize={28} />
            Play Trailer
          </button>

          <button
            onClick={() => toast('Under Production!!!')}
            className="w-10 h-10 flex items-center justify-center cursor-pointer border-2 rounded-lg border-[#7A7A7A]"
          >
            <Icon icon="mdi-light:plus" color="white" fontSize={32} />
          </button>

          <button
            onClick={() => toast('Under Production!!!')}
            className="w-10 h-10 flex items-center justify-center cursor-pointer border-2 rounded-lg border-[#7A7A7A]"
          >
            <Icon icon="ei:like" color="white" fontSize={30} />
          </button>
        </div>

      
        <div className="px-5 pb-5 text-white">
          <h1 className="text-2xl font-semibold">{movieDetail.title}</h1>
          <div className="flex gap-3 text-zinc-400 mt-1">
            <span>{movieDetail.release_date.split('-')[0]}</span>
            <span>{movieDetail.runtime}m</span>
          </div>
          <p className="mt-2 text-white leading-snug">{movieDetail.overview}</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard