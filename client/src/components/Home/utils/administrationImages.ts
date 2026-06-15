const ADMINISTRATION_IMAGE_DIR = "/images/administrations";

const ADMINISTRATION_IMAGE_FILES = [
  "Alvin A. Argosino.png",
  "Asso. Prof. Ronaldo G. Bulfa.png",
  "Assoc. Prof. Josefina P. Babiera.png",
  "Assoc. Prof. Lourdes B. Avila.png",
  "Assoc. Prof. Maria Asuncion R. Del Castillo.png",
  "Asst. Prof. Altagracia A. Silaya.png",
  "Asst. Prof. Dionysius A. Velasquez.png",
  "Asst. Prof. Gilberto A. Villanueva.png",
  "Cherry D. Landicho, RL.png",
  "Devimar V. Marcaida.png",
  "Dr. Joel C. Magtibay.png",
  "Dr. Leilidyn Y. Zurbano.png",
  "Dr. Victoria Alma V. Conti.png",
  "Engr. Antonio P. Curva.png",
  "Garito E. Fabi.png",
  "Judith Marjalino.png",
  "Marian B. Reynales, RPm.png",
  "Mary Ann D. Padua.png",
  "Porf. MARK REY U. TAN.png",
  "Prof. ALEX V. AVILA.png",
  "Prof. ALTAGRACIA A. SILAYA.png",
  "Prof. ANTONIO P. CURVA.png",
  "Prof. BENEDICK B. LABACO.png",
  "Prof. BERNIE D. TEGUENOS.png",
  "Prof. CESAR B. BERMUNDO.png",
  "Prof. CESAR S. PERION.png",
  "Prof. CHERRIE GRACE C. ENTIENZA.png",
  "Prof. CHRISTINE S. MANZANERO.png",
  "Prof. CHRISTOPHER B. VALENCIA.png",
  "Prof. DARWYN CAPIO.png",
  "Prof. DAVE M. PERION.png",
  "Prof. DEVIMAR V. MARCAIDA.png",
  "Prof. EDELYN A. PAMILARAN.png",
  "Prof. ELENITA R. PORTEZ.png",
  "Prof. ERICK A. MOLINES.png",
  "Prof. FRANCIS M. JIMENEZ.png",
  "Prof. GEORGE D. OMONGOS.png",
  "Prof. GILBERTO A. VILLANUEVA.png",
  "Prof. HIROSHI SEN T. MERA.png",
  "Prof. ICON C. OBMERGA.png",
  "Prof. IGNACIO B. RAZONA.png",
  "Prof. ISAIAS B. UBANA II.png",
  "Prof. JAYSON A. MAGNAYE.png",
  "Prof. JAYSON C. JUCOM.png",
  "Prof. JENNY C. LINGUETE.png",
  "Prof. JER ANTHONY F. PALO.png",
  "Prof. JEWEL G. DE ASIS.png",
  "Prof. JIMAR MARJALINO.png",
  "Prof. JOANNE MICHELLE D. LEE.png",
  "Prof. JOCELYN C. ENTIENZA.png",
  "Prof. JOEPET V. BROSAS.png",
  "Prof. JOMAR B. ALCANTARA.png",
  "Prof. JOSCELLE JOYCE L. RIVERA.png",
  "Prof. KENT B. PITERO.png",
  "Prof. KLAUDE M. BUÑAG.png",
  "Prof. LEAH C. BARRAMEDA.png",
  "Prof. LERMA D. LOTEREÑA.png",
  "Prof. LESLY ANN H. MAGTIBAY.png",
  "Prof. LEXTER D. UMALI.png",
  "Prof. Lynel P. Tabien.png",
  "Prof. MA. LUISA N. FRANCISCO.png",
  "Prof. MARIA VILLA A. SARMIENTO.png",
  "Prof. MARIAN R. GARDUÑA.png",
  "Prof. MARIBEL D. CHAN.png",
  "Prof. MARIE ANDREA E. ZURBANO.png",
  "Prof. MARK VENCE. DUNGCA.png",
  "Prof. MARVI ANNE MAÑAGO.png",
  "Prof. MAY ANNE F. ARAZA.png",
  "Prof. MELANIE R. SARIO.png",
  "Prof. MERLIN M. CAPISTRANO.png",
  "Prof. MILDRED M. MONDRAGON.png",
  "Prof. MITCHELLE C. HUTALLA.png",
  "Prof. NELSON N. ENTIENZA.png",
  "Prof. PATRIACIA ANNE R. DE ASIS.png",
  "Prof. REGIDOR MAPANAO.png",
  "Prof. REINDEL SAM P. BULFA.png",
  "Prof. RIZA RIZALINA A. QUINCINA.png",
  "Prof. ROBIN B. REYNOSA.png",
  "Prof. RODEL O. FLORIDO.jpg",
  "Prof. RODONES S. TRIMILLOS.png",
  "Prof. ROLAND V. MAGSINO.png",
  "Prof. ROSARIO D. ANULAO.png",
  "Prof. RUFO N. BUEZA.png",
  "Prof. RUTH JADE C. SIMBULAN.png",
  "Prof. SALVADOR U. BARROS II.png",
  "Prof. SARAH G. TABIEN.png",
  "Prof. SERGIO JR. V. PINEDA.png",
  "Prof. SIENNA GRACE S. CALINGA.png",
  "Prof. THADEUS L. ARCHE JR..png",
  "Prof. TRISTAN KIRT O. YUMUL.png",
  "Prof. VENUS. VILLAVER.png",
  "Prof. VERONICA S. ALMASE.png",
  "Prof. VINCE CZAR S. ABEL.png",
  "Prof. VIOLETA A. DANES.png",
  "Prof. WALFRANDO E. ADAN.png",
  "Ruperto I. Almase.png",
  "Ruwena M. Yumul, RN.png",
  "Themistocle Jr. S. Yumul.png",
  "Tito Ernesto Z. Loreto.png",
  "Wilbor B. De Asis.png",
  "Wilfredo B. Malabanan.png",
] as const;

