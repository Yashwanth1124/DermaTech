import { storage } from "./storage";

export async function seedDemoData() {
  try {
    // Create demo pharmacies (2000+ partners simulation)
    const pharmacies = [
      {
        name: "Apollo Pharmacy",
        licenseNumber: "AP001",
        ownerName: "Rajesh Kumar",
        phoneNumber: "+91-98765-43210",
        email: "apollo@example.com",
        address: { city: "Mumbai", state: "Maharashtra", pincode: "400001" },
        location: { lat: 19.0760, lng: 72.8777 },
        operatingHours: { monday: "8:00-22:00", tuesday: "8:00-22:00" },
        isVerified: true,
        rating: 4.8
      },
      {
        name: "MedPlus Health Services",
        licenseNumber: "MP002", 
        ownerName: "Priya Sharma",
        phoneNumber: "+91-98765-43211",
        email: "medplus@example.com",
        address: { city: "Delhi", state: "Delhi", pincode: "110001" },
        location: { lat: 28.7041, lng: 77.1025 },
        operatingHours: { monday: "7:00-23:00", tuesday: "7:00-23:00" },
        isVerified: true,
        rating: 4.7
      }
    ];

    for (const pharmacy of pharmacies) {
      await storage.createPharmacy(pharmacy);
    }

    // Create demo medications
    const medications = [
      {
        name: "Paracetamol",
        genericName: "Acetaminophen",
        manufacturer: "Sun Pharma",
        composition: "Paracetamol 500mg",
        form: "tablet",
        strength: "500mg",
        packSize: "10 tablets",
        mrp: 25.50,
        category: "painkillers",
        prescriptionRequired: false,
        contraindications: ["Liver disease"],
        sideEffects: ["Nausea", "Stomach upset"],
        drugInteractions: ["Warfarin"],
        storageConditions: "Store below 25°C"
      },
      {
        name: "Azithromycin",
        genericName: "Azithromycin",
        manufacturer: "Cipla",
        composition: "Azithromycin 500mg",
        form: "tablet",
        strength: "500mg", 
        packSize: "3 tablets",
        mrp: 89.00,
        category: "antibiotics",
        prescriptionRequired: true,
        contraindications: ["Liver dysfunction"],
        sideEffects: ["Diarrhea", "Nausea"],
        drugInteractions: ["Digoxin"],
        storageConditions: "Store in dry place"
      },
      {
        name: "Vitamin D3",
        genericName: "Cholecalciferol",
        manufacturer: "Dr. Reddy's",
        composition: "Vitamin D3 60000 IU",
        form: "capsule",
        strength: "60000 IU",
        packSize: "4 capsules",
        mrp: 156.00,
        category: "vitamins",
        prescriptionRequired: false,
        contraindications: ["Hypercalcemia"],
        sideEffects: ["Constipation"],
        drugInteractions: ["Thiazide diuretics"],
        storageConditions: "Store below 30°C"
      }
    ];

    for (const medication of medications) {
      await storage.createMedication(medication);
    }

    // Create demo translations for 15 Indian languages
    const translations = [
      { key: "welcome", language: "hi", value: "स्वागत है", context: "ui" },
      { key: "welcome", language: "bn", value: "স্বাগতম", context: "ui" },
      { key: "welcome", language: "te", value: "స్వాగతం", context: "ui" },
      { key: "welcome", language: "mr", value: "स्वागत", context: "ui" },
      { key: "welcome", language: "ta", value: "வரவேற்கிறோம்", context: "ui" },
      { key: "appointment", language: "hi", value: "अपॉइंटमेंट", context: "medical" },
      { key: "appointment", language: "bn", value: "অ্যাপয়েন্টমেন্ট", context: "medical" },
      { key: "diagnosis", language: "hi", value: "निदान", context: "medical" },
      { key: "diagnosis", language: "bn", value: "রোগ নির্ণয়", context: "medical" },
      { key: "pharmacy", language: "hi", value: "फार्मेसी", context: "ui" },
      { key: "pharmacy", language: "bn", value: "ফার্মেসি", context: "ui" }
    ];

    for (const translation of translations) {
      await storage.createTranslation(translation);
    }

    console.log("Demo data seeded successfully");
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
}