import React, { createContext, useState } from "react"

interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  runtime: number
  overview: string
}

interface MovieContextProps {
  movieDetail: Movie[]
  setmovieDetail: React.Dispatch<React.SetStateAction<Movie[]>>
  selectedGenre:number[]
  setselectedGenre:React.Dispatch<React.SetStateAction<number[]>>
  selectedYear:number | null
  setselectedYear:React.Dispatch<React.SetStateAction<number | null>>
  movieName:string
  setmovieName:React.Dispatch<React.SetStateAction<string>>
}



export const movieContext = createContext<MovieContextProps | null>(null)

const MovieContext = ({ children }: { children: React.ReactNode }) => {
  const [movieDetail, setmovieDetail] = useState<Movie[]>([])
  const [selectedGenre, setselectedGenre] = useState<number[]>([])
  const [selectedYear, setselectedYear] = useState<number | null>(null)
  const [movieName, setmovieName] = useState<string>("")

  return (
    <movieContext.Provider value={{ movieDetail, setmovieDetail,selectedGenre, setselectedGenre,selectedYear,setselectedYear,movieName, setmovieName }}>
      {children}
    </movieContext.Provider>
  )
}

export default MovieContext