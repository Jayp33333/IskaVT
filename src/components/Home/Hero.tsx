import { BiPlay } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={"/images/campus-image.jpg"}
          alt="Campus aerial view"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#800000]/85 via-[#9B1C1C]/70 to-[#FFC107]/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-xs md:text-sm tracking-wide">
              Welcome to PUP Lopez Campus
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-7xl lg:text-8xl bebas-neue-regular">
            Experience a 3D
            <span className="block bg-linear-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Campus Tour
            </span>
          </h1>

          <p className="sm:text-md md:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto">
            Explore the campus through an immersive 3D virtual tour featuring
            key buildings, facilities, and a guided character tour—anytime,
            anywhere.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                  <button
              onClick={() => navigate("/experience")}
              className="relative bg-[#808080] rounded-xl  cursor-pointer inline-flex items-center gap-2 group"
            >
              <span
                className=" bg-white text-red-900 font-semibold rounded-xl
               px-6 py-3
               transform -translate-y-1
               transition-transform duration-100 ease-in-out
               hover:bg-white/90
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

            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                         border border-white/30 text-white font-semibold
                         hover:bg-white/10 transition-all cursor-pointer"
            >
              <BiPlay className="w-5 h-5" />
              Watch Video
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
}
