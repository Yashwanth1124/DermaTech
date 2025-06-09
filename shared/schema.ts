import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  serial,
  index,
  real,
  uuid,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Comprehensive user table with ABHA integration
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // ABHA ID or system generated
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username", { length: 50 }).unique(),
  password: text("password"),
  role: varchar("role", { length: 20 }).notNull().default("patient"), // patient, doctor, admin, pharmacy
  abhaId: varchar("abha_id", { length: 14 }).unique(),
  phoneNumber: varchar("phone_number", { length: 15 }),
  dateOfBirth: timestamp("date_of_birth"),
  gender: varchar("gender", { length: 10 }),
  address: jsonb("address"), // Complete address with pincode
  languages: text("languages").array().default([]), // Preferred languages
  medicalLicense: varchar("medical_license", { length: 50 }), // For doctors
  specialization: varchar("specialization", { length: 100 }), // For doctors
  hospitalAffiliation: varchar("hospital_affiliation", { length: 200 }),
  isVerified: boolean("is_verified").default(false),
  isOnline: boolean("is_online").default(false),
  lastActive: timestamp("last_active").defaultNow(),
  fcmToken: text("fcm_token"), // For push notifications
  preferences: jsonb("preferences").default({}), // User preferences
  emergencyContact: jsonb("emergency_contact"),
  insuranceDetails: jsonb("insurance_details"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pharmacies table for marketplace
export const pharmacies = pgTable("pharmacies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  licenseNumber: varchar("license_number", { length: 50 }).notNull().unique(),
  ownerName: varchar("owner_name", { length: 100 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
  email: varchar("email", { length: 100 }),
  address: jsonb("address").notNull(),
  location: jsonb("location"), // lat, lng for geolocation
  operatingHours: jsonb("operating_hours"), // Daily operating hours
  deliveryRadius: real("delivery_radius").default(10), // In kilometers
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default(0),
  totalOrders: integer("total_orders").default(0),
  partneredDate: timestamp("partnered_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medications database
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  genericName: varchar("generic_name", { length: 200 }),
  manufacturer: varchar("manufacturer", { length: 200 }),
  composition: text("composition"),
  form: varchar("form", { length: 50 }), // tablet, capsule, syrup, etc.
  strength: varchar("strength", { length: 50 }),
  packSize: varchar("pack_size", { length: 50 }),
  mrp: decimal("mrp", { precision: 10, scale: 2 }),
  category: varchar("category", { length: 100 }),
  prescriptionRequired: boolean("prescription_required").default(true),
  contraindications: text("contraindications").array(),
  sideEffects: text("side_effects").array(),
  drugInteractions: text("drug_interactions").array(),
  storageConditions: text("storage_conditions"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pharmacy inventory
export const pharmacyInventory = pgTable("pharmacy_inventory", {
  id: serial("id").primaryKey(),
  pharmacyId: integer("pharmacy_id").references(() => pharmacies.id).notNull(),
  medicationId: integer("medication_id").references(() => medications.id).notNull(),
  stock: integer("stock").notNull().default(0),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }).default(0),
  expiryDate: timestamp("expiry_date"),
  batchNumber: varchar("batch_number", { length: 50 }),
  isAvailable: boolean("is_available").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique().on(table.pharmacyId, table.medicationId)
]);

// Enhanced appointments with AR/VR support
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: varchar("patient_id").references(() => users.id).notNull(),
  doctorId: varchar("doctor_id").references(() => users.id).notNull(),
  dateTime: timestamp("date_time").notNull(),
  duration: integer("duration").default(30), // in minutes
  status: varchar("status", { length: 20 }).notNull().default("scheduled"), // scheduled, ongoing, completed, cancelled
  type: varchar("type", { length: 20 }).notNull().default("regular"), // regular, emergency, followup, ar_vr
  consultationType: varchar("consultation_type", { length: 20 }).default("in_person"), // in_person, video, ar_vr
  symptoms: text("symptoms").array(),
  notes: text("notes"),
  prescription: jsonb("prescription"), // Prescribed medications
  diagnosis: text("diagnosis"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  arVrSessionId: varchar("ar_vr_session_id", { length: 100 }),
  recordingUrl: text("recording_url"), // For AR/VR session recordings
  vitals: jsonb("vitals"), // Heart rate, BP, temperature, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comprehensive health records (PHR/EMR)
export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  patientId: varchar("patient_id").references(() => users.id).notNull(),
  doctorId: varchar("doctor_id").references(() => users.id),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  recordType: varchar("record_type", { length: 50 }).notNull(), // diagnosis, prescription, lab_result, imaging, vitals
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  data: jsonb("data"), // Structured medical data
  attachments: jsonb("attachments"), // URLs to files, images, reports
  icdCodes: text("icd_codes").array(), // ICD-10 codes
  severity: varchar("severity", { length: 20 }), // mild, moderate, severe, critical
  isActive: boolean("is_active").default(true),
  accessLevel: varchar("access_level", { length: 20 }).default("private"), // private, shared, public
  shareableLink: varchar("shareable_link", { length: 100 }),
  blockchainHash: varchar("blockchain_hash", { length: 64 }), // For blockchain verification
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI skin diagnostics with 97% accuracy
export const aiDiagnoses = pgTable("ai_diagnoses", {
  id: serial("id").primaryKey(),
  patientId: varchar("patient_id").references(() => users.id).notNull(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
  imageUrls: text("image_urls").array().notNull(), // Multiple images
  skinCondition: varchar("skin_condition", { length: 100 }),
  diagnosis: text("diagnosis").notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(), // 97% accuracy
  severity: varchar("severity", { length: 20 }).notNull(), // mild, moderate, severe, urgent
  recommendations: jsonb("recommendations"), // Treatment recommendations
  riskFactors: text("risk_factors").array(),
  followUpRequired: boolean("follow_up_required").default(false),
  doctorReviewRequired: boolean("doctor_review_required").default(false),
  doctorReviewedBy: varchar("doctor_reviewed_by").references(() => users.id),
  doctorNotes: text("doctor_notes"),
  aiModelVersion: varchar("ai_model_version", { length: 20 }).default("v2.1"),
  processingTime: real("processing_time"), // in seconds
  metadata: jsonb("metadata"), // Additional AI analysis data
  isAccurate: boolean("is_accurate"), // Doctor validation
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// Pharmacy orders with 2000+ partners
export const pharmacyOrders = pgTable("pharmacy_orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
  patientId: varchar("patient_id").references(() => users.id).notNull(),
  pharmacyId: integer("pharmacy_id").references(() => pharmacies.id).notNull(),
  prescriptionId: integer("prescription_id").references(() => healthRecords.id),
  medications: jsonb("medications").notNull(), // Array of ordered medications
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default(0),
  deliveryCharges: decimal("delivery_charges", { precision: 10, scale: 2 }).default(0),
  finalAmount: decimal("final_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, confirmed, prepared, shipped, delivered, cancelled
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  paymentMethod: varchar("payment_method", { length: 30 }),
  deliveryType: varchar("delivery_type", { length: 20 }).default("home"), // home, pickup
  deliveryAddress: jsonb("delivery_address").notNull(),
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  trackingNumber: varchar("tracking_number", { length: 50 }),
  deliveryPersonId: varchar("delivery_person_id"),
  rating: integer("rating"), // 1-5 stars
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AR/VR consultation sessions
export const arVrSessions = pgTable("ar_vr_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull().unique(),
  appointmentId: integer("appointment_id").references(() => appointments.id).notNull(),
  patientId: varchar("patient_id").references(() => users.id).notNull(),
  doctorId: varchar("doctor_id").references(() => users.id).notNull(),
  sessionType: varchar("session_type", { length: 20 }).notNull(), // ar, vr, mixed_reality
  duration: integer("duration"), // in minutes
  status: varchar("status", { length: 20 }).default("scheduled"), // scheduled, active, completed, cancelled
  roomUrl: text("room_url"),
  recordingUrl: text("recording_url"),
  artifacts: jsonb("artifacts"), // 3D models, annotations, measurements
  qualityMetrics: jsonb("quality_metrics"), // Video quality, latency, etc.
  deviceInfo: jsonb("device_info"), // Patient and doctor device capabilities
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comprehensive notifications system
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // appointment, medication, ai_diagnosis, order, system, emergency
  priority: varchar("priority", { length: 20 }).default("normal"), // low, normal, high, urgent
  category: varchar("category", { length: 50 }),
  actionUrl: text("action_url"),
  metadata: jsonb("metadata"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  deviceType: varchar("device_type", { length: 20 }), // web, mobile, email, sms
  scheduledFor: timestamp("scheduled_for"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blockchain analytics for transparency
export const blockchainTransactions = pgTable("blockchain_transactions", {
  id: serial("id").primaryKey(),
  transactionHash: varchar("transaction_hash", { length: 66 }).notNull().unique(),
  blockNumber: integer("block_number"),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // record_creation, record_update, prescription, diagnosis
  entityType: varchar("entity_type", { length: 50 }).notNull(), // health_record, prescription, ai_diagnosis
  entityId: integer("entity_id").notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  dataHash: varchar("data_hash", { length: 64 }).notNull(),
  gasUsed: integer("gas_used"),
  gasPrice: decimal("gas_price", { precision: 20, scale: 0 }),
  status: varchar("status", { length: 20 }).default("pending"), // pending, confirmed, failed
  confirmations: integer("confirmations").default(0),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
});

// Analytics data for insights
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  eventType: varchar("event_type", { length: 50 }).notNull(), // page_view, button_click, diagnosis_completed, order_placed
  eventCategory: varchar("event_category", { length: 50 }),
  eventData: jsonb("event_data"),
  sessionId: varchar("session_id", { length: 100 }),
  deviceInfo: jsonb("device_info"),
  location: jsonb("location"), // City, state, country
  timestamp: timestamp("timestamp").defaultNow(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
});

// Multilingual content support (15 Indian languages)
export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 200 }).notNull(),
  language: varchar("language", { length: 10 }).notNull(), // en, hi, bn, te, mr, ta, gu, kn, ml, pa, or, as, ur, ks, ne
  value: text("value").notNull(),
  context: varchar("context", { length: 100 }), // medical, ui, error, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique().on(table.key, table.language)
]);

// System performance monitoring
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  metricType: varchar("metric_type", { length: 50 }).notNull(), // page_load, api_response, ai_processing
  metricName: varchar("metric_name", { length: 100 }).notNull(),
  value: real("value").notNull(),
  unit: varchar("unit", { length: 20 }), // ms, seconds, percentage
  userId: varchar("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 100 }),
  deviceInfo: jsonb("device_info"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertPharmacySchema = createInsertSchema(pharmacies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiDiagnosisSchema = createInsertSchema(aiDiagnoses).omit({
  id: true,
  createdAt: true,
  reviewedAt: true,
});

export const insertPharmacyOrderSchema = createInsertSchema(pharmacyOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertArVrSessionSchema = createInsertSchema(arVrSessions).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertBlockchainTransactionSchema = createInsertSchema(blockchainTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  timestamp: true,
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export comprehensive types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type Pharmacy = typeof pharmacies.$inferSelect;
export type InsertPharmacy = z.infer<typeof insertPharmacySchema>;

export type Medication = typeof medications.$inferSelect;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;

export type PharmacyInventory = typeof pharmacyInventory.$inferSelect;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type HealthRecord = typeof healthRecords.$inferSelect;
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;

export type AiDiagnosis = typeof aiDiagnoses.$inferSelect;
export type InsertAiDiagnosis = z.infer<typeof insertAiDiagnosisSchema>;

export type PharmacyOrder = typeof pharmacyOrders.$inferSelect;
export type InsertPharmacyOrder = z.infer<typeof insertPharmacyOrderSchema>;

export type ArVrSession = typeof arVrSessions.$inferSelect;
export type InsertArVrSession = z.infer<typeof insertArVrSessionSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type BlockchainTransaction = typeof blockchainTransactions.$inferSelect;
export type InsertBlockchainTransaction = z.infer<typeof insertBlockchainTransactionSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;

export type PerformanceMetric = typeof performanceMetrics.$inferSelect;