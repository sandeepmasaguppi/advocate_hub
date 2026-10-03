// ============================================================
//  legalNewsData.js — Comprehensive Indian Legal & Judicial News
//  LiveLaw & Bar and Bench caliber statutory & constitutional updates:
//  Supreme Court Constitution Bench judgments, High Court landmark rulings,
//  BNSS/BNS criminal law updates, bail jurisprudence, and commercial verdicts.
// ============================================================

export const NEWS_CATEGORIES_EN = [
  "All",
  "Supreme Court",
  "High Courts",
  "Criminal Law",
  "Constitutional",
  "Commercial & Corporate",
  "Family & Civil"
];

export const NEWS_CATEGORIES_KN = [
  "ಎಲ್ಲಾ",
  "ಸುಪ್ರೀಂ ಕೋರ್ಟ್",
  "ಹೈಕೋರ್ಟ್‌ಗಳು",
  "ಕ್ರಿಮಿನಲ್ ಕಾನೂನು",
  "ಸಂವಿಧಾನ",
  "ವಾಣಿಜ್ಯ & ಕಾರ್ಪೊರೇಟ್",
  "ಕೌಟುಂಬಿಕ & ಸಿವಿಲ್"
];

export const LEGAL_NEWS_DATA = [
  {
    id: 1,
    title: "Supreme Court: Section 479 BNSS on Maximum Undertrial Detention Applies Retrospectively Across All Indian Prisons",
    titleKn: "ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪು: ವಿಚಾರಣಾಧೀನ ಕೈದಿಗಳಿಗೆ ಜಾಮೀನು ನೀಡುವ BNSS ಸೆಕ್ಷನ್ 479 ಪೂರ್ವಾನ್ವಯವಾಗಿ ಅನ್ವಯ",
    category: "Criminal Law",
    court: "Supreme Court of India",
    bench: "Justice Hima Kohli & Justice Sandeep Mehta",
    citation: "2024 INSC 628 • WP (Civil) No. 406/2013",
    date: "August 23, 2024",
    author: "Supreme Court Judicial Bureau",
    readTime: "4 min read",
    statutes: ["Section 479 BNSS 2023", "Section 436A CrPC 1973", "Article 21"],
    isBreaking: true,
    isTrending: true,
    isLandmark: true,
    summary: "In a historic victory for prison decongestion, the Supreme Court ruled that Section 479 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), allowing first-time undertrial offenders release after 1/3rd detention, applies retrospectively to all pending cases filed prior to July 1, 2024.",
    summaryKn: "ಜುಲೈ ೧, ೨೦೨೪ ಕ್ಕಿಂತ ಮುಂಚಿನ ಪ್ರಕರಣಗಳಲ್ಲಿಯೂ ಮೊದಲ ಬಾರಿಯ ವಿಚಾರಣಾಧೀನ ಕೈದಿಗಳು ಒಟ್ಟು ಶಿಕ್ಷೆಯ ೧/೩ ಭಾಗ ಜೈಲುವಾಸ ಅನುಭವಿಸಿದ್ದರೆ ಜಾಮೀನು ಪಡೆಯಲು ಅರ್ಹರು ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಮಹತ್ವದ ಆದೇಶ ನೀಡಿದೆ.",
    content: `In a landmark order addressing severe prison overcrowding, the Supreme Court ruled that Section 479 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 applies retrospectively to all undertrial prisoners whose criminal proceedings were registered prior to July 1, 2024.

Hearing a Public Interest Litigation concerning inhumane jail conditions across India, the Division Bench held that procedural and beneficent penal provisions designed to safeguard personal liberty under Article 21 must be extended equally to all incarcerated individuals without arbitrary date distinctions.

Section 479 BNSS significantly liberalizes the earlier Section 436A CrPC framework:
1. First-time offenders (accused persons with no previous criminal convictions) are entitled to mandatory release on personal bond with or without sureties after undergoing detention for one-third of the maximum imprisonment period.
2. Other undertrials continue to be eligible for release upon completing one-half of the statutory term, excluding capital or life imprisonment charges.

The Apex Court issued a strict time-bound writ directing Jail Superintendents across all states and Union Territories to review every undertrial record, identify eligible prisoners within 3 months, and transmit applications directly to jurisdictional Magistrates and Sessions Courts.`,
    keyTakeaways: [
      "Retrospective applicability: Benefits of BNSS Sec 479 apply to all existing FIRs and chargesheets filed before July 1, 2024.",
      "First-time offenders: Maximum pre-trial detention capped at 1/3rd of prescribed term instead of earlier 1/2 threshold.",
      "Mandatory duty on jail superintendents: Prison authorities are obligated to independently apply to the trial court for bail.",
      "Constitutional foundation: Rooted firmly in Article 21's guarantee of speedy trial and human dignity."
    ]
  },
  {
    id: 2,
    title: "5-Judge Constitution Bench Strikes Down Electoral Bonds Scheme as Unconstitutional and Violative of Article 19(1)(a)",
    titleKn: "ಚುನಾವಣಾ ಬಾಂಡ್‌ಗಳ ಯೋಜನೆ ಅಸಂವಿಧಾನಿಕ: ೫ ನ್ಯಾಯಾಧೀಶರ ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಸಂವಿಧಾನ ಪೀಠದ ಐತಿಹಾಸಿಕ ತೀರ್ಪು",
    category: "Constitutional",
    court: "Supreme Court of India",
    bench: "Dr. D.Y. Chandrachud CJI, Justice Sanjiv Khanna, Justice B.R. Gavai, Justice J.B. Pardiwala, Justice Manoj Misra",
    citation: "(2024) 5 SCC 1 • 2024 INSC 113",
    date: "February 15, 2024",
    author: "Constitutional Law Desk",
    readTime: "6 min read",
    statutes: ["Article 19(1)(a)", "Section 182 Companies Act 2013", "Section 29C RPA 1951"],
    isBreaking: false,
    isTrending: true,
    isLandmark: true,
    summary: "The Supreme Court unanimously declared the Union Government's anonymous Electoral Bonds Scheme unconstitutional, holding that unlimited corporate political funding and voter opacity violate the voter's fundamental Right to Information.",
    summaryKn: "ರಾಜಕೀಯ ಪಕ್ಷಗಳಿಗೆ ನೀಡುವ ಅನಾಮಧೇಯ ದೇಣಿಗೆಯು ಮತದಾರರ ಮಾಹಿತಿ ಹಕ್ಕನ್ನು ಉಲ್ಲಂಘಿಸುತ್ತದೆ ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಚುನಾವಣಾ ಬಾಂಡ್‌ಗಳನ್ನು ರದ್ದುಗೊಳಿಸಿದೆ.",
    content: `A unanimous five-judge Constitution Bench of the Supreme Court of India invalidated the Union's Electoral Bonds Scheme along with amendments made to the Representation of the People Act, 1951, the Income Tax Act, 1961, and the Companies Act, 2013.

Delivering the principal judgment, the Chief Justice affirmed that economic transparency in political contributions is integral to a free, democratic society. The bench held that citizens possess a fundamental Right to Information under Article 19(1)(a) regarding funding sources of political parties contesting democratic mandates.

The court rejected the government's proportionality defence of curbing black money, observing that confidentiality of corporate donors cannot override democratic electoral integrity. The court further struck down amendments allowing loss-making shell corporations to make unlimited political donations, noting that corporate influence differs fundamentally from individual franchise.

The State Bank of India was ordered to cease issuing electoral bonds with immediate effect and submit all purchasing, redemption, and party recipient ledgers to the Election Commission of India for unredacted public publication.`,
    keyTakeaways: [
      "Voter's Right to Information: Political party financing is directly linked to representative democracy under Article 19(1)(a).",
      "Corporate funding curbs: Removing the 7.5% net profit cap under Companies Act Section 182 was held arbitrary and unconstitutional.",
      "Ban on anonymity: Donor identities and beneficiary party redemption dates must remain accessible in public domain.",
      "Strict enforcement: Mandated complete disclosure of all bond serial numbers to cross-match contributions."
    ]
  },
  {
    id: 3,
    title: "Karnataka High Court: No Limitation Period for Wife's Maintenance Petition Under Section 125 CrPC / Section 144 BNSS",
    titleKn: "ಕರ್ನಾಟಕ ಹೈಕೋರ್ಟ್ ಆದೇಶ: ಜೀವನಾಂಶ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಯಾವುದೇ ಕಾಲಮಿತಿ ಇಲ್ಲ (ಸೆಕ್ಷನ್ 125 CrPC / BNSS 144)",
    category: "Family & Civil",
    court: "High Court of Karnataka (Dharwad & Bengaluru)",
    bench: "Justice M. Nagaprasanna",
    citation: "2025 LiveLaw (Kar) 89 • RPFC No. 100245/2024",
    date: "September 12, 2025",
    author: "Bengaluru Legal Bureau",
    readTime: "3 min read",
    statutes: ["Section 125 CrPC", "Section 144 BNSS 2023", "Article 21"],
    isBreaking: false,
    isTrending: true,
    isLandmark: false,
    summary: "The Karnataka High Court ruled that a wife's statutory right to claim maintenance under Section 125 CrPC (now Section 144 BNSS) is a continuous recurring cause of action and cannot be extinguished by delay or laches.",
    summaryKn: "ಪತ್ನಿಯು ಗಂಡನಿಂದ ಜೀವನಾಂಶ ಪಡೆಯಲು ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಯಾವುದೇ ಸಮಯದ ಮಿತಿ ಅನ್ವಯಿಸುವುದಿಲ್ಲ ಮತ್ತು ವಿಳಂಬದ ಕಾರಣದಿಂದ ಅರ್ಜಿಯನ್ನು ತಿರಸ್ಕರಿಸಲಾಗದು ಎಂದು ಕರ್ನಾಟಕ ಹೈಕೋರ್ಟ್ ಸ್ಪಷ್ಟಪಡಿಸಿದೆ.",
    content: `The High Court of Karnataka firmly held that there is no limitation period governing the institution of an application for monthly maintenance by a wife under Section 125 of the Code of Criminal Procedure (and its corresponding Section 144 of the Bharatiya Nagarik Suraksha Sanhita).

The bench dismissed a revision petition filed by a husband who argued that his estranged wife was barred by limitation because she petitioned for maintenance nearly eight years following their formal separation.

Justice M. Nagaprasanna observed that maintenance provisions represent social justice legislation enacted to shield destitute women and children from vagrancy and starvation. The duty of an able-bodied spouse having sufficient means to maintain his wife is a continuous legal and moral obligation under Indian law.

The court reiterated that delay in approaching the Family Court cannot defeat statutory rights to subsistence unless there is established waiver or disentitlement due to self-sufficient independent income.`,
    keyTakeaways: [
      "No period of limitation: Maintenance under Sec 125 CrPC / Sec 144 BNSS is a recurring cause of action.",
      "Social welfare objective: Legislation intended to prevent destitution cannot be defeated by procedural technicalities.",
      "Husband's statutory duty: An able-bodied spouse is legally presumed capable of earning and providing maintenance.",
      "Binding guidance for Karnataka Family Courts: Revision petitions challenging delay in filing maintenance to be summarily dismissed."
    ]
  },
  {
    id: 4,
    title: "Supreme Court 7-Judge Bench: States Empowered to Sub-Classify Scheduled Castes to Ensure Equitable Affirmative Action",
    titleKn: "ಪರಿಶಿಷ್ಟ ಜಾತಿಗಳ ಒಳಮೀಸಲಾತಿ ಕಲ್ಪಿಸಲು ರಾಜ್ಯ ಸರ್ಕಾರಗಳಿಗೆ ಅಧಿಕಾರವಿದೆ: ೭ ನ್ಯಾಯಾಧೀಶರ ಸುಪ್ರೀಂ ಪೀಠ",
    category: "Constitutional",
    court: "Supreme Court of India",
    bench: "7-Judge Constitution Bench (Dr. D.Y. Chandrachud CJI, Justices B.R. Gavai, Vikram Nath, Bela Trivedi, Pankaj Mithal, Manoj Misra, Satish Chandra Sharma)",
    citation: "2024 INSC 562 • Civil Appeal No. 2317/2011",
    date: "August 1, 2024",
    author: "Supreme Court Bureau",
    readTime: "5 min read",
    statutes: ["Article 14", "Article 15(4)", "Article 16(4)", "Article 341"],
    isBreaking: false,
    isTrending: true,
    isLandmark: true,
    summary: "By a 6:1 majority, the Supreme Court overruled its 2004 'E.V. Chinnaiah' precedent, holding that Scheduled Castes do not form a monolithic class and state legislatures possess constitutional competence to create sub-quotas based on empirical backwardness data.",
    summaryKn: "ಪರಿಶಿಷ್ಟ ಜಾತಿಯಲ್ಲಿರುವ ಹೆಚ್ಚು ಹಿಂದುಳಿದ ಸಮುದಾಯಗಳಿಗೆ ಪ್ರತ್ಯೇಕ ಒಳಮೀಸಲಾತಿ ನೀಡುವ ಸಾಂವಿಧಾನಿಕ ಅಧಿಕಾರ ರಾಜ್ಯ ಸರ್ಕಾರಗಳಿಗಿದೆ ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪು ನೀಡಿದೆ.",
    content: `In a landmark ruling on affirmative action, a seven-judge Constitution Bench of the Supreme Court held by a 6:1 majority that states have the constitutional authority to sub-classify Scheduled Castes (SCs) and Scheduled Tribes (STs) to grant targeted quota benefits to the most disadvantaged sub-groups.

Overruling its two-decade-old judgment in E.V. Chinnaiah v. State of Andhra Pradesh (2004), the court clarified that Article 341 of the Constitution only specifies the castes included in the presidential list but does not restrict states from providing preferential treatment under Articles 15(4) and 16(4).

Writing for the majority, the bench underscored that equality is substantively substantive, not merely formal. Historical disadvantages within the SC category differ across occupations, requiring proportional state assistance. However, the court imposed a strict caveat: sub-classification cannot be arbitrary or politically motivated; it must be backed by empirical, quantifiable state demographic data demonstrating inadequate representation.

Justice B.R. Gavai and three concurring judges also observed that the 'creamy layer' principle should ideally be extended to SCs and STs to ensure benefits reach the genuinely marginalized.`,
    keyTakeaways: [
      "Overruling Chinnaiah (2004): Scheduled Castes are not a homogeneous class for affirmative action purposes.",
      "Empirical data mandatory: Sub-categorization must be justified by verifiable state surveys on backwardness and employment shares.",
      "Non-exclusionary requirement: States cannot completely exclude any listed caste from the overall reservation umbrella.",
      "Creamy layer debate: Concurring opinions suggested identification of affluent individuals within reserved groups."
    ]
  },
  {
    id: 5,
    title: "Supreme Court in 'Narayan v. State of MP': Mandatory Restrictive Bail Conditions Do Not Apply to Offences Under 7 Years",
    titleKn: "೭ ವರ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ ಶಿಕ್ಷೆಯ ಅಪರಾಧಗಳಿಗೆ ಕಠಿಣ ಜಾಮೀನು ಷರತ್ತುಗಳು ಕಡ್ಡಾಯವಲ್ಲ: ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಸ್ಪಷ್ಟನೆ",
    category: "Criminal Law",
    court: "Supreme Court of India",
    bench: "Justice Abhay S. Oka & Justice Ujjal Bhuyan",
    citation: "2026 INSC 114 • Criminal Appeal No. 718/2026",
    date: "February 24, 2026",
    author: "Criminal Law Review",
    readTime: "4 min read",
    statutes: ["Section 35 BNSS 2023", "Section 480(3) BNSS 2023", "Section 482 BNSS 2023"],
    isBreaking: true,
    isTrending: false,
    isLandmark: false,
    summary: "The Supreme Court clarified the statutory scheme of Section 480(3) BNSS, holding that mechanical imposition of burdensome bail conditions is impermissible for offences punishable with 7 years imprisonment or less.",
    summaryKn: "ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್‌ಗಳು ಮತ್ತು ವಿಚಾರಣಾ ನ್ಯಾಯಾಲಯಗಳು ಸಣ್ಣ ಅಪರಾಧಗಳಲ್ಲಿ ಆರೋಪಿಗಳಿಗೆ ಅತಿಯಾದ ಕಠಿಣ ಜಾಮೀನು ಷರತ್ತುಗಳನ್ನು ವಿಧಿಸಬಾರದು ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತಿಳಿಸಿದೆ.",
    content: `In an authoritative interpretation of the bail chapter of the Bharatiya Nagarik Suraksha Sanhita (BNSS), the Supreme Court ruled in Narayan v. State of Madhya Pradesh that the statutory conditions listed under Section 480(3) do not automatically govern offences carrying sentences of seven years or less.

The trial court and High Court had imposed onerous pre-conditions—including daily police station reporting and high monetary sureties—while granting bail to an individual accused of property trespass and minor altercation under BNS provisions.

Setting aside the rigid conditions, the bench observed that Section 480(3) of the BNSS corresponds to Section 437(3) of the CrPC and explicitly targets severe offences punishable with death, imprisonment for life, or terms extending to seven years or more.

The Court reiterated the enduring doctrine laid down in Satender Kumar Antil v. CBI: bail is the rule and jail is the exception. Courts must avoid transforming personal liberty into an illusory right through oppressive collateral covenants.`,
    keyTakeaways: [
      "Distinction by sentence severity: Stringent conditions under Section 480(3) BNSS are reserved for grave crimes.",
      "Proportionality in bail: Sureties and reporting frequencies must be calibrated to the socio-economic status of the accused.",
      "Continuity of Antil guidelines: Landmark procedural protections under CrPC remain fully applicable under BNSS 2023.",
      "Relief for undertrials: Prevents denial of effective release due to inability to satisfy unreasonable bail conditions."
    ]
  },
  {
    id: 6,
    title: "Karnataka High Court: Solitary Abusive Text Message Does Not Amount to Stalking Under BNS Sec 78 Without Course of Conduct",
    titleKn: "ಒಂದೇ ಬಾರಿಯ ನಿಂದನೀಯ ಸಂದೇಶವು BNS ಸೆಕ್ಷನ್ 78 ರ ಅಡಿಯಲ್ಲಿ 'ಹಿಂಬಾಲಿಸುವಿಕೆ' (Stalking) ಅಪರಾಧವಾಗುವುದಿಲ್ಲ: ಹೈಕೋರ್ಟ್",
    category: "High Courts",
    court: "High Court of Karnataka (Principal Bench, Bengaluru)",
    bench: "Justice M.I. Arun",
    citation: "2025 LiveLaw (Kar) 142 • Criminal Petition No. 9812/2024",
    date: "July 18, 2025",
    author: "State Legal Bureau",
    readTime: "3 min read",
    statutes: ["Section 78 BNS 2023", "Section 354D IPC 1860", "Section 67 IT Act"],
    isBreaking: false,
    isTrending: false,
    isLandmark: false,
    summary: "The Karnataka High Court quashed stalking charges against an accused, clarifying that an isolated WhatsApp message does not fulfill the statutory requirement of 'repeated or continuous monitoring' mandated under Section 78 of BNS 2023.",
    summaryKn: "BNS ಸೆಕ್ಷನ್ 78 (ಹಿಂದಿನ IPC 354D) ಅನ್ವಯವಾಗಬೇಕಾದರೆ ಮಹಿಳೆಯನ್ನು ನಿರಂತರವಾಗಿ ಅಥವಾ ಪುನರಾವರ್ತಿತವಾಗಿ ಹಿಂಬಾಲಿಸಿರಬೇಕು ಎಂದು ಹೈಕೋರ್ಟ್ ತೀರ್ಪು ನೀಡಿದೆ.",
    content: `Examining the statutory scope of Section 78 of the Bharatiya Nyaya Sanhita (which replaced Section 354D of the Indian Penal Code), the High Court of Karnataka held that an isolated, solitary rude or offensive message does not constitute the penal offence of stalking.

The petitioner had been booked under Section 78 BNS and provisions of the Information Technology Act based on an FIR alleging he sent an insulting text message following a failed commercial arrangement.

Justice M.I. Arun analyzed the statutory wording: 'Whoever follows a woman and contacts, or attempts to contact such woman to foster personal interaction repeatedly despite a clear indication of disinterest.' The court held that the legislature deliberately employed the words 'repeatedly' and 'monitors the use by a woman of the internet'.

A solitary transmission, while potentially actionable under other civil or penal provisions dealing with insult or defamation, fails to satisfy the essential legal ingredient of stalking, which necessitates proof of a persistent pattern of unwanted surveillance.`,
    keyTakeaways: [
      "Essential ingredient of BNS Section 78: Stalking mandates repeated conduct or persistent digital monitoring.",
      "Isolated communication excluded: Single offensive communications cannot be stretched into criminal stalking.",
      "Quashing under BNSS Section 528: High Courts will exercise inherent powers to prevent abuse of penal sections.",
      "Distinction maintained: Clear boundaries drawn between stalking, civil tort, and digital obscenity under the IT Act."
    ]
  },
  {
    id: 7,
    title: "Supreme Court 7-Judge Bench: Unstamped Arbitration Agreements Not Void Ab Initio, Overrules 'NN Global' Decision",
    titleKn: "ಸ್ಟ್ಯಾಂಪ್ ಡ್ಯೂಟಿ ಪಾವತಿಸದ ಮಧ್ಯಸ್ಥಿಕೆ ಒಪ್ಪಂದಗಳು ಸಂಪೂರ್ಣ ಅಮಾನ್ಯವಲ್ಲ: ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಮಹತ್ವದ ತೀರ್ಪು",
    category: "Commercial & Corporate",
    court: "Supreme Court of India",
    bench: "7-Judge Constitution Bench (Dr. D.Y. Chandrachud CJI, Justices S.K. Kaul, Sanjiv Khanna, B.R. Gavai, Surya Kant, J.B. Pardiwala, Manoj Misra)",
    citation: "2024 INSC 10 • Curative Petition (C) No. 44/2023",
    date: "December 13, 2023",
    author: "Arbitration & Commercial Division",
    readTime: "5 min read",
    statutes: ["Section 8 & 11 Arbitration Act 1996", "Section 35 Indian Stamp Act 1899"],
    isBreaking: false,
    isTrending: false,
    isLandmark: true,
    summary: "In a major boost to Indian commercial dispute resolution, a 7-judge Constitution Bench held that unstamped or insufficiently stamped contracts are curable evidentiary defects and do not render an arbitration agreement non-existent at referral stage.",
    summaryKn: "ಕರಾರಿನ ಮೇಲೆ ಸ್ಟ್ಯಾಂಪ್ ಡ್ಯೂಟಿ ಪಾವತಿಸದಿದ್ದರೂ ಮಧ್ಯಸ್ಥಿಕೆ ಪ್ರಕ್ರಿಯೆಯನ್ನು (Arbitration) ತಕ್ಷಣವೇ ಆರಂಭಿಸಬಹುದು ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪು ನೀಡಿದೆ.",
    content: `Delivering a unanimous landmark judgment for Indian and international business contracts, a seven-judge Constitution Bench of the Supreme Court held that insufficiency of stamping does not render an arbitration agreement void ab initio or unenforceable.

The verdict expressly overruled the earlier 3:2 majority ruling in N.N. Global Mercantile Pvt. Ltd. v. Indo Unique Flame Ltd. (2023), which had stalled commercial arbitrations across high courts by mandating full stamp adjudication prior to arbitral appointments.

The bench harmonized the Indian Stamp Act, 1899 with the Arbitration and Conciliation Act, 1996:
1. Under the Stamp Act, unstamped documents are merely inadmissible in evidence—a curable fiscal irregularity upon payment of stamp duty and statutory penalty.
2. Under Section 11(6A) of the Arbitration Act, judicial intervention at the pre-referral threshold is restricted solely to examining the 'prima facie existence' of the arbitration agreement.

The Supreme Court emphasized the principle of kompetenz-kompetenz: issues of stamping, admissibility, and document impounding should be determined by the arbitral tribunal rather than preliminary referral courts.`,
    keyTakeaways: [
      "Commercial efficiency restored: Stamping objections will not paralyze Section 11 arbitrator appointments.",
      "Curable defect doctrine: Non-stamping affects evidentiary admissibility, not substantive contractual existence.",
      "Arbitral tribunal competence: Arbitrators have jurisdiction to impound documents and collect deficit stamp fees.",
      "Global arbitration benchmark: Aligns Indian dispute resolution with international pro-arbitration standards."
    ]
  },
  {
    id: 8,
    title: "Supreme Court Overhauls Cheque Bounce Trial Procedures: Mandatory Compounding Windows and Strict Section 143A Orders",
    titleKn: "ಚೆಕ್ ಬೌನ್ಸ್ (NI Act 138) ಪ್ರಕರಣಗಳ ತ್ವರಿತ ವಿಲೇವಾರಿಗೆ ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಹೊಸ ಮಾರ್ಗಸೂಚಿ",
    category: "Commercial & Corporate",
    court: "Supreme Court of India",
    bench: "Justice B.R. Gavai & Justice Sandeep Mehta",
    citation: "(2024) 4 SCC 280 • Suo Motu WP (Crl) No. 2/2020",
    date: "April 16, 2024",
    author: "Commercial Litigation Bench",
    readTime: "4 min read",
    statutes: ["Section 138 NI Act 1881", "Section 143A NI Act 1881", "Section 148 NI Act 1881"],
    isBreaking: false,
    isTrending: true,
    isLandmark: false,
    summary: "To curb severe judicial backlog comprising over 35 lakh cheque bounce cases, the Supreme Court directed trial courts to enforce summary trial procedures, convert affidavits to evidence, and discourage dilatory cross-examinations.",
    summaryKn: "ದೇಶದ ನ್ಯಾಯಾಲಯಗಳಲ್ಲಿರುವ ಲಕ್ಷಾಂತರ ಚೆಕ್ ಬೌನ್ಸ್ ಪ್ರಕರಣಗಳನ್ನು ತ್ವರಿತವಾಗಿ ಮುಗಿಸಲು ವಿಚಾರಣಾ ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್‌ಗಳಿಗೆ ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಕಟ್ಟುನಿಟ್ಟಿನ ನಿರ್ದೇಶನಗಳನ್ನು ನೀಡಿದೆ.",
    content: `The Supreme Court of India passed a comprehensive set of directions to expedite adjudication under Section 138 of the Negotiable Instruments Act, 1881, warning that cheque dishonour litigations are overwhelming trial magistrate dockets nationwide.

The bench stressed that proceedings under Section 138 are predominantly civil disputes clothed with quasi-criminal penal sanction to promote commercial trust in negotiable transactions.

Key procedural mandates issued to High Courts and trial courts:
1. Summary Procedure: Magistrates must treat Section 138 complaints as summary trials by default; conversion to summons trial must be reasoned and strictly exceptional.
2. Examination of Complainant on Affidavit: Pre-summoning and post-summoning evidence by way of sworn affidavit is sufficient without mandatory physical oral examination.
3. Strict Interlocutory Relief: Trial courts should proactively exercise power under Section 143A to grant up to 20% interim compensation to the payee during the pendency of trial.
4. Compounding Encouragement: Trial courts must offer structured settlement windows at the earliest appearance before recording formal plea.`,
    keyTakeaways: [
      "Time-bound trial mandate: Magistrates directed to conclude 138 trials within the statutory 6-month timeline.",
      "Interim compensation under Sec 143A: Accused may be directed to deposit up to 20% of the cheque amount during trial.",
      "Affidavit evidence accepted: Complainants and bank officials not required to tender repetitive oral testimony.",
      "Settlement incentives: Early compounding fee waivers to reduce pending commercial court arrears."
    ]
  },
  {
    id: 9,
    title: "Supreme Court 9-Judge Bench: Mining Royalty is Not a Tax; States Retain Legislative Power Over Mineral Rights",
    titleKn: "ಗಣಿ ರಾಯಧನವು ತೆರಿಗೆಯಲ್ಲ: ಖನಿಜಗಳ ಮೇಲೆ ತೆರಿಗೆ ವಿಧಿಸಲು ರಾಜ್ಯ ಸರ್ಕಾರಗಳಿಗೆ ಅಧಿಕಾರವಿದೆ: ೯ ನ್ಯಾಯಾಧೀಶರ ಸಂವಿಧಾನ ಪೀಠ",
    category: "Constitutional",
    court: "Supreme Court of India",
    bench: "9-Judge Constitution Bench (8:1 Majority, Dr. D.Y. Chandrachud CJI presiding)",
    citation: "2024 INSC 554 • Civil Appeal No. 4056/1999",
    date: "July 25, 2024",
    author: "Fiscal Law Bureau",
    readTime: "5 min read",
    statutes: ["Entry 50 List II (State List)", "Entry 54 List I (Union List)", "MMDR Act 1957"],
    isBreaking: false,
    isTrending: false,
    isLandmark: true,
    summary: "In a colossal verdict on fiscal federalism, the Supreme Court overruled its 1989 'India Cements' judgment, ruling by 8:1 that royalty paid on extracted minerals is a contractual consideration, thereby upholding state taxation rights.",
    summaryKn: "ಗಣಿ ಗುತ್ತಿಗೆದಾರರಿಂದ ಪಡೆಯುವ ರಾಯಧನವು ಕೇವಲ ಒಪ್ಪಂದದ ಮೊತ್ತವಾಗಿದ್ದು, ರಾಜ್ಯ ಸರ್ಕಾರಗಳು ಖನಿಜ ಭೂಮಿಯ ಮೇಲೆ ಪ್ರತ್ಯೇಕ ತೆರಿಗೆ ವಿಧಿಸಬಹುದು ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಸ್ಪಷ್ಟಪಡಿಸಿದೆ.",
    content: `Resolving a decades-long constitutional deadlock between the Union and mineral-rich states, a nine-judge Constitution Bench held by an 8:1 majority that royalty payable on minerals under the Mines and Minerals (Development and Regulation) Act (MMDR Act), 1957 is not a tax.

The majority judgment authored by the Chief Justice overruled the seven-judge bench ruling in India Cements Ltd. v. State of Tamil Nadu (1989), which had erroneously held that 'royalty is tax'.

The court explained the conceptual difference: Royalty is a consideration paid by a mining lessee to the owner of the mineral (the state or private party) for the privilege of extracting minerals. A tax, in contrast, is an exaction for public purposes enforced by law.

Consequently, Parliament's regulatory powers under Entry 54 of List I do not divest state legislatures of their sovereign taxation power under Entry 50 of List II (Taxes on mineral rights subject to parliamentary limitation). The verdict substantially enhances revenues for resource-rich states like Karnataka, Jharkhand, and Odisha.`,
    keyTakeaways: [
      "Royalty distinguished from tax: Royalty is consideration for alienation of minerals; not an exercise of sovereign taxation.",
      "State fiscal autonomy affirmed: States have legislative competence to levy taxes on mineral-bearing lands under Entry 49 and 50 List II.",
      "Overruling 35-year-old precedent: Corrected typographical and conceptual error in India Cements (1989).",
      "Impact on mining industry: States can regulate and levy welfare mineral cess within reasonable non-prohibitive ceilings."
    ]
  },
  {
    id: 10,
    title: "Delhi High Court: Career Setback Post Maternity Leave Violates Dignity; ₹10 Lakh Compensation Awarded",
    titleKn: "ಪ್ರಸೂತಿ ರಜೆಯ ನಂತರ ಮಹಿಳೆಯರ ವೃತ್ತಿಜೀವನಕ್ಕೆ ಧಕ್ಕೆ ತರುವುದು ಕಾನೂನುಬಾಹಿರ: ದೆಹಲಿ ಹೈಕೋರ್ಟ್ ₹೧೦ ಲಕ್ಷ ಪರಿಹಾರ",
    category: "High Courts",
    court: "High Court of Delhi",
    bench: "Justice Sachin Datta",
    citation: "2026 DHC 1408 • W.P.(C) 4120/2024",
    date: "September 2, 2026",
    author: "Employment & Labour Law Desk",
    readTime: "4 min read",
    statutes: ["Section 12 Maternity Benefit Act 1961", "Article 14", "Article 21"],
    isBreaking: false,
    isTrending: false,
    isLandmark: false,
    summary: "The Delhi High Court held that Section 12 of the Maternity Benefit Act protects women not only from dismissal during maternity leave, but also from disadvantageous alterations in service conditions and professional career tracks.",
    summaryKn: "ತಾಯ್ತನದ ರಜೆಯ ನಂತರ ಮಹಿಳಾ ಉದ್ಯೋಗಿಗಳನ್ನು ಕೆಳದರ್ಜೆಗೆ ಇಳಿಸುವುದು ಅಥವಾ ಅವರ ಸಂಬಳದಲ್ಲಿ ವ್ಯತ್ಯಾಸ ಮಾಡುವುದು ಮಹಿಳೆಯ ಘನತೆಗೆ ಧಕ್ಕೆ ಎಂದು ದೆಹಲಿ ಹೈಕೋರ್ಟ್ ಆದೇಶಿಸಿದೆ.",
    content: `The Delhi High Court firmly held that an employer cannot alter the service conditions, seniority, or professional career trajectory of a woman returning from statutory maternity leave.

A senior academician filed a writ petition after her institution stripped her of administrative responsibilities and reduced her salary following her resumption of duties post maternity leave.

Justice Sachin Datta held that Section 12 of the Maternity Benefit Act, 1961 cannot be interpreted narrowly as merely prohibiting formal termination during leave. The protective umbrella shields female employees from any subtle, disadvantageous variation in terms of employment upon their return.

The court awarded the petitioner ₹10 lakh as compensation and ₹1.5 lakh towards litigation costs, observing that penalizing motherhood violates constitutional promises of gender equality, workplace dignity, and reproductive autonomy under Articles 14, 15, and 21.`,
    keyTakeaways: [
      "Expansive reading of Section 12: Protection extends beyond discharge/dismissal to demotion or reduced responsibilities.",
      "Right to substantive equality: Motherhood cannot be treated as an occupational disability or career handicap.",
      "Exemplary damages: Employers liable to pay punitive compensation for discriminatory post-maternity actions.",
      "Workplace protections reinforced: Applies across public institutions, universities, and private corporate bodies."
    ]
  },
  {
    id: 11,
    title: "Supreme Court Mandates Hash Value and Digital Certificate Under Section 63 BSA for WhatsApp and Mobile Evidences",
    titleKn: "ಮೊಬೈಲ್ ಮತ್ತು ವಾಟ್ಸಾಪ್ ಡಿಜಿಟಲ್ ಸಾಕ್ಷ್ಯಗಳಿಗೆ ಹ್ಯಾಶ್ ವ್ಯಾಲ್ಯೂ & ಸೆಕ್ಷನ್ 63 BSA ಪ್ರಮಾಣಪತ್ರ ಕಡ್ಡಾಯ: ಸುಪ್ರೀಂ ಕೋರ್ಟ್",
    category: "Criminal Law",
    court: "Supreme Court of India",
    bench: "Justice Vikram Nath & Justice Prasanna B. Varale",
    citation: "2025 INSC 79 • Criminal Appeal No. 450/2025",
    date: "May 14, 2025",
    author: "Cyber Law & Criminal Evidence Panel",
    readTime: "4 min read",
    statutes: ["Section 61 & 63 BSA 2023", "Section 65B Indian Evidence Act", "Section 79A IT Act"],
    isBreaking: false,
    isTrending: true,
    isLandmark: false,
    summary: "The Supreme Court clarified the evidentiary protocol under the newly enacted Bharatiya Sakshya Adhiniyam, 2023, ruling that electronic records extracted from phones and cloud storage without cryptographic hash values and Section 63 certificates are inadmissible.",
    summaryKn: "ಹೊಸ ಭಾರತೀಯ ಸಾಕ್ಷ್ಯ ಅಧಿನಿಯಮದಡಿ ಯಾವುದೇ ಮೊಬೈಲ್ ಅಥವಾ ಡಿಜಿಟಲ್ ಸಾಕ್ಷ್ಯವನ್ನು ನ್ಯಾಯಾಲಯದಲ್ಲಿ ಸಾಬೀತುಪಡಿಸಲು ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಸರ್ಟಿಫಿಕೇಟ್ ಅನಿವಾರ್ಯವಾಗಿದೆ.",
    content: `In a landmark ruling establishing forensic electronic evidence standards under the Bharatiya Sakshya Adhiniyam (BSA), 2023, the Supreme Court held that digital evidence—including WhatsApp chats, call recordings, emails, and server CCTV feeds—cannot be admitted without strict adherence to Section 63 requirements.

In a criminal prosecution relying upon printed screen captures of encrypted messages, the prosecution failed to produce the statutory certificate signed by the person in lawful control of the device or an authorized cyber expert.

The Division Bench observed that while Section 61 of the BSA recognizes electronic records on par with traditional documentary records, Section 63 incorporates essential safeguards against digital tampering, cloning, and artificial intelligence fabrication.

The Court held that modern criminal investigation mandates recording cryptographic hash values (SHA-256) at the exact moment of seizure to ensure chain of custody. Without the accompanying Schedule Certificate, electronic printouts cannot be read into trial records.`,
    keyTakeaways: [
      "Mandatory compliance with BSA Sec 63: Replaces Section 65B Evidence Act with updated statutory forms.",
      "Cryptographic integrity: Police and investigators must log device hash values during seizure under BNSS Sec 105.",
      "Inadmissibility of uncertified prints: Screenshots and printouts lacking authentic certificate cannot form sole conviction basis.",
      "Protection against AI manipulation: Prevents introduction of deepfake chats, voice clones, or synthesized digital records."
    ]
  },
  {
    id: 12,
    title: "Karnataka High Court: ED Provisional Attachment Orders Subject to Article 226 Writ Review in Cases of Manifest Illegality",
    titleKn: "ಜಾರಿ ನಿರ್ದೇಶನಾಲಯದ (ED) ಆಸ್ತಿ ಜಪ್ತಿ ಆದೇಶಗಳ ವಿರುದ್ಧ ಹೈಕೋರ್ಟ್‌ಗೆ ರಿಟ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಅವಕಾಶ: ಕರ್ನಾಟಕ ಹೈಕೋರ್ಟ್",
    category: "High Courts",
    court: "High Court of Karnataka (Principal Bench, Bengaluru)",
    bench: "Justice Hemant Chandangoudar",
    citation: "2025 LiveLaw (Kar) 201 • W.P. No. 18230/2024",
    date: "August 30, 2025",
    author: "PMLA & Financial Crimes Desk",
    readTime: "4 min read",
    statutes: ["Section 5 PMLA 2002", "Section 8 PMLA 2002", "Article 226 Constitution"],
    isBreaking: false,
    isTrending: false,
    isLandmark: false,
    summary: "The High Court of Karnataka ruled that while the PMLA provides an internal appellate tribunal, the High Court's extraordinary writ jurisdiction under Article 226 remains open to quash provisional attachment orders passed without jurisdiction or in violation of natural justice.",
    summaryKn: "ಮನಿ ಲಾಂಡರಿಂಗ್ ಕಾಯ್ದೆಯಡಿ ಇಡಿ (ED) ಮಾಡುವ ಅಕ್ರಮ ಆಸ್ತಿ ಮುಟ್ಟುಗೋಲು ಆದೇಶಗಳನ್ನು ಹೈಕೋರ್ಟ್ ರಿಟ್ ಅಧಿಕಾರದ ಮೂಲಕ ಪ್ರಶ್ನಿಸಬಹುದು ಎಂದು ತೀರ್ಪು ನೀಡಲಾಗಿದೆ.",
    content: `The High Court of Karnataka held that an alternative statutory remedy before the PMLA Adjudicating Authority does not create an absolute bar against invoking the High Court's writ jurisdiction under Article 226 of the Constitution of India.

The Directorate of Enforcement (ED) had provisionally attached commercial properties of a Bengaluru enterprise under Section 5 of the Prevention of Money Laundering Act, 2002. The agency raised a preliminary objection that the petitioner must contest the matter before the statutory Adjudicating Authority in New Delhi.

Rejecting the blanket jurisdictional bar, Justice Hemant Chandangoudar clarified that self-imposed limitations on writ powers do not apply when:
1. The attachment order is passed without 'reason to believe' recorded in writing;
2. There is a flagrant violation of the principles of natural justice;
3. The proceedings are ex-facie barred by limitation or lack a scheduled offence nexus.

The court reiterated that personal property rights under Article 300A cannot be curtailed through mechanical attachment proceedings devoid of statutory foundation.`,
    keyTakeaways: [
      "Article 226 jurisdiction intact: High Courts can review arbitrary ED attachment orders despite tribunal remedy.",
      "Reason to believe mandatory: Section 5 PMLA requires objective material demonstrating likelihood of concealment.",
      "Protection of property rights: Article 300A mandates strict procedural adherence before state confiscation.",
      "Guidance for Bengaluru businesses: Immediate relief accessible against unwarranted freezing of working capital."
    ]
  }
];
