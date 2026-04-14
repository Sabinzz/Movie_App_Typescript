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
  page:number
  setpage:React.Dispatch<React.SetStateAction<number>>
  loading:boolean
  setloading:React.Dispatch<React.SetStateAction<boolean>>
  isOlder:boolean;
  setisOlder:React.Dispatch<React.SetStateAction<boolean>>
}



export const movieContext = createContext<MovieContextProps | null>(null)

const MovieContext = ({ children }: { children: React.ReactNode }) => {
  const [movieDetail, setmovieDetail] = useState<Movie[]>([])
  const [selectedGenre, setselectedGenre] = useState<number[]>([])
  const [selectedYear, setselectedYear] = useState<number | null>(null)
  const [movieName, setmovieName] = useState<string>("")
  const [page, setpage] = useState<number>(1)
const [loading, setloading] = useState<boolean>(false)
const [isOlder, setisOlder] = useState<boolean>(false)
  return (
    <movieContext.Provider value={{isOlder, setisOlder, loading, setloading,setpage,page,movieDetail, setmovieDetail,selectedGenre, setselectedGenre,selectedYear,setselectedYear,movieName, setmovieName }}>
      {children}
    </movieContext.Provider>
  )
}

export default MovieContext