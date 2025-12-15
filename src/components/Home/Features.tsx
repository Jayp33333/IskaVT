import { MapPin, UserCircle, Navigation, Info, Map, Compass } from "lucide-react";

const features = [
  { icon: MapPin, title: "Interactive 3D Campus" },
  { icon: UserCircle, title: "Character Tour Guide" },
  { icon: Navigation, title: "Choose Your Destination" },
  { icon: Info, title: "Information on Landmarks" },
  { icon: Map, title: "Mini-Map Navigation" },
  { icon: Compass, title: "Free Exploration Mode" },
];

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl mb-12 text-[#800000] bebas-neue-regular">
          Key Features
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-4 border-[#800000] rounded-full flex items-center justify-center transition-shadow hover:shadow-lg">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#800000]" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#800000]">
                  {feature.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
