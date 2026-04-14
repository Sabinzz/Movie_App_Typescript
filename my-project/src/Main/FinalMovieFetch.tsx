import { Icon } from '@iconify/react'
import React, { useContext, useEffect } from 'react'
import { movieContext } from '../Context/MovieContext'
import axios from 'axios'

const FinalMovieFetch = () => {
    const finalContext=useContext(movieContext)
    if(!finalContext){
        throw new Error("can fetch ")
    }
    
    const{isOlder,movieDetail,setloading,movieName,page,setpage,selectedGenre,selectedYear,setmovieDetail }=finalContext
useEffect(() => {
    if(!movieName){
 handleFilter()
    }
}, [page])
useEffect(() => {
  setpage(1);
}, [selectedGenre, selectedYear]);

  
     async function handleFilter() {
  const genreQuery = selectedGenre.join(",");

  const params: any = {
    api_key: "50e506c1eb5aff5ab14c27ea3bebb47e",
    page: page,
  };

  if (genreQuery) {
    params.with_genres = genreQuery;
  }

  
  if(isOlder){
  params["primary_release_date.lte"] = "2022-01-01"
  }
  else if (selectedYear) {
    params.primary_release_year = selectedYear;
  }
setloading(true)
  try {
    const res = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      { params }
    );

    const movies = res.data.results;

    // 🔥 Fetch runtime for each movie
    const detailedMovies = await Promise.all(
      movies.map(async (movie: any) => {
        const detailRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}`,
          {
            params: {
              api_key: "50e506c1eb5aff5ab14c27ea3bebb47e",
            },
          }
        );

        return {
          ...movie,
          runtime: detailRes.data.runtime,
        };
      })
    );

    setmovieDetail(detailedMovies);
    setloading(false)
  } catch (error) {
    console.error("Filter fetch failed", error);
  }
}
 
   
  return (
    <div>
         <div className='relative'>
            <button
            onClick={handleFilter}
         
            
            className='h-7 w-22 pl-5 text-[#212529] rounded-xl bg-[#79C142]'>Filter</button>
        <Icon className='absolute top-1 left-3 translate-y-0.5' icon="lucide:search"/>
            </div>
    </div>
  )
}

export default FinalMovieFetch