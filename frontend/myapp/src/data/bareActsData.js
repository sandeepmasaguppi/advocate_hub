// ============================================================
//  bareActsData.js — Indian Statutory Compendium & Bare Acts
//  Contains complete statutory data for 16 Indian Enactments:
//  BNS 2023, BNSS 2023, BSA 2023, Constitution of India, CPC,
//  NI Act 138, HMA 1955, TPA 1882, RERA 2016, CPA 2019,
//  Companies Act 2013, POCSO 2012, IT Act 2000, IBC 2016,
//  Domestic Violence Act (PWDVA) 2005, and Motor Vehicles Act 1988.
// ============================================================

export const BARE_ACT_CATEGORIES_EN = [
  "All",
  "New Acts (2023)",
  "Criminal",
  "Civil",
  "Family",
  "Property",
  "Corporate",
  "Commercial",
  "Labour",
  "Constitutional",
  "Special Laws"
];

export const BARE_ACT_CATEGORIES_KN = [
  "ಎಲ್ಲಾ",
  "ಹೊಸ ಕಾಯ್ದೆಗಳು (೨೦೨೩)",
  "ಕ್ರಿಮಿನಲ್",
  "ಸಿವಿಲ್",
  "ಕೌಟುಂಬಿಕ",
  "ಆಸ್ತಿ",
  "ಕಾರ್ಪೊರೇಟ್",
  "ವಾಣಿಜ್ಯ",
  "ಕಾರ್ಮಿಕ",
  "ಸಂವಿಧಾನ",
  "ವಿಶೇಷ ಕಾಯ್ದೆಗಳು"
];

export const CAT_COLORS = {
  Criminal: "#dc2626",
  Civil: "#2563eb",
  Family: "#16a34a",
  Property: "#7c3aed",
  Corporate: "#ea580c",
  Commercial: "#0d9488",
  Labour: "#d97706",
  Constitutional: "#0891b2",
  "New Acts (2023)": "#059669",
  "Special Laws": "#4f46e5"
};

/**
 * Criminal Law Overhaul: Old Indian Criminal Codes ⇄ 2023 Sanhitas
 */
export const OLD_TO_NEW_CRIMINAL_MAPPING = [
  {
    offence: "Murder",
    oldAct: "IPC",
    oldSection: "302",
    newAct: "BNS",
    newSection: "103(1)",
    changeSummary: "Punishment remains Death or Life Imprisonment + Fine. Sec 103(2) introduces dedicated mob lynching provision by 5+ persons on grounds of race, caste, sex, or place of birth.",
    punishment: "Death or Imprisonment for Life + Fine",
    cognizable: "Cognizable",
    bailable: "Non-Bailable",
    triableBy: "Court of Session"
  },
  {
    offence: "Mob Lynching / Hate Killing",
    oldAct: "IPC",
    oldSection: "302 / 34 / 149",
    newAct: "BNS",
    newSection: "103(2)",
    changeSummary: "Brand new statutory sub-clause punishing mob murder committed by a group of five or more persons acting in concert.",
    punishment: "Death or Life Imprisonment + Fine",
    cognizable: "Cognizable",
    bailable: "Non-Bailable",
    triableBy: "Court of Session"
  },
  {
    offence: "Culpable Homicide Not Amounting to Murder",
    oldAct: "IPC",
    oldSection: "304",
    newAct: "BNS",
    newSection: "105",
    changeSummary: "Restructured into intentional homicide (Life/10 yrs) vs homicide with knowledge but without intention (up to 10 yrs + fine).",
    punishment: "Life Imprisonment or up to 10 Years + Fine",
    cognizable: "Cognizable",
    bailable: "Non-Bailable",
    triableBy: "Court of Session"
  },
  {
    offence: "Rash & Negligent Driving / Hit and Run",
    oldAct: "IPC",
    oldSection: "304A",
    newAct: "BNS",
    newSection: "106(1) & 106(2)",
    changeSummary: "Sec 106(1) provides up to 5 yrs imprisonment. Sec 106(2) provides up to 10 years for escape without reporting to police/magistrate.",
    punishment: "Up to 5 yrs (106(1)) / Up to 10 yrs (106(2)) + Fine",
    cognizable: "Cognizable",
    bailable: "Bailable (106(1)) / Non-Bailable (106(2))",
    triableBy: "Magistrate of First Class"
  },
  {
    offence: "Cheating and Dishonestly Inducing Delivery of Property",
    oldAct: "IPC",
    oldSection: "420",
    newAct: "BNS",
    newSection: "318(4)",
    changeSummary: "Definition simplified. Punishment of up to 7 years imprisonment and fine preserved.",
    punishment: "Imprisonment up to 7 Years + Fine",
    cognizable: "Cognizable",
    bailable: "Non-Bailable",
    triableBy: "Magistrate of First Class"
  },
  {
    offence: "Cruelty by Husband or Relatives of Husband",
    oldAct: "IPC",
    oldSection: "498A",
    newAct: "BNS",
    newSection: "85 & 86",
    changeSummary: "Separated into punishment (Sec 85) and definition of cruelty including mental and physical cruelty (Sec 86).",
    punishment: "Imprisonment up to 3 Years + Fine",
    cognizable: "Cognizable",
    bailable: "Non-Bailable",
    triableBy: "Magistrate of First Class"
  },
  {
    offence: "Rape / Aggravated Sexual Assault",
    oldAct: "IPC",
    oldSection: "375 & 376",
    newAct: "BNS",
    newSection: "63 & 64",
    changeSummary: "Rigorous imprisonment of not less than 10 years, which may extend to life imprisonment, and fine payable to the victim.",
    punishment: "Rigorous Imprisonment 10 Years to Life + Fine",
    cognizable: "Cognizable",
    bailable: "Non-Bailable",
    triableBy: "Court of Session"
  },
  {
    offence: "Snatching (Theft with Sudden Physical Force)",
    oldAct: "IPC",
    oldSection: "379 / 356",
    newAct: "BNS",
    newSection: "304",
    changeSummary: "Newly introduced specific offence of snatching to curb street chain/phone snatching.",
    punishment: "Imprisonment up to 3 Years + Fine",
    cognizable: "Cognizable",
    bailable: "Non-Bailable",
    triableBy: "Any Magistrate"
  },
  {
    offence: "Organised Crime Syndicate",
    oldAct: "Special State Acts (MCOCA/KCOCA)",
    oldSection: "State Codes",
    newAct: "BNS",
    newSection: "111",
    changeSummary: "First all-India central statutory penal provision punishing continuing unlawful activity, extortion, contract killing, and cyber syndicates.",
    punishment: "Death or Life Imprisonment + ₹5 Lakh Min Fine",
    cognizable: "Cognizable",
    bailable: "Non-Bailable",
    triableBy: "Special Court / Court of Session"
  },
  {
    offence: "First Information Report (FIR / e-FIR / Zero FIR)",
    oldAct: "CrPC",
    oldSection: "154",
    newAct: "BNSS",
    newSection: "173",
    changeSummary: "Statutory recognition of Zero FIR (filing in any police station regardless of jurisdiction) and electronic FIR with signature within 3 days.",
    punishment: "Mandatory Registration within prescribed guidelines",
    cognizable: "Cognizable Mandate",
    bailable: "N/A",
    triableBy: "Investigating Officer / Magistrate"
  },
  {
    offence: "Anticipatory Bail (Direction for Grant of Bail to Person Apprehending Arrest)",
    oldAct: "CrPC",
    oldSection: "438",
    newAct: "BNSS",
    newSection: "482",
    changeSummary: "Discretion of Sessions Court and High Court retained with updated statutory conditions and procedural safety checks.",
    punishment: "Pre-arrest protective judicial order",
    cognizable: "Procedural",
    bailable: "Judicial Discretion",
    triableBy: "Sessions Court / High Court"
  },
  {
    offence: "Regular Bail in Non-Bailable Offences",
    oldAct: "CrPC",
    oldSection: "437 & 439",
    newAct: "BNSS",
    newSection: "480 & 483",
    changeSummary: "Magistrate bail powers under Sec 480; High Court/Sessions Court special powers under Sec 483.",
    punishment: "Judicial Release on Personal Bond / Surety",
    cognizable: "Procedural",
    bailable: "Judicial Discretion",
    triableBy: "Magistrate / Sessions / High Court"
  },
  {
    offence: "Admissibility of Electronic Records / Certificates",
    oldAct: "IEA",
    oldSection: "65B",
    newAct: "BSA",
    newSection: "63",
    changeSummary: "Includes emails, server logs, mobile WhatsApp chats, cloud backups. Standard statutory certificate form added in Schedule.",
    punishment: "Mandatory Evidentiary Admissibility Rule",
    cognizable: "Evidentiary",
    bailable: "N/A",
    triableBy: "All Judicial Courts"
  }
];

