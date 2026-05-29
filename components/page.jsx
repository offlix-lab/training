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
                grade: "09",
                section: "b",
                sex: "all",
                limit:30
            })
        });
        if (response.ok) {
            const data = await response.json();            
            console.log(data);
            
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
                <Student key={index} bgColor={stud.meta["type"]} profile={stud.meta["profile"]} rank={stud.meta["rank"]} sex={stud.sex} name={stud.name} grade={stud.meta["grade"]} section={stud.section} total={stud.total} average={stud.average} />
            )) : "loading"

            }
        </div>
    )
}



function Student({name,grade,section,total,average,sex,rank,profile,bgColor}){

    const divColor = {
        "gold" : "bg-yellow-400/80 text-white [&>div>img]:border-white",
        "silver" : "bg-gray-400 text-white [&>div>img]:border-white",
        "bronze" : "bg-blue-500 text-white [&>div>img]:border-black",
        "normal" : "bg-white text-black [&>div>img]:border-black"
    }


    return(
        <div className={`border border-white w-80 rounded-[50px] mx-auto my-6 p-6 flex flex-col gap-y-4 ${divColor[bgColor]}`}>
            <div className="flex justify-between">
                <img  className=" size-18 border rounded-full" src={profile} alt="Stud" loading="lazy" />
                <p className="size-18 text-2xl text-center font-bold">{rank}</p>
            </div>
            <div className="bg-fuchsia-800/20 px-4 py-2 rounded-2xl">
                <p>Name:  {name}</p>
                <p>Sex: {sex}</p>
                <p>Grade: {grade} - {section}</p>
                <p>Total: {total}</p>
                <p>Average: {average}</p>
            </div>
        </div>
    )
}