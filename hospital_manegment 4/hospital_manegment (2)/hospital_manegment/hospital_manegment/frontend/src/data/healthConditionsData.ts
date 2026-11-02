export interface HealthCondition {
  id: string;
  name: string;
  category: string;
  severity: 'Mild' | 'Moderate' | 'Chronic Management';
  icon: string;
  overview: string;
  medicines: { name: string; dosage: string; timing: string; note: string }[];
  diet: { eat: string[]; avoid: string[] };
  exercisesAndMeditation: { exercises: string[]; meditation: string[] };
  dayRoutine: string[];
  nightRoutine: string[];
  recoveryTimeline: string;
  whenToSeeDoctor: string[];
  precautions: string[];
}

export const HEALTH_CONDITIONS_DATA: HealthCondition[] = [
  {
    id: 'hypertension',
    name: 'Hypertension (High Blood Pressure)',
    category: 'Cardiovascular',
    severity: 'Chronic Management',
    icon: '❤️',
    overview: 'Persistent elevation of arterial blood pressure requiring blood pressure monitoring, low-sodium diet, and prescribed antihypertensive therapy.',
    medicines: [
      { name: 'Amlodipine (as prescribed)', dosage: '5mg - 10mg', timing: 'Once daily in the morning', note: 'Do not skip doses. Monitor BP regularly.' },
      { name: 'Telmisartan (as prescribed)', dosage: '40mg', timing: 'Once daily with water', note: 'Reduces vascular resistance.' },
      { name: 'CoQ10 Supplement', dosage: '100mg', timing: 'After lunch', note: 'Supports cardiovascular cellular energy.' }
    ],
    diet: {
      eat: ['DASH Diet foods (Leafy greens, Berries, Oats)', 'Potassium-rich foods (Bananas, Spinach, Avocados)', 'Garlic & Olive Oil', 'Low-fat yoghurt'],
      avoid: ['High-sodium canned/processed foods', 'Pickles, Papad & Processed Cheeses', 'Excessive Caffeine & Energy drinks', 'Alcohol & Tobacco']
    },
    exercisesAndMeditation: {
      exercises: ['30 minutes moderate brisk walking daily', 'Light cycling or swimming 4 days/week', 'Isometric handgrip exercises'],
      meditation: ['Anulom Vilom (Alternate nostril breathing) 15 mins', '4-7-8 Deep Breathing technique twice daily']
    },
    dayRoutine: [
      '06:30 AM: Wake up & log resting BP reading',
      '07:00 AM: 20-min brisk walk & 10-min Anulom Vilom',
      '08:30 AM: Low-sodium breakfast + morning medication',
      '01:30 PM: Balanced DASH-compliant lunch (salads + brown rice/roti)',
      '05:30 PM: Green tea + handful of unsalted walnuts'
    ],
    nightRoutine: [
      '08:00 PM: Light early dinner (steamed veggies & lentils)',
      '09:30 PM: Screen-free wind down & soothing herbal chamomile tea',
      '10:30 PM: 7-8 hours uninterrupted restful sleep'
    ],
    recoveryTimeline: 'Continuous long-term management. Significant BP stabilization seen within 2-4 weeks of strict diet and medication.',
    whenToSeeDoctor: [
      'Systolic BP > 180 mmHg or Diastolic BP > 120 mmHg',
      'Sudden severe headache, chest tightness, or shortness of breath',
      'Blurry vision, dizziness, or numbness in limbs'
    ],
    precautions: [
      'Limit total daily salt intake to under 1.5 grams (less than 1/2 teaspoon)',
      'Avoid sudden discontinuation of blood pressure medications',
      'Regularly check kidney function and electrolytes every 6 months'
    ]
  },
  {
    id: 'type2-diabetes',
    name: 'Type 2 Diabetes Mellitus',
    category: 'Metabolic & Endocrine',
    severity: 'Chronic Management',
    icon: '🩸',
    overview: 'Metabolic disorder characterized by insulin resistance and elevated blood glucose levels. Requires glycemic control, low-GI foods, and exercise.',
    medicines: [
      { name: 'Metformin Sustained Release', dosage: '500mg - 1000mg', timing: 'Twice daily with meals (Breakfast & Dinner)', note: 'Enhances insulin sensitivity.' },
      { name: 'Glimepiride (if prescribed)', dosage: '1mg - 2mg', timing: '15 mins before breakfast', note: 'Stimulates pancreatic insulin release.' },
      { name: 'Alpha Lipoic Acid', dosage: '300mg', timing: 'Once daily after meal', note: 'Supports nerve health and reduces diabetic neuropathy risk.' }
    ],
    diet: {
      eat: ['Complex carbs (Quinoa, Oats, Whole Wheat)', 'High-fiber veggies (Broccoli, Methi, Karela, Cucumber)', 'Legumes, Sprouts & Lean Proteins', 'Cinnamon & Fenugreek water'],
      avoid: ['Refined sugars, Sweets, Pastries & Chocolates', 'White bread, White rice & Maida products', 'Fruit juices & Carbonated sugary drinks', 'Deep-fried snacks']
    },
    exercisesAndMeditation: {
      exercises: ['Post-meal 15-minute gentle walk (after breakfast, lunch, dinner)', 'Resistance/Weight training 3 times a week', 'Yoga (Pawanmuktasana, Dhanurasana)'],
      meditation: ['Mindful Meditation 15 mins daily to control cortisol & blood glucose spikes']
    },
    dayRoutine: [
      '06:30 AM: Fasting Blood Glucose check + 1 glass soaked Fenugreek water',
      '07:15 AM: 30 mins Yoga & stretching',
      '08:30 AM: High-protein diabetic breakfast (Sprouts/Eggs/Oats) + Metformin',
      '01:30 PM: Fiber-rich lunch + Post-meal 15-min walk',
      '05:00 PM: Roasted chana or buttermilk snack'
    ],
    nightRoutine: [
      '08:00 PM: Light high-protein dinner + Metformin',
      '08:45 PM: 15-min evening stroll',
      '10:00 PM: Daily foot inspection for cuts/blisters before sleep'
    ],
    recoveryTimeline: 'HbA1c optimization achievable within 8-12 weeks with strict lifestyle modification and prescribed pharmacotherapy.',
    whenToSeeDoctor: [
      'Fasting blood sugar > 250 mg/dL or Blood sugar < 70 mg/dL (Hypoglycemia)',
      'Symptoms of confusion, excessive thirst, frequent urination, or fruity breath',
      'Non-healing foot sores, ulcers, or persistent numbness in toes'
    ],
    precautions: [
      'Always carry glucose tablets or candy to manage sudden hypoglycemia',
      'Never skip meals when taking diabetes medication',
      'Get annual diabetic eye examination (Retinopathy screen) and renal check'
    ]
  },
  {
    id: 'gerd-acidity',
    name: 'Acid Reflux / GERD & Gastritis',
    category: 'Digestive & Gastric',
    severity: 'Moderate',
    icon: '🔥',
    overview: 'Stomach acid flowing back into the esophagus causing heartburn, regurgitation, chest discomfort, and stomach lining inflammation.',
    medicines: [
      { name: 'Pantoprazole or Esomeprazole', dosage: '40mg', timing: 'Once daily 30 minutes before breakfast', note: 'Proton pump inhibitor to suppress excess acid production.' },
      { name: 'Magnesium Hydroxide / Antacid Gel', dosage: '10ml', timing: 'At bedtime or as needed after meals', note: 'Provides instant neutralizing relief.' },
      { name: 'Probiotics (Lactobacillus)', dosage: '1 Capsule', timing: 'Before lunch', note: 'Restores healthy gut microbiome.' }
    ],
    diet: {
      eat: ['Oatmeal, Bananas & Melons', 'Boiled potatoes, Carrots & Steamed vegetables', 'Cold Milk & Coconut water', 'Fennel seed (Saunf) water'],
      avoid: ['Spicy curries, Chili & Fried foods', 'Citrus fruits (Lemons, Oranges, Tomatoes)', 'Caffeine, Chocolate, Peppermint & Carbonated drinks', 'Raw onions & Garlic in excess']
    },
    exercisesAndMeditation: {
      exercises: ['Light walking 20 mins post meal', 'Vajrasana posture for 10 mins post-lunch'],
      meditation: ['Sheetali Pranayama (Cooling breath) 10 mins', 'Guided Body Scan relaxation']
    },
    dayRoutine: [
      '07:00 AM: Pantoprazole with warm water on empty stomach',
      '07:30 AM: Mild breakfast (Oats/Idli with coconut water)',
      '01:00 PM: Non-spicy alkaline lunch',
      '04:30 PM: Cold milk or fennel tea',
      '07:30 PM: Early dinner 3 hours prior to lying down'
    ],
    nightRoutine: [
      '09:30 PM: Antacid syrup if experiencing night heartburn',
      '10:30 PM: Sleep with head elevated 6-8 inches using wedge pillow',
      'Sleep strictly on LEFT side to prevent acid reflux leakage into esophagus'
    ],
    recoveryTimeline: 'Acute symptom relief in 2-3 days; complete gastric mucosal healing in 2-4 weeks.',
    whenToSeeDoctor: [
      'Difficulty or severe pain while swallowing food (Dysphagia)',
      'Vomiting blood or dark black tarry stools',
      'Unexplained weight loss or persistent crushing chest pain'
    ],
    precautions: [
      'Do not lie down within 3 hours after eating any main meal',
      'Avoid tight-fitting waist clothing that presses on the abdomen',
      'Quit smoking and eliminate late-night snacking'
    ]
  },
  {
    id: 'migraine',
    name: 'Migraine & Tension Headache',
    category: 'Neurological & Mental',
    severity: 'Moderate',
    icon: '🧠',
    overview: 'Throbbing neurological headache often accompanied by sensitivity to light/sound, nausea, visual aura, and neck stiffness.',
    medicines: [
      { name: 'Naproxen / Paracetamol', dosage: '500mg', timing: 'At onset of migraine attack', note: 'Relieves acute inflammation and throbbing pain.' },
      { name: 'Sumatriptan (if prescribed)', dosage: '50mg', timing: 'At aura onset', note: 'Specific triptan for acute migraine relief.' },
      { name: 'Magnesium Glycinate', dosage: '400mg', timing: 'At bedtime', note: 'Reduces frequency of neurological vascular spasms.' }
    ],
    diet: {
      eat: ['Magnesium-rich foods (Spinach, Almonds, Pumpkin seeds)', 'Hydrating foods (Cucumbers, Watermelon)', 'Ginger tea with lemon', 'Herbal peppermint infusion'],
      avoid: ['Aged cheeses, Dark chocolate & Processed meats', 'MSG, Artificial sweeteners & Preservatives', 'Red wine & Alcoholic beverages', 'Skipping meals or erratic eating times']
    },
    exercisesAndMeditation: {
      exercises: ['Gentle neck stretches and shoulder rolls', 'Light walking in shaded green outdoor spaces'],
      meditation: ['Progressive Muscle Relaxation (PMR)', 'Mindfulness Meditation in a quiet dimly lit room']
    },
    dayRoutine: [
      '07:00 AM: Hydrate with 2 glasses of fresh water immediately upon waking',
      '08:00 AM: Wholesome breakfast on exact schedule',
      '12:30 PM: Screen break (20-20-20 rule during computer work)',
      '04:00 PM: Sip warm ginger tea & rest eyes for 10 mins',
      '08:00 PM: Consistent dinner timing'
    ],
    nightRoutine: [
      '09:30 PM: Lavender essential oil aromatherapy in bedroom',
      '10:00 PM: Dark, completely silent room for 8 hours of uninterrupted sleep'
    ],
    recoveryTimeline: 'Acute episode resolves in 4-24 hours with prompt treatment. Trigger management cuts attacks by 70%.',
    whenToSeeDoctor: [
      'Thunderclap headache (sudden, severe, maximum intensity within seconds)',
      'Headache accompanied by fever, stiff neck, confusion, or weakness on one side',
      'Headache frequency increasing to more than 3 times per week'
    ],
    precautions: [
      'Maintain a migraine trigger diary tracking food, sleep, and weather patterns',
      'Avoid prolonged blue light exposure without blue-blocker glasses',
      'Stay consistently hydrated (minimum 2.5L water daily)'
    ]
  },
  {
    id: 'common-cold-flu',
    name: 'Common Cold, Cough & Viral Flu',
    category: 'Respiratory',
    severity: 'Mild',
    icon: '🤧',
    overview: 'Upper respiratory viral infection causing nasal congestion, runny nose, sneezing, low-grade fever, sore throat, and body ache.',
    medicines: [
      { name: 'Paracetamol', dosage: '500mg', timing: 'Every 6-8 hours as needed for fever/body ache', note: 'Do not exceed 3000mg in 24 hours.' },
      { name: 'Cetirizine / Levocetirizine', dosage: '5mg - 10mg', timing: 'Once daily at bedtime', note: 'Reduces runny nose and sneezing.' },
      { name: 'Vitamin C + Zinc Supplement', dosage: '500mg', timing: 'Once daily after breakfast', note: 'Boosts immune cell recovery.' }
    ],
    diet: {
      eat: ['Hot chicken or vegetable broth/soup', 'Warm Turmeric Milk (Haldi Doodh)', 'Ginger-Tulsi herbal kadha with honey', 'Warm water with lemon'],
      avoid: ['Cold ice creams, Chilled beverages & Milkshakes', 'Deep-fried greasy snacks', 'Alcohol & Heavy oily curries']
    },
    exercisesAndMeditation: {
      exercises: ['Complete physical rest during acute phase', 'Light stretching after fever subsides'],
      meditation: ['Deep diaphragmatic breathing', 'Steam inhalation 3 times daily for 10 mins']
    },
    dayRoutine: [
      '07:30 AM: Steam inhalation with Eucalyptus oil + warm herbal Kadha',
      '08:30 AM: Light warm breakfast (Porridge/Soup)',
      '11:00 AM: Saline gargle with warm salt water',
      '01:30 PM: Nourishing warm lunch + Vitamin C tablet',
      '04:00 PM: Rest & warm honey ginger tea',
      '08:00 PM: Steam inhalation & light dinner'
    ],
    nightRoutine: [
      '09:30 PM: Saline nasal spray + Cetirizine tablet',
      '10:00 PM: Warm turmeric milk & 8-9 hours deep recovery sleep with elevated head'
    ],
    recoveryTimeline: 'Symptom improvement in 3-5 days; full resolution in 7-10 days.',
    whenToSeeDoctor: [
      'Fever > 102°F lasting more than 3 consecutive days',
      'Shortness of breath, wheezing, or severe chest pain during cough',
      'Phlegm changing to thick green/rusty color accompanied by high chills'
    ],
    precautions: [
      'Cover coughs and sneezes with tissue or elbow to prevent viral spread',
      'Do not take antibiotics for viral cold/flu unless prescribed for secondary infection',
      'Wash hands frequently with soap and water'
    ]
  },
  {
    id: 'asthma',
    name: 'Bronchial Asthma & Wheezing',
    category: 'Respiratory',
    severity: 'Chronic Management',
    icon: '🫁',
    overview: 'Chronic inflammatory airway disease marked by hyper-reactive airways, bronchial spasms, wheezing, chest tightness, and dyspnea.',
    medicines: [
      { name: 'Salbutamol / Albuterol Inhaler (Reliever)', dosage: '1-2 puffs', timing: 'SOS during acute shortness of breath / wheezing', note: 'Instant bronchodilator.' },
      { name: 'Budesonide Inhaler (Preventer/Maintenance)', dosage: '1-2 puffs', timing: 'Twice daily (Morning & Night)', note: 'Rinse mouth with water thoroughly after use to prevent oral thrush.' },
      { name: 'Montelukast', dosage: '10mg', timing: 'Once daily in the evening', note: 'Leukotriene receptor antagonist.' }
    ],
    diet: {
      eat: ['Antioxidant-rich berries & Apples', 'Magnesium-rich spinach, seeds & nuts', 'Warm ginger-tulsi tea', 'Omega-3 rich flaxseeds'],
      avoid: ['Sulfite-containing foods (Dried fruits, Wine, Pickles)', 'Cold refrigerated drinks & Ice creams', 'Artificial food preservatives & coloring agents']
    },
    exercisesAndMeditation: {
      exercises: ['Indoor walking in temperature-controlled room', 'Breathing exercises (Buteyko technique)'],
      meditation: ['Pranayama (Anulom Vilom & Nadi Shodhana) 20 mins daily']
    },
    dayRoutine: [
      '07:00 AM: Preventer Inhaler dose + Mouth rinse',
      '07:30 AM: Warm water & light nutritious breakfast',
      '12:30 PM: Indoor gentle walk & lung expansion exercises',
      '05:00 PM: Herbal warm tea & peak flow meter reading check',
      '08:00 PM: Early light dinner'
    ],
    nightRoutine: [
      '09:30 PM: Montelukast + Preventer Inhaler dose + Mouth rinse',
      '10:00 PM: Dust-mite free allergen-proof bed cover for sound sleep'
    ],
    recoveryTimeline: 'Long-term management condition. Proper inhaler compliance maintains 100% normal active lifestyle.',
    whenToSeeDoctor: [
      'Peak Expiratory Flow (PEF) drops below 60% of personal best',
      'Reliever inhaler required more than every 3-4 hours without relief',
      'Difficulty speaking full sentences, blue lips or fingernails (Cyanosis)'
    ],
    precautions: [
      'Always carry rescue inhaler (Salbutamol) wherever you go',
      'Use HEPA air purifiers in bedroom to eliminate dust mites and pollen',
      'Get annual Influenza and Pneumococcal vaccination'
    ]
  },
  {
    id: 'insomnia',
    name: 'Insomnia & Sleep Disturbances',
    category: 'Neurological & Mental',
    severity: 'Moderate',
    icon: '🌙',
    overview: 'Difficulty falling asleep, staying asleep, or experiencing non-restorative sleep leading to daytime fatigue, brain fog, and irritability.',
    medicines: [
      { name: 'Melatonin (Sublingual)', dosage: '3mg - 5mg', timing: '30-60 minutes before desired sleep time', note: 'Natural sleep-wake cycle regulator.' },
      { name: 'Ashwagandha Extract', dosage: '500mg', timing: 'After dinner', note: 'Lowers serum cortisol and promotes nervous system relaxation.' },
      { name: 'Magnesium L-Threonate / Glycinate', dosage: '300mg', timing: '45 mins before bedtime', note: 'Calms GABA brain receptors.' }
    ],
    diet: {
      eat: ['Warm Chamomile tea or Golden Turmeric milk', 'Bananas, Walnuts & Pumpkin seeds', 'Kiwi fruit (2 hours before sleep)', 'Oatmeal with warm milk'],
      avoid: ['Caffeine (Coffee, Tea, Energy drinks) after 2:00 PM', 'Heavy, spicy late-night dinners', 'Alcohol before bedtime', 'High-sugar evening treats']
    },
    exercisesAndMeditation: {
      exercises: ['Morning sunlight exposure 20 mins (resets circadian rhythm)', 'Afternoon brisk walk or swimming'],
      meditation: ['Yoga Nidra (Guided sleep relaxation) 20 mins in bed', 'Box Breathing (4s in, 4s hold, 4s out, 4s hold)']
    },
    dayRoutine: [
      '06:30 AM: Wake up at exact same time daily + 20-min direct morning sunlight exposure',
      '08:00 AM: Protein breakfast',
      '01:00 PM: Balanced lunch',
      '02:00 PM: Strict caffeine cutoff time',
      '06:00 PM: Light exercise session'
    ],
    nightRoutine: [
      '08:00 PM: Light dinner',
      '09:00 PM: Turn off all smartphones, tablets, TVs & laptops (Blue-light cutoff)',
      '09:30 PM: Warm shower + Chamomile tea + Melatonin tablet',
      '10:15 PM: Cool, pitch-black bedroom (65-68°F / 18-20°C)'
    ],
    recoveryTimeline: 'Circadian rhythm reset achievable within 10-14 days of strict sleep hygiene practice.',
    whenToSeeDoctor: [
      'Insomnia persisting > 1 month despite strict sleep hygiene',
      'Loud chronic snoring, gasping for air, or suspected Sleep Apnea',
      'Severe daytime drowsiness causing risk while driving or working'
    ],
    precautions: [
      'Use bed ONLY for sleep (do not work, watch TV, or eat in bed)',
      'If unable to sleep after 20 mins, get out of bed and read a physical book under dim light until sleepy',
      'Avoid sleeping pill dependency without strict medical supervision'
    ]
  },
  {
    id: 'anxiety-stress',
    name: 'Anxiety, Panic & Chronic Stress',
    category: 'Neurological & Mental',
    severity: 'Moderate',
    icon: '🧘',
    overview: 'State of excessive apprehension, autonomic arousal, racing thoughts, muscle tension, palpitation, and emotional overwhelm.',
    medicines: [
      { name: 'Ashwagandha KSM-66', dosage: '600mg', timing: 'Twice daily with meals', note: 'Clinically proven cortisol reducer.' },
      { name: 'L-Theanine Supplement', dosage: '200mg', timing: 'Morning or during acute stress', note: 'Promotes alpha brain wave relaxation without sedation.' },
      { name: 'Probiotic Psychobiotic Strain', dosage: '1 Capsule', timing: 'Before breakfast', note: 'Gut-brain axis mood balance.' }
    ],
    diet: {
      eat: ['Complex carbohydrates (Quinoa, Brown Rice)', 'Fermented foods (Yogurt, Kimchi, Kefir)', 'Dark chocolate (85%+ cacao in moderation)', 'Matcha green tea'],
      avoid: ['Excessive caffeine & Energy drinks', 'Refined sugar & Artificial food additives', 'Alcohol & Nicotine', 'Skipping meals']
    },
    exercisesAndMeditation: {
      exercises: ['30 mins moderate cardiovascular exercise (Walking, Jogging, Swimming)', 'Yoga postures (Child Pose, Legs up the wall)'],
      meditation: ['5-4-3-2-1 Sensory Grounding technique', 'Physiological Sigh (2 quick inhales, 1 long slow exhale)']
    },
    dayRoutine: [
      '07:00 AM: 10 mins Morning sunshine + 10 mins Guided breathwork',
      '08:00 AM: Nutrient-dense breakfast',
      '11:30 AM: 5-min stress reset break & hydration',
      '01:30 PM: Wholesome gut-friendly lunch',
      '05:30 PM: Outdoor walk in nature'
    ],
    nightRoutine: [
      '08:00 PM: Dinner without news/stressful media exposure',
      '09:00 PM: Gratitude journaling & warm Epsom salt bath',
      '10:00 PM: Sleep in calm environment'
    ],
    recoveryTimeline: 'Stress reduction notice within 1-2 weeks; profound emotional resilience in 4-6 weeks.',
    whenToSeeDoctor: [
      'Panic attacks featuring severe chest pain, hyperventilation, or fear of dying',
      'Anxiety interfering with daily job function or personal relationships',
      'Thoughts of self-harm or hopelessness'
    ],
    precautions: [
      'Practice daily screen detachment and limit doom-scrolling news feeds',
      'Engage in Cognitive Behavioral Therapy (CBT) techniques',
      'Maintain strong social connections and supportive conversations'
    ]
  },
  {
    id: 'back-pain',
    name: 'Lower Back Pain & Lumbar Strain',
    category: 'Musculoskeletal',
    severity: 'Moderate',
    icon: '🦴',
    overview: 'Muscular strain, ligamentous sprain, or disc dysfunction in the lumbar spine region causing stiffness, localized ache, or radiation.',
    medicines: [
      { name: 'Paracetamol / Ibuprofen', dosage: '400mg - 500mg', timing: 'After meals as needed for 3-5 days', note: 'Reduces acute inflammation. Take with food.' },
      { name: 'Thiocolchicoside (Muscle Relaxant, if prescribed)', dosage: '4mg', timing: 'Twice daily after meals', note: 'Relieves back muscle spasm.' },
      { name: 'Topical Capsaicin / Diclofenac Gel', dosage: 'Apply thin layer', timing: '3 times daily', note: 'Gently massage onto lumbar region.' }
    ],
    diet: {
      eat: ['Anti-inflammatory turmeric & ginger drinks', 'Calcium & Vitamin D rich dairy/fortified foods', 'Omega-3 rich seeds & Fatty fish', 'Walnuts & Chia seeds'],
      avoid: ['Refined sugars & Trans fats', 'Processed fast foods', 'Alcohol']
    },
    exercisesAndMeditation: {
      exercises: ['Cat-Cow posture stretch', 'McKenzie Extension (Prone press-up)', 'Glute bridges & Bird-Dog core stability exercises'],
      meditation: ['Mindfulness pain-reframing meditation 15 mins']
    },
    dayRoutine: [
      '07:15 AM: Warm hot-water bag application to back for 15 mins + gentle Cat-Cow stretch',
      '08:30 AM: Breakfast + anti-inflammatory turmeric milk',
      '11:00 AM: Stand up & walk 2 mins every 45 mins during desk work',
      '01:30 PM: Ergonomic lunch break with lumbar support chair',
      '06:00 PM: Core strengthening exercises'
    ],
    nightRoutine: [
      '08:30 PM: Light warm bath',
      '10:00 PM: Sleep on side with a pillow between knees (or on back with pillow under knees) to keep spine neutral'
    ],
    recoveryTimeline: 'Acute muscular strain resolves in 1-3 weeks. Chronic postural back pain improves in 4-6 weeks with core exercise.',
    whenToSeeDoctor: [
      'Loss of bowel or bladder control (Cauda Equina Emergency)',
      'Numbness/tingling radiating down both legs with foot drop',
      'Pain accompanied by unexplained fever or history of cancer'
    ],
    precautions: [
      'Never bend forward from waist to lift heavy objects; bend knees and use legs',
      'Maintain proper lumbar support while sitting on office chair',
      'Avoid long continuous sitting exceeding 60 minutes'
    ]
  },
  {
    id: 'anemia',
    name: 'Iron Deficiency Anemia',
    category: 'Metabolic & Endocrine',
    severity: 'Moderate',
    icon: '🩸',
    overview: 'Reduced hemoglobin concentration due to inadequate iron stores, leading to fatigue, paleness, shortness of breath, and cold extremities.',
    medicines: [
      { name: 'Ferrous Ascorbate / Iron Supplement', dosage: '100mg elemental iron', timing: 'Once daily on empty stomach or with Vitamin C juice', note: 'Do not take with milk, tea, or coffee.' },
      { name: 'Folic Acid Supplement', dosage: '5mg', timing: 'Once daily after meal', note: 'Supports red blood cell maturation.' },
      { name: 'Vitamin C (Ascorbic Acid)', dosage: '500mg', timing: 'Taken together with Iron tablet', note: 'Increases intestinal iron absorption by 300%.' }
    ],
    diet: {
      eat: ['Dark leafy greens (Spinach, Amaranth, Methi)', 'Beetroot, Pomegranate, Dates & Raisins', 'Jaggery (Gud) & Sesame seeds', 'Organ meats/Red meat/Eggs (for non-veg)'],
      avoid: ['Tea, Coffee & Green tea within 2 hours of meals or iron intake (tannins block iron absorption)', 'Calcium supplements at same time as iron', 'High-phytate unfermented bran']
    },
    exercisesAndMeditation: {
      exercises: ['Light walking 20-30 mins (avoid exhausting intense workouts until Hb stabilizes)'],
      meditation: ['Deep diaphragmatic breathing to increase cellular oxygenation']
    },
    dayRoutine: [
      '07:00 AM: Iron tablet + 1 glass fresh Orange juice (on empty stomach)',
      '08:30 AM: Nutrient-dense breakfast (Beetroot-pomegranate smoothie + oats)',
      '01:30 PM: Iron-rich lunch with spinach/lentils + lemon squeeze',
      '05:00 PM: Handful of soaked raisins & dates snack'
    ],
    nightRoutine: [
      '08:00 PM: Light early dinner',
      '10:00 PM: Restful 8 hours sleep to support bone marrow erythropoiesis'
    ],
    recoveryTimeline: 'Symptom fatigue improves in 2-3 weeks. Hemoglobin normalizes in 2-3 months; stores replenish in 6 months.',
    whenToSeeDoctor: [
      'Severe shortness of breath, chest pain, or rapid irregular heartbeat',
      'Dizziness, fainting spells (Syncope), or extreme pallor',
      'Heavy menstrual bleeding or dark blood in stool'
    ],
    precautions: [
      'Iron supplements can cause dark black-colored stools (normal harmless effect)',
      'If iron causes nausea or stomach upset, take it with a light non-dairy meal',
      'Recheck Complete Blood Count (CBC) & Ferritin levels after 60 days'
    ]
  },
  {
    id: 'hypothyroidism',
    name: 'Hypothyroidism (Underactive Thyroid)',
    category: 'Metabolic & Endocrine',
    severity: 'Chronic Management',
    icon: '🦋',
    overview: 'Inadequate thyroid hormone production causing slowed metabolism, weight gain, fatigue, dry skin, constipation, and cold intolerance.',
    medicines: [
      { name: 'Levothyroxine Sodium (T4)', dosage: '25mcg - 100mcg (as prescribed)', timing: 'First thing in morning with plain water 45-60 mins BEFORE breakfast', note: 'CRITICAL: Must be taken on empty stomach.' },
      { name: 'Selenium & Zinc Supplement', dosage: '200mcg Selenium', timing: 'With lunch', note: 'Aids conversion of T4 to active T3 hormone.' },
      { name: 'Vitamin D3 Drops/Tablet', dosage: '60,000 IU', timing: 'Once weekly after heavy meal', note: 'Corrects common concomitant deficiency.' }
    ],
    diet: {
      eat: ['Selenium-rich Brazil nuts (2 per day)', 'Iodized salt & Seafood', 'Fiber-rich vegetables & Whole grains', 'Eggs & Lean proteins'],
      avoid: ['RAW Goitrogenic foods (Cabbage, Broccoli, Cauliflower) in excessive quantities (cooking neutralizes goitrogens)', 'Soy products within 4 hours of medication', 'Gluten (if sensitive)']
    },
    exercisesAndMeditation: {
      exercises: ['30 mins brisk walking or metabolic resistance training 4 days/week to boost basal metabolic rate (BMR)'],
      meditation: ['Sarvangasana (Shoulder stand) & Ujjayi Breathing (throat-focused breath) for 15 mins']
    },
    dayRoutine: [
      '06:30 AM: Take Levothyroxine with 1 full glass of plain water',
      '07:30 AM: Healthy breakfast',
      '12:30 PM: Metabolic exercise routine',
      '01:30 PM: Balanced fiber & protein lunch',
      '05:00 PM: Green tea & 2 Brazil nuts'
    ],
    nightRoutine: [
      '08:00 PM: Light dinner',
      '10:00 PM: Ensure consistent 8 hours night sleep'
    ],
    recoveryTimeline: 'Long-term management condition. TSH normalization occurs within 4-8 weeks of establishing correct dose.',
    whenToSeeDoctor: [
      'TSH > 10 mIU/L or TSH < 0.1 mIU/L (Overdose/Underdose signs)',
      'Unexplained rapid heart rate, palpitations, extreme anxiety (signs of hyperthyroidism transition)',
      'Severe swelling in neck/throat area (Goiter expansion)'
    ],
    precautions: [
      'Do NOT consume calcium, iron supplements, or antacids within 4 hours of taking Levothyroxine',
      'Check TSH, Free T3, and Free T4 levels every 3 to 6 months',
      'Do not switch brand of Levothyroxine without doctor consultation due to bioavailability variances'
    ]
  },
  {
    id: 'high-cholesterol',
    name: 'High Cholesterol & Hyperlipidemia',
    category: 'Cardiovascular',
    severity: 'Chronic Management',
    icon: '🫀',
    overview: 'Elevated total cholesterol, LDL (bad cholesterol), and triglycerides with low HDL, predisposing to arterial plaque buildup and CAD.',
    medicines: [
      { name: 'Atorvastatin / Rosuvastatin', dosage: '10mg - 20mg (as prescribed)', timing: 'Once daily at bedtime', note: 'HMG-CoA reductase inhibitor. Night dosing optimizes liver enzyme inhibition.' },
      { name: 'Omega-3 Fish Oil / Algal Oil', dosage: '1000mg - 2000mg', timing: 'Twice daily after meals', note: 'Lowers high serum triglycerides.' },
      { name: 'Plant Sterols / Psyllium Husk', dosage: '5g', timing: 'Before dinner with warm water', note: 'Binds intestinal cholesterol.' }
    ],
    diet: {
      eat: ['Soluble fiber foods (Oats, Barley, Legumes, Beans)', 'Omega-3 foods (Walnuts, Flaxseeds, Chia seeds)', 'Extra virgin olive oil & Avocados', 'Garlic & Green tea'],
      avoid: ['Trans fats & Hydrogenated oils (Vanaspati, Deep-fried foods)', 'Fatty red meats & Full-fat dairy butter/cream', 'Processed bakery foods (Cakes, Biscuits, Pastries)', 'Excess refined sugars']
    },
    exercisesAndMeditation: {
      exercises: ['45 mins aerobic cardio 5 days/week (Brisk walking, Running, Swimming, Cycling) to raise HDL cholesterol'],
      meditation: ['15 mins Mindfulness to reduce stress-induced lipid oxidation']
    },
    dayRoutine: [
      '06:30 AM: Warm lemon water + 1 tsp soaked chia seeds',
      '07:00 AM: 45-min cardio session',
      '08:30 AM: Oatmeal topped with walnuts & berries breakfast',
      '01:30 PM: Fiber-heavy salad + brown rice/roti lunch',
      '05:30 PM: Green tea + roasted makhana'
    ],
    nightRoutine: [
      '08:00 PM: Light dinner',
      '09:30 PM: Psyllium husk with warm water + Atorvastatin tablet',
      '10:30 PM: 7-8 hours sleep'
    ],
    recoveryTimeline: 'Lipid profile improvement visible within 6-8 weeks of dietary modification and statin therapy.',
    whenToSeeDoctor: [
      'Crushing central chest pain or pressure radiating to left arm/jaw',
      'Shortness of breath on mild exertion',
      'Unexplained severe muscle aches/cramps after starting statin therapy'
    ],
    precautions: [
      'Avoid consuming Grapefruit or Grapefruit juice while taking statins (interferes with breakdown)',
      'Regularly test Fasting Lipid Profile & Liver Function Test (LFT) every 6 months',
      'Maintain healthy Body Mass Index (BMI between 18.5 - 24.9)'
    ]
  },
  {
    id: 'fatty-liver',
    name: 'Non-Alcoholic Fatty Liver Disease (NAFLD)',
    category: 'Metabolic & Endocrine',
    severity: 'Moderate',
    icon: '🍏',
    overview: 'Excessive triglyceride accumulation in liver cells unrelated to alcohol intake, strongly linked to insulin resistance and central obesity.',
    medicines: [
      { name: 'Vitamin E (d-alpha tocopherol)', dosage: '400 IU - 800 IU', timing: 'Once daily after lunch', note: 'Potent antioxidant reducing hepatic inflammation.' },
      { name: 'Saroglitazar (if prescribed)', dosage: '4mg', timing: 'Once daily at bedtime', note: 'Dual PPAR alpha/gamma agonist for NASH/fatty liver.' },
      { name: 'Silymarin (Milk Thistle Extract)', dosage: '140mg', timing: 'Twice daily before meals', note: 'Hepato-protective herbal supplement.' }
    ],
    diet: {
      eat: ['Mediterranean Diet (Olive oil, Vegetables, Nuts, Fish)', 'Coffee (2 cups unsweetened daily - proven hepatoprotective)', 'Green leafy vegetables & Cruciferous veggies', 'Green tea'],
      avoid: ['High-Fructose Corn Syrup & Sugary sodas/juices', 'Alcohol in any amount', 'Saturated trans fats & Deep-fried foods', 'Refined white flour & Excessive fruit consumption']
    },
    exercisesAndMeditation: {
      exercises: ['Combination of 30 mins cardio + 20 mins resistance/weight training 5 days/week (Crucial: 7-10% weight loss reverses fatty liver)'],
      meditation: ['15 mins Daily stress-reduction meditation']
    },
    dayRoutine: [
      '06:30 AM: Black coffee or warm lemon water',
      '07:00 AM: 45 mins active exercise workout',
      '08:30 AM: High-protein, high-fiber breakfast',
      '01:30 PM: Olive-oil dressed salad + lean protein lunch',
      '05:00 PM: Green tea & almonds'
    ],
    nightRoutine: [
      '07:30 PM: Early light dinner',
      '08:30 PM: 20-min evening walk',
      '10:00 PM: Sleep on schedule'
    ],
    recoveryTimeline: 'Significant reduction in liver fat deposits seen in 3-6 months with 7-10% body weight loss.',
    whenToSeeDoctor: [
      'Yellowing of eyes or skin (Jaundice)',
      'Abdominal swelling/distension (Ascites) or right upper quadrant abdominal pain',
      'Unexplained persistent nausea, vomiting, or dark tea-colored urine'
    ],
    precautions: [
      'Avoid unprescribed OTC medications that undergo liver metabolism (e.g. high-dose paracetamol)',
      'Get ultrasound liver scan and FibroScan annually',
      'Target safe weight loss rate of 0.5 to 1 kg per week (avoid crash dieting)'
    ]
  },
  {
    id: 'kidney-stones',
    name: 'Kidney Stones (Nephrolithiasis)',
    category: 'Renal & Urology',
    severity: 'Moderate',
    icon: '🪨',
    overview: 'Mineral crystalline deposits (calcium oxalate, uric acid) forming in kidneys causing severe sharp flank pain, hematuria, and dysuria.',
    medicines: [
      { name: 'Potassium Citrate Syrup', dosage: '15ml in glass of water', timing: '3 times daily after meals', note: 'Alkalinizes urine to prevent crystal precipitation.' },
      { name: 'Tamsulosin (if prescribed)', dosage: '0.4mg', timing: 'Once daily after same meal', note: 'Alpha-blocker relaxing ureter to facilitate stone passage.' },
      { name: 'Ketorolac / Diclofenac (Pain relief)', dosage: '50mg', timing: 'SOS during intense acute flank pain', note: 'Take with food and plenty of water.' }
    ],
    diet: {
      eat: ['PLENTY of Water (3 to 3.5 Liters daily)', 'Lemonade & Citrate juices (inhibits stone formation)', 'Calcium-rich dairy WITH meals (binds oxalate in gut)', 'Barley water'],
      avoid: ['High-oxalate foods (Spinach, Beetroot, Nuts, Chocolate, Tea, Sweet potatoes)', 'Excessive dietary sodium/salt', 'High animal protein in excess', 'Carbonated cola drinks']
    },
    exercisesAndMeditation: {
      exercises: ['Light jumping jacks or staircase climbing (helps dislodge small ureteral stones < 5mm)', 'Regular walking'],
      meditation: ['Mindfulness pain tolerance breathing']
    },
    dayRoutine: [
      '06:00 AM: Drink 2 large glasses of water + Lemon juice',
      '08:00 AM: Breakfast + Potassium Citrate',
      '11:00 AM: Drink 1 Liter water / Barley water',
      '01:30 PM: Balanced low-salt lunch',
      '04:00 PM: Lemonade break + Hydration check (urine must be clear/pale yellow)',
      '08:00 PM: Dinner + Tamsulosin'
    ],
    nightRoutine: [
      '10:00 PM: Drink 1 glass of water right before bed',
      '03:00 AM: (If waking up to urinate) Drink another 1 glass of water to keep night urine diluted'
    ],
    recoveryTimeline: 'Stones < 5mm pass naturally within 1-3 weeks with hyper-hydration. Larger stones may require Lithotripsy (ESWL).',
    whenToSeeDoctor: [
      'Unbearable severe flank/back pain accompanied by fever and chills (Urinary Sepsis danger)',
      'Complete inability to pass urine (Anuria)',
      'Persistent vomiting preventing oral fluid intake'
    ],
    precautions: [
      'Maintain minimum daily urine output of 2.5 Liters',
      'Strain urine through gauze to catch passed stone for lab composition analysis',
      'Do not restrict dietary calcium completely as it increases oxalate absorption'
    ]
  },
  {
    id: 'osteoarthritis-knee',
    name: 'Knee Osteoarthritis',
    category: 'Musculoskeletal',
    severity: 'Chronic Management',
    icon: '🦵',
    overview: 'Degenerative joint disease marked by articular cartilage breakdown, joint space narrowing, subchondral sclerosis, stiffness, and crepitus.',
    medicines: [
      { name: 'Glucosamine Sulfate + Chondroitin', dosage: '1500mg Glucosamine / 1200mg Chondroitin', timing: 'Daily with meals', note: 'Supports joint cartilage integrity.' },
      { name: 'Curcumin (Turmeric Extract) + Piperine', dosage: '500mg', timing: 'Twice daily after meals', note: 'Natural joint anti-inflammatory.' },
      { name: 'Topical Topical NSAID Gel', dosage: 'Apply to knee', timing: '3 times daily', note: 'Local joint pain relief.' }
    ],
    diet: {
      eat: ['Omega-3 rich seeds & Wild-caught fish', 'Bone broth & Collagen-supportive foods', 'Citrus fruits & Bell peppers (Vitamin C for collagen synthesis)', 'Ginger & Garlic'],
      avoid: ['Fried foods & Refined sugars', 'Excessive nightshade veggies (if sensitivity noticed)', 'Processed meats & Trans fats']
    },
    exercisesAndMeditation: {
      exercises: ['Quadriceps strengthening (Straight leg raises, Isometric quads)', 'Low-impact swimming or stationary cycling', 'Hamstring and calf stretches'],
      meditation: ['Mindful body awareness relaxation']
    },
    dayRoutine: [
      '07:30 AM: Warm compress or hot shower on knee + Isometric Quad exercises 15 mins',
      '08:30 AM: Nutritious breakfast',
      '01:00 PM: Lunch + Curcumin capsule',
      '05:00 PM: 20-min stationary cycling (low resistance)',
      '08:00 PM: Dinner'
    ],
    nightRoutine: [
      '09:30 PM: Gentle knee gel application',
      '10:00 PM: Pillow under knees while sleeping for comfort'
    ],
    recoveryTimeline: 'Chronic condition. Quadriceps strengthening reduces knee pain by 40-50% within 6-8 weeks.',
    whenToSeeDoctor: [
      'Knee joint suddenly locks completely or gives way (instability)',
      'Sudden hot, red, swollen knee joint (suspected septic arthritis or acute gout)',
      'Inability to bear any weight on the affected leg'
    ],
    precautions: [
      'Avoid deep squatting, sitting cross-legged on floor, or using Indian-style toilets',
      'Use knee support cap/brace during long walks',
      'Maintain optimal weight to reduce load (1 kg weight loss reduces knee load by 4 kg)'
    ]
  },
  {
    id: 'uti',
    name: 'Urinary Tract Infection (UTI)',
    category: 'Renal & Urology',
    severity: 'Mild',
    icon: '🚽',
    overview: 'Bacterial infection of urinary tract (commonly E. coli) causing burning micturition (dysuria), urinary frequency, urgency, and pelvic discomfort.',
    medicines: [
      { name: 'Nitrofurantoin / Ciprofloxacin (as prescribed)', dosage: '100mg / 500mg', timing: 'Twice daily for 5-7 days', note: 'CRITICAL: Complete full course of prescribed antibiotic.' },
      { name: 'Cranberry Extract + D-Mannose', dosage: '500mg', timing: 'Twice daily with water', note: 'Prevents E. coli adhesion to bladder wall.' },
      { name: 'Disodium Hydrogen Citrate Syrup', dosage: '2 tsp in glass of water', timing: '3 times daily', note: 'Alkalinizes urine to stop burning sensation.' }
    ],
    diet: {
      eat: ['Copious amounts of Water (3+ Liters)', 'Unsweetened Cranberry juice', 'Probiotic Yogurt / Curd', 'Coconut water & Cucumber'],
      avoid: ['Coffee, Tea, Alcohol & Carbonated drinks', 'Spicy foods & Artificial sweeteners', 'Citrus fruits during acute burning phase']
    },
    exercisesAndMeditation: {
      exercises: ['Rest during acute infection; light pelvic floor relaxation'],
      meditation: ['Relaxation breathing']
    },
    dayRoutine: [
      '07:00 AM: Drink 2 glasses of water + Disodium Citrate syrup',
      '08:00 AM: Breakfast + Antibiotic dose',
      '10:30 AM: Drink 500ml water / Cranberry juice',
      '01:30 PM: Probiotic curd lunch',
      '05:00 PM: Hydration check',
      '08:00 PM: Dinner + Antibiotic dose'
    ],
    nightRoutine: [
      '09:30 PM: Urinate completely before sleeping',
      '10:00 PM: 8 hours rest'
    ],
    recoveryTimeline: 'Dysuria relief in 24-48 hours with antibiotics; total infection clearance in 5-7 days.',
    whenToSeeDoctor: [
      'Fever with chills and flank/upper back pain (Pyelonephritis / Kidney infection)',
      'Visible blood in urine (Hematuria)',
      'Symptoms fail to improve after 48 hours of antibiotic therapy'
    ],
    precautions: [
      'Wipe from front to back after using toilet to prevent bacterial transfer',
      'Urinate immediately after sexual intercourse',
      'Do not hold urine; empty bladder whenever urge arises'
    ]
  },
  {
    id: 'ibs',
    name: 'Irritable Bowel Syndrome (IBS)',
    category: 'Digestive & Gastric',
    severity: 'Chronic Management',
    icon: '🌾',
    overview: 'Functional gastrointestinal disorder characterized by abdominal cramping, bloating, gas, and altered bowel habits (IBS-D diarrhea, IBS-C constipation, or mixed).',
    medicines: [
      { name: 'Mebeverine / Dicyclomine', dosage: '135mg', timing: '20 mins before main meals', note: 'Antispasmodic to relieve gut muscle cramping.' },
      { name: 'Probiotic Multi-strain (VSL#3 / Bifidobacterium)', dosage: '1 Capsule', timing: 'Daily with breakfast', note: 'Restores gut microbiome balance.' },
      { name: 'Psyllium Husk (Ispaghol)', dosage: '1 tbsp in warm water', timing: 'At bedtime', note: 'Soluble fiber regulating stool consistency.' }
    ],
    diet: {
      eat: ['Low-FODMAP Diet foods (Rice, Oats, Carrots, Cucumbers, Bananas)', 'Lactose-free milk / Almond milk', 'Cooked vegetables', 'Peppermint tea'],
      avoid: ['High-FODMAP foods (Onions, Garlic, Apples, Wheat, Beans, Cauliflower)', 'Artificial sweeteners (Sorbitol, Xylitol)', 'Carbonated drinks & Alcohol', 'Fried greasy foods']
    },
    exercisesAndMeditation: {
      exercises: ['30 mins gentle yoga & walking daily', 'Abdominal massages'],
      meditation: ['Gut-Directed Hypnotherapy / Mindfulness Meditation 20 mins daily (modulates gut-brain signaling)']
    },
    dayRoutine: [
      '07:00 AM: Warm water + Probiotic capsule',
      '07:30 AM: Low-FODMAP breakfast (Oats with almond milk)',
      '12:30 PM: Antispasmodic + Light lunch',
      '04:30 PM: Peppermint tea break',
      '07:30 PM: Early quiet dinner'
    ],
    nightRoutine: [
      '09:30 PM: Psyllium husk with warm water',
      '10:00 PM: 8 hours relaxing sleep'
    ],
    recoveryTimeline: 'Symptom reduction of 60-80% achieved within 3-4 weeks of Low-FODMAP diet and stress reduction.',
    whenToSeeDoctor: [
      'Unexplained weight loss or nocturnal diarrhea (waking up from sleep to defecate)',
      'Rectal bleeding or iron-deficiency anemia',
      'Onset of symptoms after age 50'
    ],
    precautions: [
      'Eat small, frequent, unhurried meals rather than large heavy feasts',
      'Keep a detailed food & symptom log to identify individual trigger foods',
      'Manage daily stress levels as gut motility is highly sensitive to anxiety'
    ]
  },
  {
    id: 'sinusitis',
    name: 'Sinusitis & Nasal Polyps',
    category: 'Respiratory',
    severity: 'Moderate',
    icon: '👃',
    overview: 'Inflammation of paranasal sinus mucous membranes causing facial pain, pressure, nasal blockage, thick post-nasal drip, and anosmia.',
    medicines: [
      { name: 'Fluticasone / Mometasone Nasal Spray', dosage: '2 sprays per nostril', timing: 'Once daily in the morning', note: 'Topical corticosteroid reducing sinus mucosal swelling.' },
      { name: 'Saline Nasal Irrigation (Neti Pot)', dosage: '200ml isotonic saline', timing: 'Twice daily', note: 'Flushes out entrapped mucus and allergens.' },
      { name: 'Montelukast + Levocetirizine', dosage: '10mg / 5mg', timing: 'Once daily at bedtime', note: 'Dual anti-allergic controller.' }
    ],
    diet: {
      eat: ['Warm soups & Steaming broths', 'Spicy horseradish, Mustard & Ginger (natural decongestants)', 'Pineapple (contains Bromelain which reduces sinus inflammation)', 'Warm water'],
      avoid: ['Chilled milk, Ice cream & Cold drinks', 'Excessive refined sugar', 'Alcohol (causes sinus mucosal engorgement)']
    },
    exercisesAndMeditation: {
      exercises: ['Light indoor walking', 'Acupressure sinus massage around cheekbones and bridge of nose'],
      meditation: ['Bhramari Pranayama (Humming bee breath) 10 mins (increases nasal Nitric Oxide levels 15-fold)']
    },
    dayRoutine: [
      '07:00 AM: Jal Neti / Saline sinus rinse + Fluticasone nasal spray',
      '08:00 AM: Warm breakfast + warm ginger tea',
      '01:00 PM: Steam inhalation with eucalyptus oil',
      '06:00 PM: Bhramari Pranayama session',
      '08:00 PM: Dinner'
    ],
    nightRoutine: [
      '09:30 PM: Steam inhalation + Montelukast tablet',
      '10:00 PM: Sleep with head elevated 45 degrees to facilitate sinus drainage'
    ],
    recoveryTimeline: 'Acute sinusitis resolves in 7-14 days. Chronic sinusitis improves significantly in 3-4 weeks with nasal steroids.',
    whenToSeeDoctor: [
      'Periorbital swelling, redness, or double vision (orbital cellulitis warning)',
      'Severe unremitting forehead headache with high fever and neck stiffness',
      'Symptoms lasting > 12 weeks despite treatment (Chronic Sinusitis)'
    ],
    precautions: [
      'Always use distilled, sterile, or previously boiled water for Neti Pot nasal rinses (never tap water)',
      'Do not overuse OTC decongestant sprays (Xylometazoline) for more than 5 consecutive days to avoid rebound congestion (Rhinitis Medicamentosa)',
      'Use room humidifiers during dry cold weather'
    ]
  }
];