/**
 * 16 Verified Enactments Library
 */
export const BARE_ACTS_DATA = [
  {
    id: 1,
    shortName: "BNS",
    title: "Bharatiya Nyaya Sanhita, 2023",
    actNumber: "Act No. 45 of 2023",
    year: 2023,
    enactmentDate: "Effective 1 July 2024",
    ministry: "Ministry of Home Affairs & Ministry of Law and Justice",
    category: "Criminal",
    desc: "The primary substantive penal code of India replacing the Indian Penal Code, 1860. Modernizes criminal jurisprudence with specific provisions on terrorism, mob lynching, organised crime, and community service.",
    sectionsCount: 358,
    chaptersCount: 20,
    isNew: true,
    popular: true,
    icon: "⚖️",
    chapters: [
      "Chapter I: Preliminary (Sections 1–3)",
      "Chapter II: Of Punishments (Sections 4–13)",
      "Chapter III: General Exceptions & Right of Private Defence (Sections 14–44)",
      "Chapter IV: Of Abetment, Criminal Conspiracy and Attempt (Sections 45–62)",
      "Chapter V: Of Offences Against Women and Children (Sections 63–99)",
      "Chapter VI: Of Offences Affecting the Human Body (Sections 100–146)",
      "Chapter VII: Of Offences Against the State (Sections 147–158)",
      "Chapter VIII: Of Offences Relating to Army, Navy and Air Force (Sections 159–168)",
      "Chapter IX: Of Offences Relating to Elections (Sections 169–177)",
      "Chapter X: Of Contempts of the Lawful Authority of Public Servants (Sections 178–226)",
      "Chapter XI: Of False Evidence and Offences Against Public Justice (Sections 227–269)",
      "Chapter XII: Of Offences Against Public Health, Safety and Morals (Sections 270–297)",
      "Chapter XIII: Of Offences Relating to Religion (Sections 298–302)",
      "Chapter XIV: Of Offences Against Property (Sections 303–334)",
      "Chapter XV: Of Offences Relating to Documents and Property Marks (Sections 335–350)",
      "Chapter XVI: Of Criminal Intimidation, Insult and Defamation (Sections 351–356)",
      "Chapter XVII: Miscellaneous Provisions"
    ],
    sections: [
      {
        no: "1",
        title: "Short title, extent and commencement",
        classification: { type: "General Provision", cognizable: "N/A", bailable: "N/A", triable: "All Courts" },
        content: "(1) This Act may be called the Bharatiya Nyaya Sanhita, 2023.\n(2) It extends to the whole of India.\n(3) It came into force on the 1st day of July, 2024 via Notification No. S.O. 850(E).",
        note: "Replaces Indian Penal Code, 1860 across all Indian states and Union territories."
      },
      {
        no: "103",
        title: "Punishment for Murder and Mob Lynching",
        classification: { type: "Penal Provision", cognizable: "Cognizable", bailable: "Non-Bailable", triable: "Court of Session" },
        content: "(1) Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.\n(2) When a group of five or more persons acting in concert commits murder on the ground of race, caste or community, sex, place of birth, language, or personal belief, each member of such group shall be punished with death or with imprisonment for life, and shall also be liable to fine.",
        note: "Sec 103(1) mirrors old IPC Sec 302. Sec 103(2) is the landmark new statutory clause for Mob Lynching."
      },
      {
        no: "106",
        title: "Causing death by negligence (Hit and Run)",
        classification: { type: "Penal Provision", cognizable: "Cognizable", bailable: "Bailable (1) / Non-Bailable (2)", triable: "Magistrate of First Class" },
        content: "(1) Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide, shall be punished with imprisonment of either description for a term which may extend to five years, and shall also be liable to fine.\n(2) Whoever causes the death of any person by rash and negligent driving of vehicle not amounting to culpable homicide, and escapes without reporting it to a police officer or a Magistrate soon after the incident, shall be punished with imprisonment of either description of a term which may extend to ten years, and shall also be liable to fine.",
        note: "Sec 106(1) replaces old IPC 304A. Sec 106(2) provides deterrent 10-year term for hit-and-run escape."
      },
      {
        no: "318",
        title: "Cheating and Dishonestly Inducing Delivery of Property",
        classification: { type: "Penal Provision", cognizable: "Cognizable", bailable: "Non-Bailable", triable: "Magistrate of First Class" },
        content: "(1) Whoever cheats shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.\n(4) Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
        note: "Sec 318(4) corresponds directly to the famous Old IPC Section 420."
      },
      {
        no: "85",
        title: "Husband or relative of husband of a woman subjecting her to cruelty",
        classification: { type: "Penal Provision", cognizable: "Cognizable", bailable: "Non-Bailable", triable: "Magistrate of First Class" },
        content: "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.",
        note: "Corresponds to old IPC Section 498A. Governed by supreme court guidelines in Arnesh Kumar v. State of Bihar."
      }
    ]
  },
  {
    id: 2,
    shortName: "BNSS",
    title: "Bharatiya Nagarik Suraksha Sanhita, 2023",
    actNumber: "Act No. 46 of 2023",
    year: 2023,
    enactmentDate: "Effective 1 July 2024",
    ministry: "Ministry of Home Affairs",
    category: "Criminal",
    desc: "The comprehensive code of criminal procedure replacing the CrPC, 1973. Mandates forensic investigation for serious crimes, electronic summons, Zero FIR, timeline-bound trial proceedings, and electronic recording of searches.",
    sectionsCount: 531,
    chaptersCount: 39,
    isNew: true,
    popular: true,
    icon: "🛡️",
    chapters: [
      "Chapter I: Preliminary",
      "Chapter II: Constitution of Criminal Courts and Offices",
      "Chapter V: Arrest of Persons",
      "Chapter VII: Processes to Compel Appearance & Summons",
      "Chapter XII: Information to Police and Their Powers to Investigate (Sec 173–196)",
      "Chapter XXXIII: Provisions as to Bail and Bonds (Sec 478–496)"
    ],
    sections: [
      {
        no: "173",
        title: "Information in cognizable cases (FIR / e-FIR / Zero FIR)",
        classification: { type: "Procedural Mandate", cognizable: "Cognizable", bailable: "N/A", triable: "Investigating Authority" },
        content: "(1) Every information relating to the commission of a cognizable offence, irrespective of the area where the offence is committed, may be given orally or by electronic communication to an officer in charge of a police station.\nProvided that if the information is given by electronic communication, it shall be taken on record on being signed by the person within three days.\n(2) A copy of the information recorded under sub-section (1) shall be given forthwith, free of cost, to the informant or the victim.",
        note: "Replaces CrPC 154. Grants statutory foundation to Zero FIR and electronic FIR filing across India."
      },
      {
        no: "482",
        title: "Direction for grant of bail to person apprehending arrest (Anticipatory Bail)",
        classification: { type: "Judicial Power", cognizable: "Procedural", bailable: "Judicial Discretion", triable: "Sessions Court / High Court" },
        content: "(1) Where any person has reason to believe that he may be arrested on accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session for a direction under this section that in the event of such arrest he shall be released on bail.\n(2) The High Court or Court of Session may, after taking into consideration the nature and gravity of accusation and previous criminal antecedents, grant anticipatory bail subject to conditions.",
        note: "Corresponds directly to Section 438 of the Code of Criminal Procedure, 1973."
      },
      {
        no: "480",
        title: "When bail may be taken in case of non-bailable offence",
        classification: { type: "Judicial Power", cognizable: "Procedural", bailable: "Judicial Discretion", triable: "Magistrate of First Class" },
        content: "When any person accused of, or suspected of, the commission of any non-bailable offence is arrested or detained without warrant by an officer in charge of a police station or appears or is brought before a Court other than the High Court or Court of Session, he may be released on bail subject to statutory restrictions.",
        note: "Corresponds to Section 437 of the Code of Criminal Procedure, 1973."
      }
    ]
  },
  {
    id: 3,
    shortName: "BSA",
    title: "Bharatiya Sakshya Adhiniyam, 2023",
    actNumber: "Act No. 47 of 2023",
    year: 2023,
    enactmentDate: "Effective 1 July 2024",
    ministry: "Ministry of Law and Justice",
    category: "Criminal",
    desc: "Replaces the Indian Evidence Act, 1872. Expands rules of admissibility to electronic records, digital signatures, server logs, mobile communications, and cloud databases as primary and secondary evidence.",
    sectionsCount: 170,
    chaptersCount: 12,
    isNew: true,
    popular: true,
    icon: "📑",
    chapters: [
      "Chapter I: Preliminary",
      "Chapter II: Relevancy of Facts",
      "Chapter V: Documentary and Electronic Evidence (Sec 56–73)",
      "Chapter IX: Of Witnesses & Expert Opinion"
    ],
    sections: [
      {
        no: "61",
        title: "Admissibility of electronic or digital record as evidence",
        classification: { type: "Evidentiary Rule", cognizable: "N/A", bailable: "N/A", triable: "All Courts" },
        content: "Nothing in this Adhiniyam shall apply to deny the admissibility of an electronic or digital record in evidence on the ground that it is an electronic or digital record and such record shall have the same legal effect, validity and enforceability as other documents.",
        note: "Core section equating electronic evidence with traditional documentary evidence."
      },
      {
        no: "63",
        title: "Conditions for admissibility of electronic records (Certificate)",
        classification: { type: "Evidentiary Condition", cognizable: "N/A", bailable: "N/A", triable: "All Courts" },
        content: "Any information contained in an electronic record which is printed on a paper, stored, recorded or copied in optical or magnetic media shall be deemed to be also a document, if the conditions specified in this section are satisfied in relation to the information and computer in question, accompanied by a certificate as provided in the Schedule.",
        note: "Corresponds directly to Section 65B of the repealed Indian Evidence Act, 1872 (Arjun Panditrao Khotkar precedent)."
      }
    ]
  },
  {
    id: 4,
    shortName: "COI",
    title: "The Constitution of India, 1950",
    actNumber: "Supreme Law of India",
    year: 1950,
    enactmentDate: "Effective 26 January 1950",
    ministry: "Ministry of Law and Justice",
    category: "Constitutional",
    desc: "The supreme legal charter of the Republic of India laying down the framework defining fundamental political code, fundamental rights, directive principles, powers of organs of state, and judicial review.",
    sectionsCount: 448,
    chaptersCount: 25,
    isNew: false,
    popular: true,
    icon: "🏛️",
    chapters: [
      "Part III: Fundamental Rights (Articles 12 to 35)",
      "Part IV: Directive Principles of State Policy (Articles 36 to 51)",
      "Part V: The Union Judiciary — Supreme Court (Articles 124 to 147)",
      "Part VI: High Courts in the States (Articles 214 to 232)"
    ],
    sections: [
      {
        no: "Art. 14",
        title: "Equality before law and equal protection of the laws",
        classification: { type: "Fundamental Right", cognizable: "Constitutional", bailable: "N/A", triable: "High Courts & Supreme Court" },
        content: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.",
        note: "Cornerstone of Indian constitutional jurisprudence prohibiting arbitrariness (E.P. Royappa)."
      },
      {
        no: "Art. 21",
        title: "Protection of life and personal liberty",
        classification: { type: "Fundamental Right", cognizable: "Constitutional", bailable: "N/A", triable: "High Courts & Supreme Court" },
        content: "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
        note: "Expanded by Supreme Court in Maneka Gandhi, Puttaswamy (Right to Privacy), and DK Basu."
      },
      {
        no: "Art. 32",
        title: "Remedies for enforcement of Fundamental Rights (Supreme Court Writs)",
        classification: { type: "Constitutional Remedy", cognizable: "Constitutional", bailable: "N/A", triable: "Supreme Court of India" },
        content: "(1) The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed.\n(2) The Supreme Court shall have power to issue directions or orders or writs, including writs in the nature of habeas corpus, mandamus, prohibition, quo warranto and certiorari.",
        note: "Dr. B.R. Ambedkar described Article 32 as the 'Heart and Soul of the Constitution'."
      },
      {
        no: "Art. 226",
        title: "Power of High Courts to issue certain writs",
        classification: { type: "Constitutional Remedy", cognizable: "Constitutional", bailable: "N/A", triable: "High Courts" },
        content: "Notwithstanding anything in Article 32, every High Court shall have powers throughout the territories in relation to which it exercise jurisdiction, to issue to any person or authority instructions or writs for the enforcement of fundamental rights and for any other purpose.",
        note: "Jurisdiction of High Courts under Art. 226 is wider than Art. 32 as it covers 'for any other purpose'."
      }
    ]
  },
  {
    id: 5,
    shortName: "CPC",
    title: "Code of Civil Procedure, 1908",
    actNumber: "Act No. 5 of 1908",
    year: 1908,
    enactmentDate: "Effective 1 January 1909",
    ministry: "Ministry of Law and Justice",
    category: "Civil",
    desc: "The procedural law administering civil suits, decree execution, jurisdiction, temporary injunctions, pleadings, appeals, and revision in Indian civil courts.",
    sectionsCount: 158,
    chaptersCount: 11,
    isNew: false,
    popular: true,
    icon: "⚖️",
    chapters: [
      "Part I: Suits in General (Sections 9 to 35B)",
      "Part II: Execution of Decrees (Sections 36 to 74)",
      "First Schedule: Order I to Order LI (Pleadings, Injunctions, Appeals)"
    ],
    sections: [
      {
        no: "9",
        title: "Courts to try all civil suits unless barred",
        classification: { type: "Jurisdiction", cognizable: "Civil", bailable: "N/A", triable: "Civil Courts" },
        content: "The Courts shall have jurisdiction to try all suits of a civil nature excepting suits of which their cognizance is either expressly or impliedly barred.",
        note: "Foundation of civil court plenary jurisdiction across India."
      },
      {
        no: "11",
        title: "Res Judicata",
        classification: { type: "Legal Doctrine", cognizable: "Civil", bailable: "N/A", triable: "Civil Courts" },
        content: "No Court shall try any suit or issue in which the matter directly and substantially in issue has been directly and substantially in issue in a former suit between the same parties, or between parties under whom they or any of them claim, litigating under the same title.",
        note: "Prevents multiplicity of proceedings and harassment of litigants."
      },
      {
        no: "Order 39 R 1 & 2",
        title: "Temporary Injunctions and Interlocutory Orders",
        classification: { type: "Interim Relief", cognizable: "Civil", bailable: "N/A", triable: "Civil Courts" },
        content: "Where in any suit it is proved by affidavit or otherwise that any property in dispute in a suit is in danger of being wasted, damaged or alienated by any party to the suit, or that the defendant threatens to dispossess the plaintiff, the Court may grant a temporary injunction.",
        note: "Requires three tests: Prima facie case, Balance of convenience, Irreparable injury (Dalpat Kumar)."
      }
    ]
  },
  {
    id: 6,
    shortName: "NI Act",
    title: "Negotiable Instruments Act, 1881",
    actNumber: "Act No. 26 of 1881",
    year: 1881,
    enactmentDate: "Effective 1 March 1882",
    ministry: "Ministry of Finance",
    category: "Commercial",
    desc: "Governs promissory notes, bills of exchange, cheques, and penal liability for dishonour of cheques for insufficiency of funds under Section 138 with interim compensation under Section 143A.",
    sectionsCount: 148,
    chaptersCount: 17,
    isNew: false,
    popular: true,
    icon: "💰",
    chapters: [
      "Chapter XVII: Penalties in case of Dishonour of Certain Cheques for Insufficiency of Funds (Sections 138 to 148)"
    ],
    sections: [
      {
        no: "138",
        title: "Dishonour of cheque for insufficiency, etc., of funds in the account",
        classification: { type: "Penal Provision", cognizable: "Non-Cognizable", bailable: "Bailable", triable: "Judicial Magistrate of First Class / Metropolitan Magistrate" },
        content: "Where any cheque drawn by a person on an account maintained by him with a banker for payment of any amount of money to another person from out of that account for the discharge, in whole or in part, of any debt or other liability, is returned by the bank unpaid, such person shall be deemed to have committed an offence and shall be punished with imprisonment for a term which may be extended to two years, or with fine which may extend to twice the amount of the cheque, or with both.\nProvided that:\n(a) Cheque presented within validity period;\n(b) Demand notice issued within 30 days of memo;\n(c) Drawer fails to pay within 15 days of notice.",
        note: "Notice period of 15 days is mandatory. Cause of action arises on 16th day."
      },
      {
        no: "139",
        title: "Presumption in favour of holder",
        classification: { type: "Legal Presumption", cognizable: "Commercial", bailable: "N/A", triable: "Trial Court" },
        content: "It shall be presumed, unless the contrary is proved, that the holder of a cheque received the cheque of the nature referred to in section 138 for the discharge, in whole or in part, of any debt or other liability.",
        note: "Statutory reverse burden of proof on the accused drawer (Rangappa v. Sri Mohan)."
      },
      {
        no: "143A",
        title: "Power to direct interim compensation",
        classification: { type: "Interim Relief", cognizable: "Commercial", bailable: "N/A", triable: "Trial Court" },
        content: "Notwithstanding anything contained in the Code of Criminal Procedure, 1973, the Court trying an offence under section 138 may order the drawer of the cheque to pay interim compensation to the complainant not exceeding twenty per cent of the amount of the cheque.",
        note: "Introduced by 2018 amendment to alleviate delays for complainants."
      }
    ]
  },
  {
    id: 7,
    shortName: "HMA",
    title: "Hindu Marriage Act, 1955",
    actNumber: "Act No. 25 of 1955",
    year: 1955,
    enactmentDate: "Effective 18 May 1955",
    ministry: "Ministry of Law and Justice",
    category: "Family",
    desc: "Codifies laws relating to marriage, restitution of conjugal rights, judicial separation, void and voidable marriages, divorce grounds, and permanent alimony amongst Hindus, Buddhists, Jains, and Sikhs.",
    sectionsCount: 30,
    chaptersCount: 6,
    isNew: false,
    popular: true,
    icon: "💍",
    chapters: [
      "Chapter I: Preliminary",
      "Chapter II: Hindu Marriages (Sec 5 to 8)",
      "Chapter III: Restitution of Conjugal Rights and Judicial Separation (Sec 9 & 10)",
      "Chapter IV: Nullity of Marriage and Divorce (Sec 11 to 13B)",
      "Chapter V: Jurisdiction and Procedure (Sec 19 to 28)"
    ],
    sections: [
      {
        no: "9",
        title: "Restitution of conjugal rights",
        classification: { type: "Matrimonial Remedy", cognizable: "Civil/Family", bailable: "N/A", triable: "Family Court / Principal Civil Court" },
        content: "When either the husband or the wife has, without reasonable excuse, withdrawn from the society of the other, the aggrieved party may apply, by petition to the district court, for restitution of conjugal rights and the court, on being satisfied of the truth of the statements made in such petition, may decree restitution of conjugal rights accordingly.",
        note: "Burden of proving reasonable excuse lies on the withdrawing spouse."
      },
      {
        no: "13",
        title: "Divorce on grounds of cruelty, adultery, desertion",
        classification: { type: "Matrimonial Dissolution", cognizable: "Civil/Family", bailable: "N/A", triable: "Family Court" },
        content: "(1) Any marriage solemnized, whether before or after the commencement of this Act, may, on a petition presented by either the husband or the wife, be dissolved by a decree of divorce on the ground that the other party—\n(ia) has treated the petitioner with cruelty;\n(ib) has deserted the petitioner for a continuous period of not less than two years;\n(v) has been suffering from venereal disease in a communicable form;\n(vi) has renounced the world by entering any religious order.",
        note: "Mental cruelty encompasses sustained systemic abuse and dowry harassment."
      },
      {
        no: "13B",
        title: "Divorce by mutual consent",
        classification: { type: "Matrimonial Dissolution", cognizable: "Civil/Family", bailable: "N/A", triable: "Family Court" },
        content: "(1) Subject to the provisions of this Act a petition for dissolution of marriage by a decree of divorce may be presented to the district court by both the parties to a marriage together on the ground that they have been living separately for a period of one year or more, and that they have not been able to live together and that they have mutually agreed that the marriage should be dissolved.",
        note: "Cooling-off period of six months can be waived by Family Court / High Court (Amardeep Singh v. Harveen Kaur)."
      },
      {
        no: "24",
        title: "Maintenance pendente lite and expenses of proceedings",
        classification: { type: "Interim Relief", cognizable: "Civil/Family", bailable: "N/A", triable: "Family Court" },
        content: "Where in any proceeding under this Act it appears to the court that either the wife or the husband has no independent income sufficient for her or his support, the court may order the respondent to pay to the petitioner the expenses of the proceeding and monthly maintenance during the proceeding.",
        note: "Ensures neither party is incapacitated from legal representation."
      }
    ]
  },
  {
    id: 8,
    shortName: "TPA",
    title: "Transfer of Property Act, 1882",
    actNumber: "Act No. 4 of 1882",
    year: 1882,
    enactmentDate: "Effective 1 July 1882",
    ministry: "Ministry of Law and Justice",
    category: "Property",
    desc: "Regulates transfer of immovable property by act of parties including sale, mortgage, lease, exchange, gift, and actionable claims in India.",
    sectionsCount: 137,
    chaptersCount: 8,
    isNew: false,
    popular: true,
    icon: "🏠",
    chapters: [
      "Chapter II: Of Transfers of Property by Act of Parties (Sec 5 to 53A)",
      "Chapter III: Of Sales of Immovable Property (Sec 54 to 57)",
      "Chapter IV: Of Mortgages of Immovable Property and Charges (Sec 58 to 104)",
      "Chapter V: Of Leases of Immovable Property (Sec 105 to 117)",
      "Chapter VII: Of Gifts (Sec 122 to 129)"
    ],
    sections: [
      {
        no: "53A",
        title: "Part Performance",
        classification: { type: "Equitable Doctrine", cognizable: "Property", bailable: "N/A", triable: "Civil Courts" },
        content: "Where any person contracts to transfer for consideration any immovable property by writing signed by him or on his behalf, and the transferee has, in part performance of the contract, taken possession of the property, the transferor shall be debarred from enforcing against the transferee any right in respect of the property.",
        note: "Requires registered contract under 2001 Registration Amendment."
      },
      {
        no: "54",
        title: "Sale defined and transfer how effected",
        classification: { type: "Substantive Transfer", cognizable: "Property", bailable: "N/A", triable: "Civil Courts" },
        content: "'Sale' is a transfer of ownership in exchange for a price paid or promised or part-paid and part-promised.\nSuch transfer, in the case of tangible immovable property of the value of one hundred rupees and upwards, can be made only by a registered instrument.",
        note: "Agreement to sell does not confer title; registered conveyance deed is mandatory."
      },
      {
        no: "105",
        title: "Lease defined",
        classification: { type: "Tenancy / Possession", cognizable: "Property", bailable: "N/A", triable: "Civil Courts / Rent Tribunals" },
        content: "A lease of immovable property is a transfer of a right to enjoy such property, made for a certain time, express or implied, or in perpetuity, in consideration of a price paid or promised, or of money, a share of crops, service or any other thing of value.",
        note: "Forms statutory basis of residential and commercial lease agreements in India."
      },
      {
        no: "122",
        title: "Gift defined and transfer how effected",
        classification: { type: "Substantive Transfer", cognizable: "Property", bailable: "N/A", triable: "Civil Courts" },
        content: "'Gift' is the transfer of certain existing movable or immovable property made voluntarily and without consideration, by one person, called the donor, to another, called the donee, and accepted by or on behalf of the donee during lifetime of donor.",
        note: "Gift of immovable property requires registered deed attested by minimum two witnesses."
      }
    ]
  },
  {
    id: 9,
    shortName: "RERA",
    title: "Real Estate (Regulation and Development) Act, 2016",
    actNumber: "Act No. 16 of 2016",
    year: 2016,
    enactmentDate: "Effective 1 May 2017",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Property",
    desc: "Protects home buyers, mandates registration of real estate projects, establishes escrow accounts (70% funds rule), and provides speedy adjudication of refunds and interest for delayed possession.",
    sectionsCount: 92,
    chaptersCount: 10,
    isNew: false,
    popular: true,
    icon: "🏗️",
    chapters: [
      "Chapter II: Registration of Real Estate Project & Real Estate Agents",
      "Chapter III: Functions and Duties of Promoter (Sec 11 to 18)",
      "Chapter V: The Real Estate Regulatory Authority (RERA)",
      "Chapter VII: The Real Estate Appellate Tribunal"
    ],
    sections: [
      {
        no: "3",
        title: "Prior registration of real estate project with Real Estate Regulatory Authority",
        classification: { type: "Statutory Requirement", cognizable: "Regulatory", bailable: "N/A", triable: "RERA Authority" },
        content: "No promoter shall advertise, market, book, sell or offer for sale, or invite persons to purchase in any manner any plot, apartment or building in any real estate project without registering the real estate project with the Real Estate Regulatory Authority.",
        note: "Applies to projects with land area exceeding 500 square meters or more than 8 apartments."
      },
      {
        no: "18",
        title: "Return of amount and compensation for delayed possession",
        classification: { type: "Consumer Remedy", cognizable: "Regulatory", bailable: "N/A", triable: "RERA Adjudicating Officer" },
        content: "If the promoter fails to complete or is unable to give possession of an apartment, plot or building in accordance with the terms of the agreement for sale, he shall be liable on demand to the allottees to return the amount received with interest at prescribed rate including compensation.",
        note: "Landmark provision empowering flat buyers to withdraw with refund or claim monthly interest."
      }
    ]
  },
  {
    id: 10,
    shortName: "CPA",
    title: "Consumer Protection Act, 2019",
    actNumber: "Act No. 35 of 2019",
    year: 2019,
    enactmentDate: "Effective 20 July 2020",
    ministry: "Ministry of Consumer Affairs, Food and Public Distribution",
    category: "Commercial",
    desc: "Replaced Consumer Protection Act 1986. Introduces Central Consumer Protection Authority (CCPA), e-filing (e-Daakhil), strict product liability, and jurisdiction up to ₹1 Crore for District Commissions.",
    sectionsCount: 107,
    chaptersCount: 8,
    isNew: false,
    popular: true,
    icon: "🛍️",
    chapters: [
      "Chapter II: Consumer Protection Councils",
      "Chapter III: Central Consumer Protection Authority (CCPA)",
      "Chapter IV: Consumer Disputes Redressal Commission (Sec 28 to 73)",
      "Chapter VI: Product Liability (Sec 82 to 87)"
    ],
    sections: [
      {
        no: "35",
        title: "Manner in which complaint shall be made to District Commission",
        classification: { type: "Complaint Procedure", cognizable: "Consumer Law", bailable: "N/A", triable: "District Consumer Disputes Redressal Commission" },
        content: "A complaint, in relation to any goods sold or delivered or agreed to be sold or delivered or any service provided or agreed to be provided, may be filed with a District Commission by the consumer, or any recognised consumer association, or Central/State Government electronically.",
        note: "Allows filing where complainant resides or works for gain."
      },
      {
        no: "82",
        title: "Application of Chapter on Product Liability",
        classification: { type: "Manufacturer Liability", cognizable: "Civil Redressal", bailable: "N/A", triable: "Consumer Commission" },
        content: "This Chapter shall apply to every action which is brought by a complainant against a product manufacturer or a product seller or a product service provider for harm caused by a defective product manufactured, sold or serviced.",
        note: "Strict product liability without necessity of proving fault or fraudulent intent."
      }
    ]
  },
  {
    id: 11,
    shortName: "CA 2013",
    title: "Companies Act, 2013",
    actNumber: "Act No. 18 of 2013",
    year: 2013,
    enactmentDate: "Effective 12 September 2013",
    ministry: "Ministry of Corporate Affairs",
    category: "Corporate",
    desc: "The primary legislation governing incorporation, governance, directors' duties, financial auditing, corporate social responsibility (CSR), oppression and mismanagement, and NCLT / NCLAT jurisdiction.",
    sectionsCount: 470,
    chaptersCount: 29,
    isNew: false,
    popular: true,
    icon: "🏢",
    chapters: [
      "Chapter II: Incorporation of Company and Matters Incidental Thereto",
      "Chapter IX: Accounts of Companies (Sec 135 CSR)",
      "Chapter XI: Appointment and Qualifications of Directors",
      "Chapter XVI: Prevention of Oppression and Mismanagement (Sec 241 to 246)",
      "Chapter XXVII: National Company Law Tribunal and Appellate Tribunal (Sec 407 to 434)"
    ],
    sections: [
      {
        no: "135",
        title: "Corporate Social Responsibility (CSR)",
        classification: { type: "Statutory Mandate", cognizable: "Corporate Compliance", bailable: "N/A", triable: "NCLT / RoC" },
        content: "Every company having net worth of rupees five hundred crore or more, or turnover of rupees one thousand crore or more or a net profit of rupees five crore or more during the immediately preceding financial year shall constitute a Corporate Social Responsibility Committee and spend at least two per cent of average net profits on CSR policies.",
        note: "Mandatory statutory CSR spending under Schedule VII."
      },
      {
        no: "166",
        title: "Duties of Directors",
        classification: { type: "Fiduciary Duty", cognizable: "Corporate Law", bailable: "N/A", triable: "NCLT / Civil Courts" },
        content: "(1) A director of a company shall act in accordance with the articles of the company.\n(2) A director of a company shall act in good faith in order to promote the objects of the company for the benefit of its members as a whole, and in the best interests of the company, its employees, the shareholders, the community and for the protection of environment.",
        note: "Fiduciary standards codified; breach attracts penalties and disqualification."
      },
      {
        no: "241",
        title: "Application to Tribunal for relief in cases of oppression, etc.",
        classification: { type: "Tribunal Remedy", cognizable: "Corporate Litigation", bailable: "N/A", triable: "National Company Law Tribunal (NCLT)" },
        content: "Any member of a company who complains that the affairs of the company have been or are being conducted in a manner prejudicial to public interest or in a manner prejudicial or oppressive to him or any other member may apply to the Tribunal.",
        note: "Core section for shareholder oppression and management disputes (Tata v. Cyrus Mistry)."
      }
    ]
  },
  {
    id: 12,
    shortName: "POCSO",
    title: "Protection of Children from Sexual Offences Act, 2012",
    actNumber: "Act No. 32 of 2012",
    year: 2012,
    enactmentDate: "Effective 14 November 2012",
    ministry: "Ministry of Women and Child Development",
    category: "Special Laws",
    desc: "A child-centric special enactment protecting children under 18 years from sexual assault, harassment, and pornography, mandating Special POCSO Courts and child-friendly trial procedures.",
    sectionsCount: 46,
    chaptersCount: 9,
    isNew: false,
    popular: true,
    icon: "🛡️",
    chapters: [
      "Chapter II: Sexual Offences against Children (Sec 3 to 12)",
      "Chapter V: Procedure for Reporting of Cases (Sec 19 to 23)",
      "Chapter VII: Special Courts (Sec 28 to 32)"
    ],
    sections: [
      {
        no: "4",
        title: "Punishment for penetrative sexual assault",
        classification: { type: "Penal Provision", cognizable: "Cognizable", bailable: "Non-Bailable", triable: "Special POCSO Court" },
        content: "Whoever commits penetrative sexual assault shall be punished with rigorous imprisonment for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine.",
        note: "Aggravated assault on children under 12 or 16 can invite death penalty under 2019 amendment."
      },
      {
        no: "19",
        title: "Mandatory reporting of sexual offences",
        classification: { type: "Statutory Obligation", cognizable: "Cognizable", bailable: "Bailable", triable: "Special Court" },
        content: "Notwithstanding anything contained in the Code of Criminal Procedure, 1973, any person, including doctors, hospital staff, teachers, or parents, who has apprehension that an offence under this Act has been committed shall provide such information to Special Juvenile Police Unit or local police.",
        note: "Failure to report under Sec 21 is a punishable criminal offence."
      }
    ]
  },
  {
    id: 13,
    shortName: "IT Act",
    title: "Information Technology Act, 2000",
    actNumber: "Act No. 21 of 2000",
    year: 2000,
    enactmentDate: "Effective 17 October 2000",
    ministry: "Ministry of Electronics and Information Technology",
    category: "Commercial",
    desc: "The primary cyber law in India conferring legal recognition to electronic transactions, digital signatures, cyber terrorism, hacking, data privacy, and intermediary liability under Section 79.",
    sectionsCount: 94,
    chaptersCount: 13,
    isNew: false,
    popular: true,
    icon: "💻",
    chapters: [
      "Chapter II: Digital Signature and Electronic Signature",
      "Chapter IX: Penalties, Compensation and Adjudication",
      "Chapter XI: Offences (Sec 65 to 78)",
      "Chapter XII: Intermediaries Not to be Liable in Certain Cases (Sec 79)"
    ],
    sections: [
      {
        no: "43",
        title: "Penalty and compensation for damage to computer system",
        classification: { type: "Civil / Compensatory", cognizable: "Civil Penal", bailable: "N/A", triable: "Adjudicating Officer" },
        content: "If any person without permission of the owner or person in charge of computer secures access, downloads, copies, or introduces computer virus, he shall be liable to pay compensation to the person so affected.",
        note: "Civil foundation for cyber damages and unauthorised access."
      },
      {
        no: "66D",
        title: "Punishment for cheating by personation by using computer resource",
        classification: { type: "Penal Provision", cognizable: "Cognizable", bailable: "Bailable", triable: "Magistrate of First Class" },
        content: "Whoever, by means of any communication device or computer resource, cheats by personation, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.",
        note: "Commonly invoked in online OTP frauds, fake profiling, and banking cyber scams."
      },
      {
        no: "79",
        title: "Exemption from liability of intermediary in certain cases (Safe Harbour)",
        classification: { type: "Safe Harbour Immunity", cognizable: "Commercial / Tech", bailable: "N/A", triable: "All Courts" },
        content: "An intermediary shall not be liable for any third party information, data, or communication link made available or hosted by him if the intermediary function is limited to providing access and observes due diligence.",
        note: "Safe harbour protection subject to IT Rules 2021 and court takedown orders (Shreya Singhal)."
      }
    ]
  },
  {
    id: 14,
    shortName: "IBC",
    title: "Insolvency and Bankruptcy Code, 2016",
    actNumber: "Act No. 31 of 2016",
    year: 2016,
    enactmentDate: "Effective 28 May 2016",
    ministry: "Ministry of Corporate Affairs",
    category: "Commercial",
    desc: "Consolidates and amends laws relating to reorganization and insolvency resolution of corporate persons, partnership firms, and individuals in a time-bound manner (CIRP under NCLT).",
    sectionsCount: 255,
    chaptersCount: 5,
    isNew: false,
    popular: true,
    icon: "📊",
    chapters: [
      "Part II: Insolvency Resolution and Liquidation for Corporate Persons (Sec 4 to 77)",
      "Chapter II: Corporate Insolvency Resolution Process (CIRP)",
      "Chapter III: Liquidation Process"
    ],
    sections: [
      {
        no: "7",
        title: "Initiation of corporate insolvency resolution process by financial creditor",
        classification: { type: "Insolvency Application", cognizable: "Commercial", bailable: "N/A", triable: "National Company Law Tribunal (NCLT)" },
        content: "A financial creditor either by itself or jointly with other financial creditors may file an application for initiating corporate insolvency resolution process against a corporate debtor before the Adjudicating Authority when a default has occurred.",
        note: "Default threshold is ₹1 Crore (post-2020 amendment)."
      },
      {
        no: "14",
        title: "Moratorium",
        classification: { type: "Statutory Injunction", cognizable: "Commercial", bailable: "N/A", triable: "NCLT" },
        content: "Subject to provisions of sub-sections (2) and (3), on the insolvency commencement date, the Adjudicating Authority shall by order declare moratorium prohibiting the institution of suits or continuation of pending suits or proceedings against the corporate debtor.",
        note: "Moratorium prevents asset stripping and protects company during 330-day CIRP period."
      }
    ]
  },
  {
    id: 15,
    shortName: "PWDVA",
    title: "Protection of Women from Domestic Violence Act, 2005",
    actNumber: "Act No. 43 of 2005",
    year: 2005,
    enactmentDate: "Effective 26 October 2006",
    ministry: "Ministry of Women and Child Development",
    category: "Family",
    desc: "Enacted to provide more effective protection of the rights of women guaranteed under the Constitution who are victims of violence of any kind occurring within the family, including residence and monetary reliefs.",
    sectionsCount: 37,
    chaptersCount: 5,
    isNew: false,
    popular: true,
    icon: "👩",
    chapters: [
      "Chapter II: Domestic Violence (Sec 3)",
      "Chapter IV: Procedure for Obtaining Orders of Reliefs (Sec 12 to 29)"
    ],
    sections: [
      {
        no: "12",
        title: "Application to Magistrate",
        classification: { type: "Statutory Application", cognizable: "Civil / Quasi-Criminal", bailable: "N/A", triable: "Judicial Magistrate of First Class" },
        content: "An aggrieved person or a Protection Officer or any other person on behalf of the aggrieved person may present an application to the Magistrate seeking one or more reliefs under this Act.",
        note: "Magistrate shall take into consideration any domestic incident report submitted by Protection Officer."
      },
      {
        no: "19",
        title: "Residence Orders",
        classification: { type: "Protective Relief", cognizable: "Civil / Family", bailable: "N/A", triable: "Magistrate of First Class" },
        content: "The Magistrate may, on being satisfied that domestic violence has taken place, pass a residence order restraining the respondent from dispossessing or in any other manner disturbing the possession of the aggrieved person from the shared household.",
        note: "Protects right to reside in shared household regardless of legal title (Satish Chander Ahuja)."
      }
    ]
  },
  {
    id: 16,
    shortName: "MV Act",
    title: "Motor Vehicles Act, 1988",
    actNumber: "Act No. 59 of 1988",
    year: 1988,
    enactmentDate: "Effective 1 July 1989",
    ministry: "Ministry of Road Transport and Highways",
    category: "Special Laws",
    desc: "Comprehensive statute regulating vehicular licensing, registration, road safety, vehicle standards, motor accident claims tribunals (MACT), and compulsory third-party insurance.",
    sectionsCount: 217,
    chaptersCount: 14,
    isNew: false,
    popular: true,
    icon: "🚗",
    chapters: [
      "Chapter XI: Insurance of Motor Vehicles against Third Party Risks (Sec 145 to 164)",
      "Chapter XII: Claims Tribunals (Sec 165 to 176)",
      "Chapter XIII: Offences, Penalties and Procedure (Sec 177 to 210D)"
    ],
    sections: [
      {
        no: "166",
        title: "Application for compensation in Motor Accident Claims Tribunal (MACT)",
        classification: { type: "Accident Claim", cognizable: "Civil / Statutory", bailable: "N/A", triable: "Motor Accident Claims Tribunal (MACT)" },
        content: "An application for compensation arising out of an accident of the nature specified in sub-section (1) of section 165 may be made by the person who has sustained the injury or by the legal representatives of the deceased to the Claims Tribunal having jurisdiction.",
        note: "Application must be filed within 6 months from accident date as per 2019 amendment."
      },
      {
        no: "161",
        title: "Special provisions as to compensation in case of hit and run motor accident",
        classification: { type: "Statutory Scheme", cognizable: "Social Welfare", bailable: "N/A", triable: "Solatium Fund Scheme / Claims Tribunal" },
        content: "The Central Government shall provide for the payment of compensation in respect of the death of, or grievous hurt to, persons resulting from hit and run motor accidents (₹2 Lakhs for death, ₹50,000 for grievous hurt).",
        note: "Enhanced statutory solatium compensation for hit and run victims."
      }
    ]
  }
];

