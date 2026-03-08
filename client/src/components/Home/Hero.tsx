import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();
  const PUPLogo = "/images/pup-logo.png";

  const handleStartTour = () => {
    navigate("/experience");
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white" id="home">
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Small label with logo */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#800000]/20">
              <img src={PUPLogo} alt="PUP Logo" className="w-6 h-6 md:w-8 md:h-8" />
              <span className="text-xs md:text-sm tracking-wide text-[#800000]">
                Welcome to
                <span className="font-bold"> PUP Lopez Campus</span>
              </span>
            </div>

            {/* Heading */}
            <h1 className="relative text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#660B05]">
              Experience a 3D
              <span className="block text-[#8C1007]">Campus Tour</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-sm md:text-md lg:text-lg text-[#800000] font-bold max-w-2xl mx-auto">
              Explore the campus through an immersive 3D virtual tour featuring key buildings, facilities, and a guided character tour—anytime, anywhere.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <button
                onClick={handleStartTour}
                className="relative bg-[rgb(102,11,5)] border-3 pt-1 boder-black rounded-xl cursor-pointer inline-flex items-center gap-2 group"
              >
                <span
                  className="bg-[#8C1007] border-2 border-[#da4d4db5] text-white font-bold rounded-[10px] text-xs
                     px-6 py-3
                     transform -translate-y-1
                     transition-transform duration-100 ease-in-out
                     hover:bg-[#980404]/90
                     active:translate-y-0
                     inline-flex items-center gap-2"
                >
                  Start Virtual Tour
                  <BsArrowRight
                    className="w-4 h-4 transform transition-transform duration-300 ease-in-out
                     group-hover:translate-x-2"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
