import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════════════════════════════════
//  CIBS-VALID  |  Validation Assessment of Longitudinal Instrument Diagnostics
//  Gold Standard Battery — Adult Version
//
//  Domain 1: Cognitive    — Ravens CAT (CIBS original, Cattell/Raven framework)
//  Domain 2: Personality  — BFI-10 (Rammstedt & John, 2007) +
//                           PID-5-BF (APA, 2013) — DSM-5 Clusters
//  Domain 3: Health       — WHO-5 Wellbeing (WHO, 2024, CC BY-NC-SA 3.0 IGO) +
//                           PHQ-9 Depression (Pfizer, free) +
//                           GAD-7 Anxiety (Pfizer, free) +
//                           Rosenberg RSES (public domain)
//  Domain 4: Risk         — C-SSRS (Columbia, public domain) +
//                           AUDIT-C (WHO, public domain)
//
//  Languages: English | हिंदी | मराठी
//  © 2026 Central Institute of Behavioural Sciences, Nagpur
//  Dr. Shailesh V. Pangaonkar | Dr. Deepali S. Pangaonkar
// ══════════════════════════════════════════════════════════════════════════════

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCR0_X2xe7ojq38W3XVt-3VAp3JISfH9DLwTolOi61TZcYAOOZhtD9oIJoMmZqU8rk/exec";

// ── Utility ───────────────────────────────────────────────────────
const cx = (...args) => args.filter(Boolean).join(" ");

async function submitToSheet(payload) {
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    console.log("✅ CIBS-VALID submission:", result);
    return result;
  } catch(err) {
    console.error("❌ Submission error:", err);
    return { status: "error" };
  }
}


// ══════════════════════════════════════════════════════════════════════════════
//  TRANSLATIONS — English | Hindi | Marathi
// ══════════════════════════════════════════════════════════════════════════════
const T = {
  en: {
    appTitle: "CIBS-VALID",
    subtitle: "Validation Assessment Battery · Adult",
    org: "Central Institute of Behavioural Sciences, Nagpur",
    choose: "Choose Language / भाषा चुनें / भाषा निवडा",
    subjInfo: "Participant Information",
    name: "Full Name", age: "Age (years)", gender: "Gender",
    gM:"Male", gF:"Female", gO:"Other", gN:"Prefer not to say",
    edu: "Education", mobile: "Mobile (10 digits)",
    examiner: "Examiner", diagnosis: "Diagnosis (if any)",
    setting: "Setting", vistaUID: "VISTA UID (if taken)",
    disclaimer: "Important Notice",
    discPoints: [
      "CIBS-VALID is a standardised self-report battery for research and clinical screening. It is NOT a diagnostic instrument.",
      "Domain 1 uses the CIBS Cognitive Ability Test (Ravens framework). Domains 2-4 use internationally validated gold-standard instruments.",
      "PHQ-9 & GAD-7: © Pfizer Inc. Free unrestricted use. WHO-5: © WHO 2024, CC BY-NC-SA 3.0 IGO. BFI-10: Rammstedt & John 2007, open access for non-commercial research. PID-5-BF: © APA 2013, free for researchers and clinicians. RSES: Public domain. C-SSRS: © Columbia University, public domain. AUDIT-C: © WHO, public domain.",
      "All scores are screening indicators only. Clinical decisions must be made by a qualified professional.",
    ],
    agreeText: "I have read and understood the above. I wish to proceed.",
    proceedBtn: "Begin Assessment →",
    domains: ["Cognition", "Personality", "Health & Wellbeing", "Risk Screening"],
    domainNames: [
      "D1 — Cognitive Ability (Ravens CAT)",
      "D2 — Personality (BFI-10 + PID-5-BF)",
      "D3 — Health & Wellbeing (WHO-5 + PHQ-9 + GAD-7 + RSES)",
      "D4 — Risk Screening (C-SSRS + AUDIT-C)",
    ],
    generating: "Generating Report…",
    forSelf: "Your Summary",
    forClinician: "Clinician Report",
    print: "🖨️ Print / PDF",
    newAssess: "🔄 New Assessment",
    // BFI
    bfi_intro: "Rate how well each statement describes you.",
    bfi_scale: "1 = Strongly Disagree · 5 = Strongly Agree",
    bfi_items: [
      "I am outgoing and sociable",
      "I am sometimes rude or critical to others",
      "I am reliable and can always be counted on",
      "I worry a lot",
      "I enjoy creative work and new ideas",
      "I am quiet and reserved",
      "I am generally trusting and cooperative",
      "I can be somewhat lazy or disorganised",
      "I stay calm and emotionally stable",
      "I have few artistic or creative interests"
    ],
    // PID-5-BF
    pid5_intro: "Rate how well each statement describes you in general.",
    pid5_scale: "0 = Very False · 1 = Sometimes False · 2 = Sometimes True · 3 = Very True",
    pid5_items: [
      "People would describe me as reckless.",
      "I feel like I act totally on impulse.",
      "Even though I know better, I can't stop making rash decisions.",
      "I often feel like nothing I do really matters.",
      "Others see me as irresponsible.",
      "I'm not good at planning ahead.",
      "My thoughts often don't make sense to others.",
      "I worry about almost everything.",
      "I get emotional easily, often for very little reason.",
      "I fear being alone in life more than anything else.",
      "I am a very anxious person.",
      "I am easily distracted.",
      "I don't hesitate to cheat if it gets me ahead.",
      "I like to stir up excitement if things seem boring.",
      "I'll say anything to get what I want.",
      "I keep my distance from people.",
      "I don't show emotions strongly.",
      "I prefer to keep romance out of my life.",
      "I don't get emotional.",
      "I am not interested in making friends.",
      "I get fixated on certain things and can't stop.",
      "Even the slightest things make me feel terrible inside.",
      "I have a very short temper.",
      "I react strongly to most things.",
      "I always worry about something.",
    ],
    pid5_domains: [
      "Disinhibition",
      "Negative Affect",
      "Psychoticism",
      "Detachment",
      "Antagonism",
    ],
    // WHO-5
    who5_intro: "Over the last two weeks, please rate how often you have felt the following:",
    who5_scale: "0 = At no time · 1 = Some of the time · 2 = Less than half · 3 = More than half · 4 = Most of the time · 5 = All of the time",
    who5_items: [
      "I have felt cheerful and in good spirits",
      "I have felt calm and relaxed",
      "I have felt active and vigorous",
      "I woke up feeling fresh and rested",
      "My daily life has been filled with things that interest me",
    ],
    who5_citation: "WHO-5: © World Health Organization 2024. Licence: CC BY-NC-SA 3.0 IGO.",
    // PHQ-9
    phq9_intro: "Over the last 2 weeks, how often have you been bothered by the following?",
    phq9_scale: "0 = Not at all · 1 = Several days · 2 = More than half the days · 3 = Nearly every day",
    phq9_items: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself — or that you are a failure",
      "Trouble concentrating on things",
      "Moving or speaking so slowly — or being unusually fidgety/restless",
      "Thoughts that you would be better off dead, or of hurting yourself",
    ],
    phq9_citation: "PHQ-9: Kroenke, Spitzer & Williams. © Pfizer Inc. Free unrestricted use.",
    // GAD-7
    gad7_intro: "Over the last 2 weeks, how often have you been bothered by the following?",
    gad7_items: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it's hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen",
    ],
    gad7_citation: "GAD-7: Spitzer et al. © Pfizer Inc. Free unrestricted use.",
    // RSES
    rses_intro: "Rate how strongly you agree or disagree with each statement.",
    rses_scale: "1 = Strongly Disagree · 2 = Disagree · 3 = Agree · 4 = Strongly Agree",
    rses_items: [
      "I feel that I am a person of worth, at least on an equal plane with others",
      "I feel that I have a number of good qualities",
      "All in all, I am inclined to feel that I am a failure",
      "I am able to do things as well as most other people",
      "I feel I do not have much to be proud of",
      "I take a positive attitude toward myself",
      "On the whole, I am satisfied with myself",
      "I wish I could have more respect for myself",
      "I certainly feel useless at times",
      "At times I think I am no good at all",
    ],
    rses_citation: "Rosenberg Self-Esteem Scale: Rosenberg, 1965. Public domain.",
    // C-SSRS
    cssrs_title: "Part A — Suicidality Screen (C-SSRS)",
    cssrs_note: "These questions are asked for health monitoring only. All responses are strictly confidential.",
    cssrs_items: [
      "Have you wished you were dead or hoped you could go to sleep and not wake up?",
      "Have you had any actual thoughts of killing yourself?",
      "Have you been thinking about how you might do this?",
      "Have you had these thoughts and had some intention of acting on them?",
      "Have you started to work out or act on the details of how to kill yourself?",
    ],
    cssrs_citation: "C-SSRS: Posner et al., Columbia University. Public domain.",
    // AUDIT-C
    audit_title: "Part B — Alcohol Use (AUDIT-C)",
    audit_note: "If you never drink alcohol, select 'Never' — further questions will be skipped.",
    audit_never_msg: "✓ Non-drinker confirmed — alcohol questions skipped",
    audit_citation: "AUDIT-C: Bush et al., 1998. © World Health Organization. Public domain.",
    yes: "Yes", no: "No",
  },
  hi: {
    appTitle: "CIBS-VALID",
    subtitle: "मान्यता मूल्यांकन बैटरी · वयस्क",
    org: "केंद्रीय व्यावहारिक विज्ञान संस्थान, नागपुर",
    choose: "भाषा चुनें",
    subjInfo: "प्रतिभागी जानकारी",
    name: "पूरा नाम", age: "आयु (वर्ष)", gender: "लिंग",
    gM:"पुरुष", gF:"महिला", gO:"अन्य", gN:"बताना नहीं चाहते",
    edu: "शिक्षा", mobile: "मोबाइल (10 अंक)",
    examiner: "परीक्षक", diagnosis: "निदान (यदि हो)",
    setting: "सेटिंग", vistaUID: "VISTA UID (यदि लिया हो)",
    disclaimer: "महत्वपूर्ण सूचना",
    discPoints: [
      "CIBS-VALID एक मानकीकृत मूल्यांकन बैटरी है। यह निदान उपकरण नहीं है।",
      "सभी स्कोर केवल जांच संकेतक हैं। नैदानिक निर्णय योग्य पेशेवर द्वारा लिए जाने चाहिए।",
    ],
    agreeText: "मैंने उपरोक्त पढ़ और समझ लिया है। मैं आगे बढ़ना चाहता/चाहती हूँ।",
    proceedBtn: "मूल्यांकन शुरू करें →",
    domains: ["संज्ञान", "व्यक्तित्व", "स्वास्थ्य एवं कल्याण", "जोखिम जांच"],
    domainNames: [
      "D1 — संज्ञानात्मक क्षमता (Ravens CAT)",
      "D2 — व्यक्तित्व (BFI-10 + PID-5-BF)",
      "D3 — स्वास्थ्य एवं कल्याण (WHO-5 + PHQ-9 + GAD-7 + RSES)",
      "D4 — जोखिम जांच (C-SSRS + AUDIT-C)",
    ],
    generating: "रिपोर्ट तैयार हो रही है…",
    forSelf: "आपका सारांश", forClinician: "चिकित्सक रिपोर्ट",
    print: "🖨️ प्रिंट / PDF", newAssess: "🔄 नया मूल्यांकन",
    bfi_intro: "प्रत्येक कथन आपका वर्णन कितनी अच्छी तरह करता है, यह बताएं।",
    bfi_scale: "1 = बिल्कुल असहमत · 5 = पूरी तरह सहमत",
    bfi_items: [
      "मैं मिलनसार और सामाजिक हूँ",
      "मैं कभी-कभी दूसरों के प्रति कठोर या आलोचनात्मक होता/होती हूँ",
      "मैं विश्वसनीय हूँ और हमेशा भरोसा किया जा सकता/सकती है",
      "मैं बहुत चिंता करता/करती हूँ",
      "मुझे रचनात्मक कार्य और नए विचार पसंद हैं",
      "मैं शांत और संकोची हूँ",
      "मैं आमतौर पर विश्वास करने वाला/वाली और सहयोगी हूँ",
      "मैं कभी-कभी आलसी या अव्यवस्थित हो सकता/सकती हूँ",
      "मैं शांत रहता/रहती हूँ और भावनात्मक रूप से स्थिर हूँ",
      "मेरी कलात्मक या रचनात्मक रुचियाँ बहुत कम हैं"
    ],
    pid5_intro: "प्रत्येक कथन आप पर कितना लागू होता है, यह बताएं।",
    pid5_scale: "0 = बिल्कुल गलत · 1 = कभी-कभी गलत · 2 = कभी-कभी सच · 3 = बिल्कुल सच",
    pid5_items: [
      "लोग मुझे लापरवाह कहते हैं।",
      "मुझे लगता है मैं बिना सोचे काम करता/करती हूँ।",
      "जानते हुए भी मैं जल्दबाजी में फैसले लेता/लेती हूँ।",
      "मुझे अक्सर लगता है कि मैं जो करता/करती हूँ उसका कोई महत्व नहीं।",
      "दूसरे मुझे गैरजिम्मेदार मानते हैं।",
      "मैं आगे की योजना नहीं बना पाता/पाती।",
      "मेरे विचार दूसरों को अजीब लगते हैं।",
      "मैं लगभग हर चीज के बारे में चिंता करता/करती हूँ।",
      "मैं जल्दी भावुक हो जाता/जाती हूँ।",
      "मुझे जिंदगी में अकेले रहने का डर है।",
      "मैं बहुत चिंतित रहता/करती हूँ।",
      "मेरा ध्यान जल्दी भटक जाता है।",
      "मैं आगे बढ़ने के लिए धोखा देने में नहीं हिचकिचाता/हिचकिचाती।",
      "मुझे उत्साह पैदा करना अच्छा लगता है।",
      "मैं जो चाहता/चाहती हूँ उसके लिए कुछ भी कह सकता/सकती हूँ।",
      "मैं लोगों से दूरी बनाए रखता/रखती हूँ।",
      "मैं भावनाएं खुलकर नहीं दिखाता/दिखाती।",
      "मैं जीवन में रोमांस से दूर रहना पसंद करता/करती हूँ।",
      "मैं भावुक नहीं होता/होती।",
      "मुझे दोस्त बनाने में कोई रुचि नहीं।",
      "मैं कुछ चीजों पर ध्यान केंद्रित करता/करती हूँ और रुक नहीं पाता/पाती।",
      "छोटी-छोटी बातें भी मुझे बहुत परेशान करती हैं।",
      "मेरा गुस्सा बहुत जल्दी भड़कता है।",
      "मैं अधिकांश चीजों पर तीव्र प्रतिक्रिया करता/करती हूँ।",
      "मैं हमेशा किसी न किसी बात की चिंता करता/करती हूँ।",
    ],
    pid5_domains: ["अवरोध-हीनता","नकारात्मक प्रभाव","मनोविकृति","अलगाव","विरोध"],
    who5_intro: "पिछले दो हफ्तों में आपने निम्नलिखित कितनी बार महसूस किया?",
    who5_scale: "0 = कभी नहीं · 1 = कभी-कभी · 2 = आधे से कम समय · 3 = आधे से ज्यादा · 4 = अधिकांश समय · 5 = हर समय",
    who5_items: [
      "मैंने खुशमिजाज और अच्छे मूड में महसूस किया",
      "मैंने शांत और तनावमुक्त महसूस किया",
      "मैंने सक्रिय और उत्साहित महसूस किया",
      "मैं सुबह तरोताजा और आराम से उठा/उठी",
      "मेरी दिनचर्या रुचिकर चीजों से भरी रही",
    ],
    who5_citation: "WHO-5: © विश्व स्वास्थ्य संगठन 2024. Licence: CC BY-NC-SA 3.0 IGO.",
    phq9_intro: "पिछले 2 हफ्तों में निम्नलिखित समस्याओं से आप कितने परेशान रहे?",
    phq9_scale: "0 = बिल्कुल नहीं · 1 = कई दिन · 2 = आधे से ज्यादा दिन · 3 = लगभग हर दिन",
    phq9_items: [
      "किसी काम में रुचि या आनंद न आना",
      "उदास, निराश या हताश महसूस करना",
      "नींद न आना या बहुत ज्यादा सोना",
      "थकान महसूस करना या ऊर्जा न होना",
      "भूख न लगना या बहुत ज्यादा खाना",
      "खुद को नाकाम या परिवार को निराश करने वाला/वाली समझना",
      "किसी काम में ध्यान न लगना",
      "बहुत धीमे बोलना/चलना या बहुत बेचैन रहना",
      "खुद को नुकसान पहुंचाने या मर जाने के विचार आना",
    ],
    phq9_citation: "PHQ-9: Kroenke, Spitzer & Williams. © Pfizer Inc. निःशुल्क उपयोग।",
    gad7_intro: "पिछले 2 हफ्तों में निम्नलिखित समस्याओं से आप कितने परेशान रहे?",
    gad7_items: [
      "घबराहट, बेचैनी या तनाव महसूस करना",
      "चिंता को रोक न पाना",
      "अलग-अलग चीजों की बहुत ज्यादा चिंता करना",
      "आराम करने में कठिनाई",
      "इतना बेचैन रहना कि चुप बैठना मुश्किल हो",
      "आसानी से चिड़चिड़ा/चिड़चिड़ी हो जाना",
      "कुछ बुरा होने का डर",
    ],
    gad7_citation: "GAD-7: Spitzer et al. © Pfizer Inc. निःशुल्क उपयोग।",
    rses_intro: "प्रत्येक कथन से आप कितना सहमत या असहमत हैं, यह बताएं।",
    rses_scale: "1 = पूरी तरह असहमत · 2 = असहमत · 3 = सहमत · 4 = पूरी तरह सहमत",
    rses_items: [
      "मुझे लगता है कि मैं एक मूल्यवान व्यक्ति हूँ",
      "मुझे लगता है कि मुझमें कई अच्छे गुण हैं",
      "कुल मिलाकर मुझे लगता है कि मैं असफल हूँ",
      "मैं अधिकांश लोगों जितना काम कर सकता/सकती हूँ",
      "मुझे लगता है कि मुझमें गर्व करने के लिए ज्यादा कुछ नहीं है",
      "मैं खुद के प्रति सकारात्मक दृष्टिकोण रखता/रखती हूँ",
      "कुल मिलाकर मैं खुद से संतुष्ट हूँ",
      "काश मुझे खुद का और अधिक सम्मान हो पाता",
      "मुझे कभी-कभी बेकार लगता है",
      "कभी-कभी मुझे लगता है कि मैं किसी काम का नहीं हूँ",
    ],
    rses_citation: "Rosenberg Self-Esteem Scale: सार्वजनिक डोमेन।",
    cssrs_title: "भाग A — आत्महत्या जांच (C-SSRS)",
    cssrs_note: "ये प्रश्न केवल स्वास्थ्य निगरानी के लिए हैं। सभी उत्तर पूरी तरह गोपनीय हैं।",
    cssrs_items: [
      "क्या आपने कभी चाहा कि आप मर जाएं या सो जाएं और न उठें?",
      "क्या आपके मन में खुद को मारने के विचार आए हैं?",
      "क्या आप सोच रहे हैं कि यह कैसे किया जाए?",
      "क्या आपने ऐसा करने का इरादा किया है?",
      "क्या आपने इसकी योजना बनाना शुरू किया है?",
    ],
    cssrs_citation: "C-SSRS: कोलंबिया विश्वविद्यालय। सार्वजनिक डोमेन।",
    audit_title: "भाग B — शराब का उपयोग (AUDIT-C)",
    audit_note: "यदि आप कभी शराब नहीं पीते, तो 'कभी नहीं' चुनें — आगे के प्रश्न छोड़े जाएंगे।",
    audit_never_msg: "✓ पुष्टि हुई — शराब के प्रश्न छोड़े गए",
    audit_citation: "AUDIT-C: WHO। सार्वजनिक डोमेन।",
    yes: "हाँ", no: "नहीं",
  },
  mr: {
    appTitle: "CIBS-VALID",
    subtitle: "प्रमाणीकरण मूल्यांकन बॅटरी · प्रौढ",
    org: "केंद्रीय वर्तणूक विज्ञान संस्था, नागपूर",
    choose: "भाषा निवडा",
    subjInfo: "सहभागी माहिती",
    name: "पूर्ण नाव", age: "वय (वर्षे)", gender: "लिंग",
    gM:"पुरुष", gF:"स्त्री", gO:"इतर", gN:"सांगू इच्छित नाही",
    edu: "शिक्षण", mobile: "मोबाईल (10 अंक)",
    examiner: "परीक्षक", diagnosis: "निदान (असल्यास)",
    setting: "सेटिंग", vistaUID: "VISTA UID (घेतले असल्यास)",
    disclaimer: "महत्त्वाची सूचना",
    discPoints: [
      "CIBS-VALID हे एक मानकीकृत मूल्यांकन साधन आहे. हे निदान साधन नाही.",
      "सर्व स्कोर केवळ तपासणी निर्देशक आहेत. वैद्यकीय निर्णय पात्र व्यावसायिकाद्वारे घेतले जावेत.",
    ],
    agreeText: "मी वरील वाचले आणि समजले. मला पुढे जायचे आहे.",
    proceedBtn: "मूल्यांकन सुरू करा →",
    domains: ["संज्ञान", "व्यक्तिमत्व", "आरोग्य व कल्याण", "जोखीम तपासणी"],
    domainNames: [
      "D1 — संज्ञानात्मक क्षमता (Ravens CAT)",
      "D2 — व्यक्तिमत्व (BFI-10 + PID-5-BF)",
      "D3 — आरोग्य व कल्याण (WHO-5 + PHQ-9 + GAD-7 + RSES)",
      "D4 — जोखीम तपासणी (C-SSRS + AUDIT-C)",
    ],
    generating: "अहवाल तयार होत आहे…",
    forSelf: "आपला सारांश", forClinician: "वैद्यकीय अहवाल",
    print: "🖨️ प्रिंट / PDF", newAssess: "🔄 नवीन मूल्यांकन",
    bfi_intro: "प्रत्येक विधान आपले किती अचूक वर्णन करते ते सांगा.",
    bfi_scale: "1 = पूर्णपणे असहमत · 5 = पूर्णपणे सहमत",
    bfi_items: [
      "मी मिळून-मिसळून राहणारा/री आणि सामाजिक आहे",
      "मी कधी-कधी इतरांशी कठोर किंवा टीकात्मक असतो/असते",
      "मी विश्वासू आहे आणि माझ्यावर नेहमी अवलंबून राहता येते",
      "मी खूप काळजी करतो/करते",
      "मला सर्जनशील काम आणि नवीन कल्पना आवडतात",
      "मी शांत आणि संकोची आहे",
      "मी सहसा विश्वास ठेवणारा/री आणि सहकार्य करणारा/री आहे",
      "मी कधी-कधी आळशी किंवा अव्यवस्थित असतो/असते",
      "मी शांत राहतो/राहते आणि भावनिकदृष्ट्या स्थिर आहे",
      "माझ्या कलात्मक किंवा सर्जनशील आवडी खूप कमी आहेत"
    ],
    pid5_intro: "प्रत्येक विधान तुमच्यावर सामान्यतः किती लागू होते ते सांगा.",
    pid5_scale: "0 = खूप चुकीचे · 1 = कधी-कधी चुकीचे · 2 = कधी-कधी खरे · 3 = खूप खरे",
    pid5_items: [
      "लोक मला बेफिकीर म्हणतात.",
      "मला वाटते मी उत्स्फूर्तपणे वागतो/वागते.",
      "माहीत असूनही मी घाईने निर्णय घेतो/घेते.",
      "मला अनेकदा वाटते माझ्या कृतींना काही महत्त्व नाही.",
      "इतर मला बेजबाबदार मानतात.",
      "मी पुढील नियोजन करण्यात कमकुवत आहे.",
      "माझे विचार इतरांना विचित्र वाटतात.",
      "मी जवळजवळ प्रत्येक गोष्टीची काळजी करतो/करते.",
      "मी सहज भावनिक होतो/होते.",
      "आयुष्यात एकट्याने राहण्याची भीती वाटते.",
      "मी खूप चिंताग्रस्त आहे.",
      "माझे लक्ष सहज विचलित होते.",
      "पुढे जाण्यासाठी फसवणूक करण्यास मी मागेपुढे पाहत नाही.",
      "कंटाळा आल्यावर मला उत्साह निर्माण करायला आवडते.",
      "हवे ते मिळवण्यासाठी मी काहीही बोलतो/बोलते.",
      "मी लोकांपासून दूर राहतो/राहते.",
      "मी भावना उघडपणे दाखवत नाही.",
      "मला आयुष्यात प्रेमसंबंध टाळायचे आहेत.",
      "मला भावना होत नाहीत.",
      "मला मित्र बनवण्यात रस नाही.",
      "मी काही गोष्टींवर लक्ष केंद्रित करतो/करते आणि थांबू शकत नाही.",
      "अगदी छोट्या गोष्टी देखील मला खूप वाईट वाटवतात.",
      "माझा राग खूप लवकर भडकतो.",
      "मी बहुतेक गोष्टींवर जोरदार प्रतिक्रिया देतो/देते.",
      "मी नेहमी कशाची तरी काळजी करतो/करते.",
    ],
    pid5_domains: ["निरोधकता","नकारात्मक परिणाम","मनोविकृती","अलिप्तता","विरोधीपणा"],
    who5_intro: "गेल्या दोन आठवड्यांत तुम्हाला खालील गोष्टी किती वेळा जाणवल्या?",
    who5_scale: "0 = कधीच नाही · 1 = कधी-कधी · 2 = निम्म्यापेक्षा कमी · 3 = निम्म्यापेक्षा जास्त · 4 = बहुतेक वेळा · 5 = सर्व वेळ",
    who5_items: [
      "मला आनंदी आणि चांगल्या मनःस्थितीत वाटले",
      "मला शांत आणि तणावमुक्त वाटले",
      "मला सक्रिय आणि उत्साही वाटले",
      "मी सकाळी ताजेतवाने आणि विश्रांती घेऊन उठलो/उठले",
      "माझी दैनंदिन जीवनात रस असलेल्या गोष्टी भरलेल्या होत्या",
    ],
    who5_citation: "WHO-5: © जागतिक आरोग्य संघटना 2024. Licence: CC BY-NC-SA 3.0 IGO.",
    phq9_intro: "गेल्या 2 आठवड्यांत खालील समस्यांनी तुम्हाला किती त्रास झाला?",
    phq9_scale: "0 = अजिबात नाही · 1 = काही दिवस · 2 = निम्म्यापेक्षा जास्त दिवस · 3 = जवळजवळ रोज",
    phq9_items: [
      "कोणत्याही गोष्टीत रस किंवा आनंद नसणे",
      "उदास, निराश किंवा हताश वाटणे",
      "झोप न येणे किंवा खूप जास्त झोपणे",
      "थकवा येणे किंवा उर्जा नसणे",
      "भूक न लागणे किंवा जास्त खाणे",
      "स्वतःबद्दल वाईट वाटणे किंवा अपयशी वाटणे",
      "एकाग्र होण्यात अडचण येणे",
      "खूप हळू बोलणे/चालणे किंवा खूप अस्वस्थ राहणे",
      "स्वतःला दुखवण्याचे किंवा मरण्याचे विचार येणे",
    ],
    phq9_citation: "PHQ-9: Kroenke, Spitzer & Williams. © Pfizer Inc. विनामूल्य वापर.",
    gad7_intro: "गेल्या 2 आठवड्यांत खालील समस्यांनी तुम्हाला किती त्रास झाला?",
    gad7_items: [
      "अस्वस्थ, चिंताग्रस्त किंवा तणावाखाली वाटणे",
      "काळजी थांबवण्यास किंवा नियंत्रित करण्यास असमर्थता",
      "वेगवेगळ्या गोष्टींची जास्त काळजी करणे",
      "आराम करण्यात अडचण",
      "इतके अस्वस्थ राहणे की शांत बसणे कठीण जाते",
      "सहज चिडचिड होणे",
      "काहीतरी भयंकर होईल असे वाटणे",
    ],
    gad7_citation: "GAD-7: Spitzer et al. © Pfizer Inc. विनामूल्य वापर.",
    rses_intro: "प्रत्येक विधानाशी तुम्ही किती सहमत किंवा असहमत आहात ते सांगा.",
    rses_scale: "1 = पूर्णपणे असहमत · 2 = असहमत · 3 = सहमत · 4 = पूर्णपणे सहमत",
    rses_items: [
      "मला वाटते मी एक मूल्यवान व्यक्ती आहे",
      "मला वाटते माझ्यात अनेक चांगले गुण आहेत",
      "एकूणच मला वाटते मी अयशस्वी आहे",
      "मी बहुतेक लोकांइतके काम करू शकतो/शकते",
      "मला वाटते माझ्याकडे अभिमान बाळगण्यासारखे फारसे नाही",
      "मी स्वतःबद्दल सकारात्मक दृष्टिकोन ठेवतो/ठेवते",
      "एकूणच मी स्वतःवर समाधानी आहे",
      "मला स्वतःबद्दल जास्त आदर असायला हवा होता",
      "कधी-कधी मला निरुपयोगी वाटते",
      "कधी-कधी मला वाटते मी कुठल्याच कामाचा/कामाची नाही",
    ],
    rses_citation: "Rosenberg Self-Esteem Scale: सार्वजनिक डोमेन.",
    cssrs_title: "भाग A — आत्महत्या तपासणी (C-SSRS)",
    cssrs_note: "हे प्रश्न केवळ आरोग्य देखरेखीसाठी आहेत. सर्व उत्तरे पूर्णपणे गोपनीय आहेत.",
    cssrs_items: [
      "तुम्हाला कधी वाटले की तुम्ही मराल तर बरे होईल?",
      "तुम्हाला स्वतःला मारण्याचे विचार आले आहेत का?",
      "हे कसे करायचे याचा तुम्ही विचार केला आहे का?",
      "तुम्ही असे करण्याचा इरादा केला आहे का?",
      "तुम्ही यासाठी तयारी करायला सुरुवात केली आहे का?",
    ],
    cssrs_citation: "C-SSRS: Columbia University. सार्वजनिक डोमेन.",
    audit_title: "भाग B — मद्यपान (AUDIT-C)",
    audit_note: "तुम्ही कधीच दारू पीत नसाल तर 'कधीच नाही' निवडा — पुढचे प्रश्न वगळले जातील.",
    audit_never_msg: "✓ पुष्टी झाली — मद्यपानाचे प्रश्न वगळले",
    audit_citation: "AUDIT-C: WHO. सार्वजनिक डोमेन.",
    yes: "होय", no: "नाही",
  },
};

