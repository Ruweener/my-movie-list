import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function About() {
    return (
        <>
            <NavBar />
            <div className='flex flex-col items-center justify-center w-full h-screen bg-gray-800'>
                <h1 className="font-bold text-black">About Us</h1>
                <p className="">This is a movie review application where you can create your own personalized rating chart</p>
            </div>
            <Footer />
        </>
    );
}

export default About;