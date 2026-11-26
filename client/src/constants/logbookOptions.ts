/**
 * Single source of truth for the logbook's select options, shared by the
 * public logbook form (`components/Home/LogbookFormDialog.tsx`) and the admin
 * Add/Edit visitor modals.
 *
 * Destination names mirror `DESTINATIONS` in `src/sampleData.ts` (same names,
 * same order, commented-out entries excluded). They are copied here rather
 * than derived because `sampleData.ts` imports `three`, which must not be
 * pulled into the admin bundle. `logbookOptions.test.ts` asserts this list
 * equals `DESTINATIONS.map((d) => d.name)`, so any drift fails CI — when you
 * add, rename or remove a destination in `sampleData.ts`, update this list.
 */
export const LOGBOOK_DESTINATIONS: readonly string[] = [
  "PUP Gymnasium",
  "Grandstand",
  "Administration Building",
  "Accounting Office",
  "Cashier's Office",
  "Registrar's Office",
  "Admission Office",
  "OJT Coordinator's Office",
  "Director Office",
  "OSAS",
  "Engineering Building",
  "Room 100 (Kitchen Laboratory)",
  "Room 101 (Beverage Laboratory)",
  "Room 102 (Tissue Laboratory)",
  "ICT Laboratory 1 (Room 103)",
  "ICT Laboratory 2 (Room 104)",
  "Room 105 (Food Laboratory)",
  "Room 106 (Lecture Room)",
  "Room 107 (Lecture Room)",
  "Room 108 (Lecture Room)",
  "Room 109 (Lecture Room)",
  "Room 110 (Lecture Room)",
  "Room 111 (CE Laboratory)",
  "Room 112 (EE Laboratory)",
  "Room 113 (Lecture Room)",
  "Room 114 (Lecture Room)",
  "Room 115 (Lecture Room)",
  "Room 116 (Lecture Room)",
  "Room 117 (Lecture Room)",
  "Room 118 (Lecture Room)",
  "Room 119 (EdTech)",
  "Quality Assurance Office",
  "Central Student Council Office",
  "Room 120 (Lecture Room)",
  "Room 121 (Lecture Room)",
  "Room 122 (Lecture Room)",
  "Faculty Room",
  "Medical Room",
  "Room 203 (Lecture Room)",
  "Room 204 (Lecture Room)",
  "Room 205 (Physics Laboratory)",
  "Room 206 (Chemistry Laboratory)",
  "Room 207 (ICT Laboratory 3)",
  "Room 208 (Drafting Laboratory)",
  "Room 209 (CEA Function Room)",
  "Room 210 (Lecture Room)",
  "Room 211 (Lecture Room)",
  "Room 212 (Lecture Room)",
  "Room 213 (Lecture Room)",
  "Guidance Counselor Office",
  "Room 214 (Lecture Room)",
  "Room 215 (Lecture Room)",
  "Room 216 (Speech Laboratory)",
  "Room 217 (Computer Laboratory 1)",
  "Room 218 (Computer Laboratory 2)",
  "Library",
  "Dental Clinic",
];

export const LOGBOOK_VISITOR_TYPES = [
  "Student",
  "Faculty",
  "Staff",
  "Visitor",
  "Alumni",
  "Guest",
] as const;

export type LogbookVisitorType = (typeof LOGBOOK_VISITOR_TYPES)[number];

/**
 * Returns `options`, plus `current` appended when it is a non-empty value not
 * already in the list. Used by edit forms so a record saved with a legacy or
 * since-removed value still shows (and keeps) that value instead of a blank
 * select.
 */
export function withCurrentOption(
  options: readonly string[],
  current: string | null | undefined
): readonly string[] {
  if (!current || !current.trim() || options.includes(current)) return options;
  return [...options, current];
}
