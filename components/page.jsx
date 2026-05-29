"use client"
import { useEffect, useState } from "react"

export default function Page(){

    return(
        <>
           <Filter/>
           <Students/>
        </>
    )
}


function Filter() {
    
    return(
        <div className="w-11/12 mx-auto my-4 bg-white rounded-2xl p-4">
            <button className="bg-black px-4 rounded cursor-pointer">
                Filter
            </button>
        </div>
    )
}

function Students () {

    const [studs,setStuds] = useState({data:[]});

    async function getData() {

        const response = await fetch("/api/students",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                sh_st : "all",
                grade:10,
                section:"E",
                sex:"M",
                limit:5
            })
        });
        if (response.ok) {
            const data = await response.json();            
            setStuds(data);
        }
    }

    useEffect(()=>{
        getData();
    },[])
    


    

    return(
        <div>
            { 
                
            studs.data.data ? studs.data.data.map((stud, index) =>(
                <Student key={index} sex={stud.sex} name={stud.name} grade={stud.grade} section={stud.section} total={stud.total_1} average={stud.average_1} />
            )) : "loading"

            }
        </div>
    )
}



function Student({name,grade,section,total,average,sex}){



    return(
        <div className="border border-white w-80 rounded-[50px] mx-auto my-6 p-6 flex flex-col gap-y-4">
            <div className="">
                <img  className=" size-18 border border-white rounded-full" src={`https://offlix.great-site.net/src/photo/photo-bg-${sex}.png`} alt="Stud" loading="lazy" />
            </div>
            <div className="bg-fuchsia-800/20 px-4 py-2 rounded-2xl">
                <p>Name:  {name}</p>
                <p>Grade: {grade}<sup>th</sup>{section}</p>
                <p>Total: {total}</p>
                <p>Average: {average}</p>
            </div>
        </div>
    )
}