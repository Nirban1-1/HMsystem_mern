// seed/test.js
// Run with: node seed/test.js  (after setting MONGO_URI in env)

import mongoose from "mongoose";
import dotenv from "dotenv";
import Test from "../models/Test.js";

dotenv.config();

const testNames = [
  // Hematology
  "Complete Blood Count (CBC)",
  "Hemoglobin",
  "Hematocrit",
  "Red Blood Cell Count (RBC)",
  "White Blood Cell Count (WBC)",
  "Platelet Count",
  "Differential Leukocyte Count (DLC)",
  "Erythrocyte Sedimentation Rate (ESR)",
  "Peripheral Blood Smear",
  "Reticulocyte Count",
  "Coagulation Profile",
  "Prothrombin Time (PT)",
  "International Normalized Ratio (INR)",
  "Activated Partial Thromboplastin Time (aPTT)",
  "Bleeding Time",
  "Clotting Time",
  "D-Dimer",
  "Fibrinogen Level",
  "Factor VIII Assay",
  "Factor IX Assay",

  // Biochemistry – metabolic & organ function
  "Random Blood Sugar (RBS)",
  "Fasting Blood Sugar (FBS)",
  "Postprandial Blood Sugar (PPBS)",
  "Oral Glucose Tolerance Test (OGTT)",
  "Glycated Hemoglobin (HbA1c)",
  "Urea",
  "Creatinine",
  "Blood Urea Nitrogen (BUN)",
  "Estimated Glomerular Filtration Rate (eGFR)",
  "Serum Electrolytes (Na, K, Cl)",
  "Serum Sodium",
  "Serum Potassium",
  "Serum Chloride",
  "Serum Bicarbonate",
  "Calcium Total",
  "Ionized Calcium",
  "Serum Phosphorus",
  "Serum Magnesium",
  "Liver Function Test (LFT)",
  "Serum Bilirubin Total",
  "Serum Bilirubin Direct",
  "Serum Bilirubin Indirect",
  "Serum Alanine Aminotransferase (ALT/SGPT)",
  "Serum Aspartate Aminotransferase (AST/SGOT)",
  "Alkaline Phosphatase (ALP)",
  "Gamma-Glutamyl Transferase (GGT)",
  "Serum Total Protein",
  "Serum Albumin",
  "Serum Globulin",
  "Albumin/Globulin Ratio",
  "Lipid Profile",
  "Total Cholesterol",
  "High-Density Lipoprotein (HDL)",
  "Low-Density Lipoprotein (LDL)",
  "Triglycerides",
  "Very Low-Density Lipoprotein (VLDL)",
  "Non-HDL Cholesterol",
  "Cardiac Enzymes Panel",
  "Creatine Kinase-MB (CK-MB)",
  "Creatine Kinase Total (CK)",
  "Troponin I",
  "Troponin T",
  "Lactate Dehydrogenase (LDH)",
  "Serum Amylase",
  "Serum Lipase",
  "Serum Uric Acid",
  "Serum Lactate",
  "Serum Iron",
  "Total Iron Binding Capacity (TIBC)",
  "Transferrin Saturation",
  "Serum Ferritin",

  // Endocrinology & hormones
  "Thyroid Profile (T3, T4, TSH)",
  "Thyroid Stimulating Hormone (TSH)",
  "Free T3",
  "Free T4",
  "Anti-Thyroid Peroxidase Antibody (Anti-TPO)",
  "Anti-Thyroglobulin Antibody",
  "Serum Cortisol (Morning)",
  "Serum Cortisol (Evening)",
  "Adrenocorticotropic Hormone (ACTH)",
  "Serum Prolactin",
  "Follicle Stimulating Hormone (FSH)",
  "Luteinizing Hormone (LH)",
  "Estradiol (E2)",
  "Progesterone",
  "Total Testosterone",
  "Free Testosterone",
  "Sex Hormone Binding Globulin (SHBG)",
  "Parathyroid Hormone (PTH)",
  "Vitamin B12",
  "25-OH Vitamin D",

  // Infection markers & serology
  "C-Reactive Protein (CRP)",
  "High Sensitivity CRP (hs-CRP)",
  "Procalcitonin",
  "Erythrocyte Sedimentation Rate (ESR) - Infection Marker",
  "Widal Test",
  "Dengue NS1 Antigen",
  "Dengue IgM Antibody",
  "Dengue IgG Antibody",
  "Malaria Parasite Smear",
  "Rapid Malaria Antigen Test",
  "Typhoid IgM Antibody",
  "Hepatitis B Surface Antigen (HBsAg)",
  "Hepatitis B Surface Antibody (Anti-HBs)",
  "Hepatitis C Virus Antibody (Anti-HCV)",
  "Hepatitis A IgM Antibody",
  "Hepatitis E IgM Antibody",
  "HIV 1 and 2 Antibody",
  "HIV ELISA",
  "VDRL (Syphilis Screening)",
  "TPHA (Treponema pallidum Hemagglutination)",
  "H. Pylori Antibody",
  "H. Pylori Antigen Stool Test",
  "COVID-19 RT-PCR",
  "COVID-19 Rapid Antigen Test",
  "COVID-19 IgG Antibody",
  "Blood Culture and Sensitivity",
  "Urine Culture and Sensitivity",
  "Sputum Culture and Sensitivity",
  "Throat Swab Culture",

  // Immunology & auto-immune
  "Antinuclear Antibody (ANA) Profile",
  "Rheumatoid Factor (RF)",
  "Anti-Cyclic Citrullinated Peptide (Anti-CCP)",
  "Anti-dsDNA Antibody",
  "Complement C3",
  "Complement C4",
  "Anti-Phospholipid Antibody",
  "Anti-Smooth Muscle Antibody",
  "Anti-Mitochondrial Antibody",
  "Total Immunoglobulin E (IgE)",
  "Serum Immunoglobulin G (IgG)",
  "Serum Immunoglobulin A (IgA)",
  "Serum Immunoglobulin M (IgM)",

  // Tumor markers
  "Alpha-Fetoprotein (AFP)",
  "Carcinoembryonic Antigen (CEA)",
  "Cancer Antigen 125 (CA-125)",
  "Cancer Antigen 15-3 (CA 15-3)",
  "Cancer Antigen 19-9 (CA 19-9)",
  "Prostate Specific Antigen (PSA) Total",
  "Free PSA",
  "Beta-hCG (Tumor Marker)",
  "Neuron Specific Enolase (NSE)",
  "Lactate Dehydrogenase (LDH) - Tumor Marker",

  // Urine tests
  "Urine Routine and Microscopy",
  "Urine Complete Examination",
  "Urine Culture",
  "24-Hour Urine Protein",
  "24-Hour Urine Creatinine",
  "Urine Microalbumin",
  "Urine Pregnancy Test (UPT)",
  "Urine Bence Jones Protein",
  "Urine Sugar",
  "Urine Ketone Bodies",
  "Urine pH",
  "Urine Specific Gravity",

  // Stool tests
  "Stool Routine and Microscopy",
  "Stool Occult Blood",
  "Stool Culture",
  "Stool for Ova and Cysts",
  "Stool Reducing Substances",
  "Stool Calprotectin",

  // Arterial and blood gases
  "Arterial Blood Gas (ABG)",
  "Venous Blood Gas (VBG)",
  "Carboxyhemoglobin Level",
  "Methemoglobin Level",

  // Microbiology – smears & PCR
  "Sputum for Acid Fast Bacilli (AFB) Smear",
  "GeneXpert MTB/RIF (TB PCR)",
  "Throat Swab for Streptococcus",
  "Gram Stain",
  "KOH Mount (Fungal Microscopy)",
  "Fungal Culture",

  // Pregnancy & fertility
  "Serum Beta-hCG Quantitative",
  "Serum Beta-hCG Qualitative",
  "Progesterone (Day 21)",
  "Anti-Mullerian Hormone (AMH)",
  "Semen Analysis",
  "Serum Prolactin - Fertility",

  // Cardiology & risk markers
  "Lipid Profile - Cardiac Risk",
  "Apolipoprotein A1",
  "Apolipoprotein B",
  "Lipoprotein(a)",
  "High Sensitivity CRP - Cardiac",
  "Homocysteine Level",
  "NT-proBNP",
  "BNP (B-type Natriuretic Peptide)",

  // Diabetes & metabolic syndrome profiles
  "Diabetes Screening Panel",
  "Insulin Fasting",
  "Insulin Postprandial",
  "C-Peptide",
  "Microalbuminuria Test",
  "Metabolic Syndrome Panel",

  // Vitamin and mineral panel
  "Vitamin B12 Level",
  "25-OH Vitamin D Level",
  "Serum Folate",
  "Serum Zinc",
  "Serum Copper",
  "Serum Selenium",

  // Allergy and respiratory
  "Total IgE - Allergy",
  "Specific IgE Allergy Panel",
  "Pulmonary Function Test (PFT)",
  "Peak Expiratory Flow Rate (PEFR)",

  // Imaging – reports
  "Chest X-Ray PA View",
  "Chest X-Ray AP View",
  "X-Ray Abdomen",
  "X-Ray Cervical Spine",
  "X-Ray Lumbar Spine",
  "X-Ray Knee Joint",
  "X-Ray Hip Joint",
  "X-Ray Skull",
  "Ultrasound Abdomen and Pelvis",
  "Ultrasound Whole Abdomen",
  "Ultrasound KUB",
  "Ultrasound Obstetric Single Fetus",
  "Ultrasound Obstetric Growth Scan",
  "Ultrasound Breast",
  "Ultrasound Thyroid",
  "Ultrasound Scrotum",
  "2D Echocardiography",
  "Color Doppler Lower Limb Venous",
  "Color Doppler Carotid",
  "CT Scan Brain Plain",
  "CT Scan Brain Contrast",
  "CT Scan Chest High Resolution (HRCT)",
  "CT Scan Abdomen and Pelvis",
  "MRI Brain Plain",
  "MRI Brain Contrast",
  "MRI Spine",
  "Mammography Bilateral",
  "Digital X-Ray Chest",
  "Bone Densitometry (DEXA Scan)",

  // Misc & pre-op
  "Preoperative Assessment Panel",
  "Blood Group and Rh Typing",
  "Cross Matching",
  "Serum Electrolytes - Preoperative",
  "Coagulation Profile - Preoperative",
  "Urine Routine - Preoperative",

  // Pediatric tests
  "Newborn Screening Panel",
  "Neonatal Bilirubin",
  "Neonatal Sepsis Screen",
  "Pediatric Vitamin D Level",
  "Pediatric Thyroid Profile",

  // Occupational & toxicology
  "Serum Lead Level",
  "Serum Mercury Level",
  "Serum Arsenic Level",
  "Serum Alcohol Level",
  "Urine Drug Screen Panel",

  // Extended panels (for variety)
  "Comprehensive Health Checkup Panel",
  "Executive Health Checkup Panel",
  "Cardiac Health Checkup Panel",
  "Liver Disease Evaluation Panel",
  "Kidney Disease Evaluation Panel",
  "Anemia Profile Basic",
  "Anemia Profile Advanced",
  "Fever Profile Basic",
  "Fever Profile Extended",
  "Arthritis Profile",
  "Thyroid Profile Advanced"
];

const seedTests = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Test.deleteMany({});
    console.log("Existing tests cleared");

    const docs = testNames.map((name) => ({ name }));
    await Test.insertMany(docs);

    console.log(`Inserted ${docs.length} tests`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedTests();
