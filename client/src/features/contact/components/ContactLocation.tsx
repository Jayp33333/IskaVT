import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";
import {
  CAMPUS_LOCATION,
  CAMPUS_MAP_EMBED_URL,
  CAMPUS_MAP_LINK_URL,
} from "../constants";

export function ContactLocation() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 overflow-hidden rounded-2xl border border-black bg-white shadow-[8px_8px_0px_0px_rgba(255,215,0,1)] sm:mt-16 sm:rounded-[2rem]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b border-black p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-black bg-[#800000] sm:h-12 sm:w-12 sm:rounded-2xl">
              <MapPin className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-black sm:text-2xl">
              Visit <span className="text-[#800000]">Our Campus</span>
            </h2>
          </div>

          <p className="mb-4 text-sm font-bold leading-relaxed text-black/70 sm:text-base">
            {CAMPUS_LOCATION.name} is located along Yumul Street in Barangay
            Burgos, Lopez, Quezon. The campus sits on a 23,724 square meter site
            donated by the Yumul family, serving students across Southern Luzon
            since 1979.
          </p>

          <div className="space-y-3 rounded-xl border border-black bg-[#FFFDF5] p-4 sm:rounded-2xl sm:p-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/50 sm:text-xs">
                Full Address
              </p>
              <p className="text-sm font-black sm:text-base">
                {CAMPUS_LOCATION.address}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/50 sm:text-xs">
                Coordinates
              </p>
              <p className="text-sm font-bold text-black/70 sm:text-base">
                {CAMPUS_LOCATION.latitude}°N, {CAMPUS_LOCATION.longitude}°E
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/50 sm:text-xs">
                Landmarks
              </p>
              <p className="text-sm font-bold text-black/70 sm:text-base">
                Near Lopez town proper, accessible via public transportation
                from Lucena and nearby municipalities.
              </p>
            </div>
          </div>

          <a
            href={CAMPUS_MAP_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-black bg-[#FFD700] px-4 py-2.5 text-xs font-black uppercase tracking-tighter text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
          >
            Open in Google Maps
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="relative min-h-[260px] bg-[#F5F5F5] sm:min-h-[320px] lg:min-h-full">
          <iframe
            title={`${CAMPUS_LOCATION.name} Map`}
            src={CAMPUS_MAP_EMBED_URL}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </motion.section>
  );
}
