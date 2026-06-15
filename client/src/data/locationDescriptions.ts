/** Official building and location descriptions for campus map UI. */
export const LOCATION_DESCRIPTIONS_BY_ID: Record<string, string> = {
  grandstand:
    "The Grandstand of PUP Lopez Campus is a sports and event structure usually used for school programs, gatherings, ceremonies, and sometimes sports activities. It's part of the campus facilities developed to support large events and student activities.",
  pylon:
    "The Pylon originally stood for the true, the good and the beautiful. The triad of pillars may also stand for wisdom, strength and beauty because there should be wisdom to contrive, strength to support and beauty to adorn any great or important undertaking.",
  "hm-rooms":
    "The HM Laboratories of PUP Lopez Campus provide Hospitality Management students with industry-based practical training. These facilities simulate real-world hospitality environments, enabling students to develop skills in housekeeping, food preparation, culinary arts, restaurant service, and beverage management. Through hands-on learning experiences, students gain the competencies required for careers in hotels, restaurants, resorts, and other hospitality-related industries. The laboratories serve as essential training venues that bridge classroom instruction with professional practice.",
  "administration-building":
    'The Administrative Building, commonly called "Admin" by students, serves as the main office center of the campus. It houses the offices for administration, registrar services, accounting, faculty concerns, and other student transactions such as enrollment, clearances, and document requests. It is considered one of the busiest areas in the university because students frequently visit the building for academic and administrative purposes.',
  "comlab-1":
    "ICT Laboratory 1 is where most students start their computer subjects — basic programming, IT lab classes, and hands-on activities. If you're in BSIT or any course with tech subjects, you'll spend time here coding, finishing projects, and using the campus computers with internet.",
  "comlab-2":
    "ICT Laboratory 2 is the next lab down the walkway from ICT Laboratory 1. It's another full computer lab for classes that need more space or heavier project work, including advanced subjects and digital projects.",
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
  "eco-park":
    "The Eco Park is a green outdoor space on campus with seating areas and landscaping. It is used for relaxation, small gatherings, and environmental activities.",
  "green-house":
    "The Green House supports campus agriculture and plant-related learning activities. It provides a controlled environment for growing and studying plants.",
  "pup-sintahan":
    "PUP Sintahanan is a multi-purpose community space built through the bayanihan efforts of PUP Lopez faculty and staff. It serves as a venue for meetings, student activities, discussions, and campus gatherings while symbolizing unity and cooperation within the PUP community.",
  "new-canteen":
    "The New Canteen is a dining area along the covered walkway where students buy meals, snacks, and drinks between classes.",
};

/** Floor-zone names used in the 3D tour (may differ from pin display names). */
export const LOCATION_DESCRIPTIONS_BY_NAME: Record<string, string> = {
  "Administration Building":
    LOCATION_DESCRIPTIONS_BY_ID["administration-building"],
  "ICT Laboratory 1": LOCATION_DESCRIPTIONS_BY_ID["comlab-1"],
  "ICT Laboratory 2": LOCATION_DESCRIPTIONS_BY_ID["comlab-2"],
  "Health and Sciences Building": LOCATION_DESCRIPTIONS_BY_ID["health-sciences"],
  "Engineering Building": LOCATION_DESCRIPTIONS_BY_ID["engineering-building"],
  "Education Building": LOCATION_DESCRIPTIONS_BY_ID["education-building"],
  "Nantes Building": LOCATION_DESCRIPTIONS_BY_ID["nantes-building"],
  "Yumul Building": LOCATION_DESCRIPTIONS_BY_ID["yumul-building"],
  Grandstand: LOCATION_DESCRIPTIONS_BY_ID.grandstand,
  Pylon: LOCATION_DESCRIPTIONS_BY_ID.pylon,
  Gymnasium: LOCATION_DESCRIPTIONS_BY_ID.gymnasium,
  "PUP Gymnasium": LOCATION_DESCRIPTIONS_BY_ID.gymnasium,
  "HM Laboratories": LOCATION_DESCRIPTIONS_BY_ID["hm-rooms"],
  "Eco Park": LOCATION_DESCRIPTIONS_BY_ID["eco-park"],
  "Green House": LOCATION_DESCRIPTIONS_BY_ID["green-house"],
  "PUP Sintahanan": LOCATION_DESCRIPTIONS_BY_ID["pup-sintahan"],
  "New Canteen": LOCATION_DESCRIPTIONS_BY_ID["new-canteen"],
};

export function getLocationDescription(
  idOrName: string,
): string | undefined {
  return (
    LOCATION_DESCRIPTIONS_BY_ID[idOrName] ??
    LOCATION_DESCRIPTIONS_BY_NAME[idOrName]
  );
}
