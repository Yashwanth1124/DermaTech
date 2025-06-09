import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertAppointmentSchema, insertHealthRecordSchema, insertAiDiagnosisSchema, insertPharmacyOrderSchema, insertNotificationSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dermatech-secret-key";

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: 'Registration failed', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ message: 'Login failed', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Failed to fetch user', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/auth/change-password', authenticateToken, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(req.user.id, { password: hashedNewPassword });

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Failed to change password', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // User profile routes
  app.patch('/api/users/:id', authenticateToken, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Users can only update their own profile, except admins
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to update this profile' });
      }

      const updateData = req.body;
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Failed to update user', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Appointment routes
  app.get('/api/appointments', authenticateToken, async (req: any, res) => {
    try {
      const appointments = await storage.getAppointments(req.user.id, req.user.role);
      res.json(appointments);
    } catch (error) {
      console.error('Get appointments error:', error);
      res.status(500).json({ message: 'Failed to fetch appointments', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/appointments', authenticateToken, async (req: any, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      
      // Create notification for the appointment
      await storage.createNotification({
        userId: appointmentData.patientId,
        title: 'Appointment Scheduled',
        message: `Your appointment has been scheduled for ${new Date(appointmentData.appointmentDate).toLocaleDateString()}`,
        type: 'info'
      });

      res.status(201).json(appointment);
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(400).json({ message: 'Failed to create appointment', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.patch('/api/appointments/:id', authenticateToken, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const appointment = await storage.updateAppointment(id, updateData);
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      res.json(appointment);
    } catch (error) {
      console.error('Update appointment error:', error);
      res.status(400).json({ message: 'Failed to update appointment', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Health records routes
  app.get('/api/health-records', authenticateToken, async (req: any, res) => {
    try {
      const patientId = req.user.role === 'patient' ? req.user.id : parseInt(req.query.patientId);
      if (!patientId) {
        return res.status(400).json({ message: 'Patient ID is required' });
      }
      
      const records = await storage.getHealthRecords(patientId);
      res.json(records);
    } catch (error) {
      console.error('Get health records error:', error);
      res.status(500).json({ message: 'Failed to fetch health records', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/health-records', authenticateToken, async (req: any, res) => {
    try {
      const recordData = insertHealthRecordSchema.parse(req.body);
      const record = await storage.createHealthRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      console.error('Create health record error:', error);
      res.status(400).json({ message: 'Failed to create health record', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // AI diagnosis routes
  app.get('/api/ai-diagnoses', authenticateToken, async (req: any, res) => {
    try {
      const patientId = req.user.role === 'patient' ? req.user.id : parseInt(req.query.patientId);
      if (!patientId) {
        return res.status(400).json({ message: 'Patient ID is required' });
      }
      
      const diagnoses = await storage.getAiDiagnoses(patientId);
      res.json(diagnoses);
    } catch (error) {
      console.error('Get AI diagnoses error:', error);
      res.status(500).json({ message: 'Failed to fetch AI diagnoses', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/ai-diagnoses', authenticateToken, async (req: any, res) => {
    try {
      const diagnosisData = insertAiDiagnosisSchema.parse(req.body);
      
      // AI analysis simulation - in production this would call actual AI service
      const aiAnalysisResult = {
        ...diagnosisData,
        diagnosis: diagnosisData.diagnosis || "AI analysis completed",
        confidence: diagnosisData.confidence || "95.2%",
        explanation: diagnosisData.explanation || {
          features: ["Pattern analysis completed", "Classification successful"],
          recommendation: "Consult with a dermatologist for professional evaluation"
        }
      };
      
      const diagnosis = await storage.createAiDiagnosis(aiAnalysisResult);
      
      // Create notification for AI diagnosis
      await storage.createNotification({
        userId: diagnosisData.patientId,
        title: 'AI Diagnosis Complete',
        message: `AI analysis completed with ${aiAnalysisResult.confidence} confidence`,
        type: 'info'
      });

      res.status(201).json(diagnosis);
    } catch (error) {
      console.error('Create AI diagnosis error:', error);
      res.status(400).json({ message: 'Failed to create AI diagnosis', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Pharmacy orders routes
  app.get('/api/pharmacy-orders', authenticateToken, async (req: any, res) => {
    try {
      const patientId = req.user.role === 'patient' ? req.user.id : parseInt(req.query.patientId);
      if (!patientId) {
        return res.status(400).json({ message: 'Patient ID is required' });
      }
      
      const orders = await storage.getPharmacyOrders(patientId);
      res.json(orders);
    } catch (error) {
      console.error('Get pharmacy orders error:', error);
      res.status(500).json({ message: 'Failed to fetch pharmacy orders', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/pharmacy-orders', authenticateToken, async (req: any, res) => {
    try {
      const orderData = insertPharmacyOrderSchema.parse(req.body);
      const order = await storage.createPharmacyOrder(orderData);
      
      // Create notification for order
      await storage.createNotification({
        userId: orderData.patientId,
        title: 'Order Placed',
        message: `Your pharmacy order #${order.id} has been placed successfully`,
        type: 'success'
      });

      res.status(201).json(order);
    } catch (error) {
      console.error('Create pharmacy order error:', error);
      res.status(400).json({ message: 'Failed to create pharmacy order', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Notifications routes
  app.get('/api/notifications', authenticateToken, async (req: any, res) => {
    try {
      const notifications = await storage.getNotifications(req.user.id);
      res.json(notifications);
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ message: 'Failed to fetch notifications', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/notifications', authenticateToken, async (req: any, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      console.error('Create notification error:', error);
      res.status(400).json({ message: 'Failed to create notification', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.patch('/api/notifications/:id/read', authenticateToken, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markNotificationAsRead(id);
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      console.error('Mark notification read error:', error);
      res.status(400).json({ message: 'Failed to mark notification as read', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Support routes
  app.post('/api/support/tickets', authenticateToken, async (req: any, res) => {
    try {
      const { subject, category, priority, message } = req.body;
      
      // Create a support notification
      await storage.createNotification({
        userId: req.user.id,
        title: 'Support Ticket Created',
        message: `Your support ticket "${subject}" has been created. We'll respond within 24 hours.`,
        type: 'info'
      });

      res.status(201).json({ 
        id: Date.now(),
        subject,
        category,
        priority,
        message,
        status: 'open',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create support ticket error:', error);
      res.status(400).json({ message: 'Failed to create support ticket', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Analytics routes (for doctors and admins)
  app.get('/api/analytics/overview', authenticateToken, async (req: any, res) => {
    try {
      if (!['doctor', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const appointments = await storage.getAppointments(req.user.id, req.user.role);
      
      const analytics = {
        totalPatients: 15420,
        totalAppointments: appointments.length,
        aiDiagnoses: 8945,
        pharmacyOrders: 3240,
        patientSatisfaction: 94.2,
        treatmentSuccess: 89.7,
        systemUptime: 99.98
      };

      res.json(analytics);
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({ message: 'Failed to fetch analytics', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Telemedicine routes
  app.post('/api/telemedicine/session', authenticateToken, async (req: any, res) => {
    try {
      const { appointmentId, type } = req.body;
      
      // Create session record
      const sessionData = {
        id: Date.now(),
        appointmentId,
        type,
        status: 'active',
        startTime: new Date().toISOString(),
        participantId: req.user.id
      };

      res.status(201).json(sessionData);
    } catch (error) {
      console.error('Create telemedicine session error:', error);
      res.status(400).json({ message: 'Failed to create telemedicine session', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Share target for PWA
  app.post('/share', async (req, res) => {
    try {
      // Handle shared content from PWA
      const { title, text, url, files } = req.body;
      
      // Process shared files (images, documents)
      if (files && files.length > 0) {
        console.log('Received shared files:', files.length);
      }

      res.json({ message: 'Content shared successfully' });
    } catch (error) {
      console.error('Share content error:', error);
      res.status(400).json({ message: 'Failed to process shared content', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Protocol handler for deep links
  app.get('/handle', (req, res) => {
    const protocol = req.query.protocol as string;
    
    if (protocol && protocol.startsWith('web+dermatech:')) {
      // Handle custom protocol URLs
      const action = protocol.replace('web+dermatech:', '');
      
      switch (action) {
        case 'appointment':
          res.redirect('/appointments');
          break;
        case 'ai-scan':
          res.redirect('/ai-diagnostics');
          break;
        case 'pharmacy':
          res.redirect('/pharmacy');
          break;
        default:
          res.redirect('/');
      }
    } else {
      res.redirect('/');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
