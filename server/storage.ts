import {
  users,
  pharmacies,
  medications,
  pharmacyInventory,
  appointments,
  healthRecords,
  aiDiagnoses,
  pharmacyOrders,
  arVrSessions,
  notifications,
  blockchainTransactions,
  analytics,
  translations,
  performanceMetrics,
  type User,
  type UpsertUser,
  type Pharmacy,
  type InsertPharmacy,
  type Medication,
  type InsertMedication,
  type Appointment,
  type InsertAppointment,
  type HealthRecord,
  type InsertHealthRecord,
  type AiDiagnosis,
  type InsertAiDiagnosis,
  type PharmacyOrder,
  type InsertPharmacyOrder,
  type ArVrSession,
  type InsertArVrSession,
  type Notification,
  type InsertNotification,
  type BlockchainTransaction,
  type InsertBlockchainTransaction,
  type Analytics,
  type InsertAnalytics,
  type Translation,
  type InsertTranslation,
  type PerformanceMetric,
} from "@shared/schema";
import { pool } from "./db";
import { eq, desc, and, or, like, count, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

// Comprehensive storage interface for DermaTech
export interface IStorage {
  // User operations (ABHA Integration)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByAbhaId(abhaId: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, user: Partial<UpsertUser>): Promise<User | undefined>;
  searchUsers(query: string, role?: string): Promise<User[]>;
  updateUserOnlineStatus(id: string, isOnline: boolean): Promise<void>;
  
  // Pharmacy operations (2000+ partners)
  getPharmacies(limit?: number, offset?: number): Promise<Pharmacy[]>;
  getPharmacyById(id: number): Promise<Pharmacy | undefined>;
  searchPharmacies(query: string, location?: any): Promise<Pharmacy[]>;
  createPharmacy(pharmacy: InsertPharmacy): Promise<Pharmacy>;
  updatePharmacy(id: number, pharmacy: Partial<InsertPharmacy>): Promise<Pharmacy | undefined>;
  
  // Medication operations
  getMedications(limit?: number, offset?: number): Promise<Medication[]>;
  getMedicationById(id: number): Promise<Medication | undefined>;
  searchMedications(query: string): Promise<Medication[]>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedication(id: number, medication: Partial<InsertMedication>): Promise<Medication | undefined>;
  
  // Appointment operations (AR/VR Support)
  getAppointments(userId: string, role: string): Promise<Appointment[]>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  getUpcomingAppointments(userId: string): Promise<Appointment[]>;
  
  // Health record operations (PHR/EMR)
  getHealthRecords(patientId: string): Promise<HealthRecord[]>;
  getHealthRecordById(id: number): Promise<HealthRecord | undefined>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;
  updateHealthRecord(id: number, record: Partial<InsertHealthRecord>): Promise<HealthRecord | undefined>;
  shareHealthRecord(id: number, shareableLink: string): Promise<void>;
  
  // AI diagnosis operations (97% accuracy)
  getAiDiagnoses(patientId: string): Promise<AiDiagnosis[]>;
  getAiDiagnosisById(id: number): Promise<AiDiagnosis | undefined>;
  createAiDiagnosis(diagnosis: InsertAiDiagnosis): Promise<AiDiagnosis>;
  updateAiDiagnosis(id: number, diagnosis: Partial<InsertAiDiagnosis>): Promise<AiDiagnosis | undefined>;
  validateAiDiagnosis(id: number, doctorId: string, isAccurate: boolean, notes?: string): Promise<void>;
  
  // Pharmacy order operations
  getPharmacyOrders(patientId: string): Promise<PharmacyOrder[]>;
  getPharmacyOrderById(id: number): Promise<PharmacyOrder | undefined>;
  createPharmacyOrder(order: InsertPharmacyOrder): Promise<PharmacyOrder>;
  updatePharmacyOrder(id: number, order: Partial<InsertPharmacyOrder>): Promise<PharmacyOrder | undefined>;
  trackPharmacyOrder(orderNumber: string): Promise<PharmacyOrder | undefined>;
  
  // AR/VR session operations
  getArVrSessions(userId: string): Promise<ArVrSession[]>;
  getArVrSessionById(id: number): Promise<ArVrSession | undefined>;
  createArVrSession(session: InsertArVrSession): Promise<ArVrSession>;
  updateArVrSession(id: number, session: Partial<InsertArVrSession>): Promise<ArVrSession | undefined>;
  
  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  
  // Blockchain operations
  getBlockchainTransactions(userId: string): Promise<BlockchainTransaction[]>;
  createBlockchainTransaction(transaction: InsertBlockchainTransaction): Promise<BlockchainTransaction>;
  updateBlockchainTransaction(id: number, transaction: Partial<InsertBlockchainTransaction>): Promise<BlockchainTransaction | undefined>;
  
  // Analytics operations
  createAnalyticsEvent(event: InsertAnalytics): Promise<Analytics>;
  getAnalytics(userId?: string, eventType?: string): Promise<Analytics[]>;
  
  // Translation operations (15 Indian languages)
  getTranslations(language: string): Promise<Translation[]>;
  getTranslation(key: string, language: string): Promise<Translation | undefined>;
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  
  // Performance monitoring
  recordPerformanceMetric(metric: Omit<PerformanceMetric, "id" | "timestamp">): Promise<void>;
  
  // Dashboard statistics
  getDashboardStats(userId: string, role: string): Promise<any>;
}

const db = drizzle(pool);

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByAbhaId(abhaId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.abhaId, abhaId));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<UpsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async searchUsers(query: string, role?: string): Promise<User[]> {
    let searchCondition = or(
      like(users.firstName, `%${query}%`),
      like(users.lastName, `%${query}%`),
      like(users.email, `%${query}%`),
      like(users.username, `%${query}%`)
    );

    if (role) {
      searchCondition = and(searchCondition, eq(users.role, role));
    }

    return await db.select().from(users).where(searchCondition).limit(50);
  }

  async updateUserOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    await db
      .update(users)
      .set({ isOnline, lastActive: new Date() })
      .where(eq(users.id, id));
  }

  // Pharmacy operations
  async getPharmacies(limit = 50, offset = 0): Promise<Pharmacy[]> {
    return await db
      .select()
      .from(pharmacies)
      .where(eq(pharmacies.isActive, true))
      .orderBy(desc(pharmacies.rating))
      .limit(limit)
      .offset(offset);
  }

  async getPharmacyById(id: number): Promise<Pharmacy | undefined> {
    const [pharmacy] = await db.select().from(pharmacies).where(eq(pharmacies.id, id));
    return pharmacy;
  }

  async searchPharmacies(query: string, location?: any): Promise<Pharmacy[]> {
    let searchCondition = and(
      eq(pharmacies.isActive, true),
      or(
        like(pharmacies.name, `%${query}%`),
        like(pharmacies.ownerName, `%${query}%`)
      )
    );

    return await db.select().from(pharmacies).where(searchCondition).limit(20);
  }

  async createPharmacy(pharmacyData: InsertPharmacy): Promise<Pharmacy> {
    const [pharmacy] = await db.insert(pharmacies).values(pharmacyData).returning();
    return pharmacy;
  }

  async updatePharmacy(id: number, updateData: Partial<InsertPharmacy>): Promise<Pharmacy | undefined> {
    const [pharmacy] = await db
      .update(pharmacies)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(pharmacies.id, id))
      .returning();
    return pharmacy;
  }

  // Medication operations
  async getMedications(limit = 50, offset = 0): Promise<Medication[]> {
    return await db
      .select()
      .from(medications)
      .where(eq(medications.isActive, true))
      .limit(limit)
      .offset(offset);
  }

  async getMedicationById(id: number): Promise<Medication | undefined> {
    const [medication] = await db.select().from(medications).where(eq(medications.id, id));
    return medication;
  }

  async searchMedications(query: string): Promise<Medication[]> {
    return await db
      .select()
      .from(medications)
      .where(
        and(
          eq(medications.isActive, true),
          or(
            like(medications.name, `%${query}%`),
            like(medications.genericName, `%${query}%`),
            like(medications.manufacturer, `%${query}%`)
          )
        )
      )
      .limit(20);
  }

  async createMedication(medicationData: InsertMedication): Promise<Medication> {
    const [medication] = await db.insert(medications).values(medicationData).returning();
    return medication;
  }

  async updateMedication(id: number, updateData: Partial<InsertMedication>): Promise<Medication | undefined> {
    const [medication] = await db
      .update(medications)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(medications.id, id))
      .returning();
    return medication;
  }

  // Appointment operations
  async getAppointments(userId: string, role: string): Promise<Appointment[]> {
    const condition = role === "patient" 
      ? eq(appointments.patientId, userId)
      : eq(appointments.doctorId, userId);
    
    return await db
      .select()
      .from(appointments)
      .where(condition)
      .orderBy(desc(appointments.dateTime));
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async createAppointment(appointmentData: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values(appointmentData).returning();
    return appointment;
  }

  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async getUpcomingAppointments(userId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(
        and(
          or(eq(appointments.patientId, userId), eq(appointments.doctorId, userId)),
          eq(appointments.status, "scheduled")
        )
      )
      .orderBy(appointments.dateTime)
      .limit(10);
  }

  // Health record operations
  async getHealthRecords(patientId: string): Promise<HealthRecord[]> {
    return await db
      .select()
      .from(healthRecords)
      .where(and(eq(healthRecords.patientId, patientId), eq(healthRecords.isActive, true)))
      .orderBy(desc(healthRecords.createdAt));
  }

  async getHealthRecordById(id: number): Promise<HealthRecord | undefined> {
    const [record] = await db.select().from(healthRecords).where(eq(healthRecords.id, id));
    return record;
  }

  async createHealthRecord(recordData: InsertHealthRecord): Promise<HealthRecord> {
    const [record] = await db.insert(healthRecords).values(recordData).returning();
    return record;
  }

  async updateHealthRecord(id: number, updateData: Partial<InsertHealthRecord>): Promise<HealthRecord | undefined> {
    const [record] = await db
      .update(healthRecords)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(healthRecords.id, id))
      .returning();
    return record;
  }

  async shareHealthRecord(id: number, shareableLink: string): Promise<void> {
    await db
      .update(healthRecords)
      .set({ shareableLink, accessLevel: "shared" })
      .where(eq(healthRecords.id, id));
  }

  // AI diagnosis operations
  async getAiDiagnoses(patientId: string): Promise<AiDiagnosis[]> {
    return await db
      .select()
      .from(aiDiagnoses)
      .where(eq(aiDiagnoses.patientId, patientId))
      .orderBy(desc(aiDiagnoses.createdAt));
  }

  async getAiDiagnosisById(id: number): Promise<AiDiagnosis | undefined> {
    const [diagnosis] = await db.select().from(aiDiagnoses).where(eq(aiDiagnoses.id, id));
    return diagnosis;
  }

  async createAiDiagnosis(diagnosisData: InsertAiDiagnosis): Promise<AiDiagnosis> {
    const [diagnosis] = await db.insert(aiDiagnoses).values(diagnosisData).returning();
    return diagnosis;
  }

  async updateAiDiagnosis(id: number, updateData: Partial<InsertAiDiagnosis>): Promise<AiDiagnosis | undefined> {
    const [diagnosis] = await db
      .update(aiDiagnoses)
      .set(updateData)
      .where(eq(aiDiagnoses.id, id))
      .returning();
    return diagnosis;
  }

  async validateAiDiagnosis(id: number, doctorId: string, isAccurate: boolean, notes?: string): Promise<void> {
    await db
      .update(aiDiagnoses)
      .set({
        doctorReviewedBy: doctorId,
        isAccurate,
        doctorNotes: notes,
        reviewedAt: new Date(),
      })
      .where(eq(aiDiagnoses.id, id));
  }

  // Pharmacy order operations
  async getPharmacyOrders(patientId: string): Promise<PharmacyOrder[]> {
    return await db
      .select()
      .from(pharmacyOrders)
      .where(eq(pharmacyOrders.patientId, patientId))
      .orderBy(desc(pharmacyOrders.createdAt));
  }

  async getPharmacyOrderById(id: number): Promise<PharmacyOrder | undefined> {
    const [order] = await db.select().from(pharmacyOrders).where(eq(pharmacyOrders.id, id));
    return order;
  }

  async createPharmacyOrder(orderData: InsertPharmacyOrder): Promise<PharmacyOrder> {
    const [order] = await db.insert(pharmacyOrders).values(orderData).returning();
    return order;
  }

  async updatePharmacyOrder(id: number, updateData: Partial<InsertPharmacyOrder>): Promise<PharmacyOrder | undefined> {
    const [order] = await db
      .update(pharmacyOrders)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(pharmacyOrders.id, id))
      .returning();
    return order;
  }

  async trackPharmacyOrder(orderNumber: string): Promise<PharmacyOrder | undefined> {
    const [order] = await db
      .select()
      .from(pharmacyOrders)
      .where(eq(pharmacyOrders.orderNumber, orderNumber));
    return order;
  }

  // AR/VR session operations
  async getArVrSessions(userId: string): Promise<ArVrSession[]> {
    return await db
      .select()
      .from(arVrSessions)
      .where(or(eq(arVrSessions.patientId, userId), eq(arVrSessions.doctorId, userId)))
      .orderBy(desc(arVrSessions.createdAt));
  }

  async getArVrSessionById(id: number): Promise<ArVrSession | undefined> {
    const [session] = await db.select().from(arVrSessions).where(eq(arVrSessions.id, id));
    return session;
  }

  async createArVrSession(sessionData: InsertArVrSession): Promise<ArVrSession> {
    const [session] = await db.insert(arVrSessions).values(sessionData).returning();
    return session;
  }

  async updateArVrSession(id: number, updateData: Partial<InsertArVrSession>): Promise<ArVrSession | undefined> {
    const [session] = await db
      .update(arVrSessions)
      .set(updateData)
      .where(eq(arVrSessions.id, id))
      .returning();
    return session;
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  }

  // Blockchain operations
  async getBlockchainTransactions(userId: string): Promise<BlockchainTransaction[]> {
    return await db
      .select()
      .from(blockchainTransactions)
      .where(eq(blockchainTransactions.userId, userId))
      .orderBy(desc(blockchainTransactions.createdAt));
  }

  async createBlockchainTransaction(transactionData: InsertBlockchainTransaction): Promise<BlockchainTransaction> {
    const [transaction] = await db.insert(blockchainTransactions).values(transactionData).returning();
    return transaction;
  }

  async updateBlockchainTransaction(id: number, updateData: Partial<InsertBlockchainTransaction>): Promise<BlockchainTransaction | undefined> {
    const [transaction] = await db
      .update(blockchainTransactions)
      .set(updateData)
      .where(eq(blockchainTransactions.id, id))
      .returning();
    return transaction;
  }

  // Analytics operations
  async createAnalyticsEvent(eventData: InsertAnalytics): Promise<Analytics> {
    const [event] = await db.insert(analytics).values(eventData).returning();
    return event;
  }

  async getAnalytics(userId?: string, eventType?: string): Promise<Analytics[]> {
    let condition: any = sql`1=1`;
    
    if (userId) {
      condition = eq(analytics.userId, userId);
    }
    
    if (eventType) {
      condition = and(condition, eq(analytics.eventType, eventType));
    }

    return await db
      .select()
      .from(analytics)
      .where(condition)
      .orderBy(desc(analytics.timestamp))
      .limit(1000);
  }

  // Translation operations
  async getTranslations(language: string): Promise<Translation[]> {
    return await db
      .select()
      .from(translations)
      .where(and(eq(translations.language, language), eq(translations.isActive, true)));
  }

  async getTranslation(key: string, language: string): Promise<Translation | undefined> {
    const [translation] = await db
      .select()
      .from(translations)
      .where(and(eq(translations.key, key), eq(translations.language, language)));
    return translation;
  }

  async createTranslation(translationData: InsertTranslation): Promise<Translation> {
    const [translation] = await db.insert(translations).values(translationData).returning();
    return translation;
  }

  // Performance monitoring
  async recordPerformanceMetric(metricData: Omit<PerformanceMetric, "id" | "timestamp">): Promise<void> {
    await db.insert(performanceMetrics).values(metricData);
  }

  // Dashboard statistics
  async getDashboardStats(userId: string, role: string): Promise<any> {
    const stats: any = {};

    try {
      if (role === "patient") {
        // Patient dashboard stats
        const [appointmentCount] = await db
          .select({ count: count() })
          .from(appointments)
          .where(eq(appointments.patientId, userId));

        const [recordCount] = await db
          .select({ count: count() })
          .from(healthRecords)
          .where(eq(healthRecords.patientId, userId));

        const [notificationCount] = await db
          .select({ count: count() })
          .from(notifications)
          .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

        const [diagnosisCount] = await db
          .select({ count: count() })
          .from(aiDiagnoses)
          .where(eq(aiDiagnoses.patientId, userId));

        stats.appointments = appointmentCount?.count || 0;
        stats.records = recordCount?.count || 0;
        stats.notifications = notificationCount?.count || 0;
        stats.aiScans = diagnosisCount?.count || 0;
      } else if (role === "doctor") {
        // Doctor dashboard stats
        const [appointmentCount] = await db
          .select({ count: count() })
          .from(appointments)
          .where(eq(appointments.doctorId, userId));

        const [todayAppointments] = await db
          .select({ count: count() })
          .from(appointments)
          .where(
            and(
              eq(appointments.doctorId, userId),
              eq(appointments.status, "scheduled"),
              sql`DATE(${appointments.dateTime}) = CURRENT_DATE`
            )
          );

        const [patientCount] = await db
          .select({ count: count() })
          .from(healthRecords)
          .where(eq(healthRecords.doctorId, userId));

        stats.appointments = appointmentCount?.count || 0;
        stats.todayAppointments = todayAppointments?.count || 0;
        stats.patients = patientCount?.count || 0;
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return { appointments: 0, records: 0, notifications: 0, aiScans: 0 };
    }

    return stats;
  }
}

export const storage = new DatabaseStorage();