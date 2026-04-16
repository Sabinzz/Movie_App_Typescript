import  { useContext, useState } from 'react'
import MovieCard from './MovieCard'
import Page from '../Pagination/Page'
import { movieContext } from '../Context/MovieContext'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date:string
  runtime:number;
  overview:string
}

interface Props {
  movieDetail: Movie[]//we used movie[] beacause we have used movieDetail as an array here
}

const ShowMovie = ({ movieDetail }: Props) => {
  const [showMovieCard, setshowMovieCard] = useState<Movie |null>(null)
 const showMovieContext=useContext(movieContext)
 if(!showMovieContext){
  throw new Error("cant load")
 }
 const{loading}=showMovieContext
  return (
   <div>
     <div className='grid grid-cols-1  sm:grid-cols-2 relative md:grid-cols-4 xs:grid-cols-1 lg:grid-cols-6 gap-4 px-5 mt-10'>
    {loading?
    Array.from({length:12}).map((_,index)=>(
      <div key={index} className="animate-pulse">
          <div className="h-[30vh] bg-gray-500 rounded-xl mt-5"></div>
          <div className="h-4 bg-gray-500 mt-3 w-3/4 rounded"></div>
          <div className="h-4 bg-gray-500 mt-2 w-1/2 rounded"></div>
        </div>
    )):
    movieDetail.map((movie) => (
        <div className='rounded-lg' key={movie.id}>
            <div 
          
            className='relative'>
 <img
   onClick={()=>setshowMovieCard(movie)}
            className='h-[30vh] w-full object-cover rounded-xl mt-5 hover:brightness-50 hover:scale-103 cursor-pointer'
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/fallback.jpg"
            }
            alt={movie.title}
          />
        
          <div className='bg-white text-black w-8 h-5 pl-1.5 rounded-sm absolute top-2 right-2'>
            <p className='text-sm font-semibold'>HD</p>
          </div>
            </div>
         
          
          <h1 className='text-(--text) mt-3 line-clamp-1'>{movie.title}</h1>
<div className='flex justify-between'>
  
  <div className='flex gap-2 mt-2'>
    <h2 className='text-[#565C67]'>
      {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
    </h2>

    <h1 className='text-[#565C67]'>.</h1>

    <h2 className='text-[#565C67]'>
      {movie.runtime ? `${movie.runtime}m` : "N/A"}
    </h2>
  </div>

  <div className='border border-[#565C67] rounded-sm  mt-2 px-1'>
    <p className='text-[#565C67] text-sm '>
    Movie
    </p>
  </div>

</div>
        </div>
      ))}
        {showMovieCard && <MovieCard movieDetail={showMovieCard} onClose={()=>{setshowMovieCard(null)}}/>}
        
    </div>
{movieDetail &&
    <Page/>
}
   </div>
  )
}



export default ShowMovie