import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { logbookAPI, type LogbookEntry } from "../../services/api";
import { enterKioskLandscape } from "../../utils/kiosk";

interface LogbookFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /**
   * If true, the dialog cannot be dismissed (used to gate the tour).
   * The user must submit the form successfully.
   */
  required?: boolean;
}

export const LogbookFormDialog = ({ open, onClose, onSuccess, required = false }: LogbookFormDialogProps) => {
  const [formData, setFormData] = useState<LogbookEntry>({
    fullName: "",
    visitorType: "",
    purpose: "",
    destination: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visitorTypes = [
    "Student",
    "Faculty",
    "Staff",
    "Visitor",
    "Alumni",
    "Guest",
  ];

  const destinations = [
    "Grandstand",
    "Lab 1",
    "Lab 2",
    "Lab 3",
    "Library",
    "Administration Building",
    "Classroom Building",
    "Cafeteria",
    "Gymnasium",
    "Auditorium",
    "Computer Lab",
    "Science Lab",
    "Main Building",
    "Student Center",
    "Other",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Run on the user's "Start Tour" gesture: best chance for fullscreen + landscape lock.
      void enterKioskLandscape();

      const now = new Date();
      const entryData: LogbookEntry = {
        ...formData,
        date: now.toISOString(),
        timeIn: now.toISOString(),
      };

      const response = await logbookAPI.createEntry(entryData);
      
      // Store the logbook entry ID in localStorage for timeout tracking
      if (response.data && response.data._id) {
        localStorage.setItem('logbookEntryId', response.data._id);
        localStorage.setItem('logbookTimeIn', new Date().toISOString());
      }
      
      onSuccess();
      // Reset form
      setFormData({
        fullName: "",
        visitorType: "",
        purpose: "",
        destination: "",
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit logbook entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (required) return;
    if (!isSubmitting) {
      setFormData({
        fullName: "",
        visitorType: "",
        purpose: "",
        destination: "",
      });
      setError(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[5000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-[5001] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-100"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-[#660B05] mb-1">
                      Visitor Logbook
                    </h2>
                    <p className="text-sm text-gray-500">
                      Please fill in your information to start the tour
                    </p>
                  </div>
                  {!required && (
                    <button
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none disabled:opacity-50 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                      aria-label="Close dialog"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05] transition-all placeholder:text-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Visitor Type */}
                  <div>
                    <label htmlFor="visitorType" className="block text-sm font-semibold text-gray-800 mb-2">
                      Visitor Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="visitorType"
                      name="visitorType"
                      value={formData.visitorType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05] transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="text-gray-400">Select visitor type</option>
                      {visitorTypes.map((type) => (
                        <option key={type} value={type} className="text-gray-900">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Destination */}
                  <div>
                    <label htmlFor="destination" className="block text-sm font-semibold text-gray-800 mb-2">
                      Destination <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05] transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="text-gray-400">Select destination</option>
                      {destinations.map((destination) => (
                        <option key={destination} value={destination} className="text-gray-900">
                          {destination}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label htmlFor="purpose" className="block text-sm font-semibold text-gray-800 mb-2">
                      Purpose <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 font-normal ml-2">
                        (Max {formData.purpose.length}/200 characters)
                      </span>
                    </label>
                    <textarea
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                      maxLength={200}
                      rows={3}
                      className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05] transition-all resize-none placeholder:text-gray-400"
                      placeholder="Enter your purpose for visiting"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
                    >
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-2">
                    {!required && (
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-[#660B05] text-white rounded-xl hover:bg-[#8C1007] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Start Tour"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
