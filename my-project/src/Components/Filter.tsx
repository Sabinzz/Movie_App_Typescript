import { Icon } from '@iconify/react'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { movieContext } from '../Context/MovieContext'
import FinalMovieFetch from '../Main/FinalMovieFetch'
interface filterProps{
    id:number
    name:string
}


const Filter = () => {
    const [genre, setgenre] = useState<filterProps[]>([])
    const [, seterror] = useState<boolean>(false)
    const contextYear=useContext(movieContext)
    if(!contextYear){
        throw new Error("shit Year")
    }
    const{selectedYear,setselectedYear,isOlder, setisOlder}=contextYear



    const context=useContext(movieContext)
    if(!context){
        throw new Error("shit Genre")
    }

    const {selectedGenre, setselectedGenre} = context
   
    useEffect(() => {
        const filterGenre=async()=>{
     try {
        seterror(false)

            const res=await axios.get("https://api.themoviedb.org/3/genre/movie/list"
                ,{
                    params:{
                        api_key:'50e506c1eb5aff5ab14c27ea3bebb47e'
                    }
                }
                )
                setgenre(res.data.genres)
              

        }
        
    
     catch (error) {
        seterror(true)
     }
      }
      filterGenre() 
    }, [])
    function handleGenreChange(id:number){
        setselectedGenre((prev)=>{
           return prev.includes(id)?prev.filter((i)=>i!==id):[...prev,id]
        })
    }
    
  return (
    <div className='flex flex-col px-10 pt-4 gap-6'>

 <hr className='border border-gray-900'/>

<div className='flex gap-3'>
    <h1 className='text-(--text)'>Released:</h1>
     <div className='flex gap-4'>
        
        <div className='flex gap-2 text-[16px] '>
            <input 
            checked={selectedYear===2026}
            onChange={()=>{setselectedYear(2026)
                  setisOlder(false)}}
            name='Year-Radio' type="radio" id='2026'/>
            <label htmlFor="2026" className='text-[#485C67]'>2026</label>
        </div>
        <div className='flex gap-2 text-[16px] '>
            <input
            checked={selectedYear===2025}
            onChange={()=>{setselectedYear(2025)
                  setisOlder(false)}}
            name='Year-Radio' type="radio" id='2025'/>
            <label htmlFor="2025" className='text-[#485C67]'>2025</label>
        </div>

    </div>
     <div className='flex gap-4 pl-2'>
        <div className='flex gap-2 text-[16px]'>
            <input
            checked={selectedYear===2024}
            onChange={()=>{setselectedYear(2024)
                  setisOlder(false)}}
            name='Year-Radio' type="radio" id='2024'/>
            <label htmlFor="2024" className='text-[#485C67]'>2024</label>
        </div>
        <div className='flex gap-2 text-[16px]'>
            <input
            checked={selectedYear===2023}
            onChange={()=>{setselectedYear(2023)
                  setisOlder(false)}}
            name='Year-Radio' type="radio" id='2023'/>
            <label htmlFor="2023" className='text-[#485C67]'>2023</label>
        </div>
        <div className='flex gap-2 text-[16px]'>
            <input
            checked={selectedYear===2022}
            onChange={()=>{setselectedYear(2022) 
                 setisOlder(false)}}
            name='Year-Radio' type="radio" id='2022'/>
            <label htmlFor="2022" className='text-[#485C67]'>2022</label>
        </div>
        <div className='flex gap-2 text-[16px]'>
            <input
            checked={isOlder}
            onChange={()=>{setisOlder(true)
                setselectedYear(null)}
            }
            name='Year-Radio' type="radio" id='Older'/>
            <label htmlFor="Older" className='text-[#485C67]'>Older</label>
        </div>

    </div>
    
    
   
</div>
 <hr className='border border-gray-900'/>
 {/* Genre */}
<div className='flex gap-3 items-start ml-1 '>
    <h1 className='text-(--text)'>Genre:</h1> 
    <div className='flex flex-wrap gap-2 items-center'>
    {genre.map((genre)=>(

    <div key={genre.id} className='flex gap-2  items-center'>
<input 
checked={selectedGenre.includes(genre.id)}
onChange={()=>handleGenreChange(genre.id)}
type="checkbox" name="genre"  id={String(genre.id)}/>
 <label className='text-[#485C67]' htmlFor={String(genre.id)}>{genre.name}</label> {/*We used String() beacuse htmlfor expects a string */}
    </div>
    )

    )}
    </div>
</div>
 <hr className='border border-gray-900'/>
<div className='flex gap-2'>
   <FinalMovieFetch/>
    <div className='relative group cursor-pointer'>
        <button className='group-hover:text-white bg-[#1D2C42] h-7 w-22 pl-5  text-(--elements)  rounded-xl transition-colors duration-200'>Close</button>
        <Icon icon="charm:cross" className='group-hover:text-white absolute top-1  -translate-x-1 left-3 text-[#6C757D] transition-colors duration-200' fontSize={22}/>
    </div>

</div>

    </div>
  )
}

export default Filter