// ── PID-5-BF Domain mapping (which items map to which domain) ────
// Items 1-5: Disinhibition, 6-10: Negative Affect, 11-15: Psychoticism (wrong order in APA)
// APA PID-5-BF correct domain mapping:
const PID5_DOMAIN_MAP = {
  "Negative Affect":  [8,9,10,11,25],   // items 8,9,10,11,25
  "Detachment":       [16,17,18,19,20],  // items 16,17,18,19,20
  "Antagonism":       [13,14,15,4,7],    // items 13,14,15 + others
  "Disinhibition":    [1,2,3,5,6],       // items 1,2,3,5,6
  "Psychoticism":     [7,12,21,22,24],   // items 7,12,21,22,24
};

// Correct APA PID-5-BF scoring (Krueger et al., 2013)
// Items per domain (1-indexed):
// Negative Affect:  7,8,9,10,25
// Detachment:       15,16,17,18,19
// Antagonism:       11,12,13,14,20
// Disinhibition:    1,2,3,4,5
// Psychoticism:     6,21,22,23,24
const PID5_DOMAINS_ITEMS = {
  "Disinhibition":   [1,2,3,4,5],
  "Negative Affect": [7,8,9,10,25],
  "Psychoticism":    [6,21,22,23,24],
  "Detachment":      [15,16,17,18,19],
  "Antagonism":      [11,12,13,14,20],
};

function scorePID5(resp) {
  const result = {};
  Object.entries(PID5_DOMAINS_ITEMS).forEach(([domain, items]) => {
    const scores = items.map(i => resp[`pid${i}`] !== undefined ? resp[`pid${i}`] : 0);
    result[domain] = parseFloat((scores.reduce((a,b)=>a+b,0) / items.length).toFixed(2));
  });
  // DSM-5 Cluster alignment
  const clusterA = ((result["Detachment"] || 0) + (result["Psychoticism"] || 0)) / 2;
  const clusterB = ((result["Antagonism"] || 0) + (result["Disinhibition"] || 0)) / 2;
  const clusterC = result["Negative Affect"] || 0;
  const clusters = { A: clusterA.toFixed(2), B: clusterB.toFixed(2), C: clusterC.toFixed(2) };
  const dominant = clusterA >= clusterB && clusterA >= clusterC ? "Cluster A (Schizoid/Schizotypal/Paranoid)" :
                   clusterB >= clusterC ? "Cluster B (Borderline/Narcissistic/Antisocial)" :
                   "Cluster C (Avoidant/Dependent/OCPD)";
  return { domains: result, clusters, dominant };
}

function scoreWHO5(resp) {
  const total = [1,2,3,4,5].reduce((a,i) => a + (resp[`who${i}`] !== undefined ? resp[`who${i}`] : 0), 0);
  const pct = total * 4;
  const level = pct >= 72 ? "Good" : pct >= 52 ? "Moderate" : pct >= 28 ? "Low" : "Poor";
  const screenDepression = pct < 52 || resp["who1"] <= 1;
  return { raw: total, score: pct, level, screenDepression };
}

function scoreRSES(resp) {
  // Reverse-scored items: 3,5,8,9,10
  const reversed = [3,5,8,9,10];
  let total = 0;
  for (let i = 1; i <= 10; i++) {
    const v = resp[`rses${i}`] !== undefined ? resp[`rses${i}`] : 2;
    total += reversed.includes(i) ? (5 - v) : v;
  }
  const level = total >= 30 ? "High Self-Esteem" :
                total >= 25 ? "Normal Self-Esteem" :
                total >= 15 ? "Moderate Self-Esteem" : "Low Self-Esteem";
  return { score: total, max: 40, level };
}

function scorePHQ9(resp) {
  const total = [1,2,3,4,5,6,7,8,9].reduce((a,i) => a + (resp[`phq${i}`] || 0), 0);
  const level = total <= 4 ? "Minimal/None" : total <= 9 ? "Mild" :
                total <= 14 ? "Moderate" : total <= 19 ? "Moderately Severe" : "Severe";
  const color = total <= 4 ? "#10B981" : total <= 9 ? "#84CC16" :
                total <= 14 ? "#F59E0B" : total <= 19 ? "#F97316" : "#EF4444";
  return { score: total, level, color };
}

function scoreGAD7(resp) {
  const total = [1,2,3,4,5,6,7].reduce((a,i) => a + (resp[`gad${i}`] || 0), 0);
  const level = total <= 4 ? "Minimal" : total <= 9 ? "Mild" :
                total <= 14 ? "Moderate" : "Severe";
  const color = total <= 4 ? "#10B981" : total <= 9 ? "#84CC16" :
                total <= 14 ? "#F59E0B" : "#EF4444";
  return { score: total, level, color };
}

const RvCircle = ({cx,cy,r=20,fill="none",stroke="#374151",sw=2.5}) =>
  <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={sw}/>;
const RvRect = ({cx,cy,s=38,fill="none",stroke="#374151",sw=2.5}) =>
  <rect x={cx-s/2} y={cy-s/2} width={s} height={s} fill={fill} stroke={stroke} strokeWidth={sw}/>;
const RvTri = ({cx,cy,s=22,fill="none",stroke="#374151",sw=2.5}) =>
  <polygon points={`${cx},${cy-s} ${cx-s*0.87},${cy+s*0.5} ${cx+s*0.87},${cy+s*0.5}`}
    fill={fill} stroke={stroke} strokeWidth={sw}/>;
const RvDiam = ({cx,cy,s=21,fill="none",stroke="#374151",sw=2.5}) =>
  <polygon points={`${cx},${cy-s} ${cx+s},${cy} ${cx},${cy+s} ${cx-s},${cy}`}
    fill={fill} stroke={stroke} strokeWidth={sw}/>;
const RvDot = ({cx,cy,r=7,fill="#374151"}) => <circle cx={cx} cy={cy} r={r} fill={fill}/>;
const RvArrow = ({cx,cy,dir="right",size=16,color="#374151"}) => {
  const s=size, h=s*0.45;
  const pts = {
    right:`${cx-s},${cy-h} ${cx+s*0.3},${cy-h} ${cx+s*0.3},${cy-s} ${cx+s},${cy} ${cx+s*0.3},${cy+s} ${cx+s*0.3},${cy+h} ${cx-s},${cy+h}`,
    down: `${cx-h},${cy-s} ${cx+h},${cy-s} ${cx+h},${cy+s*0.3} ${cx+s},${cy+s*0.3} ${cx},${cy+s} ${cx-s},${cy+s*0.3} ${cx-h},${cy+s*0.3}`,
    left: `${cx+s},${cy-h} ${cx-s*0.3},${cy-h} ${cx-s*0.3},${cy-s} ${cx-s},${cy} ${cx-s*0.3},${cy+s} ${cx-s*0.3},${cy+h} ${cx+s},${cy+h}`,
    up:   `${cx-h},${cy+s} ${cx+h},${cy+s} ${cx+h},${cy-s*0.3} ${cx+s},${cy-s*0.3} ${cx},${cy-s} ${cx-s},${cy-s*0.3} ${cx-h},${cy-s*0.3}`,
  }[dir];
  return <polygon points={pts} fill={color}/>;
};
const RvQMark = ({cx,cy,fsz=26}) =>
  <text x={cx} y={cy+9} textAnchor="middle" fontSize={fsz} fontWeight="900" fill="#94A3B8">?</text>;
const RvGrid = ({rows,cols,cs=70}) => <>
  {Array.from({length:cols+1},(_,i)=><line key={`v${i}`} x1={i*cs} y1={0} x2={i*cs} y2={rows*cs} stroke="#CBD5E1" strokeWidth={1.5}/>)}
  {Array.from({length:rows+1},(_,i)=><line key={`h${i}`} x1={0} y1={i*cs} x2={cols*cs} y2={i*cs} stroke="#CBD5E1" strokeWidth={1.5}/>)}
