import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { CONTACT_DEPARTMENTS } from "../constants";

export function ContactDepartments() {
  return (
    <section className="mt-12 sm:mt-16">
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-black sm:text-3xl">
          Department <span className="text-[#800000]">Contacts</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-bold text-black/60 sm:text-base">
          Reach the right office directly for faster assistance with your concern.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {CONTACT_DEPARTMENTS.map((dept, index) => (
          <motion.article
            key={dept.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border border-black bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:rounded-3xl sm:p-6"
          >
            <h3 className="mb-2 text-lg font-black uppercase tracking-tighter text-[#800000] sm:text-xl">
              {dept.name}
            </h3>
            <p className="mb-4 text-sm font-bold leading-relaxed text-black/70 sm:text-base">
              {dept.description}
            </p>

            <div className="space-y-2">
              <a
                href={`mailto:${dept.email}`}
                className="flex items-center gap-2 text-xs font-black text-black transition-colors hover:text-[#800000] sm:text-sm"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {dept.email}
              </a>
              <p className="flex items-center gap-2 text-xs font-black text-black/80 sm:text-sm">
                <Phone className="h-4 w-4 shrink-0" />
                {dept.phone}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
