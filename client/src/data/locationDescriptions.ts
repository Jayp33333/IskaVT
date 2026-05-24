/** Official building and location descriptions for campus map UI. */
export const LOCATION_DESCRIPTIONS_BY_ID: Record<string, string> = {
  grandstand:
    "The campus grandstand hosts major events, assemblies, and outdoor gatherings.",
  pylon:
    "The iconic campus pylon — a landmark at the heart of PUP Lopez.",
  "main-gate":
    "The main entrance to PUP Lopez — your starting point when visiting campus.",
  "administration-building":
    'The Administrative Building, commonly called "Admin" by students, serves as the main office center of the campus. It houses the offices for administration, registrar services, accounting, faculty concerns, and other student transactions such as enrollment, clearances, and document requests. It is considered one of the busiest areas in the university because students frequently visit the building for academic and administrative purposes.',
  "comlab-1":
    "The Com Lab is the primary computer laboratory facility of the campus where students conduct computer-based activities, programming, research, and digital projects. It is commonly used by students from BSIT and other programs with computer-related subjects. The building contains computer units, internet access, and equipment used for laboratory classes, practical exercises, and technology-related learning activities.",
  "comlab-2":
    "The Com Lab is the primary computer laboratory facility of the campus where students conduct computer-based activities, programming, research, and digital projects. It is commonly used by students from BSIT and other programs with computer-related subjects. The building contains computer units, internet access, and equipment used for laboratory classes, practical exercises, and technology-related learning activities.",
  "engineering-building":
    "The Engineering Building is dedicated mainly to engineering, architecture, and technology-related programs. It contains classrooms, laboratories, and drafting areas used by students for technical and practical learning. Engineering students usually perform laboratory experiments, drafting activities, and specialized subject classes in this building, making it one of the most active academic facilities on campus.",
  "health-sciences":
    "The Science Building is one of the main academic buildings used for lecture classes and science-related subjects. It accommodates various general education and major subject classes for different programs. The building serves as a regular venue for discussions, laboratory activities, and academic learning, providing students with classrooms and facilities necessary for their studies.",
  "education-building":
    "The Education Building is primarily used for education and public administration programs. It serves as a venue for lectures, demonstrations, reporting activities, seminars, and classroom discussions. Students taking professional education courses and related subjects commonly use this building for academic activities and collaborative learning.",
  "nantes-building":
    "The Nantes Building is one of the recognized classroom buildings within the campus. It is commonly used for regular lecture classes, minor subjects, and other academic activities. The building provides additional classroom spaces that accommodate students from different programs and year levels.",
  "yumul-building":
    "The Yumul Building, located near the Administrative Building, is one of the historically significant structures on campus. It was named in recognition of the Yumul family, who contributed to the establishment and development of the university campus. The building is commonly used for classrooms, offices, and various academic activities, making it an important part of the campus community.",
  gymnasium:
    "The Gymnasium Building serves as the main venue for sports activities, physical education classes, assemblies, programs, and major university events. It is commonly used during intramurals, orientations, seminars, and other large gatherings. The gymnasium provides a spacious area where students can participate in athletic, recreational, and campus-wide activities.",
};

/** Floor-zone names used in the 3D tour (may differ from pin display names). */
export const LOCATION_DESCRIPTIONS_BY_NAME: Record<string, string> = {
  "Administration Building":
    LOCATION_DESCRIPTIONS_BY_ID["administration-building"],
  "Comlab 1": LOCATION_DESCRIPTIONS_BY_ID["comlab-1"],
  "Comlab 2": LOCATION_DESCRIPTIONS_BY_ID["comlab-2"],
  "Health and Sciences Building": LOCATION_DESCRIPTIONS_BY_ID["health-sciences"],
  "Engineering Building": LOCATION_DESCRIPTIONS_BY_ID["engineering-building"],
  "Education Building": LOCATION_DESCRIPTIONS_BY_ID["education-building"],
  "Nantes Building": LOCATION_DESCRIPTIONS_BY_ID["nantes-building"],
  "Yumul Building": LOCATION_DESCRIPTIONS_BY_ID["yumul-building"],
  "PUP Gymnasium": LOCATION_DESCRIPTIONS_BY_ID.gymnasium,
};

export function getLocationDescription(
  idOrName: string,
): string | undefined {
  return (
    LOCATION_DESCRIPTIONS_BY_ID[idOrName] ??
    LOCATION_DESCRIPTIONS_BY_NAME[idOrName]
  );
}