</>;
// Regular n-sided polygon (vertex at top)
const RvPoly = ({cx,cy,r=20,n,fill="none",stroke="#374151",sw=2.5}) => {
  const pts = Array.from({length:n},(_,i)=>{
    const a = -Math.PI/2 + (2*Math.PI*i)/n;
    return `${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw}/>;
};
// Dots arranged in a compact grid
const RvDots = ({cx,cy,n,r=5}) => {
  const layouts = {
    1:[[0,0]],
    2:[[-8,0],[8,0]],
    3:[[-9,5],[0,-8],[9,5]],
    4:[[-8,-8],[8,-8],[-8,8],[8,8]],
    5:[[0,-10],[10,-3],[6,9],[-6,9],[-10,-3]],
    6:[[-10,-7],[0,-7],[10,-7],[-10,7],[0,7],[10,7]],
    7:[[-10,-9],[0,-9],[10,-9],[-10,0],[10,0],[-5,9],[5,9]],
    8:[[-12,-7],[-4,-7],[4,-7],[12,-7],[-12,7],[-4,7],[4,7],[12,7]],
    9:[[-11,-11],[0,-11],[11,-11],[-11,0],[0,0],[11,0],[-11,11],[0,11],[11,11]],
    12:[[-13,-10],[-4,-10],[4,-10],[13,-10],[-13,-2],[-4,-2],[4,-2],[13,-2],[-13,7],[-4,7],[4,7],[13,7]],
  };
  return <>{(layouts[n]||[]).map(([dx,dy],i)=><circle key={i} cx={cx+dx} cy={cy+dy} r={r} fill="#374151"/>)}</>;
};

// ── CAT Item Pools organised by IQ Band ───────────────────────────────────────
// Band 1 (IQ 70–85)   — 6 items — advance rule: 4/6 correct — Mental Age ~7–9
// Band 2 (IQ 85–100)  — 6 items — advance rule: 4/6 correct — Mental Age ~9–12
// Band 3 (IQ 100–115) — 6 items — advance rule: 4/6 correct — Mental Age ~12–15
// Band 4 (IQ 115–130) — 4 items — terminal band            — Mental Age 15+
const RAVENS_CAT = {
  1: [
    // B1-Q1: Shape cycle ○□△ repeating across each row — 3×3 matrix
    { id:1, title:"Shape Pattern", instruction:"Which shape belongs in the empty box?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={3} cols={3}/>
          {[[0,0,'c'],[0,1,'s'],[0,2,'t'],[1,0,'c'],[1,1,'s'],[1,2,'t'],[2,0,'c'],[2,1,'s']].map(([r,c,tp],i)=>{
            const x=c*70+35,y=r*70+35;
            return tp==='c'?<RvCircle key={i} cx={x} cy={y}/>:tp==='s'?<RvRect key={i} cx={x} cy={y}/>:<RvTri key={i} cx={x} cy={y}/>;
          })}
          <RvQMark cx={175} cy={175}/>
        </svg>),
      options:[
        {label:"Triangle", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvTri cx={28} cy={28} s={19}/></svg>},
        {label:"Circle",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvCircle cx={28} cy={28} r={19}/></svg>},
        {label:"Square",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvRect cx={28} cy={28} s={36}/></svg>},
        {label:"Diamond",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDiam cx={28} cy={28} s={19}/></svg>},
      ]},

    // B1-Q2: Size series — circles shrinking left to right in 1×4
    { id:2, title:"Size Series", instruction:"Which circle comes next in the sequence?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 280 70" width={280} height={70} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={1} cols={4} cs={70}/>
          <RvCircle cx={35} cy={35} r={26}/><RvCircle cx={105} cy={35} r={19}/>
          <RvCircle cx={175} cy={35} r={12}/><RvQMark cx={245} cy={35}/>
        </svg>),
      options:[
        {label:"Tiny",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvCircle cx={28} cy={28} r={6}/></svg>},
        {label:"Large",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvCircle cx={28} cy={28} r={24}/></svg>},
        {label:"Medium", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvCircle cx={28} cy={28} r={17}/></svg>},
        {label:"Small",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvCircle cx={28} cy={28} r={11}/></svg>},
      ]},

    // B1-Q3: Fill alternation — filled ● empty ○ filled ● ? = empty ○
    { id:3, title:"Fill Pattern", instruction:"Which circle comes next in the sequence?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 280 70" width={280} height={70} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={1} cols={4} cs={70}/>
          <circle cx={35}  cy={35} r={22} fill="#374151"/>
          <RvCircle cx={105} cy={35} r={22}/>
          <circle cx={175} cy={35} r={22} fill="#374151"/>
          <RvQMark cx={245} cy={35}/>
        </svg>),
      options:[
        {label:"Empty ○",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvCircle cx={28} cy={28} r={22}/></svg>},
        {label:"Filled ●", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><circle cx={28} cy={28} r={22} fill="#374151"/></svg>},
        {label:"Square",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvRect cx={28} cy={28} s={36}/></svg>},
        {label:"Triangle", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvTri cx={28} cy={28} s={20}/></svg>},
      ]},

    // B1-Q4: Dot count series 1→2→3→? = 4 dots
    { id:4, title:"Dot Count", instruction:"How many dots come next?", ans:1,
      renderStimulus:()=>(
        <svg viewBox="0 0 280 70" width={280} height={70} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={1} cols={4} cs={70}/>
          <circle cx={35} cy={35} r={7} fill="#374151"/>
          <RvDots cx={105} cy={35} n={2} r={7}/>
          <RvDots cx={175} cy={35} n={3} r={7}/>
          <RvQMark cx={245} cy={35}/>
        </svg>),
      options:[
        {label:"2 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={2} r={7}/></svg>},
        {label:"4 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={4} r={8}/></svg>},
        {label:"6 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={6} r={8}/></svg>},
        {label:"5 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={5} r={8}/></svg>},
      ]},

    // B1-Q5: Arrow direction cycle → ↓ ← ? = ↑
    { id:5, title:"Arrow Direction", instruction:"Which arrow direction comes next?", ans:2,
      renderStimulus:()=>(
        <svg viewBox="0 0 280 70" width={280} height={70} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={1} cols={4} cs={70}/>
          <RvArrow cx={35}  cy={35} dir="right" size={16}/>
          <RvArrow cx={105} cy={35} dir="down"  size={16}/>
          <RvArrow cx={175} cy={35} dir="left"  size={16}/>
          <RvQMark cx={245} cy={35}/>
        </svg>),
      options:[
        {label:"Right →", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="right" size={16}/></svg>},
        {label:"Down ↓",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="down"  size={16}/></svg>},
        {label:"Up ↑",    render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="up"    size={16}/></svg>},
        {label:"Left ←",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="left"  size={16}/></svg>},
      ]},

    // B1-Q6: Same shape repeats across each row — 3×3 (△row, ○row, □row) — missing: □
    { id:6, title:"Row Rule", instruction:"Which shape completes the bottom row?", ans:2,
      renderStimulus:()=>(
        <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={3} cols={3}/>
          <RvTri cx={35} cy={35} s={20}/><RvTri cx={105} cy={35} s={20}/><RvTri cx={175} cy={35} s={20}/>
          <RvCircle cx={35} cy={105} r={20}/><RvCircle cx={105} cy={105} r={20}/><RvCircle cx={175} cy={105} r={20}/>
          <RvRect cx={35} cy={175} s={38}/><RvRect cx={105} cy={175} s={38}/>
          <RvQMark cx={175} cy={175}/>
        </svg>),
      options:[
        {label:"Triangle", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvTri cx={28} cy={28} s={20}/></svg>},
        {label:"Circle",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvCircle cx={28} cy={28} r={20}/></svg>},
        {label:"Square",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvRect cx={28} cy={28} s={38}/></svg>},
        {label:"Diamond",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDiam cx={28} cy={28} s={20}/></svg>},
      ]},
  ],

  2: [
    // B2-Q1: Dot doubling 1→2→4→? = 8
    { id:7, title:"Dot Count", instruction:"How many dots fill the next box?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 280 70" width={280} height={70} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={1} cols={4} cs={70}/>
          <RvDot cx={35} cy={35}/>
          <RvDot cx={91} cy={22}/><RvDot cx={119} cy={48}/>
          <RvDot cx={155} cy={22}/><RvDot cx={175} cy={22}/><RvDot cx={155} cy={48}/><RvDot cx={175} cy={48}/>
          <RvQMark cx={245} cy={35}/>
        </svg>),
      options:[
        {label:"8 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={8} r={4.5}/></svg>},
        {label:"3 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={3} r={5}/></svg>},
        {label:"5 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={5} r={5}/></svg>},
        {label:"6 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={6} r={4.5}/></svg>},
      ]},

    // B2-Q2: Arrow rotation 90° clockwise: → ↓ ← ? = ↑
    { id:8, title:"Arrow Direction", instruction:"Which arrow direction comes next?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 280 70" width={280} height={70} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={1} cols={4} cs={70}/>
          <RvArrow cx={35} cy={35} dir="right" size={15}/>
          <RvArrow cx={105} cy={35} dir="down"  size={15}/>
          <RvArrow cx={175} cy={35} dir="left"  size={15}/>
          <RvQMark cx={245} cy={35}/>
        </svg>),
      options:[
        {label:"Up",    render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="up"    size={14}/></svg>},
        {label:"Right", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="right" size={14}/></svg>},
        {label:"Down",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="down"  size={14}/></svg>},
        {label:"Left",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="left"  size={14}/></svg>},
      ]},

    // B2-Q3: Checkerboard alternating fill — bottom-right cell missing
    { id:9, title:"Grid Pattern", instruction:"Which tile completes the checkerboard?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={3} cols={3}/>
          {[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]].map(([r,c])=>(
            (r+c)%2===0
              ?<rect key={`${r}${c}`} x={c*70+8} y={r*70+8} width={54} height={54} fill="#374151" rx={5}/>
              :<rect key={`${r}${c}`} x={c*70+8} y={r*70+8} width={54} height={54} fill="none" stroke="#CBD5E1" strokeWidth={2} rx={5}/>
          ))}
          <RvQMark cx={175} cy={175}/>
        </svg>),
      options:[
        {label:"Filled",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><rect x={6} y={6} width={44} height={44} fill="#374151" rx={5}/></svg>},
        {label:"Empty",    render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><rect x={6} y={6} width={44} height={44} fill="none" stroke="#CBD5E1" strokeWidth={2.5} rx={5}/></svg>},
        {label:"Triangle", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvTri cx={28} cy={28} s={19} fill="#374151" stroke="none" sw={0}/></svg>},
        {label:"Circle",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><circle cx={28} cy={28} r={22} fill="#374151"/></svg>},
      ]},

    // B2-Q4: Count increases per column (1→2→3 shapes per col), shape changes per row
    { id:10, title:"Count Pattern", instruction:"How many squares complete the bottom row?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={3} cols={3}/>
          <RvTri cx={35} cy={35} s={17} fill="#374151" stroke="none" sw={0}/>
          <RvTri cx={93} cy={35} s={14} fill="#374151" stroke="none" sw={0}/><RvTri cx={117} cy={35} s={14} fill="#374151" stroke="none" sw={0}/>
          <RvTri cx={150} cy={35} s={12} fill="#374151" stroke="none" sw={0}/><RvTri cx={170} cy={35} s={12} fill="#374151" stroke="none" sw={0}/><RvTri cx={190} cy={35} s={12} fill="#374151" stroke="none" sw={0}/>
          <RvDot cx={35} cy={105} r={15}/>
          <RvDot cx={93} cy={105} r={11}/><RvDot cx={117} cy={105} r={11}/>
          <RvDot cx={150} cy={105} r={10}/><RvDot cx={170} cy={105} r={10}/><RvDot cx={190} cy={105} r={10}/>
          <rect x={13} y={153} width={44} height={44} fill="none" stroke="#374151" strokeWidth={2.5}/>
          <rect x={79} y={158} width={32} height={32} fill="none" stroke="#374151" strokeWidth={2.5}/>
          <rect x={113} y={158} width={32} height={32} fill="none" stroke="#374151" strokeWidth={2.5}/>
          <RvQMark cx={175} cy={175}/>
        </svg>),
      options:[
        {label:"Three □", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56">
            <rect x={3}  y={18} width={15} height={15} fill="none" stroke="#374151" strokeWidth={2}/>
            <rect x={21} y={18} width={15} height={15} fill="none" stroke="#374151" strokeWidth={2}/>
            <rect x={39} y={18} width={15} height={15} fill="none" stroke="#374151" strokeWidth={2}/>
          </svg>},
        {label:"One □",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><rect x={14} y={14} width={28} height={28} fill="none" stroke="#374151" strokeWidth={2.5}/></svg>},
        {label:"Four □",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56">
            {[3,17,31,45].map(x=><rect key={x} x={x} y={20} width={11} height={11} fill="none" stroke="#374151" strokeWidth={2}/>)}
          </svg>},
        {label:"Two □",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56">
            <rect x={9}  y={18} width={16} height={16} fill="none" stroke="#374151" strokeWidth={2}/>
            <rect x={32} y={18} width={16} height={16} fill="none" stroke="#374151" strokeWidth={2}/>
          </svg>},
      ]},

    // B2-Q5: Two attributes — large/small × filled/empty in 1×4
    // large-filled, small-filled, large-empty, ? = small-empty
    { id:11, title:"Size & Fill", instruction:"Which tile fits the pattern?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 280 70" width={280} height={70} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={1} cols={4} cs={70}/>
          <rect x={11} y={11} width={48} height={48} fill="#374151" rx={5}/>
          <rect x={90} y={26} width={30} height={30} fill="#374151" rx={4}/>
          <rect x={151} y={11} width={48} height={48} fill="none" stroke="#374151" strokeWidth={2.5} rx={5}/>
          <RvQMark cx={245} cy={35}/>
        </svg>),
      options:[
        {label:"Small □", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><rect x={13} y={13} width={30} height={30} fill="none" stroke="#374151" strokeWidth={2.5} rx={4}/></svg>},
        {label:"Large □", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><rect x={3} y={3} width={50} height={50} fill="none" stroke="#374151" strokeWidth={2.5} rx={5}/></svg>},
        {label:"Small ■", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><rect x={13} y={13} width={30} height={30} fill="#374151" rx={4}/></svg>},
        {label:"Large ■", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><rect x={3} y={3} width={50} height={50} fill="#374151" rx={5}/></svg>},
      ]},

    // B2-Q6: Shape per column (○□△) × shade per row (dark→grey→outline) — 3×3
    // Missing: (row2, col2) = outline triangle
    { id:12, title:"Shape & Shade", instruction:"Which shape belongs in the empty box?", ans:0,
      renderStimulus:()=>{
        const fills=["#374151","#94A3B8",null];
        return (
          <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
            <RvGrid rows={3} cols={3}/>
            {[0,1,2].flatMap(r=>[0,1,2].map(c=>{
              if(r===2&&c===2) return <RvQMark key="q" cx={175} cy={175}/>;
              const cx=35+c*70, cy=35+r*70;
              const fill=fills[r];
              if(c===0) return <circle key={`${r}${c}`} cx={cx} cy={cy} r={22} fill={fill||"none"} stroke={fill?null:"#374151"} strokeWidth={fill?0:2.5}/>;
              if(c===1) return <rect key={`${r}${c}`} x={cx-20} y={cy-20} width={40} height={40} fill={fill||"none"} stroke={fill?null:"#374151"} strokeWidth={fill?0:2.5} rx={3}/>;
              return <RvTri key={`${r}${c}`} cx={cx} cy={cy} s={22} fill={fill||"none"} stroke={fill?null:"#374151"} sw={fill?0:2.5}/>;
            }))}
          </svg>
        );
      },
      options:[
        {label:"Empty △",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvTri cx={28} cy={28} s={22}/></svg>},
        {label:"Filled △", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvTri cx={28} cy={28} s={22} fill="#374151" stroke="none" sw={0}/></svg>},
        {label:"Grey △",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvTri cx={28} cy={28} s={22} fill="#94A3B8" stroke="none" sw={0}/></svg>},
        {label:"Empty ○",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvCircle cx={28} cy={28} r={22}/></svg>},
      ]},
  ],

  3: [
    // B3-Q1: Two rules — shape changes per row AND size shrinks per column
    { id:13, title:"Size & Shape", instruction:"Which shape belongs in the empty box?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={3} cols={3}/>
          <RvCircle cx={35} cy={35} r={27}/><RvCircle cx={105} cy={35} r={20}/><RvCircle cx={175} cy={35} r={12}/>
          <RvRect cx={35} cy={105} s={50}/><RvRect cx={105} cy={105} s={38}/><RvRect cx={175} cy={105} s={23}/>
          <RvTri cx={35} cy={175} s={27}/><RvTri cx={105} cy={175} s={20}/>
          <RvQMark cx={175} cy={175}/>
        </svg>),
      options:[
        {label:"Small △", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvTri cx={28} cy={28} s={12}/></svg>},
        {label:"Large △", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvTri cx={28} cy={28} s={24}/></svg>},
        {label:"Small ○", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvCircle cx={28} cy={28} r={12}/></svg>},
        {label:"Large ○", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvCircle cx={28} cy={28} r={24}/></svg>},
      ]},

    // B3-Q2: Shade gradient dark→grey→light repeats in every row — 3×3
    { id:14, title:"Shade Pattern", instruction:"Which shade belongs in the empty box?", ans:0,
      renderStimulus:()=>{
        const shades=["#1F2937","#94A3B8","#F1F5F9"];
        return(
          <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
            <RvGrid rows={3} cols={3}/>
            {[0,1,2].flatMap(r=>shades.map((fill,c)=>{
              if(r===2&&c===2) return null;
              return <rect key={`${r}${c}`} x={c*70+8} y={r*70+8} width={54} height={54} fill={fill} rx={6}/>;
            }))}
            <RvQMark cx={175} cy={175}/>
          </svg>);
      },
      options:[
        {label:"Light",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><rect x={5} y={5} width={46} height={46} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={1.5} rx={6}/></svg>},
        {label:"Dark",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><rect x={5} y={5} width={46} height={46} fill="#1F2937" rx={6}/></svg>},
        {label:"Medium", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><rect x={5} y={5} width={46} height={46} fill="#94A3B8" rx={6}/></svg>},
        {label:"Black",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><rect x={5} y={5} width={46} height={46} fill="#000" rx={6}/></svg>},
      ]},

    // B3-Q3: Two rules — arrow direction changes per row AND size decreases per column
    { id:15, title:"Direction & Size", instruction:"Which arrow completes the pattern?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={3} cols={3}/>
          <RvArrow cx={35}  cy={35}  dir="right" size={20}/>
          <RvArrow cx={105} cy={35}  dir="right" size={14}/>
          <RvArrow cx={175} cy={35}  dir="right" size={8}/>
          <RvArrow cx={35}  cy={105} dir="down" size={20}/>
          <RvArrow cx={105} cy={105} dir="down" size={14}/>
          <RvArrow cx={175} cy={105} dir="down" size={8}/>
          <RvArrow cx={35}  cy={175} dir="left" size={20}/>
          <RvArrow cx={105} cy={175} dir="left" size={14}/>
          <RvQMark cx={175} cy={175}/>
        </svg>),
      options:[
        {label:"Small ←",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="left"  size={8}/></svg>},
        {label:"Large ←",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="left"  size={20}/></svg>},
        {label:"Small →",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="right" size={8}/></svg>},
        {label:"Med ↓",    render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="down"  size={14}/></svg>},
      ]},

    // B3-Q4: Two rules — shape type per row (○□△) × count per column (1,2,3) — 3×3
    // Missing: (row2,col2) = 3 triangles
    { id:16, title:"Shape & Count", instruction:"What fills the missing cell?", ans:0,
      renderStimulus:()=>{
        const S=['c','s','t'];
        const draw=(sh,cx,cy,sz,key)=>{
          if(sh==='c') return <circle key={key} cx={cx} cy={cy} r={sz} fill="#374151"/>;
          if(sh==='s') return <rect key={key} x={cx-sz} y={cy-sz} width={sz*2} height={sz*2} fill="#374151" rx={2}/>;
          return <RvTri key={key} cx={cx} cy={cy} s={sz+3} fill="#374151" stroke="none" sw={0}/>;
        };
        return (
          <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
            <RvGrid rows={3} cols={3}/>
            {[0,1,2].flatMap(r=>[0,1,2].flatMap(c=>{
              if(r===2&&c===2) return [<RvQMark key="q" cx={175} cy={175}/>];
              const cx=35+c*70, cy=35+r*70, cnt=c+1;
              const sz=cnt===1?17:cnt===2?13:10;
              if(cnt===1) return [draw(S[r],cx,cy,sz,`${r}${c}0`)];
              if(cnt===2) return [draw(S[r],cx-13,cy,sz,`${r}${c}0`),draw(S[r],cx+13,cy,sz,`${r}${c}1`)];
              return [draw(S[r],cx-19,cy,sz,`${r}${c}0`),draw(S[r],cx,cy,sz,`${r}${c}1`),draw(S[r],cx+19,cy,sz,`${r}${c}2`)];
            }))}
          </svg>
        );
      },
      options:[
        {label:"3 △", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56">
          {[-18,0,18].map(dx=><RvTri key={dx} cx={28+dx} cy={28} s={13} fill="#374151" stroke="none" sw={0}/>)}
        </svg>},
        {label:"2 △", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56">
          {[-13,13].map(dx=><RvTri key={dx} cx={28+dx} cy={28} s={15} fill="#374151" stroke="none" sw={0}/>)}
        </svg>},
        {label:"3 ○", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56">
          {[-18,0,18].map(dx=><circle key={dx} cx={28+dx} cy={28} r={10} fill="#374151"/>)}
        </svg>},
        {label:"3 □", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56">
          {[-18,0,18].map(dx=><rect key={dx} x={18+dx} y={18} width={20} height={20} fill="#374151" rx={2}/>)}
        </svg>},
      ]},

    // B3-Q5: Two rules — outer shape per column (○□△) × inner dot count per row (0,1,2) — 3×3
    // Missing: (row2, col2) = triangle with 2 inner dots
    { id:17, title:"Inner Dots", instruction:"What belongs in the missing cell?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={3} cols={3}/>
          {[0,1,2].flatMap(r=>[0,1,2].flatMap(c=>{
            if(r===2&&c===2) return [<RvQMark key="q" cx={175} cy={175}/>];
            const cx=35+c*70, cy=35+r*70;
            const outer = c===0
              ? <circle key={`o${r}${c}`} cx={cx} cy={cy} r={26} fill="none" stroke="#374151" strokeWidth={2.5}/>
              : c===1
              ? <rect key={`o${r}${c}`} x={cx-24} y={cy-24} width={48} height={48} fill="none" stroke="#374151" strokeWidth={2.5} rx={3}/>
              : <RvTri key={`o${r}${c}`} cx={cx} cy={cy} s={27} fill="none" stroke="#374151" sw={2.5}/>;
            const dots = r===0 ? [] : r===1
              ? [<circle key={`d${r}${c}0`} cx={cx} cy={cy} r={6} fill="#374151"/>]
              : [<circle key={`d${r}${c}0`} cx={cx-9} cy={cy} r={5} fill="#374151"/>,
                 <circle key={`d${r}${c}1`} cx={cx+9} cy={cy} r={5} fill="#374151"/>];
            return [outer,...dots];
          }))}
        </svg>),
      options:[
        {label:"△ 2 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56">
          <RvTri cx={28} cy={28} s={25} fill="none" stroke="#374151" sw={2.5}/>
          <circle cx={20} cy={30} r={5} fill="#374151"/><circle cx={36} cy={30} r={5} fill="#374151"/>
        </svg>},
        {label:"△ 1 dot", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56">
          <RvTri cx={28} cy={28} s={25} fill="none" stroke="#374151" sw={2.5}/>
          <circle cx={28} cy={30} r={6} fill="#374151"/>
        </svg>},
        {label:"○ 2 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56">
          <circle cx={28} cy={28} r={25} fill="none" stroke="#374151" strokeWidth={2.5}/>
          <circle cx={20} cy={28} r={5} fill="#374151"/><circle cx={36} cy={28} r={5} fill="#374151"/>
        </svg>},
        {label:"□ 2 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56">
          <rect x={2} y={2} width={52} height={52} fill="none" stroke="#374151" strokeWidth={2.5} rx={3}/>
          <circle cx={20} cy={28} r={5} fill="#374151"/><circle cx={36} cy={28} r={5} fill="#374151"/>
        </svg>},
      ]},

    // B3-Q6: Additive rule — cell (r,c) contains (r+c+1) dots — 3×3
    // (0,0)=1, (0,1)=2, (0,2)=3 / (1,0)=2, (1,1)=3, (1,2)=4 / (2,0)=3, (2,1)=4, (2,2)=? = 5
    { id:18, title:"Dot Rule", instruction:"How many dots belong in the empty cell?", ans:1,
      renderStimulus:()=>(
        <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={3} cols={3}/>
          {[0,1,2].flatMap(r=>[0,1,2].map(c=>{
            const n=r+c+1;
            const cx=35+c*70, cy=35+r*70;
            if(r===2&&c===2) return <RvQMark key="q" cx={175} cy={175}/>;
            return <RvDots key={`${r}${c}`} cx={cx} cy={cy} n={n} r={n<=3?7:6}/>;
          }))}
        </svg>),
      options:[
        {label:"4 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={4} r={8}/></svg>},
        {label:"5 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={5} r={8}/></svg>},
        {label:"6 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={6} r={8}/></svg>},
        {label:"3 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={3} r={8}/></svg>},
      ]},
  ],

  4: [
    // B4-Q1: Multiplication rule — cell(r,c) = (r+1)×(c+1) dots
    { id:19, title:"Dot Matrix", instruction:"How many dots belong in the missing cell?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={3} cols={3}/>
          {[[1,2,3],[2,4,6],[3,6,null]].flatMap((row,r)=>row.map((n,c)=>{
            const cx=35+c*70, cy=35+r*70;
            if(n===null) return <RvQMark key="q" cx={175} cy={175}/>;
            return <RvDots key={`${r}${c}`} cx={cx} cy={cy} n={n} r={5}/>;
          }))}
        </svg>),
      options:[
        {label:"9 dots",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={9}  r={4}/></svg>},
        {label:"7 dots",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={7}  r={4}/></svg>},
        {label:"8 dots",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={8}  r={4}/></svg>},
        {label:"12 dots", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvDots cx={28} cy={28} n={12} r={3.5}/></svg>},
      ]},

    // B4-Q2: Polygon sides matrix — n sides = r+c+3; final cell (2,2)=7 sides
    { id:20, title:"Shape Sides", instruction:"Which shape has the correct number of sides?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={3} cols={3}/>
          {[[3,4,5],[4,5,6],[5,6,null]].flatMap((row,r)=>row.map((n,c)=>{
            const cx=35+c*70, cy=35+r*70;
            if(n===null) return <RvQMark key="q" cx={175} cy={175}/>;
            return <RvPoly key={`${r}${c}`} cx={cx} cy={cy} n={n} r={24}/>;
          }))}
        </svg>),
      options:[
        {label:"7 sides", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvPoly cx={28} cy={28} n={7} r={22}/></svg>},
        {label:"5 sides", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvPoly cx={28} cy={28} n={5} r={22}/></svg>},
        {label:"6 sides", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvPoly cx={28} cy={28} n={6} r={22}/></svg>},
        {label:"8 sides", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvPoly cx={28} cy={28} n={8} r={22}/></svg>},
      ]},

    // B4-Q3: Two rules — sides = r+c+3 AND fill alternates by (r+c) parity
    // Even parity = filled, odd parity = empty
    // (2,2): sides=7, parity=4(even) → filled 7-gon
    { id:21, title:"Sides & Fill", instruction:"Which shape belongs in the empty cell?", ans:0,
      renderStimulus:()=>(
        <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
          <RvGrid rows={3} cols={3}/>
          {[0,1,2].flatMap(r=>[0,1,2].map(c=>{
            if(r===2&&c===2) return <RvQMark key="q" cx={175} cy={175}/>;
            const cx=35+c*70, cy=35+r*70, n=r+c+3, filled=(r+c)%2===0;
            return <RvPoly key={`${r}${c}`} cx={cx} cy={cy} n={n} r={24}
              fill={filled?"#374151":"none"} stroke={filled?"none":"#374151"} sw={filled?0:2.5}/>;
          }))}
        </svg>),
      options:[
        {label:"Filled 7-gon", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvPoly cx={28} cy={28} n={7} r={23} fill="#374151" stroke="none" sw={0}/></svg>},
        {label:"Empty 7-gon",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvPoly cx={28} cy={28} n={7} r={23} fill="none" stroke="#374151" sw={2.5}/></svg>},
        {label:"Filled 8-gon", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvPoly cx={28} cy={28} n={8} r={23} fill="#374151" stroke="none" sw={0}/></svg>},
        {label:"Empty 6-gon",  render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvPoly cx={28} cy={28} n={6} r={23} fill="none" stroke="#374151" sw={2.5}/></svg>},
      ]},

    // B4-Q4: Three rules — direction = dirs[(r+c)%4], size per column, placed in 3×3
    // dirs: 0=right,1=down,2=left,3=up. sizes col0=large,col1=med,col2=small
    // (2,2): (r+c)%4 = 4%4 = 0 = right, size = small → small right arrow
    { id:22, title:"Direction & Size Matrix", instruction:"Which arrow completes the pattern?", ans:0,
      renderStimulus:()=>{
        const dirs=["right","down","left","up"], sizes=[20,14,8];
        return (
          <svg viewBox="0 0 210 210" width={210} height={210} style={{display:'block',margin:'0 auto'}}>
            <RvGrid rows={3} cols={3}/>
            {[0,1,2].flatMap(r=>[0,1,2].map(c=>{
              if(r===2&&c===2) return <RvQMark key="q" cx={175} cy={175}/>;
              return <RvArrow key={`${r}${c}`} cx={35+c*70} cy={35+r*70} dir={dirs[(r+c)%4]} size={sizes[c]}/>;
            }))}
          </svg>
        );
      },
      options:[
        {label:"Small →", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="right" size={8}/></svg>},
        {label:"Small ↓", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="down"  size={8}/></svg>},
        {label:"Med →",   render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="right" size={14}/></svg>},
        {label:"Small ←", render:(sz=56)=><svg width={sz} height={sz} viewBox="0 0 56 56"><RvArrow cx={28} cy={28} dir="left"  size={8}/></svg>},
      ]},
  ],
};


// ── CAT Advancement Rules ─────────────────────────────────────────────────────
// Each band: 6 items (4 for band 4). passThreshold = 4 correct to advance.
const CAT_RULES = {
  1: { passThreshold:4, label:"Foundation",  iqBase:70,  range:15, maLo:7,  maHi:9  },
  2: { passThreshold:4, label:"Standard",    iqBase:85,  range:15, maLo:9,  maHi:12 },
  3: { passThreshold:4, label:"Advanced",    iqBase:100, range:15, maLo:12, maHi:15 },
  4: { passThreshold:3, label:"Exceptional", iqBase:115, range:15, maLo:15, maHi:18 },
};

// IQ + Mental Age lookup based on highest band reached and within-band performance
const scoreCAT = (d1) => {
  const band = d1._band || 1;
  const b = { 1:d1._b1||0, 2:d1._b2||0, 3:d1._b3||0, 4:d1._b4||0 };
  const totalCorrect = b[1]+b[2]+b[3]+b[4];
  const totalQ = Object.keys(d1).filter(k=>!k.startsWith('_')).length;
  const rule = CAT_RULES[band];
  const bc   = b[band];
  const bandTotal = RAVENS_CAT[band].length;

  // IQ estimate: band base + proportional within-band score
  const iq = Math.round(rule.iqBase + (bc / bandTotal) * rule.range);

  // Mental Age: interpolated within band's MA range
  const ma = parseFloat((rule.maLo + (bc / bandTotal) * (rule.maHi - rule.maLo)).toFixed(1));

  // Descriptive label
  const label =
    iq < 80  ? "Below Average"  :
    iq < 90  ? "Low Average"    :
    iq < 110 ? "Average"        :
    iq < 120 ? "High Average"   :
    iq < 130 ? "Superior"       : "Exceptional";

  // Approximate percentile (normal distribution table)
  const pctRank =
    iq >= 130 ? 98 : iq >= 125 ? 95 : iq >= 120 ? 91 : iq >= 115 ? 84 :
    iq >= 110 ? 75 : iq >= 105 ? 63 : iq >= 100 ? 50 : iq >= 95  ? 37 :
    iq >= 90  ? 25 : iq >= 85  ? 16 : iq >= 80  ? 9  : 5;

  return { iq, ma, label, pctRank, band, bandScores:b, totalCorrect, totalQ };
};

const BFI10 = [
  { id:1,  text:"I am outgoing and sociable",                     dom:"E", rev:false },
  { id:2,  text:"I am sometimes rude or critical to others",      dom:"A", rev:true  },
  { id:3,  text:"I am reliable and can always be counted on",     dom:"C", rev:false },
  { id:4,  text:"I worry a lot",                                  dom:"N", rev:false },
  { id:5,  text:"I enjoy creative work and new ideas",            dom:"O", rev:false },
  { id:6,  text:"I am quiet and reserved",                        dom:"E", rev:true  },
  { id:7,  text:"I am generally trusting and cooperative",        dom:"A", rev:false },
  { id:8,  text:"I can be somewhat lazy or disorganised",         dom:"C", rev:true  },
  { id:9,  text:"I stay calm and emotionally stable",             dom:"N", rev:true  },
  { id:10, text:"I have few artistic or creative interests",      dom:"O", rev:true  },
];

const DUKE17 = [
  // Functional (Duke: 0=limited lot, 1=limited little, 2=not limited)
  { id:1,  q:"Do strenuous activities (fast walking, cycling, sports)", type:"func" },
  { id:2,  q:"Do moderate activities (sweeping, light housework)",      type:"func" },
  { id:3,  q:"Climb one flight of stairs",                              type:"func" },
  { id:4,  q:"Bend, lift, or stoop",                                    type:"func" },
  // Frequency past week (0=none, 1=little, 2=some, 3=most, 4=all)
  { id:5,  q:"Visit with friends or relatives",                         type:"freq", neg:false },
  { id:6,  q:"Done work, housework, or schoolwork",                     type:"freq", neg:false },
  { id:7,  q:"Been happy",                                              type:"freq", neg:false },
  { id:8,  q:"Had a lot of energy",                                     type:"freq", neg:false },
  { id:9,  q:"Been depressed or sad",                                   type:"freq", neg:true  },
  { id:10, q:"Been nervous or worried",                                 type:"freq", neg:true  },
  { id:11, q:"Felt worthwhile as a person",                             type:"freq", neg:false },
  { id:14, q:"Had trouble sleeping",                                    type:"freq", neg:true  },
  { id:15, q:"Had physical pain limiting activities",                   type:"freq", neg:true  },
  { id:16, q:"Got along well with other people",                        type:"freq", neg:false },
  // Health ratings (0=poor, 4=excellent)
  { id:12, q:"Overall physical health in the past week",                type:"health" },
  { id:13, q:"Mental or emotional health in the past week",             type:"health" },
  { id:17, q:"Compared to others your age, your health is…",           type:"compare" },
];

const PHQ9 = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or let yourself down",
  "Trouble concentrating on things such as reading or watching TV",
  "Moving or speaking so slowly others could notice — or the opposite, being fidgety",
  "Thoughts that you would be better off dead, or of hurting yourself in some way",
];

const AUDITC = [
  { q:"How often do you have a drink containing alcohol?",
    opts:["Never","Monthly or less","2–4 times a month","2–3 times a week","4+ times a week"], sc:[0,1,2,3,4] },
  { q:"How many drinks on a typical drinking day?",
    opts:["1–2","3–4","5–6","7–9","10 or more"], sc:[0,1,2,3,4] },
  { q:"How often do you have 6+ drinks on one occasion?",
    opts:["Never","Less than monthly","Monthly","Weekly","Daily/almost daily"], sc:[0,1,2,3,4] },
];

const CSSRS = [
  "Have you wished you were dead or hoped you could go to sleep and not wake up?",
  "Have you had any actual thoughts of killing yourself?",
  "Have you been thinking about how you might do this?",
  "Have you had these thoughts and had some intention of acting on them?",
  "Have you started to work out or act on the details of how to kill yourself?",
];

const SDQCP = [
  { q:"I often have temper tantrums or hot tempers",      rev:false },
  { q:"I usually do as I am told",                        rev:true  },
  { q:"I fight a lot or bully others to get what I want", rev:false },
  { q:"I am often accused of lying or cheating",          rev:false },
  { q:"I take things that do not belong to me",           rev:false },
];


// ── VALID: Scoring Helpers + Norms ───────────────────────────────
// ─────────────── SCORING HELPERS ───────────────────────────────────────────

const scoreBFI = (resp) => {
  // BFI-10 standard scoring (Rammstedt & John, 2007)
  // Each domain: (forward_item + (6 - reverse_item)) / 2  → range 1–5
  // Forward items: E=1, A=7, C=3, N=4, O=5
  // Reverse items: E=6, A=2, C=8, N=9, O=10
  const doms = { O:[5,10], C:[3,8], E:[1,6], A:[7,2], N:[4,9] };
  const result = {};
  Object.entries(doms).forEach(([d,[f,r]]) => {
    const fv = resp[f] !== undefined ? resp[f] : 3;
    const rv = resp[r] !== undefined ? resp[r] : 3;
    result[d] = ((fv + (6 - rv)) / 2).toFixed(1);
  });
  return result;
};

const scoreDuke = (resp) => {
  const get = (id) => resp[id] !== undefined ? resp[id] : 2;
  // Physical: items 1,2,3,4 (func 0-2 each, max 8)
  const phys    = Math.round((get(1)+get(2)+get(3)+get(4)) / 8 * 100);
  // Mental: items 7,8,11(pos) + 9,10(neg reversed) (freq 0-4 each, max 20)
  const mental  = Math.round((get(7)+get(8)+(4-get(9))+(4-get(10))+get(11)) / 20 * 100);
  // Social: items 5,6,16 (freq 0-4 each, max 12)
  const social  = Math.round((get(5)+get(6)+get(16)) / 12 * 100);
  // General: mean of three functional scales
  const general = Math.round((phys+mental+social) / 3);
  // Self-Esteem: items 7+11 (happy+worthwhile, both 0-4, max 8) — Parkerson 1990
  const selfEsteem = Math.round((get(7)+get(11)) / 8 * 100);
  // Anxiety: items 10+14 (nervous+sleepless, both 0-4, max 8) — higher=worse
  const anxiety    = Math.round((get(10)+get(14)) / 8 * 100);
  // Depression: item9 + (4-item11) (sad + not-worthwhile, max 8) — higher=worse
  const depression = Math.round((get(9)+(4-get(11))) / 8 * 100);
  // Perceived health: items 12,13 (health 0-4 each, max 8)
  const perceived  = Math.round((get(12)+get(13)) / 8 * 100);
  // Pain: item 15 (neg freq, higher=more pain)
  const pain       = Math.round(get(15) / 4 * 100);
  // Disability: item 1 reversed (0=a lot limited → disability=100)
  const disability = Math.round((2-get(1)) / 2 * 100);
  return { phys, mental, social, general, selfEsteem, anxiety, depression, perceived, pain, disability };
};

const scorePHQ = (resp) => Object.values(resp).reduce((a,b)=>a+b,0);

const classPHQ = (score) => {
  if (score<=4)  return { label:"Minimal / None", color:"#10B981", risk:"low" };
  if (score<=9)  return { label:"Mild",           color:"#84CC16", risk:"low" };
  if (score<=14) return { label:"Moderate",       color:"#F59E0B", risk:"moderate" };
  if (score<=19) return { label:"Moderately Severe", color:"#F97316", risk:"high" };
  return              { label:"Severe",           color:"#EF4444", risk:"high" };
};

const scoreCSS = (resp) => {
  const pos = Object.values(resp).filter(Boolean).length;
  if (pos===0) return { score:0, level:0, label:"No ideation", color:"#10B981" };
  if (pos<=1)  return { score:1, level:1, label:"Passive ideation", color:"#84CC16" };
  if (pos<=2)  return { score:2, level:2, label:"Active ideation (no plan)", color:"#F59E0B" };
  if (pos<=3)  return { score:3, level:3, label:"Ideation with plan", color:"#F97316" };
  return       { score:4, level:4, label:"Intent with rehearsal", color:"#EF4444" };
};

const scoreAUDIT = (resp) => {
  const s = Object.entries(resp).reduce((a,[k,v]) => a + AUDITC[parseInt(k)].sc[v], 0);
  if (s<=3)  return { score:s, level:0, label:"Low risk", color:"#10B981" };
  if (s<=7)  return { score:s, level:1, label:"Hazardous use", color:"#F59E0B" };
  return     { score:s, level:2, label:"Harmful / Dependent", color:"#EF4444" };
};

// ── Age-adjusted normative ranges ────────────────────────────────────────────
// Source: Parkerson 1990 (Duke), Rammstedt & John 2007 (BFI-10),
//         NIMHANS/ICMR reference data for Indian adult population.
const getAgeNorms = (age) => {
  const a = parseInt(age) || 30;
  const g = a < 36 ? "young" : a < 56 ? "mid" : "older";
  return {
    // Duke functional scales (higher=better, 0-100)
    phys:       { young:[75,100], mid:[65,100], older:[50,100] }[g],
    mental:     { young:[65,100], mid:[60,100], older:[55,100] }[g],
    social:     { young:[60,100], mid:[55,100], older:[50,100] }[g],
    general:    { young:[67,100], mid:[60,100], older:[52,100] }[g],
    selfEsteem: { young:[70,100], mid:[65,100], older:[60,100] }[g],
    perceived:  { young:[60,100], mid:[55,100], older:[50,100] }[g],
    // Duke dysfunction scales (lower=better, 0-100)
    anxiety:    { young:[0,25],   mid:[0,30],   older:[0,38]   }[g],
    depression: { young:[0,20],   mid:[0,25],   older:[0,32]   }[g],
    pain:       { young:[0,20],   mid:[0,30],   older:[0,40]   }[g],
    disability: { young:[0,15],   mid:[0,25],   older:[0,40]   }[g],
    // BFI-10 T-score normal ranges (M=50, SD=10)
    bfi: {
      O: { young:[38,65], mid:[36,63], older:[34,62] }[g],
      C: { young:[38,65], mid:[42,68], older:[45,70] }[g],
      E: { young:[38,65], mid:[36,63], older:[34,62] }[g],
      A: { young:[38,63], mid:[42,66], older:[45,68] }[g],
      N: { young:[36,64], mid:[33,62], older:[30,58] }[g],
    },
    // Ravens IQ age-adjustment (Average band centre)
    iqAvgLo: { young:90, mid:88, older:82 }[g],
    iqAvgHi: { young:110, mid:108, older:100 }[g],
    group: g,
    label: { young:"Young Adult (18–35)", mid:"Middle Adult (36–55)", older:"Older Adult (56+)" }[g],
  };
};

const generateLocalUID = (mobile, dob, gender) => {
  const last6 = (mobile||"").replace(/\D/g,"").slice(-6).padStart(6,"0");
  const now = new Date();
  const dd = String(now.getDate()).padStart(2,"0");
  const mm = String(now.getMonth()+1).padStart(2,"0");
  const yy = String(now.getFullYear()).slice(-2);
  const g = (gender||"X")[0].toUpperCase();
  return `SC-${last6}-${dd}${mm}${yy}-${g}`;
};


// ── VALID: UI Atoms ───────────────────────────────────────────────
// ─────────────── TINY UI ATOMS ─────────────────────────────────────────────

const cx = (...args) => args.filter(Boolean).join(" ");

const Pill = ({ children, color="#3B82F6" }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
    style={{ background: color + "18", color, border: `1px solid ${color}33` }}>
    {children}
  </span>
);

const ScoreBar = ({ value, max=100, color="#3B82F6", label, sub }) => {
  const pct = Math.min(100, Math.round((value/max)*100));
  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs font-semibold text-gray-700">{label}</span>
        <span className="text-sm font-black" style={{ color }}>{pct}</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}99, ${color})` }}/>
      </div>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
};

