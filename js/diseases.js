// AgriSense Crop Disease Knowledge Base (Fallback & Mock Engine Data)
// Supports all 38 PlantVillage ML custom model categories
window.AGRI_DISEASES = {

  // ============== APPLE ==============
  "apple_apple_scab": {
    id: "apple_apple_scab",
    crop: "Apple",
    disease: "Apple Scab",
    scientificName: "Venturia inaequalis",
    confidence: "91.7%",
    severity: "Medium",
    fertilizer: "Feed with high-potash organic fertilizer or liquid seaweed extracts in late spring to boost tree resilience. Supplement with calcium to strengthen cell walls.",
    description: "Apple scab is a significant fungal disease affecting apple trees, leaves, and fruit. It creates olive-green to dark brown, velvety circular spots on leaves, which gradually become puckered and distorted. Infected apples develop corky, scabby brown lesions, causing the fruit to crack and become unmarketable. The pathogen overwinters on fallen leaves and releases spores during spring rains.",
    precautions: [
      "Rake, chop, and compost or bury fallen leaves in autumn to prevent wintering of fungal spores.",
      "Prune apple tree branches during the winter dormant season to keep a highly open canopy for rapid foliage drying.",
      "Choose apple varieties that possess natural genetic resistance to scab (e.g., Enterprise, Liberty, or Freedom).",
      "Avoid overhead irrigation; use drip systems to keep foliage dry."
    ],
    cure: [
      "Apply organic sulfur sprays or liquid copper at green tip and pink blossom stages.",
      "Use preventative fungicides early in the spring growth cycle, particularly before rainy periods.",
      "Remove and destroy severely affected fruit clusters from the trees during the early stages to reduce secondary spore spread.",
      "Apply myclobutanil or captan-based fungicides on a 7-10 day schedule during wet springs."
    ]
  },

  "apple_black_rot": {
    id: "apple_black_rot",
    crop: "Apple",
    disease: "Black Rot",
    scientificName: "Botryosphaeria obtusa",
    confidence: "93.2%",
    severity: "High",
    fertilizer: "Apply balanced NPK fertilizers with added boron and zinc micronutrients. Use compost tea to improve overall tree vigor and disease suppression.",
    description: "Apple black rot is a serious fungal disease caused by Botryosphaeria obtusa. It affects leaves, fruit, and bark of apple trees. Leaf symptoms begin as purple spots that enlarge into tan or brown areas with purple margins ('frog-eye leaf spot'). On fruit, the infection starts as small brown spots that expand into large, black, rotted areas with concentric rings. Cankers on limbs serve as overwintering sites for the fungus.",
    precautions: [
      "Prune out and destroy all dead wood, cankers, and mummified fruit during dormant season.",
      "Maintain good air circulation in the canopy through annual pruning.",
      "Remove all fallen fruit and debris from the orchard floor to reduce inoculum.",
      "Avoid wounding trees during wet weather as wounds are primary infection sites."
    ],
    cure: [
      "Apply captan or thiophanate-methyl fungicides beginning at pink bud stage through second cover spray.",
      "Excise cankers from limbs by cutting at least 15 cm beyond visible canker margins.",
      "Apply copper sprays during the dormant season to reduce overwintering spore load.",
      "In severe cases, remove and replace heavily infected trees to protect the rest of the orchard."
    ]
  },

  "apple_cedar_apple_rust": {
    id: "apple_cedar_apple_rust",
    crop: "Apple",
    disease: "Cedar Apple Rust",
    scientificName: "Gymnosporangium juniperi-virginianae",
    confidence: "90.5%",
    severity: "Medium",
    fertilizer: "Apply potassium-rich fertilizers to strengthen leaf defenses. Use foliar sprays of manganese and zinc to support metabolic resistance pathways.",
    description: "Cedar apple rust is a fungal disease requiring two hosts to complete its life cycle: apple trees and Eastern red cedar (Juniperus virginiana). On apple leaves, bright orange-yellow spots appear on the upper surface, with tube-like structures (aecia) forming on the lower surface. Severe infections cause premature defoliation and reduced fruit quality. The fungus alternates between forming galls on cedars and infecting apple tissue.",
    precautions: [
      "Remove Eastern red cedar and juniper trees within a 2-mile radius of apple orchards if possible.",
      "Plant rust-resistant apple cultivars such as Redfree, Liberty, or Enterprise.",
      "Scout cedar trees for galls during winter and remove them before spring sporulation.",
      "Maintain good orchard sanitation and remove fallen leaves."
    ],
    cure: [
      "Apply myclobutanil or propiconazole fungicides beginning at pink bud stage.",
      "Spray preventative fungicides every 7-10 days during wet spring weather until 2 weeks after petal fall.",
      "Remove heavily infected leaves to reduce secondary spread.",
      "Apply mancozeb as a protectant spray early in the infection period."
    ]
  },

  "apple_healthy": {
    id: "apple_healthy",
    crop: "Apple",
    disease: "Healthy",
    scientificName: "No pathogen detected",
    confidence: "99.1%",
    severity: "None",
    fertilizer: "Continue balanced organic fertilization with composted manure in early spring. Apply foliar calcium sprays during fruit development for quality improvement.",
    description: "Your apple tree foliage shows excellent health with no visible signs of disease, pest damage, or nutrient deficiency. Leaf color is vibrant green with proper turgor, indicating good photosynthetic activity and adequate water supply. Continue standard orchard management practices.",
    precautions: [
      "Maintain regular pruning schedules to ensure good air circulation through the canopy.",
      "Monitor trees weekly for early signs of pest or disease pressure.",
      "Apply dormant oil sprays in late winter to suppress overwintering pest eggs.",
      "Ensure adequate irrigation during dry periods, especially during fruit development."
    ],
    cure: [
      "No treatment required — your apple tree is in excellent health!",
      "Continue integrated pest management (IPM) practices for prevention.",
      "Keep orchard floor clean of fallen fruit and debris."
    ]
  },

  // ============== BLUEBERRY ==============
  "blueberry_healthy": {
    id: "blueberry_healthy",
    crop: "Blueberry",
    disease: "Healthy",
    scientificName: "No pathogen detected",
    confidence: "98.7%",
    severity: "None",
    fertilizer: "Apply ammonium sulfate or sulfur-coated urea to maintain acidic soil pH (4.5-5.5). Supplement with iron chelate if leaves show interveinal chlorosis.",
    description: "Your blueberry plant shows vigorous, healthy growth with no signs of disease or pest damage. The leaves display a healthy dark green color with no spots, discoloration, or wilting. Blueberries thrive in acidic, well-drained soils with consistent moisture.",
    precautions: [
      "Maintain soil pH between 4.5 and 5.5 using sulfur amendments as needed.",
      "Apply 4-6 inches of acidic mulch (pine bark, sawdust) around plants annually.",
      "Ensure consistent moisture with drip irrigation — blueberries are sensitive to drought.",
      "Prune old, unproductive canes during dormancy to encourage new growth."
    ],
    cure: [
      "No treatment required — your blueberry plant is in excellent condition!",
      "Continue current cultural practices and monitoring schedule.",
      "Protect ripening berries from bird damage with netting."
    ]
  },

  // ============== CHERRY ==============
  "cherry_powdery_mildew": {
    id: "cherry_powdery_mildew",
    crop: "Cherry",
    disease: "Powdery Mildew",
    scientificName: "Podosphaera clandestina",
    confidence: "92.3%",
    severity: "Medium",
    fertilizer: "Avoid excessive nitrogen fertilization which promotes susceptible new growth. Apply potassium sulfate to strengthen leaf tissue against fungal penetration.",
    description: "Cherry powdery mildew is caused by the fungus Podosphaera clandestina. It appears as white to grayish powdery patches on the upper surfaces of young leaves, shoots, and sometimes fruit. Severely infected leaves curl upward, become distorted, and may drop prematurely. On fruit, the fungus causes a russeted, netted appearance that reduces market quality.",
    precautions: [
      "Ensure proper tree spacing and pruning to maximize air circulation.",
      "Avoid overhead irrigation that raises humidity levels in the canopy.",
      "Remove and destroy water sprouts and suckers which are highly susceptible.",
      "Plant resistant cherry cultivars where available."
    ],
    cure: [
      "Apply sulfur-based fungicides or potassium bicarbonate sprays at first sign of symptoms.",
      "Use myclobutanil or trifloxystrobin fungicides on a preventative 10-14 day schedule.",
      "Spray horticultural oils (such as neem oil) to suppress existing colonies.",
      "Remove severely infected shoots and destroy them to reduce inoculum."
    ]
  },

  "cherry_healthy": {
    id: "cherry_healthy",
    crop: "Cherry",
    disease: "Healthy",
    scientificName: "No pathogen detected",
    confidence: "98.9%",
    severity: "None",
    fertilizer: "Apply a balanced 10-10-10 fertilizer in early spring before bud break. Supplement with calcium and boron for fruit quality.",
    description: "Your cherry tree leaves are in excellent health, showing no signs of fungal infection, bacterial disease, or pest damage. The foliage exhibits a healthy, glossy green color with no spots, curling, or discoloration. Continue maintaining good orchard practices.",
    precautions: [
      "Maintain an annual pruning program to promote good air flow and light penetration.",
      "Water consistently during fruit development, avoiding water stress.",
      "Apply dormant copper sprays in late winter as a preventative measure.",
      "Monitor for cherry fruit fly and spotted wing drosophila during fruiting season."
    ],
    cure: [
      "No treatment needed — your cherry tree is thriving!",
      "Continue monitoring for early signs of disease as a precaution.",
      "Harvest fruit promptly when ripe to prevent pest attraction."
    ]
  },

  // ============== CORN (MAIZE) ==============
  "corn_cercospora_leaf_spot_gray_leaf_spot": {
    id: "corn_cercospora_leaf_spot_gray_leaf_spot",
    crop: "Corn",
    disease: "Gray Leaf Spot",
    scientificName: "Cercospora zeae-maydis",
    confidence: "94.1%",
    severity: "High",
    fertilizer: "Apply balanced NPK fertilizer with emphasis on potassium to improve disease tolerance. Supplement with zinc and manganese micronutrients for metabolic support.",
    description: "Gray leaf spot is one of the most significant foliar diseases of corn worldwide, caused by the fungus Cercospora zeae-maydis. It produces rectangular, grayish-tan lesions that run parallel to leaf veins. Under severe pressure, lesions coalesce, causing large areas of leaf tissue to die. This dramatically reduces photosynthetic capacity, leading to premature plant death and significant yield losses, particularly in humid environments.",
    precautions: [
      "Plant gray leaf spot-resistant corn hybrids suited for your region.",
      "Practice crop rotation with non-host crops (soybeans, wheat) to break the disease cycle.",
      "Manage crop residue through tillage to reduce overwintering inoculum.",
      "Avoid planting corn-on-corn in fields with a history of GLS."
    ],
    cure: [
      "Apply strobilurin or triazole fungicides at VT (tasseling) to R1 (silking) growth stage.",
      "Time fungicide applications based on disease scouting — apply at first sign of lesions on ear leaf.",
      "Ensure thorough canopy penetration with proper spray equipment calibration.",
      "Incorporate deep tillage after harvest to bury infected crop residue."
    ]
  },

  "corn_common_rust": {
    id: "corn_common_rust",
    crop: "Corn",
    disease: "Common Rust",
    scientificName: "Puccinia sorghi",
    confidence: "96.2%",
    severity: "Medium",
    fertilizer: "Apply nitrogen-phosphorus-potassium (NPK) fertilizers with sulfur and zinc micronutrients to build foliar disease resistance.",
    description: "Common rust is caused by the fungus Puccinia sorghi. It is characterized by elongated golden-brown to cinnamon-brown pustules on both upper and lower leaf surfaces. These pustules eventually rupture to release powdery, orange-red spores that are easily carried by air currents, potentially infecting entire fields. Yield impacts are usually moderate unless infection occurs early.",
    precautions: [
      "Select and plant rust-resistant hybrid corn varieties suited for your local region.",
      "Plant early in the spring season to bypass peak spore dissemination periods.",
      "Manage balanced nitrogen fertilization; excess nitrogen can promote lush, susceptible leaf growth.",
      "Scout fields regularly, especially during cool, humid weather."
    ],
    cure: [
      "Apply foliar fungicides (such as strobilurins or triazoles) if symptoms appear prior to tasseling and weather is cool and damp.",
      "Till the crop residues deep into the soil after harvest to promote decay and reduce fungal wintering.",
      "Prune surrounding weeds that could act as secondary hosts for the rust spores.",
      "For severe early infections, apply mancozeb or chlorothalonil as protectant sprays."
    ]
  },

  "corn_northern_leaf_blight": {
    id: "corn_northern_leaf_blight",
    crop: "Corn",
    disease: "Northern Leaf Blight",
    scientificName: "Exserohilum turcicum",
    confidence: "95.0%",
    severity: "High",
    fertilizer: "Ensure adequate potassium fertilization to strengthen stalk integrity. Apply balanced NPK with sulfur for overall plant health.",
    description: "Northern leaf blight is a serious corn disease caused by Exserohilum turcicum. It produces long (1-6 inch), cigar-shaped, gray-green to tan lesions on leaves. Under favorable conditions (moderate temperatures, high humidity, heavy dew), lesions expand rapidly and coalesce, destroying large areas of leaf tissue. Severe infections before or during tasseling can reduce yields by 30-50%.",
    precautions: [
      "Select corn hybrids with Ht gene resistance to northern leaf blight.",
      "Rotate crops to reduce surface inoculum from infected corn residue.",
      "Reduce surface residue through tillage in fields with disease history.",
      "Avoid late planting which increases exposure to peak spore production."
    ],
    cure: [
      "Apply foliar fungicides (azoxystrobin, pyraclostrobin, or propiconazole) at first detection before or at tasseling.",
      "Scout fields at V10-V14 stage; if 50% of plants show lesions on 3+ leaves, consider fungicide application.",
      "Bury crop debris through moldboard plowing to reduce overwintering inoculum.",
      "Consider sequential fungicide applications in high-pressure years."
    ]
  },

  "corn_healthy": {
    id: "corn_healthy",
    crop: "Corn",
    disease: "Healthy",
    scientificName: "No pathogen detected",
    confidence: "99.0%",
    severity: "None",
    fertilizer: "Continue standard NPK program with side-dress nitrogen at V6-V8. Apply zinc sulfate if soil test indicates deficiency.",
    description: "Your corn plant shows excellent health with no visible symptoms of foliar disease, pest damage, or nutrient deficiency. Leaves are vibrant green, fully expanded, and turgid, indicating strong photosynthetic activity and good root function. Continue monitoring and standard agronomic practices.",
    precautions: [
      "Continue regular field scouting for early detection of pests and diseases.",
      "Maintain proper plant population and row spacing for optimal yield.",
      "Ensure adequate soil moisture, especially during the critical pollination period.",
      "Monitor for corn rootworm and European corn borer based on regional advisories."
    ],
    cure: [
      "No treatment needed — your corn crop is in excellent condition!",
      "Continue standard integrated pest management practices.",
      "Maintain current fertilization and irrigation schedule."
    ]
  },

  // ============== GRAPE ==============
  "grape_black_rot": {
    id: "grape_black_rot",
    crop: "Grape",
    disease: "Black Rot",
    scientificName: "Guignardia bidwellii",
    confidence: "92.4%",
    severity: "Medium",
    fertilizer: "Apply organic compost mulches at the root base. Feed with zinc, boron, and magnesium micronutrients to support healthy berry clusters.",
    description: "Grape black rot is a fungal disease that attacks all green parts of the grapevine, especially the fruit berries. It starts as tiny pale dots on berries which rapidly turn black, shrivel up, and transform into hard, mummified black spheres covered in spore-producing structures. Leaf symptoms appear as tan-brown lesions with dark borders.",
    precautions: [
      "Rake and bury or burn all fallen leaves and mummified grape clusters in autumn.",
      "Prune vines in winter to maximize canopy ventilation and sunlight exposure.",
      "Select planting sites with excellent drainage and full sun exposure.",
      "Remove all mummies from trellis and ground before bud break."
    ],
    cure: [
      "Apply preventative fungicides containing copper, sulfur, or myclobutanil beginning at bud break.",
      "Manually prune and destroy active shoot infections and infected clusters during the summer.",
      "Ensure vines are well trellised to keep leaves far above damp soil.",
      "Apply mancozeb or captan sprays at 10-14 day intervals from bud break through 4 weeks after bloom."
    ]
  },

  "grape_esca_black_measles": {
    id: "grape_esca_black_measles",
    crop: "Grape",
    disease: "Esca (Black Measles)",
    scientificName: "Phaeomoniella chlamydospora",
    confidence: "89.8%",
    severity: "High",
    fertilizer: "Apply balanced vine nutrition with calcium and magnesium to strengthen vascular tissue. Avoid excessive nitrogen which promotes susceptible lush growth.",
    description: "Esca, also known as black measles, is a complex fungal trunk disease of grapevines caused by a consortium of fungi including Phaeomoniella chlamydospora and Phaeoacremonium spp. It manifests as distinctive tiger-stripe patterns on leaves — interveinal chlorosis and necrosis creating a striped appearance. Berries develop dark purple-black spots ('measles'). In acute 'apoplexy' form, entire vines can collapse and die suddenly during hot weather.",
    precautions: [
      "Make pruning cuts during dry weather and protect large wounds with wound sealant.",
      "Delay pruning until late in the dormant season when wound healing is faster.",
      "Avoid mechanical damage to trunks and cordons from equipment.",
      "Plant certified, disease-free nursery stock from reputable sources."
    ],
    cure: [
      "No fully effective cure exists — management focuses on prevention and vine surgery.",
      "Perform remedial trunk surgery by cutting out infected wood and retraining healthy suckers.",
      "Apply Trichoderma-based biological control agents to fresh pruning wounds.",
      "Remove and replace severely infected, non-productive vines to protect adjacent healthy vines."
    ]
  },

  "grape_leaf_blight_isariopsis_leaf_spot": {
    id: "grape_leaf_blight_isariopsis_leaf_spot",
    crop: "Grape",
    disease: "Leaf Blight (Isariopsis Leaf Spot)",
    scientificName: "Pseudocercospora vitis",
    confidence: "91.6%",
    severity: "Medium",
    fertilizer: "Apply potassium-rich fertilizers to improve leaf resilience. Supplement with magnesium sulfate (Epsom salt) foliar sprays.",
    description: "Grape leaf blight, also known as Isariopsis leaf spot, is caused by the fungus Pseudocercospora vitis (syn. Isariopsis clavispora). It produces angular, dark brown to reddish-brown lesions on the upper leaf surface, with a distinctive dark, felt-like fungal growth on the corresponding lower surface. Severe infections cause premature defoliation, weakening the vine and reducing fruit quality.",
    precautions: [
      "Ensure proper vine spacing and canopy management for maximum air circulation.",
      "Remove and destroy infected leaves as they appear to reduce inoculum.",
      "Maintain clean vineyard floor by removing fallen debris.",
      "Avoid excessive nitrogen fertilization that promotes dense, susceptible canopy."
    ],
    cure: [
      "Apply copper-based fungicides or mancozeb at first sign of infection.",
      "Use preventative fungicide sprays during prolonged wet weather periods.",
      "Prune vines to improve air circulation and reduce humidity in the canopy.",
      "Apply biological agents like Bacillus subtilis to suppress fungal growth."
    ]
  },

  "grape_healthy": {
    id: "grape_healthy",
    crop: "Grape",
    disease: "Healthy",
    scientificName: "No pathogen detected",
    confidence: "98.5%",
    severity: "None",
    fertilizer: "Continue standard vineyard nutrition with balanced NPK. Apply foliar boron and zinc during bloom for improved fruit set.",
    description: "Your grapevine foliage is in excellent health with no signs of fungal, bacterial, or viral disease. Leaves show vibrant green color, proper expansion, and no spots, discoloration, or distortion. Continue standard vineyard management practices for optimal yield and quality.",
    precautions: [
      "Maintain annual pruning and canopy management for air circulation and light penetration.",
      "Monitor for powdery mildew, downy mildew, and black rot during the growing season.",
      "Apply dormant-season copper sprays as preventative protection.",
      "Ensure proper irrigation scheduling — grapevines prefer deep, infrequent watering."
    ],
    cure: [
      "No treatment required — your grapevine is in excellent health!",
      "Continue integrated pest management and regular scouting.",
      "Maintain good vineyard sanitation practices."
    ]
  },

  // ============== ORANGE ==============
  "orange_haunglongbing_citrus_greening": {
    id: "orange_haunglongbing_citrus_greening",
    crop: "Orange",
    disease: "Citrus Greening (Huanglongbing)",
    scientificName: "Candidatus Liberibacter asiaticus",
    confidence: "96.8%",
    severity: "High",
    fertilizer: "Apply enhanced nutritional programs with foliar micronutrients (zinc, manganese, iron, boron) to compensate for impaired root uptake. Use slow-release nitrogen and high-potassium formulations.",
    description: "Huanglongbing (HLB), also known as citrus greening, is the most devastating disease of citrus worldwide. It is caused by the bacterium Candidatus Liberibacter asiaticus, transmitted by the Asian citrus psyllid (Diaphorina citri). Symptoms include asymmetric blotchy mottling of leaves (yellow and green patches), small and lopsided fruit with aborted seeds, fruit that remains green at the stylar end, and eventual tree decline and death. There is currently no cure.",
    precautions: [
      "Implement aggressive Asian citrus psyllid (ACP) monitoring and control programs.",
      "Plant certified disease-free nursery stock from screened facilities.",
      "Remove and destroy infected trees promptly to reduce inoculum sources.",
      "Apply systemic insecticides to control psyllid vector populations."
    ],
    cure: [
      "No cure currently exists for HLB — management is focused on slowing disease progression.",
      "Enhanced nutritional programs can extend productive life of mildly infected trees by 3-5 years.",
      "Thermotherapy (heat treatment) of young infected trees shows experimental promise.",
      "Remove severely symptomatic, non-productive trees to protect remaining healthy trees."
    ]
  },

  // ============== PEACH ==============
  "peach_bacterial_spot": {
    id: "peach_bacterial_spot",
    crop: "Peach",
    disease: "Bacterial Spot",
    scientificName: "Xanthomonas arboricola pv. pruni",
    confidence: "91.0%",
    severity: "Medium",
    fertilizer: "Apply nitrogen conservatively — excess promotes susceptible new growth. Supplement with calcium and zinc for stronger leaf cuticles.",
    description: "Peach bacterial spot is caused by Xanthomonas arboricola pv. pruni. It affects leaves, fruit, and twigs. Leaf symptoms begin as small, water-soaked spots that become angular, dark, and necrotic. Severely infected leaves develop a 'shot-hole' appearance and may drop prematurely. On fruit, spots are small, brown, and slightly sunken, often with cracks that provide entry for secondary rot organisms.",
    precautions: [
      "Plant resistant peach varieties when available for your growing region.",
      "Ensure proper tree spacing and pruning for good air circulation.",
      "Avoid overhead irrigation — use drip or micro-sprinkler systems.",
      "Apply copper sprays during dormancy as preventative protection."
    ],
    cure: [
      "Apply fixed copper bactericides at leaf fall and again at bud swell — timing is critical.",
      "Oxytetracycline (Mycoshield) sprays can provide some suppression during the growing season.",
      "Remove heavily infected branches and twigs during dry weather.",
      "Improve tree nutrition to help plants outgrow moderate infections."
    ]
  },

  "peach_healthy": {
    id: "peach_healthy",
    crop: "Peach",
    disease: "Healthy",
    scientificName: "No pathogen detected",
    confidence: "98.4%",
    severity: "None",
    fertilizer: "Apply balanced fertilizer (10-10-10) in early spring. Supplement with calcium for fruit firmness and potassium for flavor development.",
    description: "Your peach tree shows excellent leaf health with no signs of bacterial spot, leaf curl, brown rot, or pest damage. The foliage is vibrant green, well-formed, and free of lesions or discoloration. Continue standard orchard management for optimal fruit production.",
    precautions: [
      "Apply dormant copper sprays before bud swell to prevent peach leaf curl.",
      "Thin fruit appropriately to prevent brown rot pressure from fruit-to-fruit contact.",
      "Monitor for oriental fruit moth and peach tree borer in your region.",
      "Maintain good sanitation by removing fallen fruit and mummified fruit from trees."
    ],
    cure: [
      "No treatment needed — your peach tree is in excellent health!",
      "Continue preventative spray programs and orchard sanitation.",
      "Harvest fruit at proper maturity for best quality and storage life."
    ]
  },

  // ============== PEPPER ==============
  "pepper_bacterial_spot": {
    id: "pepper_bacterial_spot",
    crop: "Pepper",
    disease: "Bacterial Spot",
    scientificName: "Xanthomonas campestris pv. vesicatoria",
    confidence: "93.5%",
    severity: "Medium",
    fertilizer: "Apply balanced fertilization avoiding excess nitrogen. Supplement with calcium to reduce fruit susceptibility and strengthen cell walls.",
    description: "Pepper bacterial spot is caused by multiple Xanthomonas species. It creates small, dark, raised, water-soaked lesions on leaves that become necrotic and may coalesce. On fruit, spots are raised, scab-like, and rough-textured, reducing marketability. The disease spreads rapidly during warm, rainy weather through splashing water and contaminated seed.",
    precautions: [
      "Use certified disease-free or hot-water treated seed.",
      "Practice crop rotation — avoid planting peppers or tomatoes in the same field for 2-3 years.",
      "Avoid working in fields when foliage is wet to prevent bacterial spread.",
      "Use drip irrigation instead of overhead sprinklers."
    ],
    cure: [
      "Apply fixed copper bactericides combined with mancozeb for improved efficacy.",
      "Remove and destroy heavily infected plants to prevent epidemic spread.",
      "Apply Bacillus-based biological products as part of an integrated spray program.",
      "Avoid handling plants during wet conditions to limit pathogen dispersal."
    ]
  },

  "pepper_healthy": {
    id: "pepper_healthy",
    crop: "Pepper",
    disease: "Healthy",
    scientificName: "No pathogen detected",
    confidence: "98.6%",
    severity: "None",
    fertilizer: "Continue standard pepper fertilization with calcium-rich amendments. Side-dress with nitrogen at first fruit set.",
    description: "Your pepper plant foliage is in excellent condition showing no signs of bacterial spot, viral mosaic, anthracnose, or pest damage. Leaves are dark green, firm, and well-formed, indicating good nutrient uptake and overall plant vigor.",
    precautions: [
      "Maintain consistent watering to prevent blossom end rot caused by calcium deficiency.",
      "Support heavy-bearing plants with stakes or cages to prevent stem breakage.",
      "Monitor for aphids and whiteflies which can transmit viral diseases.",
      "Apply mulch to maintain even soil moisture and suppress weeds."
    ],
    cure: [
      "No treatment needed — your pepper plant is in excellent health!",
      "Continue current management practices and regular monitoring.",
      "Harvest peppers at desired maturity stage for best flavor."
    ]
  },

  // ============== POTATO ==============
  "potato_early_blight": {
    id: "potato_early_blight",
    crop: "Potato",
    disease: "Early Blight",
    scientificName: "Alternaria solani",
    confidence: "93.7%",
    severity: "Medium",
    fertilizer: "Apply balanced fertilization with emphasis on potassium and calcium. Avoid nitrogen deficiency which accelerates symptom development on older leaves.",
    description: "Potato early blight, caused by Alternaria solani, is one of the most common foliar diseases of potato. It initially appears on older, lower leaves as small brown-black spots that enlarge to form characteristic concentric 'target-like' ring patterns. Lesions are typically surrounded by a yellow halo. Severe defoliation reduces tuber size and yield.",
    precautions: [
      "Practice crop rotation with non-solanaceous crops for at least 2-3 years.",
      "Use certified disease-free seed potatoes.",
      "Maintain adequate fertility — nutrient-stressed plants are more susceptible.",
      "Apply mulch to prevent soil splash of spores onto lower leaves."
    ],
    cure: [
      "Apply chlorothalonil or mancozeb fungicides on a 7-10 day schedule starting at row closure.",
      "Remove and destroy severely infected lower leaves to slow upward disease progression.",
      "Apply azoxystrobin or boscalid for curative activity on established infections.",
      "Maintain vine health as long as possible to maximize tuber bulking."
    ]
  },

  "potato_late_blight": {
    id: "potato_late_blight",
    crop: "Potato",
    disease: "Late Blight",
    scientificName: "Phytophthora infestans",
    confidence: "98.1%",
    severity: "High",
    fertilizer: "Use phosphite-based liquid nutrients to stimulate the plant's natural immune defense system. Avoid high nitrogen which triggers dense foliage growth.",
    description: "Late blight is a devastating oomycete pathogen (Phytophthora infestans) that was historically responsible for the Irish Potato Famine. It presents as dark, water-soaked lesions on leaves and stems, often with a white mildew-like growth on the undersides during humid conditions. It can rot the entire tuber crop and destroy fields within days under favorable conditions.",
    precautions: [
      "Always use certified pathogen-free potato tubers for seed planting.",
      "Monitor weather forecasts closely; cool, wet, and humid conditions trigger rapid blight outbreaks.",
      "Destroy volunteer potato plants and nightshade weeds near fields which act as reservoirs.",
      "Allow potato vines to fully dry and die off (or apply vine-kill treatments) 2 weeks before harvesting tubers."
    ],
    cure: [
      "Immediately pull up, bag, and destroy all infested plants. Do NOT compost blight-infected plants.",
      "Apply protective systemic fungicides (such as mancozeb, chlorothalonil, or metalaxyl-M) in high-risk weather windows.",
      "Store harvested tubers in a cool, dry, well-ventilated warehouse, immediately discarding any soft-rotted potatoes.",
      "Use a combination of protectant and systemic fungicides on alternating schedules."
    ]
  },

  "potato_healthy": {
    id: "potato_healthy",
    crop: "Potato",
    disease: "Healthy",
    scientificName: "No pathogen detected",
    confidence: "99.2%",
    severity: "None",
    fertilizer: "Continue balanced NPK fertilization with emphasis on potassium for tuber quality. Side-dress nitrogen at hilling stage.",
    description: "Your potato plant foliage shows excellent health with no visible symptoms of early blight, late blight, or other diseases. Leaves are vibrant green, well-expanded, and free of lesions, indicating strong vegetative growth and good tuber development potential.",
    precautions: [
      "Continue regular scouting for late blight, especially during cool, wet weather.",
      "Hill soil around plants to protect developing tubers from greening and disease exposure.",
      "Monitor for Colorado potato beetle and aphid populations.",
      "Ensure adequate but not excessive irrigation during tuber bulking."
    ],
    cure: [
      "No treatment needed — your potato crop is in excellent condition!",
      "Continue preventative fungicide programs during high-risk weather.",
      "Harvest at proper maturity and allow tuber skins to set before storage."
    ]
  },

  // ============== RASPBERRY ==============
  "raspberry_healthy": {
    id: "raspberry_healthy",
    crop: "Raspberry",
    disease: "Healthy",
    scientificName: "No pathogen detected",
    confidence: "98.3%",
    severity: "None",
    fertilizer: "Apply 10-10-10 balanced fertilizer in early spring. Top-dress with compost annually and maintain slightly acidic soil pH (6.0-6.5).",
    description: "Your raspberry plant is in excellent health showing no signs of cane blight, anthracnose, spur blight, or viral diseases. Canes are vigorous, leaves are bright green, and growth habit indicates good root establishment and nutrient availability.",
    precautions: [
      "Remove spent floricanes promptly after harvest to improve air circulation.",
      "Maintain narrow hedgerow width (12-18 inches) for optimal light and air penetration.",
      "Provide trellis support for primocanes to prevent wind damage.",
      "Monitor for spotted wing drosophila during fruit ripening."
    ],
    cure: [
      "No treatment needed — your raspberry plant is thriving!",
      "Continue standard pruning and sanitation practices.",
      "Harvest fruit frequently when ripe to maintain quality."
    ]
  },

  // ============== SOYBEAN ==============
  "soybean_healthy": {
    id: "soybean_healthy",
    crop: "Soybean",
    disease: "Healthy",
    scientificName: "No pathogen detected",
    confidence: "98.8%",
    severity: "None",
    fertilizer: "Inoculate seed with Bradyrhizobium japonicum if planting in a new field. Apply phosphorus and potassium based on soil test recommendations.",
    description: "Your soybean plant shows vigorous, healthy growth with no signs of foliar disease, pest damage, or nutrient deficiency. Leaves exhibit a healthy green color with proper trifoliate formation. Nodulation appears healthy, indicating effective nitrogen fixation.",
    precautions: [
      "Scout regularly for soybean rust, sudden death syndrome, and white mold.",
      "Ensure proper inoculation for fields without recent soybean history.",
      "Maintain proper row spacing and seeding rate for optimal canopy development.",
      "Monitor for soybean aphid and bean leaf beetle populations."
    ],
    cure: [
      "No treatment needed — your soybean crop is in excellent condition!",
      "Continue standard integrated pest management practices.",
      "Harvest at 13% moisture content for optimal storage quality."
    ]
  },

  // ============== SQUASH ==============
  "squash_powdery_mildew": {
    id: "squash_powdery_mildew",
    crop: "Squash",
    disease: "Powdery Mildew",
    scientificName: "Podosphaera xanthii",
    confidence: "94.5%",
    severity: "Medium",
    fertilizer: "Apply silicon-based supplements to strengthen leaf surfaces against fungal colonization. Maintain balanced NPK with emphasis on potassium.",
    description: "Squash powdery mildew is caused primarily by Podosphaera xanthii. It appears as white to grayish-white powdery colonies on the upper and lower surfaces of leaves, petioles, and stems. Older leaves are typically infected first. Severely infected leaves turn yellow, become brittle, and senesce prematurely, reducing fruit yield and quality through reduced photosynthesis and premature vine decline.",
    precautions: [
      "Plant powdery mildew-resistant squash varieties when available.",
      "Ensure proper plant spacing for maximum air circulation.",
      "Avoid excessive nitrogen fertilization which promotes dense, susceptible foliage.",
      "Water at the base of plants; avoid wetting foliage unnecessarily."
    ],
    cure: [
      "Apply potassium bicarbonate or sulfur sprays at first sign of white powdery spots.",
      "Spray neem oil or horticultural oils to suppress existing fungal colonies.",
      "Apply myclobutanil or chlorothalonil on a 7-14 day schedule for persistent infections.",
      "Remove and destroy the most severely infected leaves to reduce sporulation."
    ]
  },

  // ============== STRAWBERRY ==============
  "strawberry_leaf_scorch": {
    id: "strawberry_leaf_scorch",
    crop: "Strawberry",
    disease: "Leaf Scorch",
    scientificName: "Diplocarpon earlianum",
    confidence: "92.1%",
    severity: "Medium",
    fertilizer: "Apply balanced fertilizer with adequate potassium for stress tolerance. Avoid excessive nitrogen which promotes dense, susceptible foliage.",
    description: "Strawberry leaf scorch is caused by the fungus Diplocarpon earlianum. It produces numerous small, irregular, dark purple spots on the upper leaf surface. Unlike leaf spot, scorch lesions lack a defined tan center — instead, the purple areas coalesce and the tissue between spots turns reddish-purple to brown, giving a 'scorched' appearance. Severely infected leaves curl upward, dry out, and die.",
    precautions: [
      "Plant certified disease-free transplants from reputable nurseries.",
      "Renovate strawberry beds after harvest by mowing, thinning, and removing old leaves.",
      "Ensure proper plant spacing for air circulation and rapid leaf drying.",
      "Apply mulch to prevent soil splash onto lower leaves."
    ],
    cure: [
      "Apply copper-based fungicides or captan at 10-14 day intervals during wet periods.",
      "Remove and destroy heavily infected leaves and plants.",
      "Apply myclobutanil or thiophanate-methyl for curative activity.",
      "Consider bed renovation or replanting with resistant varieties if disease persists."
    ]
  },

  "strawberry_healthy": {
    id: "strawberry_healthy",
    crop: "Strawberry",
    disease: "Healthy",
    scientificName: "No pathogen detected",
    confidence: "98.9%",
    severity: "None",
    fertilizer: "Apply balanced strawberry fertilizer (10-10-10) at renovation. Top-dress with compost and maintain soil pH 6.0-6.5.",
    description: "Your strawberry plant is in excellent health with no signs of leaf scorch, leaf spot, powdery mildew, or gray mold. Leaves are bright green, trifoliate, and well-formed, indicating proper nutrition and growing conditions.",
    precautions: [
      "Maintain straw or plastic mulch to prevent fruit contact with soil.",
      "Remove runners as needed to maintain proper plant spacing.",
      "Monitor for spider mites, aphids, and spotted wing drosophila.",
      "Renovate beds annually after harvest for continued productivity."
    ],
    cure: [
      "No treatment needed — your strawberry plants are thriving!",
      "Continue standard cultural practices and pest monitoring.",
      "Harvest fruit at full color for best flavor and quality."
    ]
  },

  // ============== TOMATO ==============
  "tomato_bacterial_spot": {
    id: "tomato_bacterial_spot",
    crop: "Tomato",
    disease: "Bacterial Spot",
    scientificName: "Xanthomonas vesicatoria",
    confidence: "93.0%",
    severity: "Medium",
    fertilizer: "Apply calcium-rich fertilizers to reduce fruit susceptibility. Maintain balanced nutrition without excess nitrogen.",
    description: "Tomato bacterial spot is caused by several Xanthomonas species. It produces small, dark, water-soaked, greasy-looking spots on leaves, stems, and fruit. Leaf spots may develop yellow halos and can coalesce, causing extensive defoliation. On fruit, spots are raised, scab-like, and slightly rough, significantly reducing marketability. The disease spreads rapidly during warm, rainy weather.",
    precautions: [
      "Use certified disease-free or hot-water treated seed.",
      "Practice crop rotation — avoid planting tomatoes or peppers in the same field for 2+ years.",
      "Avoid working in fields when plants are wet from rain or dew.",
      "Use drip irrigation to keep foliage dry; avoid overhead sprinklers."
    ],
    cure: [
      "Apply copper hydroxide combined with mancozeb for improved efficacy.",
      "Apply bacteriophage-based biological products where available.",
      "Remove and destroy severely infected plants to reduce inoculum.",
      "Improve air circulation through proper staking, pruning, and spacing."
    ]
  },

  "tomato_early_blight": {
    id: "tomato_early_blight",
    crop: "Tomato",
    disease: "Early Blight",
    scientificName: "Alternaria solani",
    confidence: "94.8%",
    severity: "Medium",
    fertilizer: "Apply a high-potassium foliar spray to strengthen leaf cell walls. Feed with balanced tomato fertilizers rich in calcium to prevent physiological cracking.",
    description: "Early blight is caused by the fungus Alternaria solani. It is a common foliage disease of tomatoes that initially appears as small, brown-to-black spots on older leaves, which enlarge and form concentric 'target-like' rings. Over time, it leads to leaf yellowing, premature defoliation, and decreased yields.",
    precautions: [
      "Practice crop rotation (avoid planting tomatoes, potatoes, or eggplants in the same soil for 3 years).",
      "Ensure proper spacing between tomato crops to maximize air circulation and sunlight penetration.",
      "Water crops at the base or use drip irrigation to prevent leaves from remaining wet.",
      "Apply organic mulch around the plant base to prevent fungal spores in the soil from splashing onto lower leaves."
    ],
    cure: [
      "Prune and safely destroy infected lower leaves immediately to stop upward spread.",
      "Apply organic copper-based fungicides or sulfur sprays early in the morning when the disease is first spotted.",
      "In corporate gardens, apply bio-fungicides containing Bacillus amyloliquefaciens to boost plant immunity.",
      "Thoroughly clean up and burn crop debris at the end of the harvest season."
    ]
  },

  "tomato_late_blight": {
    id: "tomato_late_blight",
    crop: "Tomato",
    disease: "Late Blight",
    scientificName: "Phytophthora infestans",
    confidence: "97.5%",
    severity: "High",
    fertilizer: "Apply phosphite-based foliar nutrients to activate plant defense pathways. Maintain adequate but not excessive nitrogen levels.",
    description: "Tomato late blight, caused by the oomycete Phytophthora infestans, is one of the most destructive diseases of tomato. It produces large, irregular, water-soaked, dark green to brown lesions on leaves and stems. Under humid conditions, white fuzzy sporangia appear on the underside of lesions. The disease can destroy an entire field within days and also infects fruit, causing firm, brown, greasy-looking rot.",
    precautions: [
      "Monitor weather forecasts — late blight thrives in cool (60-70°F), wet conditions.",
      "Destroy volunteer tomato and potato plants that can harbor the pathogen.",
      "Ensure good air circulation through proper staking, pruning, and spacing.",
      "Apply preventative fungicides before disease onset during high-risk weather."
    ],
    cure: [
      "Immediately remove and destroy infected plants — do NOT compost them.",
      "Apply chlorothalonil, mancozeb, or copper-based fungicides on a 5-7 day schedule during outbreaks.",
      "Use systemic fungicides (dimethomorph, mandipropamid) for curative activity.",
      "Alert neighboring growers — late blight spores can travel miles on wind currents."
    ]
  },

  "tomato_leaf_mold": {
    id: "tomato_leaf_mold",
    crop: "Tomato",
    disease: "Leaf Mold",
    scientificName: "Passalora fulva",
    confidence: "88.5%",
    severity: "Low",
    fertilizer: "Apply a calcium-rich foliar feed to optimize transpiration. Use organic compost tea to feed the root zone and suppress fungal spores.",
    description: "Tomato leaf mold is a fungal disease that primarily thrives in humid greenhouse environments. It presents as pale green or yellowish spots on the upper leaf surfaces, with an olive-green to purple velvety mold layer developing on the corresponding lower surfaces. Left unchecked, leaves wither and drop off.",
    precautions: [
      "Reduce humidity levels in greenhouses below 85% through proper fans and venting.",
      "Prune lower foliage to optimize air flow through the plant canopy.",
      "Grow leaf-mold resistant tomato cultivars (e.g., cherry tomatoes or specific greenhouse hybrids).",
      "Avoid overhead watering; irrigate early in the day so foliage dries quickly."
    ],
    cure: [
      "Spray crops with natural horticultural oils or neem oil to suppress fungal respiration.",
      "Apply preventative fungicides containing chlorothalonil or copper soap upon the first sign of symptoms.",
      "Sanitize the greenhouse structure, trellises, and tools with a diluted bleach solution between planting cycles."
    ]
  },

  "tomato_septoria_leaf_spot": {
    id: "tomato_septoria_leaf_spot",
    crop: "Tomato",
    disease: "Septoria Leaf Spot",
    scientificName: "Septoria lycopersici",
    confidence: "93.8%",
    severity: "Medium",
    fertilizer: "Maintain balanced NPK nutrition with supplemental calcium and magnesium. Avoid nitrogen deficiency which accelerates lower leaf senescence.",
    description: "Septoria leaf spot is caused by the fungus Septoria lycopersici and is one of the most common tomato diseases. It produces numerous small (1/16 to 1/4 inch), circular spots with dark brown margins and grayish-white centers containing tiny black pycnidia (fruiting bodies). The disease starts on lower leaves and progresses upward, causing extensive defoliation that exposes fruit to sunscald and reduces yields.",
    precautions: [
      "Rotate crops — avoid growing tomatoes, potatoes, or eggplants in the same location for 3 years.",
      "Apply organic mulch to prevent soil splash of spores onto lower leaves.",
      "Stake or cage plants to keep foliage off the ground.",
      "Remove and destroy crop debris at season end to reduce overwintering inoculum."
    ],
    cure: [
      "Apply chlorothalonil, mancozeb, or copper fungicides on a 7-10 day schedule.",
      "Remove infected lower leaves as soon as spots appear to slow disease progression.",
      "Apply biological control agents (Bacillus subtilis) as part of an integrated program.",
      "Ensure good air circulation through proper plant spacing and pruning."
    ]
  },

  "tomato_spider_mites": {
    id: "tomato_spider_mites",
    crop: "Tomato",
    disease: "Spider Mites (Two-spotted)",
    scientificName: "Tetranychus urticae",
    confidence: "91.4%",
    severity: "Medium",
    fertilizer: "Maintain balanced plant nutrition — stressed plants are more attractive to mites. Avoid excessive nitrogen which produces tender, mite-preferred foliage.",
    description: "Two-spotted spider mites (Tetranychus urticae) are tiny arachnid pests that feed on tomato leaves by piercing cells and extracting chlorophyll. Damage appears as fine stippling (tiny yellow-white dots) on the upper leaf surface. Under heavy infestation, leaves become bronzed, dry, and covered with fine silk webbing. Mites thrive in hot, dry, dusty conditions and can reproduce rapidly, with populations doubling every few days.",
    precautions: [
      "Maintain adequate irrigation — water-stressed plants are more susceptible to mite outbreaks.",
      "Avoid dusty conditions near plantings; overhead sprinkle irrigation paths to settle dust.",
      "Preserve natural predators (predatory mites, lacewings, ladybugs) by minimizing broad-spectrum insecticides.",
      "Scout regularly by examining leaf undersides with a hand lens."
    ],
    cure: [
      "Spray plants forcefully with water to physically dislodge mites from leaf undersides.",
      "Apply horticultural oil or insecticidal soap to suffocate mites — ensure thorough coverage of leaf undersides.",
      "Release predatory mites (Phytoseiulus persimilis) for biological control in greenhouses.",
      "For severe infestations, apply miticide (abamectin, spiromesifen) with proper rotation to prevent resistance."
    ]
  },

  "tomato_target_spot": {
    id: "tomato_target_spot",
    crop: "Tomato",
    disease: "Target Spot",
    scientificName: "Corynespora cassiicola",
    confidence: "90.7%",
    severity: "Medium",
    fertilizer: "Apply balanced fertilization with potassium emphasis for disease resistance. Supplement with calcium for fruit quality.",
    description: "Tomato target spot, caused by the fungus Corynespora cassiicola, produces brown, circular lesions with distinctive concentric rings (target-like pattern) on leaves, stems, and fruit. Lesions start small on lower leaves and expand to 1-2 cm in diameter. Under wet conditions, the disease can cause significant defoliation and fruit lesions, reducing yield and marketability.",
    precautions: [
      "Prune lower leaves to improve air circulation and reduce humidity near the soil.",
      "Avoid overhead irrigation; use drip systems to keep foliage dry.",
      "Practice crop rotation with non-solanaceous crops.",
      "Stake or trellis plants to keep foliage upright and improve air flow."
    ],
    cure: [
      "Apply chlorothalonil or mancozeb fungicides on a 7-10 day schedule.",
      "Use strobilurin fungicides (azoxystrobin) for curative and preventative activity.",
      "Remove and destroy heavily infected lower leaves to reduce sporulation.",
      "Apply biological control agents as part of an integrated disease management program."
    ]
  },

  "tomato_yellow_leaf_curl_virus": {
    id: "tomato_yellow_leaf_curl_virus",
    crop: "Tomato",
    disease: "Yellow Leaf Curl Virus",
    scientificName: "Tomato yellow leaf curl virus (TYLCV)",
    confidence: "96.3%",
    severity: "High",
    fertilizer: "Maintain optimal nutrition to support plant vigor during infection. Apply micronutrients (iron, zinc, manganese) to compensate for reduced root efficiency.",
    description: "Tomato yellow leaf curl virus (TYLCV) is a devastating geminivirus transmitted by the silverleaf whitefly (Bemisia tabaci). Infected plants show severe stunting, upward curling and yellowing of leaf margins, reduced leaf size, and flower drop. Plants infected early may produce no marketable fruit. The virus cannot be cured once a plant is infected.",
    precautions: [
      "Use TYLCV-resistant tomato varieties — this is the most effective control measure.",
      "Implement whitefly management with reflective mulches, yellow sticky traps, and insect netting.",
      "Apply systemic insecticides (imidacloprid, thiamethoxam) as transplant treatments to protect young plants.",
      "Remove and destroy TYLCV-infected plants immediately to reduce virus source."
    ],
    cure: [
      "No cure exists for TYLCV — focus on vector control and resistant varieties.",
      "Remove and destroy infected plants promptly — do NOT leave them as virus sources.",
      "Control whitefly populations aggressively with rotating insecticide classes.",
      "Use fine mesh insect exclusion screens in greenhouse production."
    ]
  },

  "tomato_mosaic_virus": {
    id: "tomato_mosaic_virus",
    crop: "Tomato",
    disease: "Mosaic Virus",
    scientificName: "Tomato mosaic virus (ToMV)",
    confidence: "95.2%",
    severity: "High",
    fertilizer: "Maintain balanced nutrition to support affected plants. Apply foliar micronutrients to compensate for reduced nutrient uptake efficiency.",
    description: "Tomato mosaic virus (ToMV) is a highly stable and persistent tobamovirus. It causes a characteristic light and dark green mosaic pattern on leaves, leaf distortion, and sometimes fernleaf (extremely narrow, distorted leaves). Fruit may show internal browning or uneven ripening. The virus is extremely stable, surviving on tools, hands, and plant debris for months. It is primarily spread mechanically through contaminated hands, tools, and seed.",
    precautions: [
      "Plant ToMV-resistant tomato varieties (carrying the Tm-2 or Tm-2² genes).",
      "Wash hands thoroughly with soap and water before handling plants.",
      "Disinfect all tools, stakes, and equipment with 10% trisodium phosphate or 20% skim milk solution.",
      "Use certified virus-free seed and transplants."
    ],
    cure: [
      "No cure exists — remove and destroy infected plants immediately.",
      "Prevent spread by washing hands between handling different plants.",
      "Disinfect greenhouse structures and equipment between crops.",
      "Do NOT save seed from infected plants; the virus is seed-transmissible."
    ]
  },

  "tomato_healthy": {
    id: "tomato_healthy",
    crop: "Tomato",
    disease: "Healthy",
    scientificName: "No pathogen detected",
    confidence: "99.3%",
    severity: "None",
    fertilizer: "Continue balanced tomato fertilization (5-10-10 or similar) with calcium supplementation to prevent blossom end rot.",
    description: "Your tomato plant is in excellent health with no visible symptoms of any fungal, bacterial, or viral disease. Leaves are deep green, well-formed, and show strong turgidity. Flowers and developing fruit appear normal, indicating good pollination and healthy fruit set.",
    precautions: [
      "Continue regular scouting for early blight, late blight, and pest activity.",
      "Maintain consistent watering to prevent stress-related disorders like blossom end rot.",
      "Prune suckers and lower leaves to improve air circulation.",
      "Apply preventative fungicides during prolonged wet weather as insurance."
    ],
    cure: [
      "No treatment needed — your tomato plant is in excellent health!",
      "Continue standard integrated pest management practices.",
      "Harvest fruit at proper maturity for best flavor and shelf life."
    ]
  },

  // ============== GENERIC FALLBACK ==============
  "healthy_crop": {
    id: "healthy_crop",
    crop: "General",
    disease: "Healthy Crop",
    scientificName: "No pathogen detected",
    confidence: "99.4%",
    severity: "None",
    fertilizer: "No corrective fertilizers are required. Continue standard organic compost applications and micro-nutrient feeding program.",
    description: "The AI analysis indicates your crop leaf is in excellent condition with no visible symptoms of fungal, bacterial, or viral disease! The cellular structure looks strong, chlorophyll distribution is optimal, and the foliage shows robust health.",
    precautions: [
      "Maintain your current balanced watering schedule. Avoid waterlogging the roots.",
      "Conduct regular scouting sweeps of your fields or greenhouse twice a week to inspect leaf undersides.",
      "Keep standard organic fertilization plans to ensure stable nutrient availability.",
      "Rotate crops annually to prevent soil-borne disease buildup."
    ],
    cure: [
      "No chemical or therapeutic cures are required. Keep up the fantastic farming!",
      "Ensure tool cleanliness between pruning different crop patches to keep infections from spreading.",
      "Continue monitoring and preventative practices for long-term crop protection."
    ]
  }
};
