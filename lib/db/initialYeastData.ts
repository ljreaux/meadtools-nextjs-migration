export interface Yeast {
  name: string;
  nitrogenRequirement: "Low" | "Medium" | "High" | "Very High";
  tolerance: number;
  lowTemp: number;
  highTemp: number;
}

interface Yeasts {
  Lalvin: Yeast[];
  Fermentis: Yeast[];
  ["Mangrove Jack"]: Yeast[];
  ["Red Star"]: Yeast[];
  Other: Yeast[];
}

const YEASTS: Yeasts = {
  Lalvin: [
    {
      name: "18-2007",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 50,
      highTemp: 90,
    },
    {
      name: "1895C",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 60,
      highTemp: 89,
    },
    {
      name: "71B",
      nitrogenRequirement: "Low",
      tolerance: 14,
      lowTemp: 59,
      highTemp: 86,
    },
    {
      name: "ALCHEMY I",
      nitrogenRequirement: "Medium",
      tolerance: 15.5,
      lowTemp: 56,
      highTemp: 61,
    },
    {
      name: "ALCHEMY II",
      nitrogenRequirement: "Medium",
      tolerance: 15.5,
      lowTemp: 56,
      highTemp: 62,
    },
    {
      name: "ALCHEMY III",
      nitrogenRequirement: "Medium",
      tolerance: 15.5,
      lowTemp: 61,
      highTemp: 82,
    },
    {
      name: "ALCHEMY IV",
      nitrogenRequirement: "Medium",
      tolerance: 15.5,
      lowTemp: 61,
      highTemp: 82,
    },
    {
      name: "BA11",
      nitrogenRequirement: "High",
      tolerance: 16,
      lowTemp: 59,
      highTemp: 77,
    },
    {
      name: "BDX",
      nitrogenRequirement: "Medium",
      tolerance: 16,
      lowTemp: 64,
      highTemp: 86,
    },
    {
      name: "BM 45",
      nitrogenRequirement: "High",
      tolerance: 15,
      lowTemp: 64,
      highTemp: 82,
    },
    {
      name: "BM 4x4",
      nitrogenRequirement: "High",
      tolerance: 16,
      lowTemp: 64,
      highTemp: 82,
    },
    {
      name: "BRL97",
      nitrogenRequirement: "Medium",
      tolerance: 16,
      lowTemp: 62,
      highTemp: 85,
    },
    {
      name: "C",
      nitrogenRequirement: "Low",
      tolerance: 17,
      lowTemp: 59,
      highTemp: 86,
    },
    {
      name: "CLOS",
      nitrogenRequirement: "Medium",
      tolerance: 17,
      lowTemp: 57,
      highTemp: 90,
    },
    {
      name: "CROSS EVOLUTION",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 58,
      highTemp: 68,
    },
    {
      name: "CSM",
      nitrogenRequirement: "Medium",
      tolerance: 15,
      lowTemp: 59,
      highTemp: 90,
    },
    {
      name: "CVRP",
      nitrogenRequirement: "Medium",
      tolerance: 16,
      lowTemp: 64,
      highTemp: 90,
    },
    {
      name: "CVW5",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 57,
      highTemp: 82,
    },
    {
      name: "CY17",
      nitrogenRequirement: "Low",
      tolerance: 14,
      lowTemp: 61,
      highTemp: 75,
    },
    {
      name: "CY3079 (BOURGOBLANC)",
      nitrogenRequirement: "High",
      tolerance: 15,
      lowTemp: 59,
      highTemp: 77,
    },
    {
      name: "DV10",
      nitrogenRequirement: "Low",
      tolerance: 17,
      lowTemp: 50,
      highTemp: 95,
    },
    {
      name: "EC1118",
      nitrogenRequirement: "Low",
      tolerance: 18,
      lowTemp: 50,
      highTemp: 86,
    },
    {
      name: "EC1118 (ORGANIC)",
      nitrogenRequirement: "Low",
      tolerance: 18,
      lowTemp: 50,
      highTemp: 90,
    },
    {
      name: "ENOFERM AMH",
      nitrogenRequirement: "Medium",
      tolerance: 15,
      lowTemp: 68,
      highTemp: 86,
    },
    {
      name: "ENOFERM SYRAH",
      nitrogenRequirement: "Medium",
      tolerance: 16,
      lowTemp: 59,
      highTemp: 90,
    },
    {
      name: "EXOTICS MOSAIC",
      nitrogenRequirement: "Medium",
      tolerance: 15.5,
      lowTemp: 64,
      highTemp: 83,
    },
    {
      name: "EXOTICS NOVELLO",
      nitrogenRequirement: "Medium",
      tolerance: 15.5,
      lowTemp: 64,
      highTemp: 82,
    },
    {
      name: "FERMIVIN 3C",
      nitrogenRequirement: "Medium",
      tolerance: 14,
      lowTemp: 62,
      highTemp: 72,
    },
    {
      name: "FERMIVIN 4F9",
      nitrogenRequirement: "Medium",
      tolerance: 15.5,
      lowTemp: 57,
      highTemp: 68,
    },
    {
      name: "FERMIVIN A33",
      nitrogenRequirement: "High",
      tolerance: 15.5,
      lowTemp: 72,
      highTemp: 86,
    },
    {
      name: "FERMIVIN MT48",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 68,
      highTemp: 86,
    },
    {
      name: "FERMIVIN PF6",
      nitrogenRequirement: "Medium",
      tolerance: 14,
      lowTemp: 54,
      highTemp: 75,
    },
    {
      name: "ICV D21",
      nitrogenRequirement: "Medium",
      tolerance: 16,
      lowTemp: 61,
      highTemp: 86,
    },
    {
      name: "ICV D254",
      nitrogenRequirement: "Medium",
      tolerance: 16,
      lowTemp: 54,
      highTemp: 82,
    },
    {
      name: "ICV D47",
      nitrogenRequirement: "Low",
      tolerance: 17,
      lowTemp: 50,
      highTemp: 86,
    },
    {
      name: "ICV D80",
      nitrogenRequirement: "High",
      tolerance: 16,
      lowTemp: 59,
      highTemp: 82,
    },
    {
      name: "ICV GRE",
      nitrogenRequirement: "Medium",
      tolerance: 15,
      lowTemp: 59,
      highTemp: 82,
    },
    {
      name: "ICV OKAY",
      nitrogenRequirement: "Low",
      tolerance: 16,
      lowTemp: 54,
      highTemp: 86,
    },
    {
      name: "ICV SUNROSE",
      nitrogenRequirement: "Medium",
      tolerance: 16,
      lowTemp: 57,
      highTemp: 68,
    },
    {
      name: "IOC BE FRUITS",
      nitrogenRequirement: "Low",
      tolerance: 14,
      lowTemp: 54,
      highTemp: 75,
    },
    {
      name: "IOC BE THIOLS",
      nitrogenRequirement: "Medium",
      tolerance: 15,
      lowTemp: 59,
      highTemp: 77,
    },
    {
      name: "K1V1116",
      nitrogenRequirement: "Low",
      tolerance: 18,
      lowTemp: 50,
      highTemp: 95,
    },
    {
      name: "LEVULINE BRG",
      nitrogenRequirement: "High",
      tolerance: 15,
      lowTemp: 64,
      highTemp: 88,
    },
    {
      name: "M83",
      nitrogenRequirement: "Medium",
      tolerance: 15,
      lowTemp: 63,
      highTemp: 81,
    },
    {
      name: "MSB",
      nitrogenRequirement: "Medium",
      tolerance: 14.5,
      lowTemp: 57,
      highTemp: 68,
    },
    {
      name: "MT",
      nitrogenRequirement: "Medium",
      tolerance: 15,
      lowTemp: 59,
      highTemp: 90,
    },
    {
      name: "NBC",
      nitrogenRequirement: "High",
      tolerance: 15,
      lowTemp: 57,
      highTemp: 68,
    },
    {
      name: "NT 116",
      nitrogenRequirement: "Medium",
      tolerance: 16,
      lowTemp: 54,
      highTemp: 83,
    },
    {
      name: "NT 202",
      nitrogenRequirement: "Medium",
      tolerance: 16,
      lowTemp: 64,
      highTemp: 82,
    },
    {
      name: "NT 50",
      nitrogenRequirement: "Medium",
      tolerance: 16.5,
      lowTemp: 57,
      highTemp: 82,
    },
    {
      name: "OENOFERM BOUQUET",
      nitrogenRequirement: "High",
      tolerance: 15,
      lowTemp: 61,
      highTemp: 68,
    },
    {
      name: "OENOFERM FREDDO",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 55,
      highTemp: 63,
    },
    {
      name: "OENOFERM PINOTYPE",
      nitrogenRequirement: "High",
      tolerance: 15,
      lowTemp: 64,
      highTemp: 82,
    },
    {
      name: "OENOFERM RIESLING",
      nitrogenRequirement: "High",
      tolerance: 13,
      lowTemp: 63,
      highTemp: 72,
    },
    {
      name: "OENOFERM X-THIOL",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 55,
      highTemp: 72,
    },
    {
      name: "OENOFERM X-TREME",
      nitrogenRequirement: "Low",
      tolerance: 17,
      lowTemp: 50,
      highTemp: 63,
    },
    {
      name: "PERSY",
      nitrogenRequirement: "Low",
      tolerance: 16,
      lowTemp: 59,
      highTemp: 82,
    },
    {
      name: "QA23",
      nitrogenRequirement: "Low",
      tolerance: 16,
      lowTemp: 59,
      highTemp: 90,
    },
    {
      name: "R-HST",
      nitrogenRequirement: "Medium",
      tolerance: 15,
      lowTemp: 50,
      highTemp: 86,
    },
    {
      name: "R2",
      nitrogenRequirement: "Medium",
      tolerance: 16,
      lowTemp: 50,
      highTemp: 86,
    },
    {
      name: "RA17",
      nitrogenRequirement: "High",
      tolerance: 15,
      lowTemp: 61,
      highTemp: 84,
    },
    {
      name: "RC212 (BOURGOROUGE)",
      nitrogenRequirement: "Medium",
      tolerance: 16,
      lowTemp: 60,
      highTemp: 86,
    },
    {
      name: "RHÔNE 2056",
      nitrogenRequirement: "High",
      tolerance: 16,
      lowTemp: 59,
      highTemp: 82,
    },
    {
      name: "RHÔNE 2226",
      nitrogenRequirement: "High",
      tolerance: 18,
      lowTemp: 59,
      highTemp: 82,
    },
    {
      name: "RHÔNE 4600",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 56,
      highTemp: 72,
    },
    {
      name: "RP15",
      nitrogenRequirement: "Medium",
      tolerance: 17,
      lowTemp: 68,
      highTemp: 86,
    },
    {
      name: "SAUVY",
      nitrogenRequirement: "Medium",
      tolerance: 14,
      lowTemp: 57,
      highTemp: 68,
    },
    {
      name: "SENSY",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 54,
      highTemp: 64,
    },
    {
      name: "STEINBERGER",
      nitrogenRequirement: "Medium",
      tolerance: 13,
      lowTemp: 59,
      highTemp: 77,
    },
    {
      name: "SVG",
      nitrogenRequirement: "Medium",
      tolerance: 15,
      lowTemp: 61,
      highTemp: 82,
    },
    {
      name: "TANGO",
      nitrogenRequirement: "Medium",
      tolerance: 15.5,
      lowTemp: 59,
      highTemp: 82,
    },
    {
      name: "UVAFERM 43",
      nitrogenRequirement: "Low",
      tolerance: 17,
      lowTemp: 55,
      highTemp: 95,
    },
    {
      name: "UVAFERM CEG (EPERNAY II)",
      nitrogenRequirement: "Medium",
      tolerance: 13.5,
      lowTemp: 59,
      highTemp: 77,
    },
    {
      name: "VIN 13",
      nitrogenRequirement: "Low",
      tolerance: 17,
      lowTemp: 54,
      highTemp: 61,
    },
    {
      name: "VIN 2000",
      nitrogenRequirement: "Low",
      tolerance: 15.5,
      lowTemp: 55,
      highTemp: 61,
    },
    {
      name: "VITIFERM ALBA FRIA (ORGANIC)",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 61,
      highTemp: 65,
    },
    {
      name: "VITIFERM ESPIRIT (ORGANIC)",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 61,
      highTemp: 65,
    },
    {
      name: "VITIFERM PINOT ALBA (ORGANIC)",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 65,
      highTemp: 68,
    },
    {
      name: "VITIFERM RUBINO EXTRA (ORGANIC)",
      nitrogenRequirement: "Low",
      tolerance: 17,
      lowTemp: 61,
      highTemp: 90,
    },
    {
      name: "VITIFERM SAUVAGE (ORGANIC)",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 61,
      highTemp: 90,
    },
    {
      name: "VITIFERM VULCANO (ORGANIC)",
      nitrogenRequirement: "Low",
      tolerance: 16,
      lowTemp: 61,
      highTemp: 90,
    },
    {
      name: "VITILEVURE 3001",
      nitrogenRequirement: "Medium",
      tolerance: 15,
      lowTemp: 54,
      highTemp: 90,
    },
    {
      name: "VITILEVURE 58W",
      nitrogenRequirement: "Medium",
      tolerance: 14,
      lowTemp: 54,
      highTemp: 77,
    },
    {
      name: "VITILEVURE ELIXIR",
      nitrogenRequirement: "Medium",
      tolerance: 15,
      lowTemp: 57,
      highTemp: 77,
    },
    {
      name: "VRB",
      nitrogenRequirement: "Medium",
      tolerance: 17,
      lowTemp: 59,
      highTemp: 82,
    },
    {
      name: "W15",
      nitrogenRequirement: "High",
      tolerance: 16,
      lowTemp: 50,
      highTemp: 81,
    },
  ],
  Fermentis: [
    {
      name: "SafAle US-05",
      nitrogenRequirement: "Medium",
      tolerance: 12,
      lowTemp: 59,
      highTemp: 75,
    },
  ],
  "Mangrove Jack": [
    {
      name: "AW4",
      nitrogenRequirement: "Low",
      tolerance: 14,
      lowTemp: 61,
      highTemp: 75,
    },
    {
      name: "BV7",
      nitrogenRequirement: "Low",
      tolerance: 14,
      lowTemp: 57,
      highTemp: 82,
    },
    {
      name: "CL23",
      nitrogenRequirement: "Low",
      tolerance: 18,
      lowTemp: 57,
      highTemp: 90,
    },
    {
      name: "CR51",
      nitrogenRequirement: "High",
      tolerance: 14,
      lowTemp: 61,
      highTemp: 75,
    },
    {
      name: "M02",
      nitrogenRequirement: "Low",
      tolerance: 17.5,
      lowTemp: 54,
      highTemp: 82,
    },
    {
      name: "M05",
      nitrogenRequirement: "Medium",
      tolerance: 18,
      lowTemp: 59,
      highTemp: 86,
    },
    {
      name: "MA33",
      nitrogenRequirement: "Low",
      tolerance: 14,
      lowTemp: 64,
      highTemp: 82,
    },
    {
      name: "R56",
      nitrogenRequirement: "Low",
      tolerance: 15,
      lowTemp: 64,
      highTemp: 82,
    },
    {
      name: "SN9",
      nitrogenRequirement: "Low",
      tolerance: 18,
      lowTemp: 57,
      highTemp: 82,
    },
    {
      name: "VR21",
      nitrogenRequirement: "High",
      tolerance: 15,
      lowTemp: 64,
      highTemp: 82,
    },
  ],
  "Red Star": [
    {
      name: "Cotes des Blanc",
      nitrogenRequirement: "Medium",
      tolerance: 13,
      lowTemp: 64,
      highTemp: 86,
    },
    {
      name: "Premier Classique",
      nitrogenRequirement: "Low",
      tolerance: 13,
      lowTemp: 59,
      highTemp: 86,
    },
    {
      name: "Premier Cuvee",
      nitrogenRequirement: "Medium",
      tolerance: 18,
      lowTemp: 45,
      highTemp: 95,
    },
    {
      name: "Premier Rouge (Pasteur Red)",
      nitrogenRequirement: "Medium",
      tolerance: 18,
      lowTemp: 64,
      highTemp: 86,
    },
  ],
  Other: [
    {
      name: "Other Low N Yeast",
      nitrogenRequirement: "Low",
      tolerance: 12,
      lowTemp: 50,
      highTemp: 65,
    },
    {
      name: "Other Medium N Yeast",
      nitrogenRequirement: "Medium",
      tolerance: 12,
      lowTemp: 55,
      highTemp: 70,
    },
    {
      name: "Other High N Yeast",
      nitrogenRequirement: "High",
      tolerance: 12,
      lowTemp: 55,
      highTemp: 70,
    },
    {
      name: "Generic Beer Yeast",
      nitrogenRequirement: "Medium",
      tolerance: 12,
      lowTemp: 55,
      highTemp: 70,
    },
    {
      name: "Kveik Yeast",
      nitrogenRequirement: "Very High",
      tolerance: 12,
      lowTemp: 70,
      highTemp: 100,
    },
  ],
};

export default YEASTS;