const SectionHead = ({ icon, title, color="#1A2E4A", badge }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
    <span className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
      style={{ background: color + "18" }}>{icon}</span>
    <div className="flex-1">
      <p className="font-black text-sm text-gray-800">{title}</p>
    </div>
    {badge && <Pill color={badge.color}>{badge.text}</Pill>}
  </div>
);

// ─────────────── SCREENS ───────────────────────────────────────────────────

// ════ WELCOME ════════════════════════════════════════════════════════════════

// ── VALID: Eligibility Screener ──────────────────────────────────
// ════ ELIGIBILITY (3-step) ════════════════════════════════════════════════
const Eligibility = ({ onResult }) => {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState([]);

  const pass = (ok) => {
    const nr = [...results, ok];
    setResults(nr);
    if (step < 2) setTimeout(() => setStep(s => s + 1), 350);
    else {
      const allPass = nr.every(Boolean);
      setTimeout(() => onResult(allPass ? "self" : "assisted"), 500);
    }
  };

  const steps = [
    {
      inst: "Tap the CIRCLE",
      items: [
        { id:"circle",   label:"Circle",   render: <svg width={56} height={56} viewBox="0 0 56 56"><circle cx={28} cy={28} r={22} fill="#6B7280"/></svg> },
        { id:"triangle", label:"Triangle", render: <svg width={56} height={56} viewBox="0 0 56 56"><polygon points="28,6 50,50 6,50" fill="#6B7280"/></svg> },
        { id:"square",   label:"Square",   render: <svg width={56} height={56} viewBox="0 0 56 56"><rect x={6} y={6} width={44} height={44} fill="#6B7280"/></svg> },
      ],
      ans: "circle",
    },
    {
      inst: "Tap the HAPPY face",
      items: [
        { id:"happy",   label:"Happy",   render: <HappyFace/> },
        { id:"neutral", label:"Neutral", render: <NeutralFace/> },
        { id:"sad",     label:"Sad",     render: <SadFace/> },
      ],
      ans: "happy",
    },
    {
      inst: "Tap RED first, then the SQUARE",
      twoStep: true,
    },
  ];

  if (step < 2) {
    const s = steps[step];
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b px-4 py-3">
          <p className="text-xs text-center text-gray-400 mb-2">Orientation Check — Step {step+1} of 3</p>
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className="flex-1 h-2 rounded-full"
                style={{ background: i < step ? "#10B981" : i === step ? "#8B5CF6" : "#E5E7EB" }}/>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center mb-8">
              <p className="text-xl font-black text-purple-800">{s.inst}</p>
            </div>
            <div className="flex justify-around">
              {s.items.map(item => (
                <button key={item.id} onClick={() => pass(item.id === s.ans)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-200 bg-white active:scale-95 transition-all">
                  {item.render}
                  <span className="text-xs text-gray-500">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Two-step task
  return <TwoStepTask onDone={(ok) => pass(ok)} stepIndex={step} totalSteps={3}/>;
};

// Inline face SVGs
const HappyFace = () => (
  <svg width={56} height={56} viewBox="0 0 56 56">
    <circle cx={28} cy={28} r={24} fill="#FDE047"/>
    <ellipse cx={20} cy={24} rx={3} ry={3} fill="#1F2937"/>
    <ellipse cx={36} cy={24} rx={3} ry={3} fill="#1F2937"/>
    <path d="M18 34 Q28 44 38 34" stroke="#1F2937" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
  </svg>
);
const NeutralFace = () => (
  <svg width={56} height={56} viewBox="0 0 56 56">
    <circle cx={28} cy={28} r={24} fill="#D1D5DB"/>
    <ellipse cx={20} cy={24} rx={3} ry={3} fill="#1F2937"/>
    <ellipse cx={36} cy={24} rx={3} ry={3} fill="#1F2937"/>
    <line x1={19} y1={36} x2={37} y2={36} stroke="#1F2937" strokeWidth={2.5} strokeLinecap="round"/>
  </svg>
);
const SadFace = () => (
  <svg width={56} height={56} viewBox="0 0 56 56">
    <circle cx={28} cy={28} r={24} fill="#BFDBFE"/>
    <ellipse cx={20} cy={24} rx={3} ry={3} fill="#1F2937"/>
    <ellipse cx={36} cy={24} rx={3} ry={3} fill="#1F2937"/>
    <path d="M18 40 Q28 30 38 40" stroke="#1F2937" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
  </svg>
);

const TwoStepTask = ({ onDone, stepIndex, totalSteps }) => {
  const [seq, setSeq] = useState([]);
  const items = [
    { id:"rc", isRed:true,  isSquare:false, label:"Red Circle",     shape:"circle", fill:"#EF4444" },
    { id:"bs", isRed:false, isSquare:true,  label:"Blue Square",    shape:"square",  fill:"#3B82F6" },
    { id:"gt", isRed:false, isSquare:false, label:"Green Triangle", shape:"triangle",fill:"#22C55E" },
    { id:"ys", isRed:false, isSquare:true,  label:"Yellow Square",  shape:"square",  fill:"#EAB308" },
  ];
  const ShapeEl = ({ shape, fill }) => (
    <svg width={48} height={48} viewBox="0 0 48 48">
      {shape==="circle"   && <circle cx={24} cy={24} r={20} fill={fill}/>}
      {shape==="square"   && <rect x={4} y={4} width={40} height={40} fill={fill}/>}
      {shape==="triangle" && <polygon points="24,4 44,44 4,44" fill={fill}/>}
    </svg>
  );
  const tap = (item) => {
    if (seq.find(s=>s.id===item.id)) return;
    const ns = [...seq, item];
    setSeq(ns);
    if (ns.length===2) {
      const ok = ns[0].isRed && ns[1].isSquare;
      setTimeout(() => onDone(ok), 400);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-4 py-3">
        <p className="text-xs text-center text-gray-400 mb-2">Orientation Check — Step {stepIndex+1} of {totalSteps}</p>
        <div className="flex gap-1.5">
          {Array.from({length:totalSteps}).map((_,i) => (
            <div key={i} className="flex-1 h-2 rounded-full"
              style={{ background: i < stepIndex ? "#10B981" : i===stepIndex ? "#8B5CF6" : "#E5E7EB" }}/>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center mb-6">
            <p className="text-xl font-black text-purple-800">Tap RED first, then the SQUARE</p>
            <p className="text-sm text-purple-500 mt-1">
              {seq.length===0 ? "Touch any red item →" : seq.length===1 ? "Now touch any square →" : ""}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {items.map(item => {
              const idx = seq.findIndex(s=>s.id===item.id);
              return (
                <button key={item.id} onClick={()=>tap(item)} disabled={idx!==-1}
                  className={cx("flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                    idx!==-1 ? "border-green-400 bg-green-50" : "border-gray-200 bg-white active:scale-95")}>
                  <ShapeEl shape={item.shape} fill={item.fill}/>
                  <span className="text-xs text-gray-500">{item.label}</span>
                  {idx!==-1 && <span className="text-xs font-bold text-green-600">Step {idx+1} ✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


// ── VALID: Domain Meta + Assessment Container ────────────────────
// ════ DOMAIN NAVIGATOR ═══════════════════════════════════════════════════════
const DOMAIN_META = [
  { id:1, code:"D1", name:"Cognition",   color:"#3B82F6", bg:"#EFF6FF", icon:"🧩", count:22 },
  { id:2, code:"D2", name:"Personality", color:"#8B5CF6", bg:"#F5F3FF", icon:"🪞", count:10 },
  { id:3, code:"D3", name:"Health",      color:"#10B981", bg:"#F0FDF4", icon:"💚", count:17 },
  { id:4, code:"D4", name:"Risk",        color:"#EF4444", bg:"#FEF2F2", icon:"🛡", count:13 },
];

// ════ ASSESSMENT CONTAINER ════════════════════════════════════════════════════
const Assessment = ({ mode, onComplete }) => {
  const [domain, setDomain] = useState(1);
  const [resp, setResp] = useState({ d1:{}, d2:{}, d3:{}, d4:{} });
  const scrollRef = useRef(null);

  const set = (d, k, v) => setResp(r => ({ ...r, [`d${d}`]: { ...r[`d${d}`], [k]: v } }));
  const answered = (d) => d===1
    ? Object.keys(resp.d1).filter(k=>!k.startsWith('_')).length
    : Object.keys(resp[`d${d}`]).length;
  const complete = (d) => d===1
    ? resp.d1._done === 1
    : Object.keys(resp[`d${d}`]).length >= DOMAIN_META[d-1].count;
  const pct = () => {
    const total = DOMAIN_META.reduce((s,m)=>s+m.count,0);
    const done  = DOMAIN_META.reduce((s,m)=>s+answered(m.id),0);
    return Math.round(done/total*100);
  };
  const allDone = DOMAIN_META.every(m => complete(m.id));
  const cd = DOMAIN_META[Math.min(domain,DOMAIN_META.length)-1];

  const nextDomain = () => {
    if (domain < DOMAIN_META.length) { setDomain(d=>d+1); scrollRef.current?.scrollTo(0,0); }
    else onComplete(resp);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-purple-600">CIBS-VALID</span>
          <span className="text-xs text-gray-400">{pct()}% complete</span>
        </div>
        {/* Domain tabs */}
        <div className="flex gap-1">
          {DOMAIN_META.map(m => (
            <button key={m.id} onClick={()=>{ setDomain(m.id); scrollRef.current?.scrollTo(0,0); }}
              className="flex-1 h-2 rounded-full transition-all"
              style={{ background: complete(m.id)?"#10B981": m.id===domain? m.color:"#E5E7EB" }}/>
          ))}
        </div>
        <div className="flex mt-1">
          {DOMAIN_META.map(m => (
            <button key={m.id} onClick={()=>{ setDomain(m.id); scrollRef.current?.scrollTo(0,0); }}
              className="flex-1 text-center text-xs py-0.5 font-bold transition-all"
              style={{ color: complete(m.id)?"#10B981": m.id===domain? m.color:"#CBD5E1" }}>
              {complete(m.id) ? "✓" : m.code}
            </button>
          ))}
        </div>
      </div>

      {/* Domain pill */}
      <div className="px-4 pt-3 pb-1 max-w-sm mx-auto w-full">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: cd.bg, border:`1px solid ${cd.color}33` }}>
          <span>{cd.icon}</span>
          <div>
            <p className="text-xs font-black" style={{ color:cd.color }}>{cd.code} · {cd.name}</p>
            <p className="text-xs text-gray-400">
            {domain===1
              ? (resp.d1._done ? "Cognitive test complete ✓" : "Adaptive assessment in progress")
              : `${answered(domain)}/${cd.count} answered`}
          </p>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 max-w-sm mx-auto w-full">
        {domain===1 && <DomainCognition set={(k,v)=>set(1,k,v)} color={cd.color} bg={cd.bg}/>}
        {domain===2 && <DomainPersonality resp={resp.d2} set={(k,v)=>set(2,k,v)} color={cd.color} bg={cd.bg}/>}
        {domain===3 && <DomainHealth resp={resp.d3} set={(k,v)=>set(3,k,v)} color={cd.color} bg={cd.bg}/>}
        {domain===4 && <DomainRisk resp={resp.d4} set={(k,v)=>set(4,k,v)} color={cd.color} bg={cd.bg} mode={mode}/>}

        <div className="pt-4 pb-8 space-y-3">
          {!complete(domain) && domain!==1 && (
            <p className="text-center text-xs text-gray-400">
              {cd.count - answered(domain)} more question{cd.count - answered(domain) !== 1 ? "s" : ""} remaining in this domain
            </p>
          )}
          {complete(domain) && (
            <button onClick={nextDomain}
              className="w-full py-4 rounded-2xl font-black text-white text-sm"
              style={{ background: `linear-gradient(135deg,${cd.color},${cd.color}cc)` }}>
              {domain < DOMAIN_META.length ? `Continue → ${DOMAIN_META[domain].name}` : "Complete Assessment ✅"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── VALID: Domain Components (Cognition, Personality, Health, Risk)
// ════ DOMAIN 1 — COGNITION (Adaptive CAT Engine) ══════════════════════════════
const BAND_LABELS = {
  1:"Foundation Level", 2:"Standard Level", 3:"Advanced Level", 4:"Exceptional Level"
};
const BAND_TRANSITIONS = {
  1:"Great start! The patterns are about to get more interesting.",
  2:"Excellent work! You're ready for more complex reasoning challenges.",
  3:"Outstanding! You've reached our most advanced questions.",
};
const BAND_COLORS = { 1:"#3B82F6", 2:"#8B5CF6", 3:"#F59E0B", 4:"#EF4444" };
const BAND_ICONS  = { 1:"🔵", 2:"🟣", 3:"🟡", 4:"🔴" };

const DomainCognition = ({ set, color, bg }) => {
  const [phase, setPhase]     = useState('intro');      // intro | testing | transition | done
  const [band, setBand]       = useState(1);
  const [qIdx, setQIdx]       = useState(0);
  const [selected, setSelected] = useState(null);       // index of chosen option, for highlight
  const [bandCorrect, setBandCorrect] = useState({1:0,2:0,3:0,4:0});
  const [transMsg, setTransMsg] = useState('');
  const [totalQ, setTotalQ]   = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [finalBand, setFinalBand] = useState(null);

  const items   = RAVENS_CAT[band] || [];
  const item    = items[qIdx];
  const bColor  = BAND_COLORS[band];
  const qNumber = Object.values(RAVENS_CAT).slice(0,band-1).flat().length + qIdx + 1;

  const finish = useCallback((fBand, bCorrect, tQ, tC) => {
    // Store everything into parent resp.d1
    set('_done', 1);
    set('_band', fBand);
    set('_b1', bCorrect[1]);
    set('_b2', bCorrect[2]);
    set('_b3', bCorrect[3]);
    set('_b4', bCorrect[4]);
    set('_correct', tC);
    set('_total', tQ);
    setFinalBand(fBand);
    setPhase('done');
  }, [set]);

  const handleAnswer = useCallback((optIdx) => {
    if (selected !== null || phase !== 'testing') return;
    setSelected(optIdx);

    const isCorrect = optIdx === item.ans;
    set(item.id, optIdx); // store in parent

    const newBandCorrect = { ...bandCorrect, [band]: bandCorrect[band] + (isCorrect?1:0) };
    const newTotalQ      = totalQ + 1;
    const newTotalC      = totalCorrect + (isCorrect?1:0);

    setBandCorrect(newBandCorrect);
    setTotalQ(newTotalQ);
    setTotalCorrect(newTotalC);

    setTimeout(() => {
      const nextQIdx = qIdx + 1;

      if (nextQIdx < items.length) {
        // More questions remain in this band — advance
        setQIdx(nextQIdx);
        setSelected(null);
      } else {
        // Band complete — check pass/fail
        const bc = newBandCorrect[band];
        const passed = bc >= CAT_RULES[band].passThreshold;

        if (passed && band < 4) {
          // Advance to next band — show transition screen
          setTransMsg(BAND_TRANSITIONS[band]);
          setPhase('transition');
          setTimeout(() => {
            setBand(b => b+1);
            setQIdx(0);
            setSelected(null);
            setPhase('testing');
          }, 2200);
        } else {
          // Test complete
          finish(band, newBandCorrect, newTotalQ, newTotalC);
        }
      }
    }, 650);
  }, [selected, phase, item, band, qIdx, items, bandCorrect, totalQ, totalCorrect, finish, set]);

  // ── INTRO SCREEN ───────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5" style={{ background:bg, border:`1.5px solid ${color}44` }}>
        <p className="text-sm font-black mb-1" style={{color}}>🧩 Cognitive Pattern Completion</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          You will see a series of visual patterns — shapes, dots, arrows, and grids.
          Each pattern has an empty space. <strong>Tap the picture that best completes the pattern.</strong>
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
        {[
          ["🕐","Take your time","There is no time limit. Think carefully before tapping."],
          ["🔍","Look at the whole pattern","Consider rows, columns, and any rules that repeat."],
          ["✅","Tap to confirm","Once you tap an answer the next pattern appears automatically."],
        ].map(([icon,head,sub])=>(
          <div key={head} className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <div><p className="text-sm font-bold text-gray-800">{head}</p>
              <p className="text-xs text-gray-500">{sub}</p></div>
          </div>
        ))}
      </div>
      <button onClick={()=>setPhase('testing')}
        className="w-full py-4 rounded-2xl font-black text-white text-base"
        style={{background:`linear-gradient(135deg,${color},${color}cc)`}}>
        Begin Pattern Test →
      </button>
    </div>
  );

  // ── BAND TRANSITION SCREEN ─────────────────────────────────────────────────
  if (phase === 'transition') return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-5">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{background:BAND_COLORS[band+1]+"18",border:`3px solid ${BAND_COLORS[band+1]}44`}}>
        ✨
      </div>
      <p className="text-xl font-black text-gray-800 text-center">Well done!</p>
      <p className="text-sm text-gray-600 text-center leading-relaxed max-w-xs">{transMsg}</p>
      <div className="flex gap-2 mt-2">
        {[1,2,3,4].map(b=>(
          <div key={b} className="w-3 h-3 rounded-full transition-all"
            style={{background: b<=band ? BAND_COLORS[b] : "#E5E7EB"}}/>
        ))}
      </div>
      <p className="text-xs text-gray-400">Next challenge loading…</p>
    </div>
  );

  // ── DONE SCREEN ────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const result = scoreCAT({ _band:finalBand,
      _b1:bandCorrect[1],_b2:bandCorrect[2],_b3:bandCorrect[3],_b4:bandCorrect[4] });
    return (
      <div className="space-y-4">
        <div className="rounded-2xl p-5 text-center"
          style={{background:`linear-gradient(135deg,${color}12,${color}06)`,border:`2px solid ${color}33`}}>
          <p className="text-3xl mb-1">🎯</p>
          <p className="text-lg font-black text-gray-800 mb-0.5">Pattern Test Complete</p>
          <p className="text-sm text-gray-500">{totalQ} question{totalQ!==1?'s':''} answered across {finalBand} level{finalBand!==1?'s':''}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            {label:"Estimated CQ", val:`~${result.iq}`, color:"#3B82F6"},
            {label:"Classification", val:result.label, color:BAND_COLORS[finalBand]},
          ].map(item=>(
            <div key={item.label} className="bg-white rounded-2xl border border-gray-200 p-3 text-center">
              <p className="text-base font-black" style={{color:item.color}}>{item.val}</p>
              <p className="text-xs text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Band-by-Band Progress</p>
          {[1,2,3,4].map(b=>{
            const reached = b <= finalBand;
            const bc = bandCorrect[b];
            const bt = RAVENS_CAT[b].length;
            return (
              <div key={b} className="flex items-center gap-3 mb-2">
                <span className="text-base w-6">{reached?BAND_ICONS[b]:'⬜'}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-700">{BAND_LABELS[b]}</p>
                  <p className="text-xs text-gray-400">IQ {CAT_RULES[b].iqBase}–{CAT_RULES[b].iqBase+CAT_RULES[b].range}</p>
                </div>
                <span className="text-sm font-black" style={{color:reached?BAND_COLORS[b]:"#D1D5DB"}}>
                  {reached ? `${bc}/${bt}` : '—'}
                </span>
              </div>
            );
          })}
        </div>
        <div className="rounded-xl p-3 text-xs text-center text-gray-400"
          style={{background:"#F8FAFC",border:"1px solid #E2E8F0"}}>
          Tap <strong>"Continue → Personality"</strong> below to proceed
        </div>
      </div>
    );
  }

  // ── ACTIVE TEST SCREEN ─────────────────────────────────────────────────────
  const bandTotal = items.length;
  const bandPct   = Math.round((qIdx / bandTotal) * 100);
  const val       = selected;

  return (
    <div className="space-y-4">
      {/* Band indicator + question counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">{BAND_ICONS[band]}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{background:bColor+"15",color:bColor}}>{BAND_LABELS[band]}</span>
        </div>
        <span className="text-xs font-bold text-gray-400">Question {qNumber}</span>
      </div>

      {/* Active question card */}
      <div className="bg-white rounded-2xl border-2 p-4 shadow-sm"
        style={{borderColor:bColor+"44"}}>
        {/* Item header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
            style={{background:bColor}}>{qNumber}</span>
          <div>
            <p className="text-sm font-bold text-gray-800">{item.title}</p>
            <p className="text-xs text-gray-400">{item.instruction}</p>
          </div>
        </div>

        {/* Stimulus */}
        <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 mb-4 flex items-center justify-center py-3">
          {item.renderStimulus()}
        </div>

        {/* 2×2 option grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {item.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(i)}
              disabled={val !== null}
              className={cx(
                "flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all active:scale-95",
                val === i
                  ? "shadow-md scale-105"
                  : val !== null
                  ? "opacity-40 border-gray-200 bg-white"
                  : "border-gray-200 bg-white hover:border-blue-200"
              )}
              style={val===i ? {borderColor:bColor, background:bColor+"15"} : {}}>
              <div className="flex items-center justify-center h-14">
                {opt.render(52)}
              </div>
              <span className="text-xs font-semibold"
                style={{color: val===i ? bColor : "#9CA3AF"}}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Band progress bar */}
      <div className="px-1">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-400">Progress in this level</span>
          <span className="text-xs font-bold" style={{color:bColor}}>{qIdx+1}/{bandTotal}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{width:`${((qIdx+1)/bandTotal)*100}%`,background:bColor}}/>
        </div>
      </div>
    </div>
  );
};

// ════ DOMAIN 2 — PERSONALITY (BFI-10) ═══════════════════════════════════════
const DomainPersonality = ({ resp, set, color, bg }) => (
  <div className="space-y-3">
    <div className="rounded-xl p-3 text-xs" style={{ background:bg, border:`1px solid ${color}33` }}>
      <strong style={{color}}>Big Five Personality — BFI-10</strong><br/>
      <span className="text-gray-600">
        Rate how well each statement describes you. <br/>
        1 = Strongly Disagree &nbsp;·&nbsp; 5 = Strongly Agree
      </span>
    </div>
    {BFI10.map(item => {
      const val = resp[item.id];
      const domLabel = { O:"Openness", C:"Conscientiousness", E:"Extraversion", A:"Agreeableness", N:"Neuroticism" }[item.dom];
      return (
        <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-1.5 py-0.5 rounded font-medium"
              style={{ background:color+"18", color }}>{item.dom}</span>
            <span className="text-xs text-gray-400">{domLabel}</span>
            {item.rev && <span className="text-xs text-orange-400 ml-auto">reversed</span>}
          </div>
          <p className="text-sm text-gray-700 mb-3">{item.id}. {item.text}</p>
          <div className="flex gap-1.5">
            {[1,2,3,4,5].map(v => (
              <button key={v} onClick={() => set(item.id, v)}
                className={cx("flex-1 py-2.5 rounded-xl text-sm font-black border-2 transition-all",
                  val===v ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-300")}>
                {v}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-1 px-1">
            <span className="text-xs text-gray-300">Disagree</span>
            <span className="text-xs text-gray-300">Agree</span>
          </div>
        </div>
      );
    })}
  </div>
);

// ════ DOMAIN 3 — HEALTH (Duke-17) ════════════════════════════════════════════
const DomainHealth = ({ resp, set, color, bg }) => {

  // ── Option configs per question type ─────────────────────────────────────
  const FUNC_OPTS = [
    { label:"No — I could not do it at all",        icon:"🔴", sub:"Too difficult or impossible" },
    { label:"Yes — but with quite a bit of effort", icon:"🟡", sub:"Managed, but not easily" },
    { label:"Yes — easily, no problem at all",      icon:"🟢", sub:"No difficulty" },
  ];

  const FREQ_OPTS_POS = [  // positive items (higher = better)
    { label:"Never",                     icon:"😞", sub:"0 days" },
    { label:"Rarely",                    icon:"😐", sub:"1–2 days" },
    { label:"Sometimes",                 icon:"🙂", sub:"3–4 days" },
    { label:"Often",                     icon:"😊", sub:"5–6 days" },
    { label:"Always",                    icon:"😄", sub:"Every day" },
  ];

  const FREQ_OPTS_NEG = [  // negative items (higher = worse — shown in natural language, reversed internally)
    { label:"Never",                     icon:"😄", sub:"0 days" },
    { label:"Rarely",                    icon:"😊", sub:"1–2 days" },
    { label:"Sometimes",                 icon:"🙂", sub:"3–4 days" },
    { label:"Often",                     icon:"😐", sub:"5–6 days" },
    { label:"Always",                    icon:"😞", sub:"Every day" },
  ];

  const HEALTH_OPTS = [
    { label:"Very Poor",   icon:"😟", color:"#EF4444" },
    { label:"Poor",        icon:"😕", color:"#F97316" },
    { label:"Fair",        icon:"😐", color:"#EAB308" },
    { label:"Good",        icon:"🙂", color:"#84CC16" },
    { label:"Excellent",   icon:"😄", color:"#10B981" },
  ];

  const CMP_OPTS = [
    { label:"Much worse",      icon:"⬇⬇", color:"#EF4444" },
    { label:"Somewhat worse",  icon:"⬇",  color:"#F97316" },
    { label:"About the same",  icon:"↔",  color:"#6B7280" },
    { label:"Somewhat better", icon:"⬆",  color:"#84CC16" },
    { label:"Much better",     icon:"⬆⬆", color:"#10B981" },
  ];

  // ── Section divider component ─────────────────────────────────────────────
  const SectionBanner = ({ icon, title, instruction, example }) => (
    <div className="rounded-2xl p-4 mt-2" style={{ background: color+"10", border:`2px solid ${color}33` }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <p className="text-sm font-black" style={{ color }}>{title}</p>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-1">{instruction}</p>
      {example && (
        <div className="rounded-xl px-3 py-2 mt-2 text-xs"
          style={{ background:"white", border:`1px solid ${color}33` }}>
          <span className="font-bold" style={{ color }}>Example: </span>
          <span className="text-gray-600">{example}</span>
        </div>
      )}
    </div>
  );

  // ── Card per question ─────────────────────────────────────────────────────
  const QuestionCard = ({ item, opts, renderOpts }) => {
    const val = resp[item.id];
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-800 mb-3 leading-snug">
          {item.q}
        </p>
        {renderOpts(val)}
      </div>
    );
  };

  // ── Render helpers per type ───────────────────────────────────────────────
  const renderFunc = (item) => {
    const val = resp[item.id];
    return (
      <div className="space-y-2">
        {FUNC_OPTS.map((opt, i) => (
          <button key={i} onClick={() => set(item.id, i)}
            className={cx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all active:scale-98 text-left",
              val===i
                ? "border-green-500 bg-green-50"
                : "border-gray-200 bg-white hover:border-green-300"
            )}>
            <span className="text-xl flex-shrink-0">{opt.icon}</span>
            <div>
              <p className={cx("text-sm font-bold", val===i?"text-green-800":"text-gray-700")}>{opt.label}</p>
              <p className="text-xs text-gray-400">{opt.sub}</p>
            </div>
            {val===i && <span className="ml-auto text-green-500 text-base font-black">✓</span>}
          </button>
        ))}
      </div>
    );
  };

  const renderFreq = (item) => {
    const val = resp[item.id];
    const opts = item.neg ? FREQ_OPTS_NEG : FREQ_OPTS_POS;
    return (
      <div className="grid grid-cols-5 gap-1.5">
        {opts.map((opt, i) => (
          <button key={i} onClick={() => set(item.id, i)}
            className={cx(
              "flex flex-col items-center gap-1 py-3 px-1 rounded-2xl border-2 transition-all active:scale-95",
              val===i ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"
            )}>
            <span className="text-xl">{opt.icon}</span>
            <span className={cx("text-xs font-bold text-center leading-tight",
              val===i ? "text-green-700" : "text-gray-500")}>{opt.label}</span>
            <span className="text-xs text-gray-300 text-center leading-tight">{opt.sub}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderHealth = (item) => {
    const val = resp[item.id];
    return (
      <div className="grid grid-cols-5 gap-1.5">
        {HEALTH_OPTS.map((opt, i) => (
          <button key={i} onClick={() => set(item.id, i)}
            className={cx(
              "flex flex-col items-center gap-1 py-3 px-1 rounded-2xl border-2 transition-all active:scale-95",
              val===i ? "border-2 shadow-sm" : "border-gray-200 bg-white"
            )}
            style={val===i ? { borderColor:opt.color, background:opt.color+"15" } : {}}>
            <span className="text-2xl">{opt.icon}</span>
            <span className="text-xs font-bold text-center leading-tight"
              style={{ color: val===i ? opt.color : "#9CA3AF" }}>
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    );
  };

  const renderCompare = (item) => {
    const val = resp[item.id];
    return (
      <div className="grid grid-cols-5 gap-1.5">
        {CMP_OPTS.map((opt, i) => (
          <button key={i} onClick={() => set(item.id, i)}
            className={cx(
              "flex flex-col items-center gap-1 py-3 px-1 rounded-2xl border-2 transition-all active:scale-95",
              val===i ? "border-2 shadow-sm" : "border-gray-200 bg-white"
            )}
            style={val===i ? { borderColor:opt.color, background:opt.color+"15" } : {}}>
            <span className="text-base font-black" style={{ color: val===i ? opt.color : "#D1D5DB" }}>{opt.icon}</span>
            <span className="text-xs font-bold text-center leading-tight"
              style={{ color: val===i ? opt.color : "#9CA3AF" }}>
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    );
  };

  // ── Group items by type ───────────────────────────────────────────────────
  const funcItems  = DUKE17.filter(i => i.type==="func");
  const freqItems  = DUKE17.filter(i => i.type==="freq");
  const healthItems= DUKE17.filter(i => i.type==="health");
  const cmpItems   = DUKE17.filter(i => i.type==="compare");

  return (
    <div className="space-y-3">

      {/* ── Top intro ── */}
      <div className="rounded-2xl p-4" style={{ background:bg, border:`1.5px solid ${color}44` }}>
        <p className="text-sm font-black mb-1" style={{ color }}>💚 Duke Health Profile — DUKE-17</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          This section asks about your <strong>health and daily activities over the past 7 days</strong>.
          Answer based on how things have actually been — not how you would like them to be.
          There are <strong>17 questions</strong> in 4 short groups.
        </p>
      </div>

      {/* ══ GROUP 1: Physical Ability ══════════════════════════════════════ */}
      <SectionBanner
        icon="🏃"
        title="Group 1 of 4 — Physical Abilities"
        instruction="For each activity below, tell us whether you were able to do it during the past week. Tap the option that best describes your experience."
        example="If climbing stairs was very difficult or impossible for you this week, choose the red option. If you could do it easily, choose the green one."
      />
      {funcItems.map(item => (
        <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-800 mb-3 leading-snug">
            During the past week, were you able to:
            <span className="block text-base font-black text-gray-900 mt-1">
              {item.q}?
            </span>
          </p>
          {renderFunc(item)}
        </div>
      ))}

      {/* ══ GROUP 2: Daily Life Frequency ══════════════════════════════════ */}
      <SectionBanner
        icon="📅"
        title="Group 2 of 4 — How Often in the Past Week"
        instruction="For each statement, choose how many days out of the past 7 days this was true for you. Tap the face that matches best."
        example="If you felt happy on most days this week, tap 'Often' or 'Always'. If you never felt worried, tap 'Never'."
      />
      {freqItems.map(item => (
        <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-800 mb-1 leading-snug">
            In the past week, how often did you:
          </p>
          <p className="text-base font-black text-gray-900 mb-3">{item.q}?</p>
          {renderFreq(item)}
        </div>
      ))}

      {/* ══ GROUP 3: Health Ratings ═════════════════════════════════════════ */}
      <SectionBanner
        icon="⭐"
        title="Group 3 of 4 — Rate Your Health"
        instruction="Give an overall rating for your health in the past week. Tap the face that matches how your health has been — honestly, as it has felt to you."
        example="If your physical health felt good but not great, tap 'Good'. If your mental health felt excellent, tap 'Excellent'."
      />
      {healthItems.map(item => (
        <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <p className="text-base font-black text-gray-900 mb-3 leading-snug">{item.q}</p>
          {renderHealth(item)}
        </div>
      ))}

      {/* ══ GROUP 4: Comparison ════════════════════════════════════════════ */}
      <SectionBanner
        icon="⚖️"
        title="Group 4 of 4 — Compared to Others Your Age"
        instruction="Think about other people you know who are roughly the same age as you. Compared to them overall, how would you say your health is?"
        example="If most people your age seem healthier than you, choose 'Somewhat worse'. If you feel healthier than most, choose 'Somewhat better' or 'Much better'."
      />
      {cmpItems.map(item => (
        <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <p className="text-base font-black text-gray-900 mb-3 leading-snug">{item.q}</p>
          {renderCompare(item)}
        </div>
      ))}

    </div>
  );
};

// ════ DOMAIN 4 — RISK ════════════════════════════════════════════════════════
const DomainRisk = ({ resp, set, color, bg, mode }) => (
  <div className="space-y-4">
    <div className="rounded-xl p-3 text-xs" style={{ background:bg, border:`1px solid ${color}33` }}>
      <strong style={{color}}>⚠️ Risk Factor Profile — D4</strong><br/>
      <span className="text-gray-600">
        These questions are asked for health monitoring only. All responses are strictly confidential.
        Answer honestly — this helps identify if any support might be needed.
      </span>
    </div>

    {/* C-SSRS */}
    <p className="text-xs font-black text-gray-500 uppercase tracking-wider px-1">Part A — Suicidality Screen (C-SSRS)</p>
    {CSSRS.map((q, i) => {
      const val = resp[`css${i+1}`];
      return (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-sm text-gray-700 mb-3">{i+1}. {q}</p>
          <div className="flex gap-2">
            {["Yes","No"].map((opt, j) => (
              <button key={j} onClick={() => set(`css${i+1}`, j===0)}
                className={cx("flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all",
                  val===(j===0) ? (j===0?"border-red-400 bg-red-50 text-red-700":"border-green-400 bg-green-50 text-green-700")
                    : "border-gray-200 text-gray-500")}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    })}

    {/* AUDIT-C — Q2 and Q3 skipped if Q1 = Never */}
    <p className="text-xs font-black text-gray-500 uppercase tracking-wider px-1 mt-2">Part B — Alcohol Screen (AUDIT-C)</p>
    {AUDITC.map((item, i) => {
      const val = resp[`aud${i+1}`];
      const q1Never = resp["aud1"] === 0;
      if (i > 0 && q1Never) return null;
      return (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-sm text-gray-700 mb-2">{item.q}</p>
          {i === 0 && <p className="text-xs text-gray-400 mb-2 italic">If you never drink alcohol, select "Never" — further questions will be skipped.</p>}
          <div className="space-y-1.5">
            {item.opts.map((opt, j) => (
              <button key={j} onClick={() => { set(`aud${i+1}`, j); if(j===0 && i===0){set("aud2",0);set("aud3",0);} }}
                className={cx("w-full text-left py-2 px-3 rounded-xl text-xs border-2 transition-all",
                  val===j ? "border-orange-500 bg-orange-50 text-orange-700 font-bold" : "border-gray-200 text-gray-600")}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    })}
    {resp["aud1"] === 0 && (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-3">
        <p className="text-sm text-green-700 font-bold">✓ Non-drinker confirmed — alcohol questions skipped</p>
        <p className="text-xs text-green-600 mt-1">AUDIT-C score recorded as 0</p>
      </div>
    )}

    {/* SDQ-CP */}
    <p className="text-xs font-black text-gray-500 uppercase tracking-wider px-1 mt-2">Part C — Conduct Profile (SDQ-CP)</p>
    {SDQCP.map((item, i) => {
      const val = resp[`sdq${i+1}`];
      return (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-sm text-gray-700 mb-2">{i+1}. {item.q}</p>
          <div className="flex gap-1.5">
            {["Not True","Somewhat True","Certainly True"].map((opt, j) => (
              <button key={j} onClick={() => set(`sdq${i+1}`, j)}
                className={cx("flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all",
                  val===j ? "border-red-400 bg-red-50 text-red-700" : "border-gray-200 text-gray-400")}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

// ════ DEMOGRAPHICS ════════════════════════════════════════════════════════════

// ── VALID: Alert Components + Wellbeing Report ───────────────────

// ─── Red Flag Alert Component ────────────────────────────────────────────────
const RedFlag = ({ title, body, helplines }) => (
  <div className="rounded-2xl p-4 mt-4" style={{
    background:"linear-gradient(135deg,#FFF1F1,#FFF7F7)",
    border:"2px solid #FCA5A5"
  }}>
    <div className="flex items-start gap-2.5 mb-2">
      <span className="text-xl flex-shrink-0 mt-0.5">🚨</span>
      <div>
        <p className="text-sm font-black text-red-700 mb-1">{title}</p>
        <p className="text-xs text-red-800 leading-relaxed">{body}</p>
      </div>
    </div>
    {helplines && (
      <div className="rounded-xl p-2.5 mt-2" style={{background:"#FEE2E2"}}>
        <p className="text-xs font-bold text-red-700 mb-1">Free Support — Available Now</p>
        {helplines.map((h,i) => (
          <p key={i} className="text-xs text-red-800">📞 {h}</p>
        ))}
      </div>
    )}
  </div>
);

// ─── Gentle Amber Flag Component ─────────────────────────────────────────────
const AmberFlag = ({ title, body, action }) => (
  <div className="rounded-2xl p-4 mt-3" style={{
    background:"linear-gradient(135deg,#FFFBEB,#FFFEF5)",
    border:"2px solid #FCD34D"
  }}>
    <div className="flex items-start gap-2.5">
      <span className="text-xl flex-shrink-0 mt-0.5">⚠️</span>
      <div>
        <p className="text-sm font-bold text-amber-800 mb-1">{title}</p>
        <p className="text-xs text-amber-900 leading-relaxed">{body}</p>
        {action && <p className="text-xs font-semibold text-amber-700 mt-1.5">→ {action}</p>}
      </div>
    </div>
  </div>
);

// ─── Strength Badge Component ─────────────────────────────────────────────────
const StrengthBadge = ({ text }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mr-1.5 mb-1.5"
    style={{background:"#F0FDF4", color:"#15803D", border:"1px solid #86EFAC"}}>
    ✦ {text}
  </span>
);

// ══════════════════════════════════════════════════════════════════════════════
// WELLBEING REPORT — Lucid, personal, narrative-driven
// ══════════════════════════════════════════════════════════════════════════════
const WellbeingReport = ({ bfi, duke, cssCl, audCl, ravensScore, ravensLabel, catResult, ageNorms, demographics }) => {

  const dn = ageNorms || getAgeNorms(demographics?.age);

  // ── Cognitive narrative ───────────────────────────────────────────────────
  const cognitiveNarrative = () => {
    const iq = catResult.iq, ma = catResult.ma, pct = catResult.pctRank;
    if (iq >= 115) return {
      headline:"Your reasoning is exceptional",
      body:`You solved advanced multi-rule patterns that require holding several logical principles in mind at once — a result that places you at the ${pct}th percentile, with a mental age equivalent of approximately ${ma} years. You have a natural ability to spot structure in complexity, think several steps ahead, and adapt quickly when a problem changes shape.`,
      strength:"Pattern recognition · Abstract thinking · Analytical depth"
    };
    if (iq >= 100) return {
      headline:"Your reasoning is above average",
      body:`You performed well on the pattern reasoning tasks — ${pct}th percentile, mental age approximately ${ma} years. Your mind picks up sequences and logical rules efficiently, which serves you well in problem-solving, learning new skills, and making sound decisions.`,
      strength:"Logical reasoning · Quick learning · Problem solving"
    };
    if (iq >= 85) return {
      headline:"Your reasoning is solid and practical",
      body:`You answered the pattern tasks at a level consistent with most adults — ${pct}th percentile, mental age approximately ${ma} years. Steady, practical, and reliable. You may think most effectively when you can take your time and work through things step by step.`,
      strength:"Steady thinking · Practical approach · Attention to detail"
    };
    return {
      headline:"Your reasoning may benefit from practice",
      body:`The pattern tasks in this section were challenging today — ${pct}th percentile, mental age approximately ${ma} years. This does not reflect your overall intelligence. Many forms of thinking and ability are simply not measured by visual pattern tests. Step-by-step reasoning is very much a skill that can grow with practice.`,
      strength:"Persistence · Effort · Room to grow"
    };
  };
  const cog = cognitiveNarrative();

  // ── Personality narrative ─────────────────────────────────────────────────
  const bfiNarrative = {
    O: {
      high:{ line:"Curious & Creative", desc:"You have an open, imaginative mind. You are drawn to new ideas, enjoy exploring possibilities, and feel energised by learning. You likely bring fresh perspectives to situations and may sometimes feel a little different from people who prefer routine — and that is a gift, not a flaw." },
      low: { line:"Grounded & Practical", desc:"You prefer what works over what is theoretical. You are comfortable with familiar routines and tend to trust experience over speculation. This pragmatic quality makes you reliable and realistic — qualities many people around you depend on." }
    },
    C: {
      high:{ line:"Reliable & Organised", desc:"You are someone others can count on. You follow through, plan ahead, and take your responsibilities seriously. This conscientiousness is one of the strongest predictors of long-term success and wellbeing — it is a genuine asset." },
      low: { line:"Flexible & Spontaneous", desc:"You tend to live more in the moment and may sometimes find rigid structure frustrating. While this can mean things occasionally slip through the cracks, your flexibility means you adapt well to change — a strength in an unpredictable world. Building a few simple routines can help you harness the best of both." }
    },
    E: {
      high:{ line:"Sociable & Energetic", desc:"You are energised by people and connection. You enjoy being part of conversations, group activities, and social situations. Your warmth and expressiveness make you easy to be around, and people likely find you approachable and engaging." },
      low: { line:"Reflective & Self-Sufficient", desc:"You recharge by spending time with yourself and do not need a lot of external stimulation to feel at ease. This quiet self-sufficiency allows you to think deeply and work independently. It is not shyness — it is a deliberate and valued way of being in the world." }
    },
    A: {
      high:{ line:"Warm & Cooperative", desc:"You genuinely care about the people around you and tend to put relationships first. Your cooperative nature and empathy make you a trusted friend and colleague. You likely go out of your way to keep things harmonious — which is a beautiful quality, as long as you also take care of your own needs." },
      low: { line:"Direct & Independent-minded", desc:"You say what you think and do not easily back down from your position. This directness can sometimes create friction, but it also means people always know where they stand with you — a form of honesty many genuinely respect. Channelled well, this quality is a real leadership strength." }
    },
    N: {
      high:{ line:"Emotionally Sensitive", desc:"You experience your emotions deeply and are attuned to changes in mood, both in yourself and in those around you. This sensitivity is also what makes you empathetic, creative, and authentic. The challenge is that it can also mean you carry stress and worry more intensely than others — and that is something worth actively managing with support and self-care." },
      low: { line:"Emotionally Steady", desc:"You are remarkably resilient under pressure. You tend to remain calm when things go wrong and recover quickly from setbacks. This emotional stability is one of the most protective factors for long-term mental health and is something many people quietly admire about people like you." }
    },
  };

  const bfiFlags = () => {
    const flags = [];
    if (+bfi.N > 4)   flags.push({ title:"You may be carrying more stress than usual", body:"Your responses suggest you are experiencing a notable level of emotional tension or worry right now. This is something many people go through, and it does not mean anything is permanently wrong. But it is worth acknowledging — and speaking with someone you trust or a counsellor can make a real difference.", action:"Consider speaking with a counsellor or your family doctor about how you have been feeling lately." });
    if (+bfi.A < 2)   flags.push({ title:"Relationships may feel difficult right now", body:"Your responses suggest some difficulty with trust or cooperation in relationships at the moment. This can sometimes be a sign of accumulated stress, past hurt, or feeling unsafe around others. It is worth reflecting on whether this is long-standing or a recent shift.", action:"A few sessions with a counsellor can be very helpful in untangling relationship patterns." });
    if (+bfi.C < 1.8) flags.push({ title:"Day-to-day functioning may be a challenge", body:"A very low score on reliability and organisation can sometimes signal that everyday tasks are feeling overwhelming. If you are struggling to manage daily responsibilities, please consider reaching out for support.", action:"Your doctor or a mental health professional can help identify what is making things feel so hard right now." });
    return flags;
  };

  // ── Health narrative ──────────────────────────────────────────────────────
  const healthNarrative = () => {
    const g = +duke.general;
    if (g >= 75) return { head:"Your overall health and wellbeing are in excellent shape", body:"All three pillars — physical, mental, and social health — are functioning well. You are in a strong position right now. The task ahead is to protect and maintain what you have built: regular activity, meaningful connection, and time to rest and restore." };
    if (g >= 55) return { head:"Your wellbeing is in a reasonable place with some areas to nurture", body:"You have real strengths across several areas of health, but something — physical energy, mood, or social connection — may not be quite where you want it. This is a good moment to pay a little more attention to whichever area feels most depleted, before a small dip becomes a larger one." };
    if (g >= 35) return { head:"Some areas of your health need attention right now", body:"Your scores suggest you may be going through a difficult period — physically, emotionally, or both. This is not unusual, and it does not mean things cannot improve. But it does mean this is a good time to reach out — to a doctor, a friend, a counsellor, or someone you trust — rather than pushing through alone." };
    return { head:"Your health and wellbeing are under significant strain", body:"Your responses across physical health, mental health, and social functioning all point to a period of real difficulty. Please do not try to manage this alone. Talking to a healthcare professional — even a single honest conversation — can open doors to support that makes a meaningful difference." };
  };
  const health = healthNarrative();

  const healthFlags = () => {
    const flags = [];
    if (+duke.phys < 30)    flags.push({ title:"Your physical health may need medical attention", body:"Your responses suggest significant limitations in physical activity and function. This is worth a conversation with your doctor, even if you have been putting it off.", action:"Book an appointment with your physician or a nearby primary health centre." });
    if (+duke.mental < 35)  flags.push({ title:"Your mental wellbeing is at a low point", body:"Very low mental health scores on the Duke scale, combined with other findings in this report, suggest you are carrying a significant emotional burden right now. Please do not wait for things to get worse before seeking support.", action:"A mental health professional — psychiatrist, psychologist, or counsellor — can help." });
    if (+duke.social < 30)  flags.push({ title:"You may be feeling isolated right now", body:"Social isolation is one of the strongest risk factors for depression and declining health. If you feel cut off from others, reaching out — even in a small way — matters more than you may realise.", action:"Even one regular social connection can meaningfully protect your mental health." });
    return flags;
  };

  // ── Mood narrative — based on Duke Depression & Anxiety subscales ────────
  const moodNarrative = () => {
    const dep = +duke.depression;
    const anx = +duke.anxiety;
    const depHigh = dep > dn.depression[1];
    const anxHigh = anx > dn.anxiety[1];
    if (!depHigh && !anxHigh) return {
      head:"Your mood and emotional wellbeing are in a healthy place",
      body:"Your responses across the health profile show no significant signs of depression or anxiety at this time. You appear to be managing life's demands without marked emotional distress — a real positive. Continue investing in the things that keep you well: sleep, connection, movement, and moments of meaning."
    };
    if (depHigh && anxHigh) return {
      head:"Your mood and anxiety scores both need attention",
      body:`Your Duke Health Profile shows elevated depression (${dep}/100, normal 0–${dn.depression[1]}) and anxiety (${anx}/100, normal 0–${dn.anxiety[1]}) for your age group. Experiencing both together is common and very treatable. Please do not try to manage this alone — speaking to a doctor or counsellor is an important next step.`
    };
    if (depHigh) return {
      head:"Your mood score suggests you may be experiencing low mood",
      body:`Your Duke Depression subscale score (${dep}/100) is above the normal range for your age group (0–${dn.depression[1]}). This suggests you have been feeling down, sad, or lacking a sense of worth more than usual recently. These feelings are real, valid, and respond well to support.`
    };
    return {
      head:"Your anxiety score suggests you may be feeling more stressed than usual",
      body:`Your Duke Anxiety subscale score (${anx}/100) is above the normal range for your age group (0–${dn.anxiety[1]}). Worry, nervousness, and trouble sleeping are all common signs of elevated anxiety. There is effective support available — please consider speaking with your doctor or a counsellor.`
    };
  };
  const mood = moodNarrative();

  // ── Compile all active flags ───────────────────────────────────────────────
  const activeRedFlags = [];
  if (cssCl.level >= 2) activeRedFlags.push({
    title: cssCl.level >= 4 ? "You have described thoughts of suicide — please reach out right now" :
           cssCl.level >= 3 ? "You are having thoughts of suicide with a plan — please tell someone today" :
           "You are having thoughts of harming yourself — you do not have to face this alone",
    body: cssCl.level >= 3
      ? "You have shared that you are thinking about ending your life and have begun thinking about how. This is a serious signal that you need support right now — not tomorrow. Please contact a crisis line, go to your nearest hospital emergency department, or tell someone you trust immediately."
      : "Thoughts of suicide or self-harm are telling you that your pain has reached a level that needs immediate support. These thoughts can pass, and real help is available. You deserve to feel better.",
    helplines: ["iCall (TISS): 9152987821 (Mon–Sat, 8am–10pm)","Vandrevala Foundation: 1860-2662-345 (24/7)","NIMHANS Helpline: 080-46110007","Emergency: 112"]
  });
  if (+duke.depression > dn.depression[1] * 1.5) activeRedFlags.push({
    title:"Your depression score is significantly elevated — please speak to a doctor",
    body:`Your Duke Depression score (${duke.depression}/100) is well above the normal range for your age group. This level of depressive experience benefits strongly from professional support. Effective help is available — this is a health need, exactly like any other medical condition.`,
    helplines:["iCall (TISS): 9152987821","Your nearest government hospital psychiatry OPD — free of charge"]
  });
  if (audCl.score >= 8) activeRedFlags.push({
    title:"Your alcohol use is at a level that can harm your health",
    body:"Your AUDIT-C score suggests harmful or dependent alcohol use. Alcohol at this level damages physical health, worsens depression and anxiety, and affects relationships and work. The good news is that de-addiction support is effective and confidential. You deserve support without judgement.",
    helplines:["iDARC (NIMHANS): 080-46110007","Vandrevala Foundation: 1860-2662-345 (24/7)"]
  });

  const activeAmberFlags = [];
  if (+duke.depression > dn.depression[1] && +duke.depression <= dn.depression[1] * 1.5) activeAmberFlags.push({
    title:"Your mood score suggests some depressive feelings",
    body:`Your Duke Depression score (${duke.depression}/100) is above the normal range for your age (0–${dn.depression[1]}). This is worth paying attention to — speaking with a counsellor or your family doctor is a sensible step.`,
    action:"Book an appointment with a counsellor or your family doctor in the next week."
  });
  if (+duke.anxiety > dn.anxiety[1]) activeAmberFlags.push({
    title:"Your anxiety level is elevated",
    body:`Your Duke Anxiety score (${duke.anxiety}/100) is above the normal range for your age (0–${dn.anxiety[1]}). Worry, poor sleep, and tension are manageable with the right support.`,
    action:"Consider speaking with a counsellor about stress management and relaxation techniques."
  });
  if (+duke.selfEsteem < dn.selfEsteem[0]) activeAmberFlags.push({
    title:"Your sense of self-worth seems low right now",
    body:`Your Duke Self-Esteem score (${duke.selfEsteem}/100) is below the normal range for your age (${dn.selfEsteem[0]}–100). How we see ourselves shapes almost every area of life. This is absolutely something that can be worked on.`,
    action:"A few sessions with a counsellor focused on self-compassion can make a meaningful difference."
  });
  if (audCl.score >= 4 && audCl.score < 8) activeAmberFlags.push({
    title:"Your alcohol use is worth monitoring",
    body:"Your AUDIT-C score suggests hazardous drinking. At this level, alcohol may be interfering with sleep, mood, or relationships in ways you might not have connected yet.",
    action:"Consider tracking your alcohol intake for a week — it often reveals more than we expect."
  });
  bfiFlags().forEach(f => activeAmberFlags.push(f));
  healthFlags().forEach(f => activeAmberFlags.push(f));

  return (
    <div className="space-y-5">

      {/* ── Active Red Flags ── */}
      {activeRedFlags.map((f,i) => <RedFlag key={i} {...f}/>)}
      {activeAmberFlags.slice(0,2).map((f,i) => <AmberFlag key={i} {...f}/>)}

      {/* ── Cognitive section ── */}
      <div className="bg-white rounded-2xl border border-blue-200 p-5">
        <SectionHead icon="🧩" title="Your Thinking & Reasoning" color="#3B82F6"/>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            {label:"CQ Estimate", val:`~${catResult.iq}`, sub:"out of 130", color:"#3B82F6"},
            {label:"Mental Age",  val:`~${catResult.ma} yrs`, sub:catResult.label, color:"#8B5CF6"},
            {label:"Percentile",  val:`${catResult.pctRank}th`, sub:"among peers", color:"#10B981"},
          ].map(({label,val,sub,color})=>(
            <div key={label} className="rounded-xl p-2.5 text-center" style={{background:color+"10",border:`1px solid ${color}30`}}>
              <p className="text-xl font-black" style={{color}}>{val}</p>
              <p className="text-xs font-bold text-gray-600 leading-tight">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mb-3 p-3 rounded-xl" style={{background:"#EFF6FF"}}>
          <div>
            <p className="text-sm font-black text-blue-800 mb-0.5">{cog.headline}</p>
            <div className="flex flex-wrap">{cog.strength.split("·").map(s=><StrengthBadge key={s} text={s.trim()}/>)}</div>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{cog.body}</p>
      </div>

      {/* ── Personality section ── */}
      <div className="bg-white rounded-2xl border border-purple-200 p-5">
        <SectionHead icon="🪞" title="Your Personality & Character" color="#8B5CF6"/>
        <p className="text-xs text-gray-500 mb-4">These scores reflect how you see yourself right now — they are not fixed labels. Personality is dynamic and can shift with experience and growth.</p>
        {[["O","Openness"],["C","Conscientiousness"],["E","Extraversion"],["A","Agreeableness"],["N","Emotional Sensitivity"]].map(([d, label]) => {
          const val = +bfi[d];
          const isHigh = val > 3;
          const nar = bfiNarrative[d][isHigh?"high":"low"];
          const col = "#8B5CF6";
          return (
            <div key={d} className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-black text-gray-700">{label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{background:col+"18",color:col}}>{nar.line}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all"
                  style={{width:`${(val/5)*100}%`, background:`linear-gradient(90deg,${col}88,${col})`}}/>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{nar.desc}</p>
            </div>
          );
        })}
      </div>

      {/* ── Health section ── */}
      <div className="bg-white rounded-2xl border border-green-200 p-5">
        <SectionHead icon="💚" title="Your Health & Wellbeing" color="#10B981"/>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {[
            { label:"Physical",  val:duke.phys,   color:"#3B82F6", icon:"🏃" },
            { label:"Mental",    val:duke.mental,  color:"#8B5CF6", icon:"🧠" },
            { label:"Social",    val:duke.social,  color:"#10B981", icon:"🤝" },
            { label:"Overall",   val:duke.general, color:"#F59E0B", icon:"⭐" },
          ].map(item => {
            const v = +item.val;
            const tier = v>=70?"Good":v>=45?"Fair":"Low";
            const tierColor = v>=70?"#15803D":v>=45?"#B45309":"#DC2626";
            return (
              <div key={item.label} className="rounded-2xl p-3"
                style={{background:item.color+"10", border:`1.5px solid ${item.color}33`}}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs font-bold" style={{color:tierColor}}>{tier}</span>
                </div>
                <p className="text-2xl font-black" style={{color:item.color}}>{item.val}</p>
                <p className="text-xs text-gray-500 font-medium">{item.label} Health</p>
              </div>
            );
          })}
        </div>
        <p className="text-sm font-bold text-gray-700 mb-1">{health.head}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{health.body}</p>
      </div>

      {/* ── Mood section ── */}
      {(() => {
        const dep = +duke.depression;
        const anx = +duke.anxiety;
        const se  = +duke.selfEsteem;
        const depOk = dep <= dn.depression[1];
        const anxOk = anx <= dn.anxiety[1];
        const seOk  = se  >= dn.selfEsteem[0];
        const overallOk = depOk && anxOk && seOk;
        const sectionColor = overallOk ? "#10B981" : dep > dn.depression[1]*1.5 || anx > dn.anxiety[1]*1.5 ? "#EF4444" : "#F59E0B";
        return (
          <div className="bg-white rounded-2xl p-5" style={{
            border: `2px solid ${sectionColor}66`,
            background: `linear-gradient(135deg, white, ${sectionColor}06)`
          }}>
            <SectionHead icon="🌤" title="Your Mood & Emotional Wellbeing" color={sectionColor}
              badge={{text: overallOk?"Within normal range":"Needs attention", color:sectionColor}}/>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label:"Depression", val:dep, lo:dn.depression[0], hi:dn.depression[1], worse:"↑", color:"#6366F1" },
                { label:"Anxiety",    val:anx, lo:dn.anxiety[0],    hi:dn.anxiety[1],    worse:"↑", color:"#F59E0B" },
                { label:"Self-Esteem",val:se,  lo:dn.selfEsteem[0], hi:dn.selfEsteem[1], worse:"↓", color:"#10B981" },
              ].map(({ label, val, lo, hi, worse, color }) => {
                const ok = worse==="↑" ? val<=hi : val>=lo;
                const sc = ok ? "#059669" : "#DC2626";
                return (
                  <div key={label} className="rounded-xl p-2.5 text-center border"
                    style={{borderColor:sc+"33", background:sc+"08"}}>
                    <p className="text-2xl font-black" style={{color:sc}}>{val}</p>
                    <p className="text-xs font-bold text-gray-600">{label}</p>
                    <p className="text-xs font-semibold" style={{color:sc}}>{ok?"Normal":worse==="↑"?"Elevated":"Low"}</p>
                    <p className="text-xs text-gray-400">{worse==="↑"?`norm 0–${hi}`:`norm ${lo}–100`}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-sm font-black text-gray-800 mb-1">{mood.head}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{mood.body}</p>
            {(!depOk || !anxOk) && (
              <div className="mt-3 rounded-xl p-3 text-xs" style={{background:"#FFFBEB",border:"1px solid #FCD34D"}}>
                <p className="font-bold text-amber-800 mb-1">You deserve support</p>
                <p className="text-amber-900">📞 iCall (TISS): <strong>9152987821</strong> — Mon–Sat, 8am–10pm</p>
                <p className="text-amber-900">📞 Vandrevala Foundation: <strong>1860-2662-345</strong> — 24/7, free</p>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Remaining amber flags ── */}
      {activeAmberFlags.slice(2).map((f,i) => <AmberFlag key={i} {...f}/>)}

      {/* ── Closing note ── */}
      <div className="rounded-2xl p-4" style={{background:"linear-gradient(135deg,#F5F3FF,#EFF6FF)",border:"1.5px solid #DDD6FE"}}>
        <p className="text-xs font-black text-purple-700 mb-1">A note from the CIBS team</p>
        <p className="text-xs text-purple-900 leading-relaxed">
          This report is a starting point for self-understanding — not a diagnosis, and not the final word on who you are.
          Use it as a compassionate mirror. If something here resonates or concerns you, please share it with a trusted doctor
          or counsellor. You deserve support that is personal, skilled, and kind.
        </p>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// CLINICAL REPORT — Lab-style, formal, structured for clinician use
// ══════════════════════════════════════════════════════════════════════════════

// ── VALID: Clinical Report Component ─────────────────────────────
const ValidClinicalReport = ({ bfi, duke, cssCl, audCl, ravensScore, ravensIQ, ravensLabel, responses, mode, demographics, catResult, ageNorms }) => {

  const sdqTotal = SDQCP.reduce((s,item,i) => {
    const v = responses.d4[`sdq${i+1}`] || 0;
    return s + (item.rev ? (2-v) : v);
  }, 0);

  const bfiDSM = () => {
    const N=+bfi.N, A=+bfi.A, C=+bfi.C, O=+bfi.O, E=+bfi.E;
    const clusters = [];
    if (N>3.8 && A<2.5) clusters.push("Cluster B (Emotional Dysregulation / Antagonism)");
    if (N>3.8 && C<2.5) clusters.push("Cluster C (Anxious / Avoidant traits)");
    if (O<2.5 && E<2.5 && A<2.5) clusters.push("Cluster A (Schizotypal / Detachment pattern)");
    return clusters.length ? clusters : ["No clinically significant DSM-5 Cluster A/B/C personality trait pattern identified"];
  };

  const RangeRow = ({label, val, lo, hi, unit="", flag=""}) => {
    const v = parseFloat(val);
    const inRange = v>=lo && v<=hi;
    const stateColor = inRange ? "#059669" : v>hi ? "#DC2626" : "#D97706";
    const stateLabel = inRange ? "Within Range" : v>hi ? "Above Range ↑" : "Below Range ↓";
    return (
      <tr style={{borderBottom:"1px solid #F1F5F9"}}>
        <td className="py-2 pr-3 text-xs text-gray-700 font-medium">{label}</td>
        <td className="py-2 pr-3 text-sm font-black" style={{color:stateColor}}>{val}{unit}</td>
        <td className="py-2 pr-3 text-xs text-gray-400">{lo}–{hi}{unit}</td>
        <td className="py-2">
          <span className="text-xs px-1.5 py-0.5 rounded font-semibold"
            style={{background:stateColor+"18", color:stateColor}}>{stateLabel}</span>
        </td>
      </tr>
    );
  };

  const today = new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"});
  const reportId = "CIBS-" + (demographics?.uid?.slice(-8)||"XXXX");

  // Compile clinical alerts
  const clinAlerts = [];
  const dn = ageNorms || getAgeNorms(demographics?.age);
  if (cssCl.level >= 3) clinAlerts.push({ sev:"CRITICAL", text:`C-SSRS Level ${cssCl.level}/4 — Suicidal ideation with plan${cssCl.level>=4?" and rehearsal":""} endorsed. Immediate clinical assessment and safety planning required.` });
  if (cssCl.level >= 1 && cssCl.level < 3) clinAlerts.push({ sev:"MODERATE", text:`C-SSRS Level ${cssCl.level} — passive/active ideation without plan. Safety monitoring and 2-week follow-up recommended.` });
  // Duke Depression alert (dysfunction scale — higher=worse; normal upper limit is dn.depression[1])
  if (+duke.depression > dn.depression[1])
    clinAlerts.push({ sev:+duke.depression>60?"HIGH":"MODERATE", text:`Duke Depression subscale ${duke.depression}/100 — above age-adjusted normal range (0–${dn.depression[1]}). Depressive symptomatology indicated. Clinical interview and further evaluation recommended.` });
  // Duke Anxiety alert
  if (+duke.anxiety > dn.anxiety[1])
    clinAlerts.push({ sev:+duke.anxiety>60?"HIGH":"MODERATE", text:`Duke Anxiety subscale ${duke.anxiety}/100 — above age-adjusted normal range (0–${dn.anxiety[1]}). Anxiety symptoms present. Consider structured anxiety assessment (GAD-7/HAM-A).` });
  // Duke Self-Esteem alert (positive scale — lower=worse; normal lower limit is dn.selfEsteem[0])
  if (+duke.selfEsteem < dn.selfEsteem[0])
    clinAlerts.push({ sev:"MODERATE", text:`Duke Self-Esteem subscale ${duke.selfEsteem}/100 — below age-adjusted normal range (${dn.selfEsteem[0]}–100). Low self-worth may co-present with depressive or personality disorder features.` });
  if (audCl.score >= 8) clinAlerts.push({ sev:"HIGH", text:`AUDIT-C score ${audCl.score}/12 — Harmful or dependent use. Structured brief intervention and referral to de-addiction services indicated.` });
  if (audCl.score >= 4 && audCl.score < 8) clinAlerts.push({ sev:"MODERATE", text:`AUDIT-C score ${audCl.score}/12 — Hazardous use detected. Brief alcohol counselling recommended at next clinical contact.` });
  if (sdqTotal >= 5) clinAlerts.push({ sev:"MODERATE", text:`SDQ-Conduct subscale score ${sdqTotal}/10 — Elevated conduct symptomatology. Consider full SDQ or CBCL if paediatric/adolescent presentation.` });
  if (+bfi.N > 4 && +duke.depression > dn.depression[1]) clinAlerts.push({ sev:"MODERATE", text:`High Neuroticism (T=${Math.round(50+(+bfi.N-3)*10)}) concurrent with elevated Duke Depression — emotionally dysregulated presentation warrants psychotherapy referral.` });

  const AlertBadge = ({sev}) => {
    const cfg = {CRITICAL:{bg:"#FEE2E2",c:"#991B1B"},HIGH:{bg:"#FEF2F2",c:"#DC2626"},MODERATE:{bg:"#FFFBEB",c:"#92400E"}};
    const {bg,c} = cfg[sev]||cfg.MODERATE;
    return <span className="text-xs font-black px-2 py-0.5 rounded" style={{background:bg,color:c}}>{sev}</span>;
  };

  return (
    <div className="space-y-5 text-gray-800">

      {/* ── Lab Report Header ── */}
      <div style={{background:"#F8FAFC",border:"1.5px solid #CBD5E1",borderRadius:16}}>
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">CIBS-VALID · Psychometric Lab Report</p>
              <p className="text-xs text-slate-400 mt-0.5">Report ID: {reportId} · {today}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Administered by</p>
              <p className="text-xs font-bold text-slate-700">{mode==="assisted"?"Clinician (Assisted)":"Self-Administered"}</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 grid grid-cols-3 gap-4 text-xs">
          {[
            ["Battery","CIBS-VALID v3.0"],
            ["Domains","4 (D1–D4)"],
            ["Total Items","~62 (adaptive)"],
            ["Instruments","Raven's CAT-22 · BFI-10 · DUKE-17 · C-SSRS · AUDIT-C · SDQ-CP"],
          ].map(([k,v])=>(
            <div key={k}>
              <p className="text-slate-400 font-medium">{k}</p>
              <p className="text-slate-700 font-bold leading-tight">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Clinical Alerts Panel ── */}
      {clinAlerts.length > 0 && (
        <div style={{background:"#FFF5F5",border:"2px solid #FCA5A5",borderRadius:16,padding:16}}>
          <p className="text-xs font-black text-red-700 uppercase tracking-wider mb-3">⚠ Clinical Alerts — Action Required</p>
          <div className="space-y-2">
            {clinAlerts.map((a,i)=>(
              <div key={i} className="flex items-start gap-2.5">
                <AlertBadge sev={a.sev}/>
                <p className="text-xs text-red-900 leading-relaxed flex-1">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── D1: Cognitive Function ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-slate-100"
          style={{background:"linear-gradient(90deg,#3B82F608,white)"}}>
          <p className="text-xs font-black text-blue-700 uppercase tracking-wider">D1 · Cognitive Function</p>
          <p className="text-xs text-slate-400">Raven's Progressive Matrices — Adaptive CAT (CIBS Edition, 11-item pool)</p>
        </div>
        <div className="p-4">
          {/* Summary row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              {label:"Est. CQ",       val:`~${catResult.iq}`,              color:"#3B82F6"},
              {label:"Mental Age",    val:`~${catResult.ma} yrs`,          color:"#8B5CF6"},
              {label:"Percentile",    val:`${catResult.pctRank}th`,        color:"#10B981"},
              {label:"Band / Level",  val:`${catResult.band}/4 · ${catResult.label}`, color:BAND_COLORS[catResult.band]},
            ].map(item=>(
              <div key={item.label} className="rounded-xl p-2 text-center bg-blue-50">
                <p className="text-sm font-black" style={{color:item.color}}>{item.val}</p>
                <p className="text-xs text-gray-500 leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
          {/* Band-by-band table */}
          <table className="w-full mb-3">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">Band</th>
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">CQ / MA</th>
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">Items</th>
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">Correct</th>
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">Pass?</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4].map(b=>{
                const reached = b <= catResult.band;
                const bc = catResult.bandScores[b];
                const bt = RAVENS_CAT[b].length;
                const rule = CAT_RULES[b];
                const passed = b < catResult.band; // passed if they advanced past it
                const isFinal = b === catResult.band;
                const passedFinal = isFinal && bc >= rule.passThreshold;
                return (
                  <tr key={b} style={{borderBottom:"1px solid #F1F5F9",
                    background: isFinal ? BAND_COLORS[b]+"08" : "transparent"}}>
                    <td className="py-2 pr-2">
                      <span className="text-xs font-black" style={{color:reached?BAND_COLORS[b]:"#CBD5E1"}}>
                        {BAND_ICONS[b]} B{b}
                      </span>
                    </td>
                    <td className="py-2 pr-2 text-xs text-slate-500">
                      {rule.iqBase}–{rule.iqBase+rule.range} · MA {rule.maLo}–{rule.maHi}y
                    </td>
                    <td className="py-2 pr-2 text-xs text-slate-700 font-bold">
                      {reached ? `${bt}` : '—'}
                    </td>
                    <td className="py-2 pr-2 text-sm font-black"
                      style={{color:reached?(bc>=rule.passThreshold?"#059669":"#DC2626"):"#CBD5E1"}}>
                      {reached ? `${bc}/${bt}` : '—'}
                    </td>
                    <td className="py-2 text-xs font-bold">
                      {!reached ? <span className="text-slate-300">Not reached</span>
                       : passed ? <span className="text-green-600">✓ Advanced</span>
                       : passedFinal ? <span className="text-green-600">✓ Passed</span>
                       : isFinal ? <span className="text-amber-600">Final band</span>
                       : <span className="text-red-500">Stopped here</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="rounded-lg px-3 py-2 bg-blue-50 text-xs text-blue-900 mb-2">
            <strong>Interpretation:</strong> {
              catResult.iq>=125?`Exceptional non-verbal reasoning — Mental Age ~${catResult.ma} yrs (${catResult.pctRank}th percentile). Completed highest band levels with passing scores. Abstract and relational pattern recognition is a primary cognitive strength.`:
              catResult.iq>=110?`Above average fluid intelligence — Mental Age ~${catResult.ma} yrs (${catResult.pctRank}th percentile). Advanced to Band 3+, indicating strong capacity for multi-rule abstract reasoning.`:
              catResult.iq>=90?`Average to high-average cognitive screening — Mental Age ~${catResult.ma} yrs (${catResult.pctRank}th percentile). Passed foundation and standard levels. No significant impairment identified.`:
              `Below average performance on non-verbal reasoning screening — Mental Age ~${catResult.ma} yrs (${catResult.pctRank}th percentile). Stopped at Foundation level. Further formal cognitive assessment (WAIS-IV / NIMHANS Battery) is recommended.`
            }
          </div>
          <p className="text-xs text-slate-400 italic">
            Note: CQ and Mental Age are analogs based on highest band reached and within-band performance (22-item adaptive pool, 4 bands).
            Not a validated IQ/MA measure. Adaptive administration: {catResult.totalQ} of up to 22 items presented.
          </p>
        </div>
      </div>

      {/* ── D2: Personality ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-slate-100"
          style={{background:"linear-gradient(90deg,#8B5CF608,white)"}}>
          <p className="text-xs font-black text-purple-700 uppercase tracking-wider">D2 · Personality Profile</p>
          <p className="text-xs text-slate-400">Big Five Inventory-10 (BFI-10; Rammstedt & John, 2007)</p>
        </div>
        <div className="p-4">
          <table className="w-full mb-3">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5 w-6">Dom</th>
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">Facet</th>
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">Raw (1–5)</th>
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">T-Score</th>
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">Flag</th>
              </tr>
            </thead>
            <tbody>
              {[["O","Openness"],["C","Conscientiousness"],["E","Extraversion"],["A","Agreeableness"],["N","Neuroticism"]].map(([d,label])=>{
                const raw = +bfi[d];
                const tScore = Math.round(50 + (raw-3)*10);
                const nLo = ageNorms.bfi[d][0], nHi = ageNorms.bfi[d][1];
                const flag = tScore>nHi ? `↑ Elevated (T>${nHi})` : tScore<nLo ? `↓ Low (T<${nLo})` : "Within normal range";
                const fColor = tScore>nHi ? "#DC2626" : tScore<nLo ? "#D97706" : "#059669";
                return (
                  <tr key={d} style={{borderBottom:"1px solid #F1F5F9"}}>
                    <td className="py-2 pr-2 text-xs font-black text-slate-400">{d}</td>
                    <td className="py-2 pr-2 text-xs text-slate-700">{label}</td>
                    <td className="py-2 pr-2 text-sm font-black text-slate-800">{raw.toFixed(1)}</td>
                    <td className="py-2 pr-2 text-sm font-black" style={{color:fColor}}>T={tScore}</td>
                    <td className="py-2 text-xs font-semibold" style={{color:fColor}}>{flag}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="rounded-lg px-3 py-2 bg-purple-50 text-xs text-purple-900 mb-2">
            <strong>DSM-5 Personality Trait Pattern:</strong>
            <ul className="mt-1 space-y-0.5 list-disc list-inside">
              {bfiDSM().map((c,i)=><li key={i}>{c}</li>)}
            </ul>
          </div>
          <p className="text-xs text-slate-400 italic">
            Age group: <strong>{ageNorms.label}</strong>. Normal T-range is age-adjusted.
            BFI-10 is a screening instrument. PID-5 recommended if personality disorder evaluation is indicated.
          </p>
        </div>
      </div>

      {/* ── D3: Duke Health Profile ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-slate-100"
          style={{background:"linear-gradient(90deg,#10B98108,white)"}}>
          <p className="text-xs font-black text-green-700 uppercase tracking-wider">D3 · Health Profile</p>
          <p className="text-xs text-slate-400">Duke Health Profile (DUKE-17; Parkerson et al., 1990) · Age group: {ageNorms.label}</p>
        </div>
        <div className="p-4">

          {/* ── Psychological Subscale Highlights ── */}
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Psychological Subscales</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label:"Depression", val:+duke.depression, lo:ageNorms.depression[0], hi:ageNorms.depression[1], note:"↓ better", color:"#6366F1" },
              { label:"Anxiety",    val:+duke.anxiety,    lo:ageNorms.anxiety[0],    hi:ageNorms.anxiety[1],    note:"↓ better", color:"#F59E0B" },
              { label:"Self-Esteem",val:+duke.selfEsteem, lo:ageNorms.selfEsteem[0], hi:ageNorms.selfEsteem[1], note:"↑ better", color:"#10B981" },
            ].map(({ label, val, lo, hi, note, color }) => {
              const isDeprAnx = note === "↓ better";
              const ok = isDeprAnx ? val <= hi : val >= lo;
              const sc = ok ? "#059669" : "#DC2626";
              const statusLabel = ok ? "Normal" : isDeprAnx ? "Elevated ↑" : "Low ↓";
              return (
                <div key={label} className="rounded-xl p-2.5 text-center border-2"
                  style={{borderColor: sc+"44", background: sc+"0A"}}>
                  <p className="text-lg font-black" style={{color: sc}}>{val}</p>
                  <p className="text-xs font-bold text-slate-600 leading-tight">{label}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{color: sc}}>{statusLabel}</p>
                  <p className="text-xs text-slate-400">{note} · norm {isDeprAnx?`0–${hi}`:`${lo}–100`}</p>
                </div>
              );
            })}
          </div>

          {/* ── Full functional scales table ── */}
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Functional Health Scales</p>
          <table className="w-full mb-3">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">Subscale</th>
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">Score</th>
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">Age Norm</th>
                <th className="text-left text-xs text-slate-400 font-medium pb-1.5">Status</th>
              </tr>
            </thead>
            <tbody>
              <RangeRow label="Physical Health"       val={duke.phys}       lo={ageNorms.phys[0]}       hi={ageNorms.phys[1]}/>
              <RangeRow label="Mental Health"         val={duke.mental}     lo={ageNorms.mental[0]}     hi={ageNorms.mental[1]}/>
              <RangeRow label="Social Health"         val={duke.social}     lo={ageNorms.social[0]}     hi={ageNorms.social[1]}/>
              <RangeRow label="General Health"        val={duke.general}    lo={ageNorms.general[0]}    hi={ageNorms.general[1]}/>
              <RangeRow label="Perceived Health"      val={duke.perceived}  lo={ageNorms.perceived[0]}  hi={ageNorms.perceived[1]}/>
              <RangeRow label="Pain (↓ better)"       val={duke.pain}       lo={ageNorms.pain[0]}       hi={ageNorms.pain[1]}/>
              <RangeRow label="Disability (↓ better)" val={duke.disability} lo={ageNorms.disability[0]} hi={ageNorms.disability[1]}/>
            </tbody>
          </table>
          <div className="rounded-lg px-3 py-2 bg-green-50 text-xs text-green-900">
            <strong>Clinical Summary:</strong> {
              +duke.general>=ageNorms.general[0] ? "General health profile within age-adjusted normal parameters across functional domains." :
              +duke.general>=(ageNorms.general[0]*0.75) ? "Moderate health profile. One or more subscales below age-adjusted normative range. Targeted clinical attention recommended." :
              "Significantly compromised health profile. Multiple subscales below age-adjusted normative range. Multidomain clinical evaluation and intervention planning is indicated."
            }
          </div>
          <p className="text-xs text-slate-400 mt-2 italic">
            Normative reference: Age-adjusted Indian adult population norms. Higher = better for functional scales. Lower = better for Pain and Disability. Psychological subscales: Depression and Anxiety are dysfunction scales (lower=better); Self-Esteem is a positive scale (higher=better).
          </p>
        </div>
      </div>

      {/* ── D4: Risk Factor Profile ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-slate-100"
          style={{background:"linear-gradient(90deg,#EF444408,white)"}}>
          <p className="text-xs font-black text-red-700 uppercase tracking-wider">D4 · Risk Factor Profile</p>
          <p className="text-xs text-slate-400">C-SSRS Screen · AUDIT-C · SDQ Conduct Subscale</p>
        </div>
        <div className="p-4 space-y-4">

          {/* C-SSRS */}
          <div>
            <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2">Suicidality — C-SSRS (Columbia, 2008)</p>
            <table className="w-full mb-2">
              <tbody>
                {CSSRS.map((q,i)=>{
                  const v = responses.d4[`css${i+1}`];
                  return (
                    <tr key={i} style={{borderBottom:"1px solid #F8FAFC",
                      background:v===true?"#FEF2F2":"transparent"}}>
                      <td className="py-1.5 pr-2 text-xs text-slate-400">{i+1}</td>
                      <td className="py-1.5 pr-2 text-xs text-slate-700">{q}</td>
                      <td className="py-1.5 text-xs font-black text-center w-12"
                        style={{color:v===true?"#DC2626":"#10B981"}}>{v===true?"YES":v===false?"NO":"—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="rounded-lg px-3 py-2 text-xs" style={{background:cssCl.color+"12",border:`1px solid ${cssCl.color}44`}}>
              <div className="flex justify-between items-center">
                <span className="font-black" style={{color:cssCl.color}}>Level {cssCl.level}/4 — {cssCl.label}</span>
                <span className="font-semibold text-slate-600">
                  {cssCl.level===0?"No clinical action required.":
                   cssCl.level===1?"Monitor. Safety check at next appointment.":
                   cssCl.level===2?"Active ideation — safety plan required. Review in 1 week.":
                   cssCl.level===3?"Ideation with plan — urgent clinical assessment today.":
                   "CRITICAL — Imminent risk. Immediate intervention and safety measures required."}
                </span>
              </div>
            </div>
          </div>

          {/* AUDIT-C */}
          <div>
            <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2">Alcohol Use — AUDIT-C (WHO, Bush et al. 1998)</p>
            <table className="w-full mb-2">
              <tbody>
                {AUDITC.map((item,i)=>{
                  const v = responses.d4[`aud${i+1}`];
                  const sc = item.sc[v]??0;
                  return (
                    <tr key={i} style={{borderBottom:"1px solid #F8FAFC"}}>
                      <td className="py-1.5 pr-2 text-xs text-slate-700 leading-tight">{item.q}</td>
                      <td className="py-1.5 pr-2 text-xs text-slate-500 text-right">{v!==undefined?item.opts[v]:"—"}</td>
                      <td className="py-1.5 text-sm font-black text-center w-8" style={{color:sc>=2?"#DC2626":"#374151"}}>{sc}</td>
                    </tr>
                  );
                })}
                <tr style={{borderTop:"2px solid #E2E8F0"}}>
                  <td className="py-1.5 text-xs font-black text-slate-700" colSpan={2}>AUDIT-C Total</td>
                  <td className="py-1.5 text-base font-black text-center" style={{color:audCl.color}}>{audCl.score}</td>
                </tr>
              </tbody>
            </table>
            <div className="rounded-lg px-3 py-2 text-xs" style={{background:audCl.color+"12",border:`1px solid ${audCl.color}44`}}>
              <span className="font-black" style={{color:audCl.color}}>{audCl.label} (Score {audCl.score}/12) — </span>
              <span className="text-slate-700">
                {audCl.score<=3?"No significant alcohol use detected.":
                 audCl.score<=7?"Hazardous use pattern. Brief intervention (BI) recommended at next clinical contact.":
                 "Harmful or dependent use. Structured brief intervention + referral to de-addiction services indicated. Consider CAGE or AUDIT-Full if further characterisation needed."}
              </span>
            </div>
          </div>

          {/* SDQ-CP */}
          <div>
            <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2">Conduct — SDQ Conduct Subscale (Goodman, 1997)</p>
            <table className="w-full mb-2">
              <tbody>
                {SDQCP.map((item,i)=>{
                  const v = responses.d4[`sdq${i+1}`];
                  const sc = v!==undefined ? (item.rev?2-v:v) : 0;
                  return (
                    <tr key={i} style={{borderBottom:"1px solid #F8FAFC"}}>
                      <td className="py-1.5 pr-2 text-xs text-slate-700">{item.q}</td>
                      <td className="py-1.5 pr-2 text-xs text-slate-400 text-right">{v!==undefined?["Not True","Somewhat True","Certainly True"][v]:"—"}</td>
                      <td className="py-1.5 text-sm font-black text-center w-8">{sc}</td>
                    </tr>
                  );
                })}
                <tr style={{borderTop:"2px solid #E2E8F0"}}>
                  <td className="py-1.5 text-xs font-black text-slate-700" colSpan={2}>SDQ-Conduct Total</td>
                  <td className="py-1.5 text-base font-black text-center"
                    style={{color:sdqTotal>=5?"#DC2626":sdqTotal>=3?"#D97706":"#059669"}}>{sdqTotal}</td>
                </tr>
              </tbody>
            </table>
            <div className="rounded-lg px-3 py-2 text-xs bg-slate-50 border border-slate-200">
              <span className="font-black" style={{color:sdqTotal>=5?"#DC2626":sdqTotal>=3?"#D97706":"#059669"}}>
                {sdqTotal>=5?"Elevated":sdqTotal>=3?"Borderline":"Normal"} ({sdqTotal}/10) — </span>
              <span className="text-slate-700">
                {sdqTotal>=5?"Elevated conduct symptomatology. Full SDQ or CBCL recommended. Consider ADHD comorbidity.":
                 sdqTotal>=3?"Borderline conduct concerns. Monitor and review in clinical context.":
                 "No significant conduct concerns identified on SDQ screening subscale."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Clinical Summary & Recommendations ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-slate-100" style={{background:"#F8FAFC"}}>
          <p className="text-xs font-black text-slate-700 uppercase tracking-wider">Clinical Summary & Recommendations</p>
        </div>
        <div className="p-4 space-y-3">
          {[
            { label:"D1 Cognition",    val:`CQ ~${catResult.iq} · MA ~${catResult.ma} yrs · ${catResult.pctRank}th %ile`, note:catResult.label, color:"#3B82F6" },
            { label:"D2 Personality",  val:`N=T${Math.round(50+(+bfi.N-3)*10)} · C=T${Math.round(50+(+bfi.C-3)*10)} · E=T${Math.round(50+(+bfi.E-3)*10)}`, note:bfiDSM()[0], color:"#8B5CF6" },
            { label:"D3 Health",       val:`General=${duke.general} · Dep=${duke.depression} · Anx=${duke.anxiety}`, note:`SE=${duke.selfEsteem} · Phys=${duke.phys} · Social=${duke.social}`, color:"#10B981" },
            { label:"D4 Risk",         val:`C-SSRS Lv${cssCl.level} · AUDIT-C ${audCl.score}`, note:cssCl.label+" | "+audCl.label, color:cssCl.level>=2?"#DC2626":audCl.score>=4?"#F97316":"#10B981" },
          ].map(item=>(
            <div key={item.label} className="flex items-center gap-3 py-1.5 border-b border-slate-50">
              <span className="w-28 text-xs font-black" style={{color:item.color}}>{item.label}</span>
              <span className="text-xs font-bold text-slate-800 flex-1">{item.val}</span>
              <span className="text-xs text-slate-400 text-right">{item.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Examiner Notes ── */}
      {mode==="assisted" && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-4">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Examiner Clinical Notes</p>
          <div className="space-y-3">
            {["Behavioural observations during assessment:","Affect and presentation:","Clinical impression:","Diagnosis (provisional):", "Recommended action / Referral:","Examiner signature / date:"].map(l=>(
              <div key={l}>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">{l}</p>
                <div className="h-7 border-b border-dashed border-slate-200"/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Report Disclaimer ── */}
      <div className="rounded-xl p-3" style={{background:"#F8FAFC",border:"1px solid #E2E8F0"}}>
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-500">Disclaimer:</strong> This psychometric screening report is intended for use by qualified mental health
          professionals. It does not constitute a clinical diagnosis under ICD-11 or DSM-5. All findings should be
          interpreted in the context of a full clinical assessment. Instrument citations: BFI-10 (Rammstedt & John, 2007);
          DUKE-17 (Parkerson et al., 1990); C-SSRS (Posner et al., 2011);
          AUDIT-C (Bush et al., 1998); SDQ (Goodman, 1997). Age-adjusted norms: NIMHANS/ICMR adapted reference data.
        </p>
      </div>
    </div>
  );
};


// ══════════════════════════════════════════════════════════════════
// ║  UNIFIED: Landing, Bridge, Demographics, Combined Report      ║
// ══════════════════════════════════════════════════════════════════

// ── Landing Page ─────────────────────────────────────────────────
const LandingPage = ({ onStart }) => (
  <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0f1f3d 0%,#1a3a6b 60%,#1e4d8c 100%)",
    fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", padding:"24px 16px 48px" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;900&family=DM+Mono:wght@400;500&display=swap');
      * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
      .font-mono { font-family: 'DM Mono', monospace; }
      @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      @keyframes bobble{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
      @keyframes glow{0%,100%{box-shadow:0 0 16px rgba(96,165,250,0.3)}50%{box-shadow:0 0 28px rgba(96,165,250,0.6)}}
      button:active{transform:scale(0.97)}
      input:focus,select:focus{outline:none;border-color:#3b82f6!important;box-shadow:0 0 0 3px rgba(59,130,246,0.15)!important}
      @media print{.no-print{display:none!important}body{background:white!important}}
    `}</style>

    {/* Header */}
    <div style={{ textAlign:"center", marginBottom:32, animation:"fadeUp 0.5s ease" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:10 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:"0 4px 20px rgba(59,130,246,0.4)" }}>🧠</div>
        <div>
          <div style={{ fontSize:9, letterSpacing:"0.22em", color:"#93c5fd", textTransform:"uppercase", fontWeight:700 }}>Central Institute of Behavioural Sciences</div>

// ══════════════════════════════════════════════════════════════════════════════
//  DOMAIN 2 — PERSONALITY (BFI-10 + PID-5-BF)
// ══════════════════════════════════════════════════════════════════════════════
const DomainPersonalityFull = ({ resp, set, t }) => {
  const answered_bfi = [1,2,3,4,5,6,7,8,9,10].filter(i => resp[`bfi${i}`] !== undefined).length;
  const answered_pid = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25].filter(i => resp[`pid${i}`] !== undefined).length;
  const total_answered = answered_bfi + answered_pid;
  const total_items = 35;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-3 text-xs text-center font-semibold" style={{background:"#f5f3ff", color:"#6d28d9"}}>
        {t.bfi_intro}<br/><span className="font-normal">{t.bfi_scale}</span>
      </div>

      {/* BFI-10 */}
      <p className="text-xs font-black text-purple-500 uppercase tracking-wider px-1">
        Part A — Big Five Inventory (BFI-10) · {answered_bfi}/10
      </p>
      {(t.bfi_items||[]).map((item, i) => {
        const val = resp[`bfi${i+1}`];
        return (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-sm text-gray-700 mb-3">{i+1}. {item}</p>
            <div className="flex gap-1.5">
              {[1,2,3,4,5].map(v => (
                <button key={v} onClick={() => set(`bfi${i+1}`, v)}
                  className={cx("flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all",
                    val===v ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-400")}>
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
              <span>{t.bfi_scale?.split("·")[0]?.replace("1 =","")?.trim()}</span>
              <span>{t.bfi_scale?.split("·")[1]?.replace("5 =","")?.trim()}</span>
            </div>
          </div>
        );
      })}

      {/* PID-5-BF */}
      <div className="rounded-xl p-3 text-xs text-center font-semibold mt-4" style={{background:"#fef3c7", color:"#92400e"}}>
        {t.pid5_intro}<br/><span className="font-normal">{t.pid5_scale}</span>
      </div>
      <p className="text-xs font-black text-yellow-600 uppercase tracking-wider px-1">
        Part B — DSM-5 Personality (PID-5-BF) · {answered_pid}/25
      </p>
      {(t.pid5_items||[]).map((item, i) => {
        const val = resp[`pid${i+1}`];
        return (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-sm text-gray-700 mb-3">{i+1}. {item}</p>
            <div className="flex gap-1.5">
              {[0,1,2,3].map(v => (
                <button key={v} onClick={() => set(`pid${i+1}`, v)}
                  className={cx("flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all",
                    val===v ? "border-yellow-500 bg-yellow-50 text-yellow-700" : "border-gray-200 text-gray-400")}>
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
              <span>Very False</span><span>Very True</span>
            </div>
          </div>
        );
      })}
      <p className="text-xs text-gray-400 text-center">PID-5-BF: © APA 2013. Free for researchers and clinicians.</p>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  DOMAIN 3 — HEALTH & WELLBEING (WHO-5 + PHQ-9 + GAD-7 + RSES)
// ══════════════════════════════════════════════════════════════════════════════
const DomainHealthFull = ({ resp, set, t }) => {
  const scale04 = [0,1,2,3,4,5];
  const scale03 = [0,1,2,3];
  const scale14 = [1,2,3,4];
  const scaleLabels03 = ["Not at all","Several days","More than half","Nearly every day"];

  return (
    <div className="space-y-4">

      {/* WHO-5 */}
      <div className="rounded-xl p-3 text-xs" style={{background:"#f0fdf4", border:"1px solid #86efac"}}>
        <p className="font-bold text-green-700 mb-1">🌱 Part A — WHO-5 Wellbeing Index</p>
        <p className="text-green-600">{t.who5_intro}</p>
        <p className="text-green-500 mt-1">{t.who5_scale}</p>
      </div>
      {(t.who5_items||[]).map((item,i) => {
        const val = resp[`who${i+1}`];
        return (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-sm text-gray-700 mb-3">{i+1}. {item}</p>
            <div className="flex gap-1">
              {scale04.map(v => (
                <button key={v} onClick={() => set(`who${i+1}`, v)}
                  className={cx("flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all",
                    val===v ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-400")}>
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
              <span>Never</span><span>Always</span>
            </div>
          </div>
        );
      })}
      <p className="text-xs text-gray-400 text-center">{t.who5_citation}</p>

      {/* PHQ-9 */}
      <div className="rounded-xl p-3 text-xs mt-4" style={{background:"#eff6ff", border:"1px solid #bfdbfe"}}>
        <p className="font-bold text-blue-700 mb-1">🧠 Part B — PHQ-9 Depression Scale</p>
        <p className="text-blue-600">{t.phq9_intro}</p>
        <p className="text-blue-500 mt-1">{t.phq9_scale}</p>
      </div>
      {(t.phq9_items||[]).map((item,i) => {
        const val = resp[`phq${i+1}`];
        return (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-sm text-gray-700 mb-3">{i+1}. {item}</p>
            <div className="flex gap-1.5">
              {scale03.map((v,j) => (
                <button key={v} onClick={() => set(`phq${i+1}`, v)}
                  className={cx("flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all",
                    val===v ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-400")}>
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-0.5">
              {scaleLabels03.map((l,i) => <span key={i} className="text-center flex-1" style={{fontSize:9}}>{l}</span>)}
            </div>
          </div>
        );
      })}
      <p className="text-xs text-gray-400 text-center">{t.phq9_citation}</p>

      {/* GAD-7 */}
      <div className="rounded-xl p-3 text-xs mt-4" style={{background:"#fff7ed", border:"1px solid #fed7aa"}}>
        <p className="font-bold text-orange-700 mb-1">😰 Part C — GAD-7 Anxiety Scale</p>
        <p className="text-orange-600">{t.gad7_intro}</p>
      </div>
      {(t.gad7_items||[]).map((item,i) => {
        const val = resp[`gad${i+1}`];
        return (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-sm text-gray-700 mb-3">{i+1}. {item}</p>
            <div className="flex gap-1.5">
              {scale03.map(v => (
                <button key={v} onClick={() => set(`gad${i+1}`, v)}
                  className={cx("flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all",
                    val===v ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-400")}>
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-0.5">
              {scaleLabels03.map((l,i) => <span key={i} className="text-center flex-1" style={{fontSize:9}}>{l}</span>)}
            </div>
          </div>
        );
      })}
      <p className="text-xs text-gray-400 text-center">{t.gad7_citation}</p>

      {/* RSES */}
      <div className="rounded-xl p-3 text-xs mt-4" style={{background:"#f5f3ff", border:"1px solid #ddd6fe"}}>
        <p className="font-bold text-purple-700 mb-1">💎 Part D — Rosenberg Self-Esteem Scale</p>
        <p className="text-purple-600">{t.rses_intro}</p>
        <p className="text-purple-500 mt-1">{t.rses_scale}</p>
      </div>
      {(t.rses_items||[]).map((item,i) => {
        const val = resp[`rses${i+1}`];
        return (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-sm text-gray-700 mb-3">{i+1}. {item}</p>
            <div className="flex gap-1.5">
              {scale14.map(v => (
                <button key={v} onClick={() => set(`rses${i+1}`, v)}
                  className={cx("flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all",
                    val===v ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-400")}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <p className="text-xs text-gray-400 text-center">{t.rses_citation}</p>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  DOMAIN 4 — RISK (C-SSRS + AUDIT-C)
// ══════════════════════════════════════════════════════════════════════════════
const DomainRiskFull = ({ resp, set, t }) => {
  const AUDITC_DATA = [
    { q: "How often do you have a drink containing alcohol?",
      opts:["Never","Monthly or less","2–4 times a month","2–3 times a week","4+ times a week"], sc:[0,1,2,3,4] },
    { q: "How many standard drinks on a typical drinking day?",
      opts:["1–2","3–4","5–6","7–9","10 or more"], sc:[0,1,2,3,4] },
    { q: "How often do you have 6+ drinks on one occasion?",
      opts:["Never","Less than monthly","Monthly","Weekly","Daily or almost daily"], sc:[0,1,2,3,4] },
  ];

  return (
    <div className="space-y-4">
      {/* C-SSRS */}
      <div className="rounded-xl p-3 text-xs" style={{background:"#fef2f2", border:"1px solid #fca5a5"}}>
        <p className="font-bold text-red-700 mb-1">⚠️ {t.cssrs_title}</p>
        <p className="text-red-600">{t.cssrs_note}</p>
      </div>
      {(t.cssrs_items||[]).map((q,i) => {
        const val = resp[`css${i+1}`];
        return (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-sm text-gray-700 mb-3">{i+1}. {q}</p>
            <div className="flex gap-2">
              {[t.yes||"Yes", t.no||"No"].map((opt,j) => (
                <button key={j} onClick={() => set(`css${i+1}`, j===0)}
                  className={cx("flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all",
                    val===(j===0)
                      ? (j===0?"border-red-400 bg-red-50 text-red-700":"border-green-400 bg-green-50 text-green-700")
                      : "border-gray-200 text-gray-500")}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <p className="text-xs text-gray-400 text-center">{t.cssrs_citation}</p>

      {/* AUDIT-C */}
      <div className="rounded-xl p-3 text-xs mt-4" style={{background:"#fffbeb", border:"1px solid #fcd34d"}}>
        <p className="font-bold text-yellow-700 mb-1">🍺 {t.audit_title}</p>
        <p className="text-yellow-600 italic">{t.audit_note}</p>
      </div>
      {AUDITC_DATA.map((item,i) => {
        const val = resp[`aud${i+1}`];
        const q1Never = resp["aud1"] === 0;
        if (i > 0 && q1Never) return null;
        return (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-sm text-gray-700 mb-2">{item.q}</p>
            <div className="space-y-1.5">
              {item.opts.map((opt,j) => (
                <button key={j} onClick={() => { set(`aud${i+1}`, j); if(j===0&&i===0){set("aud2",0);set("aud3",0);} }}
                  className={cx("w-full text-left py-2 px-3 rounded-xl text-xs border-2 transition-all",
                    val===j ? "border-orange-500 bg-orange-50 text-orange-700 font-bold" : "border-gray-200 text-gray-600")}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {resp["aud1"] === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-3">
          <p className="text-sm text-green-700 font-bold">{t.audit_never_msg}</p>
        </div>
      )}
      <p className="text-xs text-gray-400 text-center">{t.audit_citation}</p>
    </div>
  );
};


// ══════════════════════════════════════════════════════════════════════════════
//  COMBINED VALID REPORT
// ══════════════════════════════════════════════════════════════════════════════
function ValidReport({ results, subjInfo, t, onNew }) {
  const [tab, setTab] = useState("self");
  const today = new Date().toLocaleDateString("en-IN", {year:"numeric",month:"long",day:"numeric"});
  const { catRes, bfi, pid5, who5, phq9, gad7, rses, css, aud } = results;

  const SBar = ({label, value, max=100, color="#3b82f6", suffix=""}) => (
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
        <span style={{color:"#374151",fontWeight:600}}>{label}</span>
        <span style={{fontWeight:800,color,fontFamily:"monospace"}}>{value}{suffix}</span>
      </div>
      <div style={{background:"#f3f4f6",borderRadius:4,height:7,overflow:"hidden"}}>
        <div style={{width:`${Math.min((value/max)*100,100)}%`,height:"100%",background:color,borderRadius:4}}/>
      </div>
    </div>
  );

  const Card = ({title,color,icon,children}) => (
    <div style={{background:"white",borderRadius:14,marginBottom:16,border:`1px solid ${color}20`,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
      <div style={{background:`linear-gradient(135deg,${color},${color}dd)`,padding:"10px 16px",color:"white"}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase"}}>{icon} {title}</div>
      </div>
      <div style={{padding:16}}>{children}</div>
    </div>
  );

  return (
    <div style={{background:"#e8ecf0",minHeight:"100vh",padding:"16px 8px 80px",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <style>{`@media print{body{background:white!important}#no-print{display:none!important}}`}</style>
      <div id="no-print" style={{maxWidth:800,margin:"0 auto 14px",display:"flex",gap:9}}>
        <button onClick={()=>window.print()} style={{flex:1,padding:"11px",background:"#1e3a5f",color:"white",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>{t.print}</button>
        <button onClick={onNew} style={{flex:1,padding:"11px",background:"white",color:"#1e3a5f",border:"1.5px solid #1e3a5f",borderRadius:9,fontSize:12,fontWeight:600,cursor:"pointer"}}>{t.newAssess}</button>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",background:"white",boxShadow:"0 4px 40px rgba(0,0,0,0.12)",borderRadius:4}}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#3b1f6e,#6d28d9,#8b5cf6)",padding:"22px 24px",color:"white"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:"#e9d5ff",marginBottom:4}}>CIBS-VALID · Gold Standard Battery</div>
              <div style={{fontSize:22,fontWeight:900}}>Validation Assessment Report</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:2}}>Ravens CAT · BFI-10 · PID-5-BF · WHO-5 · PHQ-9 · GAD-7 · RSES · C-SSRS · AUDIT-C</div>
            </div>
            <div style={{textAlign:"right",fontSize:11,color:"rgba(255,255,255,0.7)",lineHeight:2}}>
              <div style={{color:"white",fontWeight:700,fontSize:13}}>{today}</div>
              <div>Dr. Shailesh V. Pangaonkar</div>
              <div>CIBS Nagpur</div>
            </div>
          </div>
          {/* Subject strip */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:16}}>
            {[["Name",subjInfo.name||"—"],["Age",subjInfo.age+" yrs"],["Gender",subjInfo.gender||"—"],["VISTA UID",subjInfo.vistaUID||"—"]].map(([k,v])=>(
              <div key={k} style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"8px 10px"}}>
                <div style={{fontSize:9,color:"#e9d5ff",textTransform:"uppercase"}}>{k}</div>
                <div style={{fontSize:11,fontWeight:700,color:"white",marginTop:2}}>{v}</div>
              </div>))}
          </div>
        </div>

        {/* Tab bar */}
        <div id="no-print" style={{display:"flex",borderBottom:"2px solid #e2e8f0",background:"#f8fafc"}}>
          {[["self","👤 "+t.forSelf],["clinician","🏥 "+t.forClinician]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"12px",background:tab===id?"white":"transparent",color:tab===id?"#6d28d9":"#64748b",border:"none",borderBottom:tab===id?"2px solid #6d28d9":"2px solid transparent",marginBottom:-2,fontSize:12,fontWeight:tab===id?700:500,cursor:"pointer"}}>{label}</button>))}
        </div>

        <div style={{padding:"20px 20px 40px"}}>

          {/* SELF TAB */}
          {tab==="self" && (
            <div>
              {/* Cognitive */}
              <Card title="Cognitive Ability — Ravens CAT" color="#3b82f6" icon="🧩">
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:12}}>
                  <div style={{background:catRes.band===4?"#fef9c3":catRes.band===3?"#f0fdf4":catRes.band===2?"#eff6ff":"#fef2f2",borderRadius:12,padding:16,textAlign:"center"}}>
                    <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",marginBottom:4}}>IQ Estimate</div>
                    <div style={{fontSize:42,fontWeight:900,color:"#1e3a5f"}}>{catRes.iq}</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#374151"}}>{catRes.label}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>{catRes.pctRank}th percentile</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8,justifyContent:"center"}}>
                    <div style={{background:"#f8fafc",borderRadius:10,padding:12}}>
                      <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase"}}>Band</div>
                      <div style={{fontSize:16,fontWeight:800,color:"#1e3a5f"}}>{catRes.label} (Band {catRes.band}/4)</div>
                    </div>
                    <div style={{background:"#f8fafc",borderRadius:10,padding:12}}>
                      <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase"}}>Items Correct</div>
                      <div style={{fontSize:16,fontWeight:800,color:"#1e3a5f"}}>{catRes.totalCorrect}/{catRes.totalQ}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Personality */}
              <Card title="Personality — Big Five (BFI-10)" color="#8b5cf6" icon="🪞">
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:12}}>
                  {[["O","Openness","#8b5cf6"],["C","Consci.","#0891b2"],["E","Extraver.","#059669"],["A","Agreeable.","#d97706"],["N","Neurotic.","#dc2626"]].map(([d,l,c])=>(
                    <div key={d} style={{background:"white",borderRadius:10,padding:10,border:`1px solid ${c}30`,textAlign:"center"}}>
                      <div style={{fontSize:22,fontWeight:900,color:c}}>{bfi[d]}</div>
                      <div style={{fontSize:9,color:"#9ca3af",marginTop:2}}>{l}</div>
                      <div style={{height:3,background:"#f1f5f9",borderRadius:2,marginTop:6}}>
                        <div style={{width:`${((parseFloat(bfi[d])-1)/4)*100}%`,height:"100%",background:c,borderRadius:2}}/>
                      </div>
                    </div>))}
                </div>
                <div style={{fontSize:10,color:"#64748b",textAlign:"center"}}>Range 1–5 · Rammstedt & John, 2007</div>
              </Card>

              {/* DSM-5 Clusters */}
              <Card title="Personality Disorders — PID-5-BF (DSM-5)" color="#f59e0b" icon="🔍">
                <div style={{background:"#fffbeb",borderRadius:10,padding:12,marginBottom:12,border:"1px solid #fcd34d"}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#92400e"}}>Dominant Pattern</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#78350f",marginTop:4}}>{pid5.dominant}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:8}}>
                  {[["Cluster A","#6366f1",pid5.clusters.A],["Cluster B","#f59e0b",pid5.clusters.B],["Cluster C","#10b981",pid5.clusters.C]].map(([l,c,v])=>(
                    <div key={l} style={{background:"white",borderRadius:10,padding:10,border:`1px solid ${c}30`,textAlign:"center"}}>
                      <div style={{fontSize:20,fontWeight:900,color:c}}>{v}</div>
                      <div style={{fontSize:10,color:"#9ca3af"}}>{l}</div>
                    </div>))}
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {Object.entries(pid5.domains).map(([d,v])=>(
                    <div key={d} style={{background:"#f8fafc",borderRadius:8,padding:"6px 10px",fontSize:11}}>
                      <span style={{fontWeight:700,color:"#374151"}}>{d}: </span>
                      <span style={{color:"#6b7280"}}>{v}/3</span>
                    </div>))}
                </div>
                <div style={{fontSize:10,color:"#64748b",marginTop:8}}>PID-5-BF: © APA 2013. Free for researchers and clinicians.</div>
              </Card>

              {/* WHO-5 + PHQ-9 + GAD-7 */}
              <Card title="Health & Wellbeing" color="#10b981" icon="💚">
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                  {[
                    ["WHO-5","Wellbeing",who5.score,100,who5.level,who5.score>=52?"#10b981":"#f59e0b"],
                    ["PHQ-9","Depression",phq9.score,27,phq9.level,phq9.color],
                    ["GAD-7","Anxiety",gad7.score,21,gad7.level,gad7.color],
                  ].map(([scale,name,score,max,level,color])=>(
                    <div key={scale} style={{background:"#f8fafc",borderRadius:10,padding:12,textAlign:"center",border:`1px solid ${color}30`}}>
                      <div style={{fontSize:9,color:"#64748b",textTransform:"uppercase"}}>{scale}</div>
                      <div style={{fontSize:24,fontWeight:900,color}}>{score}</div>
                      <div style={{fontSize:10,color:"#9ca3af"}}>/{max}</div>
                      <div style={{fontSize:10,fontWeight:700,color,marginTop:2}}>{level}</div>
                      <div style={{height:3,background:"#e2e8f0",borderRadius:2,marginTop:6}}>
                        <div style={{width:`${(score/max)*100}%`,height:"100%",background:color,borderRadius:2}}/>
                      </div>
                    </div>))}
                </div>
                {/* RSES */}
                <div style={{background:"#f5f3ff",borderRadius:10,padding:12,display:"flex",gap:16,alignItems:"center"}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:9,color:"#6d28d9",textTransform:"uppercase"}}>RSES</div>
                    <div style={{fontSize:28,fontWeight:900,color:"#6d28d9"}}>{rses.score}</div>
                    <div style={{fontSize:10,color:"#9ca3af"}}>/40</div>
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"#4c1d95"}}>{rses.level}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>Rosenberg Self-Esteem Scale</div>
                    {who5.screenDepression && (
                      <div style={{fontSize:10,background:"#fef2f2",color:"#dc2626",borderRadius:6,padding:"4px 8px",marginTop:6,fontWeight:700}}>
                        ⚠ WHO-5 score suggests depression screening needed
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Risk */}
              <Card title="Risk Screening" color="#dc2626" icon="🛡">
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div style={{background:css.level>=2?"#fef2f2":"#f0fdf4",borderRadius:10,padding:12,border:`1px solid ${css.color}40`}}>
                    <div style={{fontSize:10,fontWeight:700,color:css.color,textTransform:"uppercase",marginBottom:4}}>C-SSRS Suicidality</div>
                    <div style={{fontSize:18,fontWeight:900,color:css.color}}>{css.label}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>Level {css.level}/4</div>
                    {css.level >= 2 && <div style={{fontSize:11,color:"#dc2626",fontWeight:700,marginTop:4}}>⚠ Clinical assessment required</div>}
                  </div>
                  <div style={{background:aud.level>=1?"#fffbeb":"#f0fdf4",borderRadius:10,padding:12,border:`1px solid ${aud.color}40`}}>
                    <div style={{fontSize:10,fontWeight:700,color:aud.color,textTransform:"uppercase",marginBottom:4}}>AUDIT-C Alcohol</div>
                    <div style={{fontSize:18,fontWeight:900,color:aud.color}}>{aud.label}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>Score: {aud.score}/12</div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* CLINICIAN TAB */}
          {tab==="clinician" && (
            <div style={{fontFamily:"'Courier New',monospace"}}>
              <div style={{background:"#3b1f6e",color:"white",borderRadius:10,padding:"14px 18px",marginBottom:20}}>
                <div style={{fontSize:10,letterSpacing:"0.15em",color:"#e9d5ff"}}>CIBS-VALID CLINICAL REPORT — CONFIDENTIAL</div>
                <div style={{fontSize:13,fontWeight:700,marginTop:4}}>{subjInfo.name||"Anonymous"} · Age {subjInfo.age} · {subjInfo.gender} · {today}</div>
                <div style={{fontSize:11,color:"#e9d5ff",marginTop:2}}>Examiner: {subjInfo.examiner||"—"} · Diagnosis: {subjInfo.diagnosis||"—"} · VISTA UID: {subjInfo.vistaUID||"—"}</div>
              </div>

              {/* Section 1 */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:900,color:"#3b82f6",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10,paddingBottom:6,borderBottom:"2px solid #3b82f6"}}>I. COGNITIVE ABILITY — RAVENS CAT</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <tbody>
                    {[["IQ Estimate",catRes.iq,"Mean=100, SD=15"],["Classification",catRes.label,""],["Percentile",catRes.pctRank+"th",""],["Band",catRes.band+"/4",""],["Items Correct",`${catRes.totalCorrect}/${catRes.totalQ}`,"Raw score"]].map(([l,v,n])=>(
                      <tr key={l} style={{borderBottom:"1px solid #f1f5f9"}}>
                        <td style={{padding:"6px 8px",fontWeight:600,color:"#374151",width:"40%"}}>{l}</td>
                        <td style={{padding:"6px 8px",fontWeight:900,color:"#1e3a5f",width:"35%"}}>{v}</td>
                        <td style={{padding:"6px 8px",color:"#9ca3af",fontSize:10}}>{n}</td>
                      </tr>))}
                  </tbody>
                </table>
              </div>

              {/* Section 2 */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:900,color:"#8b5cf6",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10,paddingBottom:6,borderBottom:"2px solid #8b5cf6"}}>II. PERSONALITY — BFI-10 + PID-5-BF</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:12}}>
                  {Object.entries(bfi).map(([d,v])=>(
                    <div key={d} style={{background:"#f8fafc",borderRadius:8,padding:"8px",textAlign:"center",border:"1px solid #e2e8f0"}}>
                      <div style={{fontSize:16,fontWeight:900,color:"#6d28d9"}}>{v}</div>
                      <div style={{fontSize:9,color:"#9ca3af"}}>BFI-{d}</div>
                    </div>))}
                </div>
                <div style={{background:"#fffbeb",borderRadius:8,padding:"10px 12px",marginBottom:8}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#92400e"}}>DSM-5 PID-5-BF Dominant Cluster: {pid5.dominant}</div>
                  <div style={{fontSize:11,color:"#78350f",marginTop:4}}>Cluster A: {pid5.clusters.A} · Cluster B: {pid5.clusters.B} · Cluster C: {pid5.clusters.C}</div>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <tbody>
                    {Object.entries(pid5.domains).map(([d,v])=>(
                      <tr key={d} style={{borderBottom:"1px solid #f1f5f9"}}>
                        <td style={{padding:"5px 8px",fontWeight:600,color:"#374151"}}>{d}</td>
                        <td style={{padding:"5px 8px",fontWeight:900,color:"#f59e0b"}}>{v}/3</td>
                        <td style={{padding:"5px 8px",color:"#9ca3af",fontSize:10}}>{parseFloat(v)>=2?"Elevated":parseFloat(v)>=1?"Moderate":"Low"}</td>
                      </tr>))}
                  </tbody>
                </table>
              </div>

              {/* Section 3 */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:900,color:"#10b981",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10,paddingBottom:6,borderBottom:"2px solid #10b981"}}>III. HEALTH & WELLBEING</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <tbody>
                    {[
                      ["WHO-5 Wellbeing",who5.score+"/100",who5.level,who5.screenDepression?"Screen for depression":"Adequate"],
                      ["PHQ-9 Depression",phq9.score+"/27",phq9.level,phq9.score>=10?"Intervention indicated":""],
                      ["GAD-7 Anxiety",gad7.score+"/21",gad7.level,gad7.score>=10?"Intervention indicated":""],
                      ["Rosenberg RSES",rses.score+"/40",rses.level,""],
                    ].map(([l,v,level,note])=>(
                      <tr key={l} style={{borderBottom:"1px solid #f1f5f9"}}>
                        <td style={{padding:"6px 8px",fontWeight:600,color:"#374151",width:"35%"}}>{l}</td>
                        <td style={{padding:"6px 8px",fontWeight:900,color:"#1e3a5f",width:"15%"}}>{v}</td>
                        <td style={{padding:"6px 8px",fontWeight:700,color:"#10b981",width:"25%"}}>{level}</td>
                        <td style={{padding:"6px 8px",color:"#9ca3af",fontSize:10}}>{note}</td>
                      </tr>))}
                  </tbody>
                </table>
              </div>

              {/* Section 4 */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:900,color:"#dc2626",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10,paddingBottom:6,borderBottom:"2px solid #dc2626"}}>IV. RISK SCREENING</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <tbody>
                    <tr style={{borderBottom:"1px solid #f1f5f9"}}>
                      <td style={{padding:"6px 8px",fontWeight:600,color:"#374151"}}>C-SSRS (Suicidality)</td>
                      <td style={{padding:"6px 8px",fontWeight:900,color:css.color}}>{css.label} (Level {css.level}/4)</td>
                      <td style={{padding:"6px 8px",color:"#9ca3af",fontSize:10}}>{css.level>=3?"Immediate assessment":"Monitor"}</td>
                    </tr>
                    <tr style={{borderBottom:"1px solid #f1f5f9"}}>
                      <td style={{padding:"6px 8px",fontWeight:600,color:"#374151"}}>AUDIT-C (Alcohol)</td>
                      <td style={{padding:"6px 8px",fontWeight:900,color:aud.color}}>{aud.label} (Score {aud.score}/12)</td>
                      <td style={{padding:"6px 8px",color:"#9ca3af",fontSize:10}}>{aud.score>=4?"Brief intervention":"No action needed"}</td>
                    </tr>
                  </tbody>
                </table>
                {css.level >= 2 && (
                  <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"10px 12px",marginTop:10}}>
                    <div style={{fontWeight:700,color:"#dc2626",fontSize:12}}>⚠ PRIORITY: C-SSRS Level {css.level} — Structured clinical safety assessment required at this contact.</div>
                  </div>
                )}
              </div>

              {/* Instruments footer */}
              <div style={{marginTop:16,fontSize:10,color:"#9ca3af",lineHeight:1.8,borderTop:"1px solid #e2e8f0",paddingTop:12}}>
                <strong>Instruments used:</strong> Ravens CAT (CIBS original, Cattell/Raven framework) · BFI-10 (Rammstedt & John, 2007, open access) · PID-5-BF (Krueger et al., 2013, © APA, free for researchers/clinicians) · WHO-5 (WHO, 2024, CC BY-NC-SA 3.0 IGO) · PHQ-9 (Kroenke et al., 2001, © Pfizer, free) · GAD-7 (Spitzer et al., 2006, © Pfizer, free) · RSES (Rosenberg, 1965, public domain) · C-SSRS (Posner et al., 2011, Columbia University, public domain) · AUDIT-C (Bush et al., 1998, WHO, public domain)<br/>
                <strong>Disclaimer:</strong> Screening tool only. All findings require clinical confirmation by qualified professional.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN VALID APP
// ══════════════════════════════════════════════════════════════════════════════
export default function CIBSVALIDApp() {
  const [lang, setLang]         = useState(null);
  const [screen, setScreen]     = useState("language");
  const [agreed, setAgreed]     = useState(false);
  const [subjInfo, setSubjInfo] = useState({name:"",age:"",gender:"",edu:"",mobile:"",diagnosis:"",examiner:"",setting:"",vistaUID:""});
  const [domain, setDomain]     = useState(1);
  const [resp, setResp]         = useState({d1:{},d2:{},d3:{},d4:{}});
  const [results, setResults]   = useState(null);
  const [generating, setGenerating] = useState(false);
  const scrollRef = useRef(null);

  const t = T[lang] || T.en;

  const set = (d, k, v) => setResp(r => ({ ...r, [`d${d}`]: { ...r[`d${d}`], [k]: v } }));

  const DOMAIN_META = [
    { id:1, name:"Cognition",      color:"#3B82F6", bg:"#EFF6FF", icon:"🧩", count:22   },
    { id:2, name:"Personality",    color:"#8B5CF6", bg:"#F5F3FF", icon:"🪞", count:35   },
    { id:3, name:"Health",         color:"#10B981", bg:"#F0FDF4", icon:"💚", count:31   },
    { id:4, name:"Risk",           color:"#EF4444", bg:"#FEF2F2", icon:"🛡", count:8    },
  ];

  const answered = (d) => {
    if (d===1) return resp.d1._done === 1 ? DOMAIN_META[0].count : 0;
    return Object.keys(resp[`d${d}`]).length;
  };
  const complete = (d) => {
    if (d===1) return resp.d1._done === 1;
    return answered(d) >= DOMAIN_META[d-1].count;
  };
  const pct = () => {
    const total = DOMAIN_META.reduce((s,m)=>s+m.count,0);
    const done  = DOMAIN_META.reduce((s,m)=>s+Math.min(answered(m.id),m.count),0);
    return Math.round(done/total*100);
  };
  const allDone = DOMAIN_META.every(m => complete(m.id));
  const cd = DOMAIN_META[Math.min(domain,DOMAIN_META.length)-1];

  const f = (k,v) => setSubjInfo(p=>({...p,[k]:v}));
  const canProceed = subjInfo.age && subjInfo.gender;

  const reset = () => {
    setLang(null); setScreen("language"); setAgreed(false);
    setSubjInfo({name:"",age:"",gender:"",edu:"",mobile:"",diagnosis:"",examiner:"",setting:"",vistaUID:""});
    setDomain(1); setResp({d1:{},d2:{},d3:{},d4:{}}); setResults(null); setGenerating(false);
  };

  const completeAssessment = async () => {
    setGenerating(true);
    // Score everything
    const catRes  = scoreCAT(resp.d1);
    const bfi     = scoreBFI(resp.d2);
    const pid5    = scorePID5(resp.d2);
    const who5    = scoreWHO5(resp.d3);
    const phq9    = scorePHQ9(resp.d3);
    const gad7    = scoreGAD7(resp.d3);
    const rses    = scoreRSES(resp.d3);
    const css     = scoreCSS(resp.d4);
    const aud     = scoreAUDIT(resp.d4);

    const scored = { catRes, bfi, pid5, who5, phq9, gad7, rses, css, aud };
    setResults(scored);

    // Submit to Google Sheets — Battery_OPD tab
    try {
      const uid = subjInfo.vistaUID ||
        (subjInfo.mobile ? btoa(subjInfo.name.slice(0,3)+subjInfo.age+subjInfo.mobile.slice(-4)).slice(0,12).toUpperCase() : "ANON-"+Date.now().toString(36).toUpperCase().slice(-6));

      const payload = {
        // Routing — goes to Battery_OPD and Battery_Research
        Source: "valid-standalone",
        UID: uid,
        Name: subjInfo.name,
        Age: subjInfo.age,
        Gender: subjInfo.gender,
        Education: subjInfo.edu,
        Mobile: subjInfo.mobile,
        Diagnosis: subjInfo.diagnosis,
        Language: lang || "en",
        Device: navigator.userAgent.match(/Mobile/i) ? "Mobile" : "Desktop",
        // Cognitive
        "VALID CQ": catRes.iq,
        "VALID CQ Band": catRes.label,
        "VALID Percentile": catRes.pctRank,
        // Personality BFI-10
        "VALID BFI-O": bfi.O,
        "VALID BFI-C": bfi.C,
        "VALID BFI-E": bfi.E,
        "VALID BFI-A": bfi.A,
        "VALID BFI-N": bfi.N,
        // Personality PID-5-BF
        "VALID PID5 Neg Affect": pid5.domains["Negative Affect"],
        "VALID PID5 Detachment": pid5.domains["Detachment"],
        "VALID PID5 Antagonism": pid5.domains["Antagonism"],
        "VALID PID5 Disinhibition": pid5.domains["Disinhibition"],
        "VALID PID5 Psychoticism": pid5.domains["Psychoticism"],
        "VALID DSM Cluster": pid5.dominant,
        // Health
        "VALID WHO5": who5.score,
        "VALID WHO5 Level": who5.level,
        "VALID PHQ9": phq9.score,
        "VALID PHQ9 Level": phq9.level,
        "VALID GAD7": gad7.score,
        "VALID GAD7 Level": gad7.level,
        "VALID RSES": rses.score,
        "VALID RSES Level": rses.level,
        // Risk
        "VALID CSSRS Level": css.level,
        "VALID CSSRS Label": css.label,
        "VALID AUDIT Score": aud.score,
        "VALID AUDIT Label": aud.label,
      };
      await submitToSheet(payload);
      console.log("✅ CIBS-VALID submitted successfully");
    } catch(err) {
      console.error("❌ Submission error:", err);
    }

    setGenerating(false);
    setScreen("report");
  };

  // ── SCREENS ───────────────────────────────────────────────────
  const rootStyle = {minHeight:"100vh",background:"#f0f4f8",fontFamily:"'Segoe UI',system-ui,sans-serif"};
  const cardStyle = {background:"white",borderRadius:14,padding:"20px 18px",maxWidth:580,width:"100%",margin:"0 auto",boxShadow:"0 2px 18px rgba(0,0,0,0.09)"};

  // Language
  if (screen==="language") return (
    <div style={rootStyle}>
      <div style={{background:"linear-gradient(135deg,#3b1f6e,#6d28d9)",padding:"32px 20px 44px",textAlign:"center",color:"white",marginBottom:-20}}>
        <div style={{fontSize:9,letterSpacing:"0.2em",color:"#e9d5ff",textTransform:"uppercase",marginBottom:8}}>Central Institute of Behavioural Sciences, Nagpur</div>
        <div style={{fontSize:28,fontWeight:900,marginBottom:4}}>CIBS-VALID</div>
        <div style={{fontSize:13,color:"#ddd6fe"}}>Gold Standard Validation Battery · Adult</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:4}}>Ravens CAT · BFI-10 · PID-5-BF · WHO-5 · PHQ-9 · GAD-7 · RSES · C-SSRS · AUDIT-C</div>
      </div>
      <div style={{...cardStyle,marginTop:40}}>
        <div style={{fontSize:13,fontWeight:700,color:"#3b1f6e",textAlign:"center",marginBottom:20}}>{T.en.choose}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[["en","English","A"],["hi","हिंदी — Hindi","अ"],["mr","मराठी — Marathi","अ"]].map(([code,label,icon])=>(
            <button key={code} onClick={()=>{setLang(code);setScreen("disclaimer");}} style={{padding:"14px 18px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"white",cursor:"pointer",display:"flex",alignItems:"center",gap:12,fontSize:14,fontWeight:600,color:"#3b1f6e",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#6d28d9";e.currentTarget.style.background="#f5f3ff";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.background="white";}}>
              <span style={{width:36,height:36,borderRadius:"50%",background:"#6d28d9",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900}}>{icon}</span>
              {label}
            </button>))}
        </div>
      </div>
    </div>
  );

  // Disclaimer
  if (screen==="disclaimer") return (
    <div style={rootStyle}>
      <div style={{background:"linear-gradient(135deg,#3b1f6e,#6d28d9)",padding:"20px",textAlign:"center",color:"white",marginBottom:24}}>
        <div style={{fontSize:16,fontWeight:800}}>CIBS-VALID</div>
        <div style={{fontSize:11,color:"#ddd6fe"}}>{t.disclaimer}</div>
      </div>
      <div style={cardStyle}>
        <div style={{background:"#fef9ec",border:"1.5px solid #fcd34d",borderRadius:12,padding:"14px 16px",marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:700,color:"#92400e",marginBottom:10}}>⚠ {t.disclaimer}</div>
          <ol style={{margin:0,paddingLeft:18,color:"#78350f",fontSize:12,lineHeight:2}}>
            {(t.discPoints||[]).map((p,i)=><li key={i}>{p}</li>)}
          </ol>
        </div>
        <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",marginBottom:20}}>
          <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:2,width:16,height:16}}/>
          <span style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{t.agreeText}</span>
        </label>
        <button onClick={()=>agreed&&setScreen("demographics")} style={{width:"100%",padding:"14px",borderRadius:12,background:agreed?"linear-gradient(135deg,#3b1f6e,#6d28d9)":"#e2e8f0",color:agreed?"white":"#9ca3af",border:"none",fontSize:14,fontWeight:700,cursor:agreed?"pointer":"not-allowed"}}>{t.proceedBtn}</button>
      </div>
    </div>
  );

  // Demographics
  if (screen==="demographics") {
    const INP = {width:"100%",padding:"10px 12px",border:"1.5px solid #cbd5e1",borderRadius:10,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box",background:"#fafafa",color:"#0f172a"};
    const LBL = {display:"block",fontSize:10,fontWeight:700,color:"#3b1f6e",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4};
    return (
      <div style={rootStyle}>
        <div style={{background:"linear-gradient(135deg,#3b1f6e,#6d28d9)",padding:"20px",textAlign:"center",color:"white",marginBottom:24}}>
          <div style={{fontSize:16,fontWeight:800}}>CIBS-VALID — {t.subjInfo}</div>
        </div>
        <div style={{...cardStyle,maxWidth:620}}>
          <div style={{background:"white",borderRadius:14,padding:16,marginBottom:14,border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#3b1f6e",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Participant</div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:10,marginBottom:10}}>
              <div><label style={LBL}>{t.name}</label><input style={INP} placeholder="—" value={subjInfo.name} onChange={e=>f("name",e.target.value)}/></div>
              <div><label style={LBL}>{t.age} *</label><input style={INP} type="number" min={18} max={99} placeholder="35" value={subjInfo.age} onChange={e=>f("age",e.target.value)}/></div>
            </div>
            <div style={{marginBottom:10}}>
              <label style={LBL}>{t.gender} *</label>
              <div style={{display:"flex",gap:7}}>
                {[[t.gM,"Male"],[t.gF,"Female"],[t.gO,"Other"],[t.gN,"N/S"]].map(([label,val])=>(
                  <button key={val} onClick={()=>f("gender",val)} style={{flex:1,padding:"9px 4px",borderRadius:9,fontSize:11,fontWeight:700,cursor:"pointer",border:subjInfo.gender===val?"2px solid #6d28d9":"2px solid #e2e8f0",background:subjInfo.gender===val?"#6d28d9":"white",color:subjInfo.gender===val?"white":"#94a3b8"}}>{label}</button>))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div><label style={LBL}>{t.edu}</label>
                <select style={INP} value={subjInfo.edu} onChange={e=>f("edu",e.target.value)}>
                  <option value="">— Select —</option>
                  {["Illiterate","Primary","Secondary","Higher Secondary","Graduate","Post-Graduate","Doctoral"].map(o=><option key={o}>{o}</option>)}
                </select></div>
              <div><label style={LBL}>{t.mobile}</label><input style={INP} type="tel" maxLength={10} placeholder="9876543210" value={subjInfo.mobile} onChange={e=>f("mobile",e.target.value)}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><label style={LBL}>{t.examiner}</label><input style={INP} placeholder="Dr. Name" value={subjInfo.examiner} onChange={e=>f("examiner",e.target.value)}/></div>
              <div><label style={LBL}>{t.diagnosis}</label><input style={INP} placeholder="—" value={subjInfo.diagnosis} onChange={e=>f("diagnosis",e.target.value)}/></div>
            </div>
          </div>
          {/* VISTA UID link */}
          <div style={{background:"#f5f3ff",borderRadius:12,padding:12,marginBottom:14,border:"1px solid #ddd6fe"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6d28d9",marginBottom:6}}>🔗 Link to VISTA Assessment (Optional)</div>
            <label style={LBL}>{t.vistaUID}</label>
            <input style={INP} placeholder="e.g. ABCDEF123456 — enter if this person has taken CIBS-VISTA" value={subjInfo.vistaUID} onChange={e=>f("vistaUID",e.target.value)}/>
            <div style={{fontSize:10,color:"#8b5cf6",marginTop:4}}>Entering the VISTA UID links both assessments in the research database for convergent validity analysis.</div>
          </div>
          <button onClick={()=>canProceed&&setScreen("assessment")} style={{display:"block",width:"100%",padding:"15px",borderRadius:14,background:canProceed?"linear-gradient(135deg,#3b1f6e,#6d28d9)":"#e2e8f0",color:canProceed?"white":"#9ca3af",border:"none",fontSize:14,fontWeight:700,cursor:canProceed?"pointer":"not-allowed"}}>
            Begin Assessment →
          </button>
        </div>
      </div>
    );
  }

  // Assessment
  if (screen==="assessment") {
    const progress = pct();
    return (
      <div style={rootStyle}>
        {/* Progress header */}
        <div style={{background:"linear-gradient(135deg,#3b1f6e,#6d28d9)",padding:"14px 16px",position:"sticky",top:0,zIndex:20}}>
          <div style={{maxWidth:580,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:12,fontWeight:700,color:"white"}}>CIBS-VALID</div>
              <div style={{fontSize:11,color:"#e9d5ff"}}>{progress}% complete</div>
            </div>
            <div style={{background:"rgba(255,255,255,0.2)",borderRadius:4,height:4,overflow:"hidden"}}>
              <div style={{width:`${progress}%`,height:"100%",background:"#a78bfa",borderRadius:4,transition:"width 0.4s ease"}}/>
            </div>
            {/* Domain tabs */}
            <div style={{display:"flex",gap:4,marginTop:10}}>
              {DOMAIN_META.map(m=>(
                <button key={m.id} onClick={()=>{if(m.id<=domain||complete(m.id-1)||m.id===1)setDomain(m.id);}}
                  style={{flex:1,padding:"5px 2px",borderRadius:8,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,
                    background:domain===m.id?m.color:complete(m.id)?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.1)",
                    color:domain===m.id?"white":complete(m.id)?"white":"rgba(255,255,255,0.5)"}}>
                  {complete(m.id)?"✓ ":""}{m.icon}
                </button>))}
            </div>
          </div>
        </div>

        <div style={{maxWidth:580,margin:"0 auto",padding:"16px 8px 100px"}} ref={scrollRef}>
          {/* Domain header */}
          <div style={{background:"white",borderRadius:14,padding:"14px 16px",marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:`1px solid ${cd.color}20`}}>
            <div style={{fontSize:9,fontWeight:700,color:cd.color,letterSpacing:"0.12em",textTransform:"uppercase"}}>{t.domainNames?.[domain-1]}</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:3}}>
              {domain===1&&"CIBS original, Cattell/Raven framework · Adaptive · ~10 min"}
              {domain===2&&"BFI-10 (Rammstedt & John, 2007) + PID-5-BF (APA, 2013) · 35 items · ~8 min"}
              {domain===3&&"WHO-5 + PHQ-9 + GAD-7 + Rosenberg RSES · 31 items · ~10 min"}
              {domain===4&&"C-SSRS (Columbia) + AUDIT-C (WHO) · 8 items · ~3 min"}
            </div>
          </div>

          {domain===1 && <DomainCognition set={(k,v)=>set(1,k,v)} color={cd.color} bg={cd.bg}/>}
          {domain===2 && <DomainPersonalityFull resp={resp.d2} set={(k,v)=>set(2,k,v)} t={t}/>}
          {domain===3 && <DomainHealthFull resp={resp.d3} set={(k,v)=>set(3,k,v)} t={t}/>}
          {domain===4 && <DomainRiskFull resp={resp.d4} set={(k,v)=>set(4,k,v)} t={t}/>}

          {/* Navigation */}
          <div style={{position:"fixed",bottom:0,left:0,right:0,background:"white",borderTop:"1px solid #e2e8f0",padding:"12px 16px",boxShadow:"0 -2px 12px rgba(0,0,0,0.08)"}}>
            <div style={{maxWidth:580,margin:"0 auto",display:"flex",gap:10,alignItems:"center"}}>
              {domain > 1 && (
                <button onClick={()=>{setDomain(d=>d-1);scrollRef.current?.scrollTo(0,0);}} style={{padding:"12px 18px",borderRadius:11,border:"1.5px solid #e2e8f0",background:"white",fontSize:13,fontWeight:600,color:"#64748b",cursor:"pointer"}}>← Back</button>
              )}
              <button onClick={()=>{
                if (domain < DOMAIN_META.length) { setDomain(d=>d+1); scrollRef.current?.scrollTo(0,0); }
                else completeAssessment();
              }} style={{flex:1,padding:"14px",borderRadius:12,background:`linear-gradient(135deg,#3b1f6e,${cd.color})`,color:"white",border:"none",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                {domain < DOMAIN_META.length ? `Continue → ${DOMAIN_META[domain].icon} ${DOMAIN_META[domain].name}` : "Generate Report ✅"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generating
  if (generating) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#3b1f6e,#6d28d9)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{textAlign:"center",maxWidth:340,padding:20}}>
        <div style={{width:60,height:60,border:"3px solid rgba(255,255,255,0.1)",borderTopColor:"#a78bfa",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 24px"}}/>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        <h2 style={{fontSize:20,color:"white",fontWeight:800,marginBottom:10}}>{t.generating}</h2>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>Scoring 9 instruments · Submitting to CIBS database…</div>
      </div>
    </div>
  );

  // Report
  if (screen==="report" && results) return (
    <ValidReport results={results} subjInfo={subjInfo} t={t} onNew={reset}/>
  );

  return null;
}

