export default function Header(){

    return(
        <header className="flex w-full bg-white p-4 gap-x-10 fixed left-0 top-0">
            <div className=" flex">
                <div className="text-black">OFFLIX</div>
                <div className="text-blue-600">EDU</div>
            </div>
            <div className="sm:flex md:flex hidden">
                <ul className="flex gap-x-4">
                    <li className="text-sm text-black"><a href="#f">News</a></li>
                    <li className="text-sm text-black"><a href="#s">About</a></li>
                    <li className="text-sm text-black"><a href="#c">Contact Us</a></li>
                </ul>
            </div>
            <div className="fixed right-6 bg-black flex gap-x-4 px-4  rounded-2xl">

                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#e3e3e3">
                    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                </svg>
            </div>
        </header>
    )
}