const TITLE_PREFIX =
  /^(assoc\.?\s*prof\.?|asso\.?\s*prof\.?|asst\.?\s*prof\.?|porf\.?\s*prof\.?|prof\.?|dr\.?|engr\.?)\s+/i;

const MANUAL_IMAGE_OVERRIDES: Record<string, string> = {
  "assoc prof ronaldo g bulfa": "Asso. Prof. Ronaldo G. Bulfa.png",
  "cherry d landicho": "Cherry D. Landicho, RL.png",
  "judith m marjalino": "Judith Marjalino.png",
  "prof mark rey u tan": "Porf. MARK REY U. TAN.png",
  "prof jay lexter d umali": "Prof. LEXTER D. UMALI.png",
  "themistocles jr s yumul": "Themistocle Jr. S. Yumul.png",
};

function administrationImageUrl(file: string): string {
  return `${ADMINISTRATION_IMAGE_DIR}/${file}`;
}

function normalizeAdministrationName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTitles(name: string): string {
  return name.replace(TITLE_PREFIX, "").trim();
}

function nameTokens(name: string): string[] {
  return stripTitles(normalizeAdministrationName(name))
    .split(" ")
    .filter(
      (token) =>
        token.length > 0 &&
        !["jr", "ii", "iii", "rn", "rpm", "rl"].includes(token),
    );
}

function significantTokens(name: string): string[] {
  const tokens = nameTokens(name);
  if (tokens.length === 0) {
    return [];
  }

  const last = tokens[tokens.length - 1];
  const significant = tokens.filter((token) => token.length >= 2);

  if (last.length === 1 && !significant.includes(last)) {
    significant.push(last);
  }

  return significant;
}

function scoreNameMatch(query: string, candidate: string): number {
  const queryTokens = new Set(significantTokens(query));
  const candidateTokens = significantTokens(candidate);

  if (candidateTokens.length === 0) {
    return 0;
  }

  const lastName = candidateTokens[candidateTokens.length - 1];
  if (!queryTokens.has(lastName)) {
    return 0;
  }

  let matches = 0;
  for (const token of candidateTokens) {
    if (queryTokens.has(token)) {
      matches += 1;
    }
  }

  return matches / Math.max(queryTokens.size, candidateTokens.length);
}

const fileBases = ADMINISTRATION_IMAGE_FILES.map((file) =>
  file.replace(/\.(png|jpg|jpeg|webp)$/i, ""),
);

const exactImageLookup = new Map<string, string>();

for (const file of ADMINISTRATION_IMAGE_FILES) {
  const baseName = file.replace(/\.(png|jpg|jpeg|webp)$/i, "");
  const imagePath = administrationImageUrl(file);

  exactImageLookup.set(normalizeAdministrationName(baseName), imagePath);
  exactImageLookup.set(
    normalizeAdministrationName(stripTitles(baseName)),
    imagePath,
  );
}

export function getAdministrationImagePath(name: string): string | undefined {
  const normalized = normalizeAdministrationName(name);
  const overrideFile = MANUAL_IMAGE_OVERRIDES[normalized];

  if (overrideFile) {
    return administrationImageUrl(overrideFile);
  }

  const exactMatch =
    exactImageLookup.get(normalized) ??
    exactImageLookup.get(normalizeAdministrationName(stripTitles(name)));

  if (exactMatch) {
    return exactMatch;
  }

  let bestBase: string | null = null;
  let bestScore = 0;

  for (const base of fileBases) {
    const candidateScore = scoreNameMatch(name, base);
    if (candidateScore > bestScore) {
      bestScore = candidateScore;
      bestBase = base;
    }
  }

  if (!bestBase || bestScore < 0.66) {
    return undefined;
  }

  const file = ADMINISTRATION_IMAGE_FILES[fileBases.indexOf(bestBase)];
  return administrationImageUrl(file);
}