export const ALL_50_CONDITIONS_LIST: HealthCondition[] = [
  ...HEALTH_CONDITIONS_DATA,
  {
    id: 'cervical-spondylosis',
    name: 'Cervical Spondylosis (Neck Pain)',
    category: 'Musculoskeletal',
    severity: 'Moderate',
    icon: '🦴',
    overview: 'Age-related or posture-induced wear and tear of cervical spine discs causing neck pain, muscle stiffness, and nerve compression.',
    medicines: [
      { name: 'Pregabalin / Methylcobalamin', dosage: '75mg / 1500mcg', timing: 'At bedtime', note: 'Relieves cervical nerve pain and numbness.' },
      { name: 'Diclofenac Gel', dosage: 'Apply to neck', timing: '3 times daily', note: 'Local anti-inflammatory.' }
    ],
    diet: {
      eat: ['Calcium & Vitamin D rich foods', 'Turmeric milk', 'Nuts & Seeds'],
      avoid: ['Processed junk foods', 'Excessive alcohol']
    },
    exercisesAndMeditation: {
      exercises: ['Cervical isometric neck exercises', 'Chin tucks & Shoulder blade squeezes'],
      meditation: ['Mindfulness relaxation']
    },
    dayRoutine: ['07:30 AM: Warm neck compress & Isometric neck stretch', '11:00 AM: Maintain computer monitor at eye level', '08:00 PM: Light dinner'],
    nightRoutine: ['09:30 PM: Cervical contour pillow for sleep', '10:00 PM: 8 hours rest'],
    recoveryTimeline: 'Relief within 2-4 weeks of consistent physiotherapy and ergonomic adjustments.',
    whenToSeeDoctor: ['Sudden loss of hand grip strength or dropping objects', 'Severe numbness radiating to fingers'],
    precautions: ['Avoid looking down at smartphones for long hours (Text Neck Syndrome)', 'Use ergonomic cervical pillow']
  },
  {
    id: 'vitamin-d-deficiency',
    name: 'Vitamin D & Calcium Deficiency',
    category: 'Metabolic & Endocrine',
    severity: 'Mild',
    icon: '☀️',
    overview: 'Low serum 25-hydroxyvitamin D levels leading to bone pain, muscle weakness, fatigue, and osteopenia.',
    medicines: [
      { name: 'Cholecalciferol (Vitamin D3)', dosage: '60,000 IU', timing: 'Once weekly for 8 weeks with milk', note: 'High-dose loading therapy.' },
      { name: 'Calcium Carbonate + D3', dosage: '500mg', timing: 'Twice daily after meals', note: 'Bone mineralization support.' }
    ],
    diet: {
      eat: ['Fortified milk & Orange juice', 'Eggs & Mushrooms', 'Fatty fish (Salmon, Mackerel)'],
      avoid: ['Excessive soft drinks containing phosphoric acid', 'High caffeine intake']
    },
    exercisesAndMeditation: {
      exercises: ['Morning outdoor walking in direct sunlight 20-30 mins', 'Weight-bearing exercises'],
      meditation: ['Sun salutations (Surya Namaskar)']
    },
    dayRoutine: ['07:30 AM: 25 mins direct sunlight exposure (arms & legs exposed)', '08:30 AM: Fortified breakfast', '08:00 PM: Dinner'],
    nightRoutine: ['10:00 PM: Sound sleep'],
    recoveryTimeline: 'Normal Vitamin D levels restored in 8-12 weeks of supplementation.',
    whenToSeeDoctor: ['Bone fractures from low-impact falls', 'Severe muscle spasms or tetany'],
    precautions: ['Sunlight exposure without sunscreen for 20 mins between 10am-2pm is ideal', 'Recheck serum Vitamin D after 3 months']
  },
  {
    id: 'pcos',
    name: 'Polycystic Ovary Syndrome (PCOS)',
    category: 'Metabolic & Endocrine',
    severity: 'Chronic Management',
    icon: '🌸',
    overview: 'Hormonal disorder featuring hyperandrogenism, ovulatory dysfunction, polycystic ovarian morphology, and insulin resistance.',
    medicines: [
      { name: 'Myo-Inositol + D-Chiro Inositol (40:1)', dosage: '2000mg', timing: 'Twice daily before meals', note: 'Restores ovulatory function and insulin sensitivity.' },
      { name: 'Metformin (if prescribed)', dosage: '500mg', timing: 'Twice daily with meals', note: 'Manages hyperinsulinemia.' }
    ],
    diet: {
      eat: ['Low-GI whole foods', 'Spearmint tea (2 cups daily - lowers free testosterone)', 'High-fiber veggies & Berries'],
      avoid: ['Refined sugar & Sugary drinks', 'Dairy (if acne/bloating occurs)', 'Processed carbs & Trans fats']
    },
    exercisesAndMeditation: {
      exercises: ['Strength training 3 times/week + Moderate cardio', 'Yoga (Bhadrasana, Supta Baddha Konasana)'],
      meditation: ['15 mins Stress relief meditation (stress worsens cortisol/androgens)']
    },
    dayRoutine: ['07:00 AM: Spearmint tea + 30 mins Strength workout', '08:30 AM: High-protein breakfast', '08:00 PM: Balanced dinner'],
    nightRoutine: ['09:30 PM: Spearmint tea', '10:30 PM: 8 hours sleep'],
    recoveryTimeline: 'Menstrual cycle regularity and symptom improvement seen in 3-6 months.',
    whenToSeeDoctor: ['Menstrual period delayed > 90 days', 'Sudden severe pelvic pain'],
    precautions: ['Focus on sustainable weight management', 'Track menstrual cycles with an app']
  },
  {
    id: 'constipation',
    name: 'Constipation & Sluggish Digestion',
    category: 'Digestive & Gastric',
    severity: 'Mild',
    icon: '🚽',
    overview: 'Infrequent bowel movements (< 3 times/week), hard dry stools, excessive straining, and sense of incomplete evacuation.',
    medicines: [
      { name: 'Psyllium Husk (Ispaghol) / Lactulose', dosage: '1-2 tbsp', timing: 'At bedtime with 2 glasses of warm water', note: 'Bulk-forming osmotic laxative.' },
      { name: 'Triphala Churna / Extract', dosage: '500mg', timing: 'At bedtime with warm water', note: 'Traditional digestive stimulant.' }
    ],
    diet: {
      eat: ['Prunes, Figs & Papaya', 'Oats, Flaxseeds & Chia seeds', 'High-fiber vegetables & Lentils', 'Warm water'],
      avoid: ['Processed white bread & Maida', 'Excessive cheese & Unripe bananas', 'Fast food & Fried snacks']
    },
    exercisesAndMeditation: {
      exercises: ['30 mins brisk morning walk', 'Pawanmuktasana & Malasana (Squat posture)'],
      meditation: ['Abdominal breathing']
    },
    dayRoutine: ['06:30 AM: 2 glasses warm water on empty stomach + 20-min brisk walk', '08:00 AM: High-fiber papaya & oats breakfast', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Psyllium husk in warm water', '10:00 PM: Rest'],
    recoveryTimeline: 'Bowel movement relief within 12-24 hours; long-term regularity in 1-2 weeks.',
    whenToSeeDoctor: ['Severe abdominal pain with vomiting', 'Blood in stool or unexplained weight loss'],
    precautions: ['Drink at least 3 Liters of fluids daily when taking fiber supplements', 'Do not ignore natural urge to defecate']
  },
  {
    id: 'diarrhea-gastroenteritis',
    name: 'Acute Diarrhea & Gastroenteritis',
    category: 'Digestive & Gastric',
    severity: 'Mild',
    icon: '💧',
    overview: 'Frequent loose watery stools caused by viral/bacterial intestinal infection, food contamination, or toxin exposure.',
    medicines: [
      { name: 'Oral Rehydration Salts (ORS)', dosage: '1 sachet in 1L water', timing: 'Sip continuously throughout the day', note: 'CRITICAL: Prevents severe electrolyte depletion.' },
      { name: 'Zinc Supplementation', dosage: '20mg', timing: 'Once daily for 14 days', note: 'Reduces diarrhea duration and recurrence.' },
      { name: 'Racecadotril / Loperamide (if prescribed)', dosage: '100mg', timing: '3 times daily before meals', note: 'Antisecretory agent.' }
    ],
    diet: {
      eat: ['BRAT Diet (Bananas, Rice, Applesauce, Toast)', 'Electrolyte ORS, Coconut water & Rice kanji', 'Boiled potatoes & Yogurt'],
      avoid: ['Milk & Dairy products (temporary lactose intolerance)', 'Spicy, oily & fatty foods', 'Sugary juices & Caffeine']
    },
    exercisesAndMeditation: {
      exercises: ['Complete bed rest during active illness'],
      meditation: ['Gentle breathing']
    },
    dayRoutine: ['Continuous ORS hydration', '08:30 AM: Banana & dry toast', '01:30 PM: Plain boiled rice with curd', '08:00 PM: Light rice soup'],
    nightRoutine: ['ORS by bedside', '09:30 PM: Rest'],
    recoveryTimeline: 'Acute phase subsides in 24-48 hours; complete recovery in 3-5 days.',
    whenToSeeDoctor: ['High fever > 102°F or severe abdominal pain', 'Signs of severe dehydration (sunken eyes, no urine in 8h, confusion)', 'Blood or mucus in stools'],
    precautions: ['Wash hands thoroughly with soap before eating and after toilet use', 'Drink only safe purified/boiled water']
  },
  {
    id: 'dengue-recovery',
    name: 'Dengue Fever Recovery',
    category: 'Infectious & Immune',
    severity: 'Moderate',
    icon: '🦟',
    overview: 'Post-viral recovery phase following Dengue infection, characterized by low platelet count, severe weakness, and joint pain.',
    medicines: [
      { name: 'Carica Papaya Leaf Extract', dosage: '500mg', timing: '3 times daily', note: 'Supports rapid platelet recovery.' },
      { name: 'Paracetamol (ONLY)', dosage: '500mg', timing: 'SOS for fever/pain', note: 'AVOID Aspirin & Ibuprofen due to bleeding risk!' }
    ],
    diet: {
      eat: ['Papaya leaf juice & Pomegranate juice', 'Coconut water & ORS', 'Kiwi fruits & Goat milk', 'Light vegetable soups'],
      avoid: ['Dark colored/red foods (makes detecting internal GI bleeding difficult)', 'Spicy, oily, heavy foods', 'Alcohol']
    },
    exercisesAndMeditation: {
      exercises: ['Strict physical rest; avoid strenuous activities that risk trauma/bleeding'],
      meditation: ['Relaxation pranayama']
    },
    dayRoutine: ['Continuous fluid tracking (minimum 3L daily)', '08:30 AM: Papaya leaf extract + Coconut water', '01:30 PM: Soft khichdi lunch', '08:00 PM: Light soup'],
    nightRoutine: ['09:30 PM: Rest', '10:00 PM: 9 hours sleep'],
    recoveryTimeline: 'Platelets normalize in 5-7 days; complete strength recovery in 2-3 weeks.',
    whenToSeeDoctor: ['Platelet count drops below 50,000 / cu mm', 'Bleeding from gums/nose or red skin spots (Petechiae)', 'Severe persistent abdominal pain or black vomit'],
    precautions: ['Monitor Complete Blood Count (CBC) daily until platelets exceed 150,000', 'Use mosquito nets & repellent']
  },
  {
    id: 'typhoid-recovery',
    name: 'Typhoid Fever Recovery',
    category: 'Infectious & Immune',
    severity: 'Moderate',
    icon: '🌡️',
    overview: 'Convalescent phase of Salmonella typhi infection requiring intestinal rest, high-calorie soft diet, and antibiotic completion.',
    medicines: [
      { name: 'Cefixime / Azithromycin (as prescribed)', dosage: 'As per doctor', timing: 'Complete full 10-14 day course', note: 'Crucial to prevent typhoid relapse.' },
      { name: 'Multivitamin & B-Complex', dosage: '1 Tablet', timing: 'Daily after lunch', note: 'Restores metabolic energy.' }
    ],
    diet: {
      eat: ['High-calorie soft foods (Khichdi, Custard, Boiled eggs, Mashed potatoes)', 'Boiled purified water', 'Fruit juices without pulp'],
      avoid: ['High-fiber roughage (raw salads, seeds - risks intestinal perforation)', 'Spicy curries & Fried foods', 'Unpasteurized milk']
    },
    exercisesAndMeditation: {
      exercises: ['Bed rest during first week; light walking during second week'],
      meditation: ['Calm breathing']
    },
    dayRoutine: ['07:30 AM: Boiled water + soft breakfast', '01:30 PM: Soft well-cooked Khichdi with curd', '08:00 PM: Light soup & toast'],
    nightRoutine: ['09:30 PM: Antibiotic dose', '10:00 PM: 9 hours sleep'],
    recoveryTimeline: 'Full digestive and physical strength restored in 3-4 weeks.',
    whenToSeeDoctor: ['Sudden severe sharp abdominal pain (suspected intestinal perforation)', 'High fever recurrence', 'Severe blood in stool'],
    precautions: ['Consume ONLY thoroughly boiled water and freshly cooked warm food', 'Do not resume heavy physical labor too early']
  },
  {
    id: 'tonsillitis',
    name: 'Tonsillitis & Sore Throat',
    category: 'Respiratory',
    severity: 'Mild',
    icon: '🗣️',
    overview: 'Inflammation of palatine tonsils due to viral or streptococcal infection causing odynophagia (painful swallowing), throat exudates, and swollen lymph nodes.',
    medicines: [
      { name: 'Amoxicillin-Clavulanate (if bacterial)', dosage: '625mg', timing: 'Twice daily after meals for 5-7 days', note: 'Prescription antibiotic for Strep throat.' },
      { name: 'Benzydamine Throat Spray / Salt Water Gargle', dosage: 'Warm saline', timing: '4 times daily', note: 'Relieves localized throat pain.' }
    ],
    diet: {
      eat: ['Warm soups & Broths', 'Soft smooth foods (Yogurt, Smoothies, Mashed potatoes)', 'Warm Honey-lemon tea', 'Warm turmeric milk'],
      avoid: ['Crunchy, hard or rough foods (Chips, Nuts)', 'Citrus fruits & Vinegar', 'Very hot or iced cold items', 'Spicy foods']
    },
    exercisesAndMeditation: {
      exercises: ['Rest; avoid straining vocal cords'],
      meditation: ['Relaxing deep breaths']
    },
    dayRoutine: ['07:30 AM: Warm salt-water gargle + warm tea', '08:30 AM: Soft breakfast', '01:30 PM: Warm soup lunch', '08:00 PM: Warm gargle + dinner'],
    nightRoutine: ['09:30 PM: Warm turmeric milk + salt water gargle', '10:00 PM: Sleep'],
    recoveryTimeline: 'Viral tonsillitis subsides in 4-7 days; bacterial strep responds to antibiotics in 48 hours.',
    whenToSeeDoctor: ['Inability to swallow liquids or saliva (drooling)', 'Difficulty breathing or opening mouth wide (Trismus / Peritonsillar abscess)', 'High fever with white pus patches on tonsils'],
    precautions: ['Replace toothbrush after antibiotic therapy to prevent re-infection', 'Practice frequent hand hygiene']
  },
  {
    id: 'vertigo',
    name: 'Vertigo & Positional Dizziness (BPPV)',
    category: 'Neurological & Mental',
    severity: 'Moderate',
    icon: '🌀',
    overview: 'Sensation of spinning or room tilting caused by inner ear vestibular otolith displacement (BPPV) or vestibular neuritis.',
    medicines: [
      { name: 'Betahistine', dosage: '16mg', timing: '3 times daily after meals', note: 'Improves inner ear microcirculation.' },
      { name: 'Cinnarizine / Dimenhydrinate', dosage: '25mg', timing: 'SOS during acute vertigo/nausea', note: 'Vestibular sedative.' }
    ],
    diet: {
      eat: ['Hydrating fluids & Coconut water', 'Ginger tea (anti-nausea)', 'Magnesium & B6 rich foods'],
      avoid: ['High salt/sodium foods (worsens inner ear fluid pressure)', 'Caffeine & Alcohol', 'High sugar treats']
    },
    exercisesAndMeditation: {
      exercises: ['Epley Maneuver (performed by clinician/guided for BPPV)', 'Brandt-Daroff habituation exercises 3 times/day'],
      meditation: ['Calm grounding breathing']
    },
    dayRoutine: ['07:30 AM: Slow gradual sit up from bed (avoid sudden head movements)', '08:30 AM: Breakfast + Betahistine', '11:00 AM: Brandt-Daroff exercise', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Sleep elevated with 2 pillows', '10:00 PM: 8 hours sleep'],
    recoveryTimeline: 'BPPV resolves rapidly in 1-3 sessions of Epley maneuver; vestibular compensation takes 1-2 weeks.',
    whenToSeeDoctor: ['Vertigo accompanied by double vision, slurred speech, or facial numbness (Stroke warning)', 'Sudden hearing loss or ringing in ear (Tinnitus)', 'Inability to stand or walk without falling'],
    precautions: ['Avoid sudden rapid head turns or bending down completely', 'Install bathroom grab bars and avoid driving during active episodes']
  },
  {
    id: 'sciatica',
    name: 'Sciatica Nerve Pain',
    category: 'Musculoskeletal',
    severity: 'Moderate',
    icon: '⚡',
    overview: 'Irritation or compression of the sciatic nerve causing sharp shooting pain radiating from buttock down posterior thigh to leg/foot.',
    medicines: [
      { name: 'Pregabalin + Methylcobalamin', dosage: '75mg / 1500mcg', timing: 'Once daily at bedtime', note: 'Calms neuropathic sciatic nerve firing.' },
      { name: 'Naproxen / Aceclofenac', dosage: '100mg', timing: 'Twice daily after meals for 5 days', note: 'Reduces disc inflammation.' }
    ],
    diet: {
      eat: ['Anti-inflammatory turmeric & ginger foods', 'B-complex rich foods (Whole grains, Dairy, Eggs)', 'Magnesium foods'],
      avoid: ['Refined sugar & Trans fats', 'Processed fast foods']
    },
    exercisesAndMeditation: {
      exercises: ['Nerve flossing / Sciatic nerve glide exercise', 'Pigeon pose stretch & Hamstring stretch'],
      meditation: ['Mindful pain reframing']
    },
    dayRoutine: ['07:30 AM: Ice pack on lower back for 15 mins + gentle nerve glide stretch', '08:30 AM: Breakfast', '01:30 PM: Ergonomic seating break', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Pregabalin capsule', '10:00 PM: Sleep on side with pillow between knees'],
    recoveryTimeline: '75-90% of sciatica cases resolve with conservative treatment in 4-6 weeks.',
    whenToSeeDoctor: ['Progressive leg muscle weakness (foot drop)', 'Loss of bowel or bladder control (Emergency Cauda Equina)', 'Severe pain unremitting after 4 weeks'],
    precautions: ['Do not sit on hard surfaces or soft sinking couches for long periods', 'Avoid forward bending with straight legs']
  },
  {
    id: 'gout',
    name: 'Gout & High Uric Acid',
    category: 'Musculoskeletal',
    severity: 'Moderate',
    icon: '🦶',
    overview: 'Inflammatory arthritis caused by monosodium urate crystal deposition in joints (commonly big toe), triggering excruciating pain, redness, and swelling.',
    medicines: [
      { name: 'Febuxostat / Allopurinol', dosage: '40mg', timing: 'Once daily after breakfast', note: 'Xanthine oxidase inhibitor reducing serum uric acid.' },
      { name: 'Colchicine (for acute flare)', dosage: '0.5mg', timing: 'As prescribed during acute gout attack', note: 'Specific anti-inflammatory for gout crystals.' }
    ],
    diet: {
      eat: ['Tart Cherry juice (proven uric acid reducer)', 'PLENTY of Water (3+ Liters)', 'Low-fat Milk & Yogurt', 'Coffee & Vitamin C foods'],
      avoid: ['High-purine foods (Red meat, Organ meats, Shellfish, Anchovies)', 'Beer & Hard Alcohol (strongly triggers gout)', 'High-fructose corn syrup & Sugary sodas']
    },
    exercisesAndMeditation: {
      exercises: ['Rest joint during acute attack; low-impact swimming when pain-free'],
      meditation: ['Pain-management breathing']
    },
    dayRoutine: ['07:00 AM: 2 glasses water + 1 glass Tart Cherry juice', '08:30 AM: Low-purine breakfast + Febuxostat', '01:30 PM: Hydrating lunch', '08:00 PM: Light dinner'],
    nightRoutine: ['09:30 PM: Keep foot elevated on pillow if joint is swollen', '10:00 PM: Rest'],
    recoveryTimeline: 'Acute attack subsides in 3-7 days with Colchicine; serum uric acid normalizes < 6 mg/dL in 4-8 weeks.',
    whenToSeeDoctor: ['High fever with joint pain (must rule out septic joint)', 'Multiple joints swollen simultaneously', 'Presence of visible subcutaneous uric acid deposits (Tophi)'],
    precautions: ['Maintain target serum uric acid level below 6.0 mg/dL', 'Avoid rapid crash weight loss as it spikes uric acid']
  },
  {
    id: 'eczema',
    name: 'Eczema & Atopic Dermatitis',
    category: 'Dermatological',
    severity: 'Moderate',
    icon: '🧴',
    overview: 'Chronic pruritic inflammatory skin condition characterized by dry, erythematous, itchy, and flaking skin patches.',
    medicines: [
      { name: 'Ceramide-rich Emollient Moisturizer', dosage: 'Liberal application', timing: '3-4 times daily (within 3 mins of bathing)', note: 'Rebuilds skin barrier.' },
      { name: 'Hydrocortisone / Tacrolimus Ointment', dosage: 'Thin layer', timing: 'Twice daily on flare-up spots', note: 'Topical anti-inflammatory.' },
      { name: 'Cetirizine / Fexofenadine', dosage: '10mg', timing: 'At bedtime', note: 'Controls nighttime itching.' }
    ],
    diet: {
      eat: ['Omega-3 rich seeds & Salmon', 'Probiotic yogurt & Fermented foods', 'Quercetin-rich foods (Apples, Berries)'],
      avoid: ['Common food allergens if sensitive (Dairy, Eggs, Soy, Gluten, Peanuts)', 'Artificial food preservatives & Dyes']
    },
    exercisesAndMeditation: {
      exercises: ['Moderate indoor exercise (shower immediately after sweating)'],
      meditation: ['Stress reduction meditation (stress triggers eczema flares)']
    },
    dayRoutine: ['07:30 AM: Short lukewarm bath (under 10 mins) + Apply moisturizer on damp skin', '08:30 AM: Breakfast', '01:30 PM: Reapply moisturizer to hands/arms', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Reapply moisturizer + Cetirizine tablet', '10:00 PM: Wear 100% soft breathable cotton sleepwear'],
    recoveryTimeline: 'Flare-up controlled within 7-14 days; maintenance care prevents recurrence.',
    whenToSeeDoctor: ['Skin patches show yellow crusting, pus, or weeping (Bacterial infection)', 'Severe itch preventing sleep', 'Widespread body involvement'],
    precautions: ['Avoid harsh alkaline soaps; use fragrance-free cleanser', 'Pat skin dry gently with towel; never rub']
  },
  {
    id: 'psoriasis',
    name: 'Psoriasis Flare-Up',
    category: 'Dermatological',
    severity: 'Chronic Management',
    icon: '✨',
    overview: 'Autoimmune skin condition causing rapid epidermal cell turnover, producing thick silvery-scaled erythematous plaques.',
    medicines: [
      { name: 'Clobetasol + Salicylic Acid Ointment', dosage: 'Apply to plaques', timing: 'Twice daily', note: 'Descales and reduces plaque thickness.' },
      { name: 'Vitamin D3 Analogue (Calcipotriene)', dosage: 'Apply topically', timing: 'Once daily', note: 'Slows hyperactive skin cell growth.' },
      { name: 'Omega-3 High Potency Fish Oil', dosage: '2000mg', timing: 'Daily after meals', note: 'Systemic anti-inflammatory.' }
    ],
    diet: {
      eat: ['Anti-inflammatory Mediterranean diet', 'Turmeric curcumin & Ginger', 'Leafy greens & Berries'],
      avoid: ['Alcohol & Tobacco (major psoriasis triggers)', 'Red meat & Processed foods', 'Refined sugars']
    },
    exercisesAndMeditation: {
      exercises: ['30 mins exercise daily', 'Controlled sunbathing 15 mins (UVB rays help heal plaques)'],
      meditation: ['Mind-body stress reduction']
    },
    dayRoutine: ['07:30 AM: Lukewarm shower + Topical ointment on plaques + 15 mins morning sun', '08:30 AM: Anti-inflammatory breakfast', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Apply heavy moisturizer', '10:00 PM: 8 hours sleep'],
    recoveryTimeline: 'Plaque flattening and descaling within 3-6 weeks of consistent topical and light therapy.',
    whenToSeeDoctor: ['Joint pain or stiffness in fingers/spine (Psoriatic Arthritis warning)', 'Plaques cover > 10% of body surface', 'Pustular skin eruptions'],
    precautions: ['Avoid skin injuries/scratches (Koebner Phenomenon triggers new plaques)', 'Keep skin continuously hydrated']
  },
  {
    id: 'acne-vulgaris',
    name: 'Acne Vulgaris & Oily Skin',
    category: 'Dermatological',
    severity: 'Mild',
    icon: '🫧',
    overview: 'Inflammatory pilosebaceous unit disorder featuring comedones, papules, pustules, and sebum hypersecretion.',
    medicines: [
      { name: 'Benzoyl Peroxide Gel (2.5%) / Adapalene', dosage: 'Pea-sized amount', timing: 'Once daily at bedtime', note: 'Unclogs pores and kills P. acnes bacteria.' },
      { name: 'Salicylic Acid Cleanser (2%)', dosage: 'Wash face', timing: 'Twice daily (Morning & Evening)', note: 'Exfoliates pore linings.' },
      { name: 'Zinc Picolinate Supplement', dosage: '30mg', timing: 'After lunch', note: 'Reduces cutaneous sebum production.' }
    ],
    diet: {
      eat: ['Low-glycemic index foods', 'Zinc-rich pumpkin seeds & Legumes', 'Green tea & Spearmint tea', 'Water'],
      avoid: ['High-glycemic milk, Dairy products & Whey protein', 'Sugary chocolates & Sweets', 'Fried greasy foods']
    },
    exercisesAndMeditation: {
      exercises: ['Regular exercise (wash face promptly after sweating)'],
      meditation: ['Stress control breathing']
    },
    dayRoutine: ['07:30 AM: Wash face with Salicylic cleanser + Non-comedogenic moisturizer + SPF 50 sunscreen', '08:30 AM: Low-GI breakfast', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Gentle face wash + Apply thin layer of Adapalene gel', '10:00 PM: Sleep on clean silk/cotton pillowcase'],
    recoveryTimeline: 'Noticeable acne reduction in 4-8 weeks; full skin clearing in 12 weeks.',
    whenToSeeDoctor: ['Deep painful cystic acne leaving permanent scars', 'Acne unremitting after 8 weeks of OTC care'],
    precautions: ['NEVER pop, pick or squeeze pimples (causes dark post-inflammatory hyperpigmentation & scarring)', 'Use strictly non-comedogenic cosmetics']
  },
  {
    id: 'hemorrhoids-piles',
    name: 'Hemorrhoids & Piles',
    category: 'Digestive & Gastric',
    severity: 'Moderate',
    icon: '🩹',
    overview: 'Swollen, inflamed vascular cushions in the lower rectum and anus causing painful defecation, rectal bleeding, and prolapse.',
    medicines: [
      { name: 'Flavonioid Complex (Micronized Purified Flavonoid Fraction)', dosage: '500mg', timing: 'Twice daily after meals', note: 'Reduces venous capacitance and microvascular permeability.' },
      { name: 'Anesthetic Cream / Hydrocortisone Suppository', dosage: 'Apply locally', timing: 'Twice daily after Sitz bath', note: 'Relieves local anal itching and swelling.' },
      { name: 'Psyllium Husk', dosage: '1 tbsp in water', timing: 'At bedtime', note: 'Keeps stool soft and bulked.' }
    ],
    diet: {
      eat: ['High-fiber oats, Prunes & Whole grains', 'Abundant fluids (3+ Liters daily)', 'Green leafy vegetables', 'Papaya'],
      avoid: ['Spicy chilies & Hot curries', 'Refined flour / Maida', 'Alcohol & Excessive coffee']
    },
    exercisesAndMeditation: {
      exercises: ['Sitz Bath (soaking anal area in warm water for 15 mins 3 times daily)', 'Pelvic floor exercises (Kegels)'],
      meditation: ['Stress relief']
    },
    dayRoutine: ['07:00 AM: Warm Sitz bath 15 mins', '08:00 AM: High-fiber breakfast', '02:00 PM: Warm Sitz bath', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Sitz bath + Apply soothing ointment + Psyllium husk', '10:00 PM: Rest'],
    recoveryTimeline: 'Acute symptom pain relief in 3-7 days; hemorrhoidal tissue shrinking in 2-3 weeks.',
    whenToSeeDoctor: ['Heavy bright red rectal bleeding causing weakness', 'Severe sudden throbbing pain (suspected Thrombosed External Hemorrhoid)', 'Permanent prolapse that cannot be pushed back in'],
    precautions: ['NEVER strain while passing stool', 'Do not sit on toilet seat for longer than 5 minutes']
  },
  {
    id: 'gallstones',
    name: 'Gallbladder Stones (Gallstones)',
    category: 'Digestive & Gastric',
    severity: 'Moderate',
    icon: '🪨',
    overview: 'Concretions formed in gallbladder (cholesterol or pigment stones) causing right upper quadrant biliary colic after fatty meals.',
    medicines: [
      { name: 'Ursodeoxycholic Acid (UDCA)', dosage: '300mg', timing: 'Twice daily with meals', note: 'Dissolves small radiolucent cholesterol stones (if non-surgical candidate).' },
      { name: 'Drotaverine / Hyoscine (Antispasmodic)', dosage: '40mg', timing: 'SOS during biliary colic pain', note: 'Relieves biliary smooth muscle spasm.' }
    ],
    diet: {
      eat: ['Ultra low-fat meals', 'High-fiber vegetables & Beans', 'Citrus fruits & Fiber-rich oats', 'Plenty of water'],
      avoid: ['Fatty fried foods, Butter, Ghee, Cream & Cheese', 'Rich curries & Heavy desserts', 'Red meat & Pork']
    },
    exercisesAndMeditation: {
      exercises: ['Light 30-min daily walk', 'Avoid sudden heavy abdominal strain'],
      meditation: ['Calm breathing']
    },
    dayRoutine: ['07:30 AM: Low-fat breakfast (Oats/Idli without oil)', '01:30 PM: Ultra low-fat lunch', '08:00 PM: Light early dinner'],
    nightRoutine: ['09:30 PM: UDCA tablet with water', '10:00 PM: Sleep on left side'],
    recoveryTimeline: 'Symptom management with low-fat diet. Surgical Laparoscopic Cholecystectomy provides definitive 100% cure.',
    whenToSeeDoctor: ['Biliary pain lasting > 5 hours continuously', 'Fever with chills and jaundice (Acute Cholecystitis / Cholangitis emergency)', 'Severe vomiting'],
    precautions: ['Strictly adhere to low-fat diet to prevent gallbladder contraction pain', 'Do not skip meals']
  },
  {
    id: 'obesity-weight',
    name: 'Obesity & Weight Management',
    category: 'Metabolic & Endocrine',
    severity: 'Chronic Management',
    icon: '⚖️',
    overview: 'Excess body fat accumulation (BMI >= 30 kg/m2) predisposing to cardiovascular, metabolic, and joint complications.',
    medicines: [
      { name: 'Orlistat (if prescribed)', dosage: '120mg', timing: 'With each main fat-containing meal', note: 'Lipase inhibitor blocking 30% dietary fat absorption.' },
      { name: 'Green Tea Extract (EGCG)', dosage: '500mg', timing: 'Morning', note: 'Metabolic thermogenesis support.' }
    ],
    diet: {
      eat: ['Calorie-deficit whole food diet', 'Lean proteins (Chicken, Tofu, Paneer, Fish)', 'Abundant vegetables & Salads before meals', 'Water (500ml before meals)'],
      avoid: ['Caloric beverages (Sodas, Juices, Alcohol)', 'Ultra-processed junk food & Bakery items', 'Deep-fried snacks']
    },
    exercisesAndMeditation: {
      exercises: ['150-300 mins moderate cardio per week + 2 days resistance strength training'],
      meditation: ['Mindful intuitive eating meditation']
    },
    dayRoutine: ['06:30 AM: 500ml water + 45 mins exercise workout', '08:30 AM: High-protein breakfast', '01:00 PM: Large salad bowl + lean protein lunch', '07:30 PM: Early light dinner'],
    nightRoutine: ['09:30 PM: Herbal tea', '10:30 PM: 8 hours quality sleep (sleep deprivation increases ghrelin hunger hormone)'],
    recoveryTimeline: 'Safe sustainable weight loss of 0.5 to 1 kg per week (5-10% total body weight loss in 6 months).',
    whenToSeeDoctor: ['BMI > 40 or BMI > 35 with metabolic co-morbidities', 'Obstructive sleep apnea symptoms'],
    precautions: ['Avoid crash fad diets; focus on long-term lifestyle modification', 'Track daily step count (aim for 8,000 - 10,000 steps)']
  },
  {
    id: 'depression-low-energy',
    name: 'Mild Depression & Low Mood',
    category: 'Neurological & Mental',
    severity: 'Moderate',
    icon: '🌅',
    overview: 'Persistent low mood, loss of interest (anhedonia), low energy, altered sleep/appetite, and feelings of worthlessness.',
    medicines: [
      { name: 'SSRI / Antidepressant (as prescribed by psychiatrist)', dosage: 'As prescribed', timing: 'Morning with food', note: 'Modulates brain serotonin levels.' },
      { name: 'Vitamin B-Complex + B12', dosage: '1 Tablet', timing: 'Daily with breakfast', note: 'Neurotransmitter synthesis support.' },
      { name: 'Omega-3 EPA High Dose (1000mg EPA)', dosage: '1000mg', timing: 'Daily after meal', note: 'Supports neuroplasticity.' }
    ],
    diet: {
      eat: ['Tryptophan-rich foods (Eggs, Bananas, Oats)', 'Fermented probiotic foods', 'Dark leafy greens & Nuts'],
      avoid: ['Alcohol & Recreational drugs', 'High refined sugar foods (causes mood crashes)', 'Processed junk']
    },
    exercisesAndMeditation: {
      exercises: ['30 mins outdoor walking in sunlight (increases brain endorphins & serotonin)'],
      meditation: ['Mindfulness Based Cognitive Therapy (MBCT) 20 mins']
    },
    dayRoutine: ['07:00 AM: Open curtains for morning sunlight + 20-min outdoor walk', '08:30 AM: Protein breakfast', '01:30 PM: Wholesome lunch', '05:00 PM: Connect with a friend or family member'],
    nightRoutine: ['08:00 PM: Light dinner', '10:00 PM: Regular bedtime routine'],
    recoveryTimeline: 'Medication and therapy show noticeable mood improvement in 4-6 weeks.',
    whenToSeeDoctor: ['Suicidal thoughts or plans (URGENT HELPLINE NEEDED)', 'Inability to get out of bed or care for basic personal hygiene'],
    precautions: ['Do not stop antidepressant medication abruptly (avoids discontinuation syndrome)', 'Engage in regular psychotherapy/counseling']
  },
  {
    id: 'dry-eye-syndrome',
    name: 'Dry Eye Syndrome & Digital Strain',
    category: 'General Wellness',
    severity: 'Mild',
    icon: '👁️',
    overview: 'Inadequate tear quantity or quality causing ocular stinging, redness, grittiness, and asthenopia from screen use.',
    medicines: [
      { name: 'CMC 0.5% / Trehalose Lubricating Eye Drops', dosage: '1-2 drops per eye', timing: '4 times daily', note: 'Replenishes tear film.' },
      { name: 'Omega-3 Fatty Acid Supplement', dosage: '1000mg', timing: 'Daily after lunch', note: 'Improves meibomian gland oil secretion.' }
    ],
    diet: {
      eat: ['Vitamin A & Lutein rich foods (Carrots, Spinach, Corn, Eggs)', 'Omega-3 seeds & Fish', 'Hydrating water'],
      avoid: ['Direct air flow from AC/fans blowing into eyes']
    },
    exercisesAndMeditation: {
      exercises: ['20-20-20 Rule (every 20 mins look at something 20 feet away for 20 seconds)', 'Conscious blinking exercises'],
      meditation: ['Palming technique (warm palms over closed eyes 5 mins)']
    },
    dayRoutine: ['08:00 AM: Eye drops + Warm eye compress', '11:00 AM: Practice 20-20-20 rule', '02:00 PM: Eye drops', '08:00 PM: Screen curfew'],
    nightRoutine: ['09:30 PM: Warm eye compress 10 mins + Lubricating eye gel', '10:00 PM: 8 hours sleep'],
    recoveryTimeline: 'Ocular comfort improves in 3-7 days of regular eye drop compliance.',
    whenToSeeDoctor: ['Severe eye pain, photophobia, or sudden decrease in vision', 'Corneal scratch or persistent red eye'],
    precautions: ['Adjust screen brightness and use blue-light filters', 'Maintain proper humidification in air-conditioned rooms']
  },
  {
    id: 'carpal-tunnel',
    name: 'Carpal Tunnel Syndrome (Wrist Pain)',
    category: 'Musculoskeletal',
    severity: 'Mild',
    icon: '✋',
    overview: 'Median nerve entrapment under transverse carpal ligament at wrist, causing thumb/index/middle finger numbness and tingling.',
    medicines: [
      { name: 'Methylcobalamin (Vitamin B12)', dosage: '1500mcg', timing: 'Once daily after meal', note: 'Promotes nerve sheath repair.' },
      { name: 'Ibuprofen', dosage: '400mg', timing: 'SOS after food for wrist pain', note: 'Reduces flexor tendon inflammation.' }
    ],
    diet: {
      eat: ['Vitamin B6 rich foods (Bananas, Chickpeas, Potatoes, Chicken)', 'Anti-inflammatory ginger & turmeric'],
      avoid: ['High-sodium foods (causes fluid retention & nerve compression)']
    },
    exercisesAndMeditation: {
      exercises: ['Wrist tendon nerve gliding exercises', 'Wrist extensor stretches'],
      meditation: ['Hand relaxation']
    },
    dayRoutine: ['08:00 AM: Wrist stretches before typing', '11:00 AM: Take 5-min hand rest break every hour', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Wear neutral wrist splint/brace before sleep', '10:00 PM: Sleep'],
    recoveryTimeline: 'Numbness and nocturnal awakening improve in 2-4 weeks with night splinting.',
    whenToSeeDoctor: ['Permanent loss of sensation in thumb/fingers', 'Wasting/atrophy of thenar muscle at base of thumb'],
    precautions: ['Keep wrist in neutral straight position while typing (use ergonomic wrist pad)', 'Wear wrist splint strictly at night']
  },
  {
    id: 'hair-loss-alopecia',
    name: 'Hair Loss & Alopecia',
    category: 'Dermatological',
    severity: 'Mild',
    icon: '💇',
    overview: 'Excessive hair shedding or thinning caused by androgenetic genetics, telogen effluvium stress, or nutritional deficiency.',
    medicines: [
      { name: 'Minoxidil Solution 5%', dosage: '1 ml', timing: 'Twice daily on dry scalp', note: 'Vasodilator stimulating hair follicle growth.' },
      { name: 'Biotin + Amino Acid + Iron Hair Supplement', dosage: '1 Tablet', timing: 'Daily after breakfast', note: 'Provides keratin building blocks.' }
    ],
    diet: {
      eat: ['Protein-rich eggs, Sprouts, Paneer & Fish', 'Iron & Zinc rich pumpkin seeds & Spinach', 'Vitamin C fruits'],
      avoid: ['Crash dieting & Severe calorie restriction', 'Excessive sugar & Processed junk']
    },
    exercisesAndMeditation: {
      exercises: ['Head massage (increases scalp microcirculation)', 'Yoga (Adho Mukha Svanasana - Downward dog)'],
      meditation: ['Stress relief meditation (stress causes Telogen Effluvium)']
    },
    dayRoutine: ['07:30 AM: Apply 1ml Minoxidil to dry scalp', '08:30 AM: High-protein breakfast + Hair supplement', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Apply 1ml Minoxidil', '10:00 PM: Sleep'],
    recoveryTimeline: 'Initial reduction in hair shedding in 6-8 weeks; visible new hair growth in 3-6 months.',
    whenToSeeDoctor: ['Sudden patchy circular hair loss spots (Alopecia Areata)', 'Hair loss accompanied by scalp redness, pus, or severe scaling'],
    precautions: ['Minoxidil must be used continuously to maintain results', 'Avoid tight hairstyles and harsh chemical treatments']
  },
  {
    id: 'food-poisoning',
    name: 'Food Poisoning & Stomach Bug',
    category: 'Digestive & Gastric',
    severity: 'Mild',
    icon: '🤢',
    overview: 'Acute gastroenteritis caused by ingesting food contaminated with bacterial toxins (Staph, Salmonella, E. coli).',
    medicines: [
      { name: 'ORS (Oral Rehydration Solution)', dosage: '200ml after every loose stool', timing: 'Continuous hydration', note: 'Essential to prevent acute dehydration.' },
      { name: 'Osetron / Ondansetron', dosage: '4mg', timing: 'SOS for severe nausea/vomiting', note: 'Anti-emetic.' },
      { name: 'Saccharomyces Boulardii (Probiotic)', dosage: '250mg', timing: 'Twice daily with water', note: 'Probiotic yeast neutralizing enterotoxins.' }
    ],
    diet: {
      eat: ['ORS water, Rice kanji, Coconut water', 'Bland banana & Toast', 'Clear vegetable broth'],
      avoid: ['Solid heavy food during active vomiting', 'Dairy milk & Fat', 'Spicy foods']
    },
    exercisesAndMeditation: {
      exercises: ['Complete physical rest'],
      meditation: ['Calm breathing']
    },
    dayRoutine: ['Continuous hydration with ORS sips', '01:00 PM: Warm clear soup', '08:00 PM: Rice kanji with salt'],
    nightRoutine: ['09:30 PM: ORS by bedside', '10:00 PM: Rest'],
    recoveryTimeline: 'Acute nausea and diarrhea resolve within 24-48 hours.',
    whenToSeeDoctor: ['High fever > 101.5°F', 'Inability to keep any liquids down for > 12 hours', 'Blood in vomit or stool'],
    precautions: ['Never consume food left at room temperature for more than 2 hours', 'Practice strict kitchen hygiene']
  },
  {
    id: 'motion-sickness',
    name: 'Motion Sickness & Travel Nausea',
    category: 'General Wellness',
    severity: 'Mild',
    icon: '🚗',
    overview: 'Conflict between visual cues and inner ear vestibular motion perception during travel causing dizziness, cold sweats, and vomiting.',
    medicines: [
      { name: 'Dimenhydrinate (Avomine / Dramamine)', dosage: '25mg - 50mg', timing: '30-60 minutes BEFORE starting travel', note: 'Prophylactic anticholinergic/antihistamine.' },
      { name: 'Ginger Extract Candy / Chew', dosage: '500mg', timing: 'During travel', note: 'Natural stomach anti-nausea.' }
    ],
    diet: {
      eat: ['Light dry crackers, Toast or Pretzels before travel', 'Clear water or Ginger ale'],
      avoid: ['Heavy, oily, or greasy meals right before travel', 'Alcohol before or during travel', 'Strong smelling foods']
    },
    exercisesAndMeditation: {
      exercises: ['Focus gaze on horizon fixed point outside vehicle window'],
      meditation: ['Controlled slow diaphragmatic breathing']
    },
    dayRoutine: ['Take Dimenhydrinate 45 mins prior to boarding vehicle', 'Sit in front passenger seat of car or over airplane wing', 'Keep fresh air ventilation open'],
    nightRoutine: ['Rest after travel'],
    recoveryTimeline: 'Symptoms cease immediately within 15-30 minutes after motion stops.',
    whenToSeeDoctor: ['Severe dizziness or vomiting persisting hours after travel has ended'],
    precautions: ['Do NOT read books or look down at phone screens while vehicle is moving', 'Keep eyes fixed on steady distant horizon']
  },
  {
    id: 'chronic-fatigue',
    name: 'Chronic Fatigue & Brain Fog',
    category: 'General Wellness',
    severity: 'Moderate',
    icon: '⚡',
    overview: 'Persistent debilitating physical and cognitive exhaustion not relieved by sleep, often post-viral or mitochondrial in origin.',
    medicines: [
      { name: 'Coenzyme Q10 (CoQ10) + NADH', dosage: '200mg', timing: 'Morning after breakfast', note: 'Enhances cellular mitochondrial ATP generation.' },
      { name: 'Active B-Complex (Methylated B12 & Folate)', dosage: '1 Tablet', timing: 'Daily morning', note: 'Supports cellular energy metabolism.' }
    ],
    diet: {
      eat: ['Nutrient-dense whole foods', 'Mitochondrial foods (Avocados, Spinach, Seeds, Berries)', 'Adequate protein'],
      avoid: ['Refined sugar & High-carb meals (causes sugar crashes)', 'Caffeine dependency']
    },
    exercisesAndMeditation: {
      exercises: ['Pacing energy (avoid push-crash cycle; light 10-min walk within energy envelope)'],
      meditation: ['Deep relaxation Yoga Nidra 20 mins afternoon']
    },
    dayRoutine: ['07:30 AM: Gentle hydration + CoQ10', '08:30 AM: Protein breakfast', '02:00 PM: 20-min Yoga Nidra rest', '08:00 PM: Light dinner'],
    nightRoutine: ['09:30 PM: Magnesium warm drink', '10:00 PM: 8-9 hours sleep'],
    recoveryTimeline: 'Gradual energy envelope restoration over 2-6 months with strict pacing.',
    whenToSeeDoctor: ['Fatigue accompanied by unexplained lymph node enlargement, low fever, or joint swelling'],
    precautions: ['Learn activity pacing; do not overexert on good energy days', 'Exclude thyroid, iron deficiency, and autoimmune causes first']
  },
  {
    id: 'frozen-shoulder',
    name: 'Frozen Shoulder (Adhesive Capsulitis)',
    category: 'Musculoskeletal',
    severity: 'Moderate',
    icon: '💪',
    overview: 'Fibrosis and contracture of glenohumeral joint capsule causing progressive pain and severe active/passive range-of-motion restriction.',
    medicines: [
      { name: 'Aceclofenac + Paracetamol', dosage: '100mg / 325mg', timing: 'Twice daily after meals for 7 days', note: 'Reduces capsular inflammation.' },
      { name: 'Intra-articular Corticosteroid Shot (if prescribed by Ortho)', dosage: 'Single dose', timing: 'Clinical procedure', note: 'Accelerates stage 1 pain relief.' }
    ],
    diet: {
      eat: ['Anti-inflammatory diet (Turmeric, Ginger, Fatty fish)', 'Vitamin C & Collagen foods'],
      avoid: ['Processed sugars & Trans fats']
    },
    exercisesAndMeditation: {
      exercises: ['Pendulum exercise (swinging arm gently)', 'Towel stretch & Finger ladder wall climb exercise 3 times daily'],
      meditation: ['Mindfulness pain tolerance']
    },
    dayRoutine: ['07:30 AM: Warm shower on shoulder + Pendulum exercises 10 mins', '08:30 AM: Breakfast', '05:00 PM: Wall climb finger exercise', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Warm pack + Pain gel', '10:00 PM: Sleep with pillow supporting affected arm'],
    recoveryTimeline: 'Capsular mobility slowly recovers in 6 to 12 months with persistent physical therapy.',
    whenToSeeDoctor: ['Total inability to move shoulder accompanied by fever', 'History of recent major shoulder trauma/fracture'],
    precautions: ['Perform gentle range-of-motion exercises daily within pain tolerance', 'Do not keep arm in sling continuously (worsens freezing)']
  },
  {
    id: 'plantar-fasciitis',
    name: 'Plantar Fasciitis (Heel Pain)',
    category: 'Musculoskeletal',
    severity: 'Mild',
    icon: '🦶',
    overview: 'Micro-tearing and inflammation of the thick plantar fascia ligament on sole of foot, causing stabbing heel pain during first morning steps.',
    medicines: [
      { name: 'Diclofenac Gel', dosage: 'Apply to heel sole', timing: '3 times daily', note: 'Topical anti-inflammatory relief.' },
      { name: 'Ice Bottle Rolling', dosage: '10-15 mins', timing: 'Twice daily', note: 'Reduces plantar fascia swelling.' }
    ],
    diet: {
      eat: ['Anti-inflammatory turmeric drinks', 'Calcium & Vitamin D foods'],
      avoid: ['Excessive salt & Processed foods']
    },
    exercisesAndMeditation: {
      exercises: ['Plantar fascia stretch (pull toes back toward shin)', 'Calf muscle stretching against wall', 'Frozen water bottle foot rolling'],
      meditation: ['Relaxation']
    },
    dayRoutine: ['07:00 AM: BEFORE stepping out of bed: Perform 2 mins toe & calf stretches!', '08:30 AM: Wear supportive cushioned footwear indoors', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Roll heel over frozen water bottle 10 mins', '10:00 PM: Sleep'],
    recoveryTimeline: '80-90% heel pain resolution in 6-12 weeks of daily stretching and arch support.',
    whenToSeeDoctor: ['Severe heel pain preventing weight bearing completely', 'Numbness or tingling in sole of foot (Tarsal Tunnel)'],
    precautions: ['NEVER walk barefoot on hard tile/concrete floors; wear arch-support orthotics', 'Replace worn-out running shoes']
  },
  {
    id: 'vitamin-b12-deficiency',
    name: 'Vitamin B12 Deficiency',
    category: 'Metabolic & Endocrine',
    severity: 'Mild',
    icon: '💊',
    overview: 'Inadequate serum cobalamin levels leading to megaloblastic anemia, peripheral neuropathy (glove-and-stocking numbness), and memory fog.',
    medicines: [
      { name: 'Methylcobalamin (Sublingual / Injection)', dosage: '1500mcg daily (or 1000mcg IM injection weekly)', timing: 'Once daily after breakfast', note: 'Bioactive form of Vitamin B12.' },
      { name: 'Folic Acid', dosage: '5mg', timing: 'Daily with B12', note: 'Synergistic DNA synthesis support.' }
    ],
    diet: {
      eat: ['Milk, Cheese & Yogurt', 'Fortified breakfast cereals & Plant milks', 'Eggs, Meat & Fish (for non-veg)', 'Nutritional yeast'],
      avoid: ['Heavy alcohol consumption (impairs B12 absorption)']
    },
    exercisesAndMeditation: {
      exercises: ['30 mins regular walking to stimulate peripheral nerve repair'],
      meditation: ['Mindfulness focus exercise']
    },
    dayRoutine: ['07:30 AM: B12 tablet under tongue after breakfast', '01:30 PM: Dairy/fortified lunch', '08:00 PM: Dinner'],
    nightRoutine: ['10:00 PM: 8 hours sleep'],
    recoveryTimeline: 'Neurological symptoms improve in 4-8 weeks; full stores replenished in 3 months.',
    whenToSeeDoctor: ['Unsteadiness while walking, frequent falls, or severe memory loss', 'Severe tingling or burning pain in feet'],
    precautions: ['Strict vegetarians and vegans MUST take daily B12 oral supplements or regular injections', 'Monitor B12 level annually']
  },
  {
    id: 'respiratory-allergy',
    name: 'Dust & Pollen Respiratory Allergy',
    category: 'Respiratory',
    severity: 'Mild',
    icon: '🌾',
    overview: 'Hypersensitivity reaction to airborne allergens (dust mites, pollen, pet dander) causing paroxysmal sneezing, watery eyes, and nasal itching.',
    medicines: [
      { name: 'Fexofenadine / Bilastine', dosage: '120mg / 20mg', timing: 'Once daily in the morning', note: 'Non-drowsy 2nd generation antihistamine.' },
      { name: 'Azelastine Nasal Spray', dosage: '1 spray per nostril', timing: 'Twice daily', note: 'Topical rapid-acting antihistamine spray.' }
    ],
    diet: {
      eat: ['Local honey (may help desensitize to local pollen)', 'Ginger & Green tea', 'Vitamin C rich oranges & Bell peppers'],
      avoid: ['Cold dairy during acute allergic flare']
    },
    exercisesAndMeditation: {
      exercises: ['Indoor workouts during high pollen count days'],
      meditation: ['Nadi Shodhana Pranayama 15 mins']
    },
    dayRoutine: ['07:30 AM: Fexofenadine tablet + Saline nasal spray', '08:30 AM: Breakfast', '05:00 PM: Keep windows closed during high pollen sunset hours', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Shower to wash off airborne pollen from hair/skin before bed', '10:00 PM: Sleep in allergen-free room'],
    recoveryTimeline: 'Symptoms controlled within 1-2 hours of antihistamine dose.',
    whenToSeeDoctor: ['Allergy symptoms trigger severe asthma wheezing or shortness of breath', 'Nasal polyps blocking airway'],
    precautions: ['Encase mattresses and pillows in allergen-proof dust-mite covers', 'Wash bed sheets in hot water (130°F / 60°C) weekly']
  },
  {
    id: 'heat-stroke-dehydration',
    name: 'Heat Exhaustion & Dehydration',
    category: 'General Wellness',
    severity: 'Moderate',
    icon: '☀️',
    overview: 'Thermoregulatory failure due to high ambient heat and fluid loss, causing heavy sweating, dizziness, rapid pulse, and muscle cramps.',
    medicines: [
      { name: 'ORS (Oral Rehydration Solution)', dosage: 'Sip 1-2 Liters', timing: 'Immediately upon heat symptom onset', note: 'Restores vital sodium, potassium, and glucose.' },
      { name: 'Cold Compress Application', dosage: 'Ice packs to neck, armpits, groin', timing: 'Immediate emergency application', note: 'Rapid core body cooling.' }
    ],
    diet: {
      eat: ['Chilled ORS water & Coconut water', 'Watermelon, Cucumbers & Buttermilk (Chaach)', 'Lemonade with pinch of salt'],
      avoid: ['Alcohol, Coffee & Caffeine (worsens dehydration)', 'Heavy hot spicy meals']
    },
    exercisesAndMeditation: {
      exercises: ['STRICT REST in cool, shaded or air-conditioned environment; cease all workouts'],
      meditation: ['Cooling mental breathing']
    },
    dayRoutine: ['Immediate transfer to cool room under fan/AC', 'Sip 200ml ORS every 15 minutes', 'Apply damp cool cloths to skin'],
    nightRoutine: ['Rest in cool room', '10:00 PM: 9 hours recovery sleep'],
    recoveryTimeline: 'Heat exhaustion symptoms resolve in 24-48 hours with rapid fluid replacement.',
    whenToSeeDoctor: ['Body temperature > 103°F (39.4°C) or loss of consciousness / confusion (Heat Stroke Emergency!)', 'Hot red dry skin without sweating', 'Inability to drink liquids due to vomiting'],
    precautions: ['Wear lightweight, light-colored, loose cotton clothing in summer', 'Never leave children or pets inside parked cars']
  },
  {
    id: 'varicose-veins',
    name: 'Varicose Veins & Leg Swelling',
    category: 'Cardiovascular',
    severity: 'Mild',
    icon: '🦵',
    overview: 'Dilated, tortuous superficial leg veins caused by incompetent venous valves, resulting in leg heaviness, aching, and pedal edema.',
    medicines: [
      { name: 'Micronized Purified Flavonoid Fraction (MPFF)', dosage: '500mg', timing: 'Twice daily with meals', note: 'Improves venous tone and reduces edema.' },
      { name: 'Compression Stockings (Class 1 or 2)', dosage: 'Graduated compression', timing: 'Wear during daytime standing/sitting hours', note: 'Promotes venous return.' }
    ],
    diet: {
      eat: ['High-fiber foods to prevent constipation (straining worsens vein pressure)', 'Bioflavonoid rich berries & Citrus', 'Potassium foods'],
      avoid: ['High-salt foods (causes leg fluid retention)', 'Excessive alcohol']
    },
    exercisesAndMeditation: {
      exercises: ['Ankle pumps & Calf raises', '30 mins brisk walking (calf muscle pump drives venous return)', 'Legs-up-the-wall pose (Viparita Karani) 15 mins daily'],
      meditation: ['Relaxation']
    },
    dayRoutine: ['07:30 AM: Put on compression stockings BEFORE stepping out of bed', '11:00 AM: Perform 10 calf raises every hour', '05:00 PM: 15 mins Legs-up-the-wall pose', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Remove compression stockings', '10:00 PM: Elevate foot of bed by 3-4 inches for night sleep'],
    recoveryTimeline: 'Leg heaviness and swelling reduce within 1-2 weeks of compression stocking use.',
    whenToSeeDoctor: ['Sudden painful swelling in ONE leg accompanied by warmth/redness (Deep Vein Thrombosis - DVT Emergency)', 'Non-healing venous skin ulcer near ankle'],
    precautions: ['Avoid prolonged standing or sitting without moving feet', 'Do not wear tight restrictive clothing around waist or thighs']
  },
  {
    id: 'mouth-ulcers',
    name: 'Oral Aphthous Ulcers (Mouth Sores)',
    category: 'General Wellness',
    severity: 'Mild',
    icon: '👄',
    overview: 'Painful benign non-contagious mucosal ulcerations inside mouth/cheeks caused by stress, minor trauma, or Vitamin B/Iron deficiency.',
    medicines: [
      { name: 'Triamcinolone Acetonide Oral Paste', dosage: 'Dab small dab on ulcer', timing: '3 times daily after meals', note: 'Topical steroid paste for rapid ulcer healing.' },
      { name: 'Choline Salicylate + Lignocaine Gel', dosage: 'Apply to ulcer', timing: '5 mins before meals', note: 'Local anesthetic reducing eating pain.' },
      { name: 'Riboflavin (Vitamin B2) + Folic Acid', dosage: '1 Capsule', timing: 'Daily after lunch', note: 'Corrects underlying mucosal deficiency.' }
    ],
    diet: {
      eat: ['Cool bland foods (Yogurt, Ice cream, Smoothies)', 'Mashed potatoes & Soft rice', 'Coconut water & Cucumber juice'],
      avoid: ['Spicy chilies & Acidic citrus fruits (Tomatoes, Lemons)', 'Rough, sharp or salty foods (Chips, Toast)', 'Hot temperature beverages']
    },
    exercisesAndMeditation: {
      exercises: ['Rest'],
      meditation: ['Stress reduction (stress is primary trigger for aphthous ulcers)']
    },
    dayRoutine: ['07:30 AM: Apply mouth gel before breakfast', '08:30 AM: Soft bland breakfast', '01:30 PM: Apply gel before lunch', '08:00 PM: Apply Triamcinolone paste after night dinner'],
    nightRoutine: ['09:30 PM: Gentle salt-water rinse', '10:00 PM: Restful sleep'],
    recoveryTimeline: 'Pain relief within 24 hours; complete aphthous ulcer healing in 4-7 days.',
    whenToSeeDoctor: ['Mouth ulcer persisting longer than 2 weeks continuously', 'Unusually large ulcers (> 1cm) or multiple recurring clusters', 'High fever accompanying mouth sores'],
    precautions: ['Use soft-bristled toothbrush and SLS-free toothpaste', 'Avoid accidental cheek biting while chewing']
  },
  {
    id: 'muscle-strain-cramps',
    name: 'Mild Muscle Strain & Nocturnal Cramps',
    category: 'Musculoskeletal',
    severity: 'Mild',
    icon: '⚡',
    overview: 'Acute muscular fiber overstretching or nocturnal involuntary muscle contraction caused by dehydration, electrolyte imbalance, or overuse.',
    medicines: [
      { name: 'Magnesium Glycinate / Citrate', dosage: '300mg - 400mg', timing: 'Once daily at bedtime', note: 'Prevents nocturnal leg muscle cramps.' },
      { name: 'Diclofenac / Capsaicin Topical Pain Spray', dosage: 'Spray on muscle', timing: '3 times daily', note: 'Local pain relief.' },
      { name: 'ORS / Electrolyte drink', dosage: '500ml', timing: 'During/after workout', note: 'Replaces lost sodium & potassium.' }
    ],
    diet: {
      eat: ['Bananas & Avocados (Potassium)', 'Spinach & Pumpkin seeds (Magnesium)', 'Coconut water & Milk', 'Water (2.5L daily)'],
      avoid: ['Alcohol (causes muscle dehydration)', 'Excessive caffeine']
    },
    exercisesAndMeditation: {
      exercises: ['Gentle static muscle stretching (hold 30s without bouncing)', 'R.I.C.E protocol (Rest, Ice, Compression, Elevation) for strains'],
      meditation: ['Progressive muscle relaxation']
    },
    dayRoutine: ['07:30 AM: Gentle calf/hamstring stretches', '08:30 AM: Banana & oatmeal breakfast', '05:00 PM: Ice pack application to strained muscle 15 mins', '08:00 PM: Dinner'],
    nightRoutine: ['09:30 PM: Magnesium capsule + gentle stretch before bed', '10:00 PM: 8 hours sleep'],
    recoveryTimeline: 'Muscle cramps resolve immediately with stretching & magnesium; mild muscle strain heals in 5-10 days.',
    whenToSeeDoctor: ['Severe muscle swelling, dark reddish-brown urine (Rhabdomyolysis warning)', 'Inability to move affected limb', 'Severe pain lasting > 2 weeks'],
    precautions: ['Always warm up for 10 mins before intense exercise', 'Stay thoroughly hydrated during physical exertion']
  }
];
