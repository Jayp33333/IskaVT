import { motion } from 'framer-motion';
import { Send, Mail, MessageCircle, Phone, Sparkles } from 'lucide-react';

export function Contact() {
  return (
    <section className="py-32 px-6 lg:px-20 bg-[#FFFDF5] relative overflow-hidden" id="contact">
      
      {/* Background abstract shapes */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#800000]/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* --- LEFT: Contact Info & Character --- */}
          <div className="w-full lg:w-1/3 flex flex-col justify-between">
            <div>
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-[#800000] font-black uppercase tracking-widest text-sm italic mb-4 block"
              >
                Get in Touch
              </motion.span>
              <h2 className="text-5xl md:text-6xl font-black text-black leading-[0.9] mb-8 uppercase tracking-tighter">
                READY TO <br />
                <span className="text-[#800000]">TALK?</span>
              </h2>
              <p className="text-lg font-bold text-black/70 mb-10">
                Have questions about the 3D campus or found a bug? Send us a message and our team will get back to you faster than a teleport icon!
              </p>

              {/* Contact Cards */}
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "support@pup-lopez.edu" },
                  { icon: Phone, label: "Hotline", value: "+63 (042) 123 4567" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="p-2 bg-[#FFD700] border-2 border-black rounded-lg">
                      <item.icon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase opacity-50 leading-none">{item.label}</p>
                      <p className="font-black text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Playful Character Interaction */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="mt-12 p-6 bg-[#800000] border-4 border-black rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full border-2 border-black flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#FFD700]" />
                </div>
                <p className="text-white font-black italic">"I'm usually online 24/7!"</p>
              </div>
              <div className="absolute -top-3 -left-3">
                <MessageCircle className="w-8 h-8 text-[#FFD700] fill-[#FFD700] stroke-black stroke-[2px]" />
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT: The Neo-Brutalist Form --- */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="w-full lg:w-2/3 bg-white border-8 border-black rounded-[48px] p-8 md:p-12 shadow-[24px_24px_0px_0px_rgba(255,215,0,1)]"
          >
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Field */}
              <div className="flex flex-col gap-3">
                <label className="font-black uppercase text-sm tracking-widest ml-2">Your Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Iska"
                  className="bg-[#F5F5F5] border-4 border-black p-4 rounded-2xl font-bold focus:bg-[#FFD700]/10 focus:outline-none transition-colors placeholder:opacity-30"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-3">
                <label className="font-black uppercase text-sm tracking-widest ml-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="iska@email.com"
                  className="bg-[#F5F5F5] border-4 border-black p-4 rounded-2xl font-bold focus:bg-[#FFD700]/10 focus:outline-none transition-colors placeholder:opacity-30"
                />
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-3 md:col-span-2">
                <label className="font-black uppercase text-sm tracking-widest ml-2">Message</label>
                <textarea 
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  className="bg-[#F5F5F5] border-4 border-black p-4 rounded-3xl font-bold focus:bg-[#FFD700]/10 focus:outline-none transition-colors placeholder:opacity-30 resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 flex justify-end">
                <button 
                  type="submit"
                  className="group relative bg-[#800000] border-4 border-black px-12 py-5 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-3 text-white font-black text-2xl uppercase tracking-tighter">
                    Send Message <Send className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  </div>
                  {/* Decorative Slanted Corner */}
                  <div className="absolute top-0 right-0 w-6 h-6 bg-white border-b-4 border-l-4 border-black rounded-bl-xl" />
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}