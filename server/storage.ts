import { 
  users, 
  appointments,
  healthRecords,
  aiDiagnoses,
  pharmacyOrders,
  notifications,
  type User, 
  type InsertUser,
  type Appointment,
  type InsertAppointment,
  type HealthRecord,
  type InsertHealthRecord,
  type AiDiagnosis,
  type InsertAiDiagnosis,
  type PharmacyOrder,
  type InsertPharmacyOrder,
  type Notification,
  type InsertNotification
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Appointment operations
  getAppointments(userId: number, role: string): Promise<Appointment[]>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  
  // Health record operations
  getHealthRecords(patientId: number): Promise<HealthRecord[]>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;
  
  // AI diagnosis operations
  getAiDiagnoses(patientId: number): Promise<AiDiagnosis[]>;
  createAiDiagnosis(diagnosis: InsertAiDiagnosis): Promise<AiDiagnosis>;
  
  // Pharmacy order operations
  getPharmacyOrders(patientId: number): Promise<PharmacyOrder[]>;
  createPharmacyOrder(order: InsertPharmacyOrder): Promise<PharmacyOrder>;
  
  // Notification operations
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getAppointments(userId: number, role: string): Promise<Appointment[]> {
    if (role === "patient") {
      return await db
        .select()
        .from(appointments)
        .where(eq(appointments.patientId, userId))
        .orderBy(desc(appointments.appointmentDate));
    } else if (role === "doctor") {
      return await db
        .select()
        .from(appointments)
        .where(eq(appointments.doctorId, userId))
        .orderBy(desc(appointments.appointmentDate));
    }
    return await db.select().from(appointments).orderBy(desc(appointments.appointmentDate));
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values({
        ...insertAppointment,
        createdAt: new Date(),
      })
      .returning();
    return appointment;
  }

  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set(updateData)
      .where(eq(appointments.id, id))
      .returning();
    return appointment || undefined;
  }

  async getHealthRecords(patientId: number): Promise<HealthRecord[]> {
    return await db
      .select()
      .from(healthRecords)
      .where(eq(healthRecords.patientId, patientId))
      .orderBy(desc(healthRecords.createdAt));
  }

  async createHealthRecord(insertRecord: InsertHealthRecord): Promise<HealthRecord> {
    const [record] = await db
      .insert(healthRecords)
      .values({
        ...insertRecord,
        createdAt: new Date(),
      })
      .returning();
    return record;
  }

  async getAiDiagnoses(patientId: number): Promise<AiDiagnosis[]> {
    return await db
      .select()
      .from(aiDiagnoses)
      .where(eq(aiDiagnoses.patientId, patientId))
      .orderBy(desc(aiDiagnoses.createdAt));
  }

  async createAiDiagnosis(insertDiagnosis: InsertAiDiagnosis): Promise<AiDiagnosis> {
    const [diagnosis] = await db
      .insert(aiDiagnoses)
      .values({
        ...insertDiagnosis,
        createdAt: new Date(),
      })
      .returning();
    return diagnosis;
  }

  async getPharmacyOrders(patientId: number): Promise<PharmacyOrder[]> {
    return await db
      .select()
      .from(pharmacyOrders)
      .where(eq(pharmacyOrders.patientId, patientId))
      .orderBy(desc(pharmacyOrders.orderDate));
  }

  async createPharmacyOrder(insertOrder: InsertPharmacyOrder): Promise<PharmacyOrder> {
    const [order] = await db
      .insert(pharmacyOrders)
      .values({
        ...insertOrder,
        orderDate: new Date(),
      })
      .returning();
    return order;
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values({
        ...insertNotification,
        createdAt: new Date(),
      })
      .returning();
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }
}

export const storage = new DatabaseStorage();
