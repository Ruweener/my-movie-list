import NavBar from "../components/NavBar";

function About() {
    return (
        <>
            <NavBar />
            <div className='flex flex-col items-center justify-center w-screen h-screen bg-gray-800'>
                <h1 className="font-bold text-black">About Us</h1>
                <p className="">This is a movie review application where you can create your own personalized rating chart</p>
            </div>
        </>
    );
}

export default About;