import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("patient"), // patient, doctor, admin
  abhaId: text("abha_id"),
  phoneNumber: text("phone_number"),
  profileImage: text("profile_image"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled
  type: text("type").notNull().default("video"), // video, arvr, in-person
  notes: text("notes"),
  diagnosis: text("diagnosis"),
  prescription: jsonb("prescription"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id"),
  recordType: text("record_type").notNull(), // prescription, report, image, ai_diagnosis
  title: text("title").notNull(),
  content: jsonb("content"),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiDiagnoses = pgTable("ai_diagnoses", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  imageUrl: text("image_url").notNull(),
  diagnosis: text("diagnosis").notNull(),
  confidence: text("confidence").notNull(),
  explanation: jsonb("explanation"),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: integer("verified_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pharmacyOrders = pgTable("pharmacy_orders", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  pharmacyName: text("pharmacy_name").notNull(),
  items: jsonb("items").notNull(),
  totalAmount: text("total_amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, shipped, delivered
  orderDate: timestamp("order_date").defaultNow(),
  deliveryDate: timestamp("delivery_date"),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // info, warning, success, error
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({
  id: true,
  createdAt: true,
});

export const insertAiDiagnosisSchema = createInsertSchema(aiDiagnoses).omit({
  id: true,
  createdAt: true,
});

export const insertPharmacyOrderSchema = createInsertSchema(pharmacyOrders).omit({
  id: true,
  orderDate: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type HealthRecord = typeof healthRecords.$inferSelect;
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;
export type AiDiagnosis = typeof aiDiagnoses.$inferSelect;
export type InsertAiDiagnosis = z.infer<typeof insertAiDiagnosisSchema>;
export type PharmacyOrder = typeof pharmacyOrders.$inferSelect;
export type InsertPharmacyOrder = z.infer<typeof insertPharmacyOrderSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
