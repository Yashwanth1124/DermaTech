CREATE TABLE "ai_diagnoses" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" varchar NOT NULL,
	"session_id" varchar(100) NOT NULL,
	"image_urls" text[] NOT NULL,
	"skin_condition" varchar(100),
	"diagnosis" text NOT NULL,
	"confidence" numeric(5, 2) NOT NULL,
	"severity" varchar(20) NOT NULL,
	"recommendations" jsonb,
	"risk_factors" text[],
	"follow_up_required" boolean DEFAULT false,
	"doctor_review_required" boolean DEFAULT false,
	"doctor_reviewed_by" varchar,
	"doctor_notes" text,
	"ai_model_version" varchar(20) DEFAULT 'v2.1',
	"processing_time" real,
	"metadata" jsonb,
	"is_accurate" boolean,
	"created_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"event_type" varchar(50) NOT NULL,
	"event_category" varchar(50),
	"event_data" jsonb,
	"session_id" varchar(100),
	"device_info" jsonb,
	"location" jsonb,
	"timestamp" timestamp DEFAULT now(),
	"ip_address" varchar(45),
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" varchar NOT NULL,
	"doctor_id" varchar NOT NULL,
	"date_time" timestamp NOT NULL,
	"duration" integer DEFAULT 30,
	"status" varchar(20) DEFAULT 'scheduled' NOT NULL,
	"type" varchar(20) DEFAULT 'regular' NOT NULL,
	"consultation_type" varchar(20) DEFAULT 'in_person',
	"symptoms" text[],
	"notes" text,
	"prescription" jsonb,
	"diagnosis" text,
	"follow_up_required" boolean DEFAULT false,
	"follow_up_date" timestamp,
	"consultation_fee" numeric(10, 2),
	"payment_status" varchar(20) DEFAULT 'pending',
	"ar_vr_session_id" varchar(100),
	"recording_url" text,
	"vitals" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ar_vr_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(100) NOT NULL,
	"appointment_id" integer NOT NULL,
	"patient_id" varchar NOT NULL,
	"doctor_id" varchar NOT NULL,
	"session_type" varchar(20) NOT NULL,
	"duration" integer,
	"status" varchar(20) DEFAULT 'scheduled',
	"room_url" text,
	"recording_url" text,
	"artifacts" jsonb,
	"quality_metrics" jsonb,
	"device_info" jsonb,
	"started_at" timestamp,
	"ended_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "ar_vr_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "blockchain_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_hash" varchar(66) NOT NULL,
	"block_number" integer,
	"transaction_type" varchar(50) NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"data_hash" varchar(64) NOT NULL,
	"gas_used" integer,
	"gas_price" numeric(20, 0),
	"status" varchar(20) DEFAULT 'pending',
	"confirmations" integer DEFAULT 0,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"confirmed_at" timestamp,
	CONSTRAINT "blockchain_transactions_transaction_hash_unique" UNIQUE("transaction_hash")
);
--> statement-breakpoint
CREATE TABLE "health_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" varchar NOT NULL,
	"doctor_id" varchar,
	"appointment_id" integer,
	"record_type" varchar(50) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"data" jsonb,
	"attachments" jsonb,
	"icd_codes" text[],
	"severity" varchar(20),
	"is_active" boolean DEFAULT true,
	"access_level" varchar(20) DEFAULT 'private',
	"shareable_link" varchar(100),
	"blockchain_hash" varchar(64),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "medications" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"generic_name" varchar(200),
	"manufacturer" varchar(200),
	"composition" text,
	"form" varchar(50),
	"strength" varchar(50),
	"pack_size" varchar(50),
	"mrp" numeric(10, 2),
	"category" varchar(100),
	"prescription_required" boolean DEFAULT true,
	"contraindications" text[],
	"side_effects" text[],
	"drug_interactions" text[],
	"storage_conditions" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"priority" varchar(20) DEFAULT 'normal',
	"category" varchar(50),
	"action_url" text,
	"metadata" jsonb,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"device_type" varchar(20),
	"scheduled_for" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "performance_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_type" varchar(50) NOT NULL,
	"metric_name" varchar(100) NOT NULL,
	"value" real NOT NULL,
	"unit" varchar(20),
	"user_id" varchar,
	"session_id" varchar(100),
	"device_info" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pharmacies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"license_number" varchar(50) NOT NULL,
	"owner_name" varchar(100) NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"email" varchar(100),
	"address" jsonb NOT NULL,
	"location" jsonb,
	"operating_hours" jsonb,
	"delivery_radius" real DEFAULT 10,
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"rating" numeric(3, 2) DEFAULT 0,
	"total_orders" integer DEFAULT 0,
	"partnered_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pharmacies_license_number_unique" UNIQUE("license_number")
);
--> statement-breakpoint
CREATE TABLE "pharmacy_inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"pharmacy_id" integer NOT NULL,
	"medication_id" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"discount" numeric(5, 2) DEFAULT 0,
	"expiry_date" timestamp,
	"batch_number" varchar(50),
	"is_available" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pharmacy_inventory_pharmacy_id_medication_id_unique" UNIQUE("pharmacy_id","medication_id")
);
--> statement-breakpoint
CREATE TABLE "pharmacy_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(20) NOT NULL,
	"patient_id" varchar NOT NULL,
	"pharmacy_id" integer NOT NULL,
	"prescription_id" integer,
	"medications" jsonb NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT 0,
	"delivery_charges" numeric(10, 2) DEFAULT 0,
	"final_amount" numeric(10, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"payment_status" varchar(20) DEFAULT 'pending',
	"payment_method" varchar(30),
	"delivery_type" varchar(20) DEFAULT 'home',
	"delivery_address" jsonb NOT NULL,
	"estimated_delivery" timestamp,
	"actual_delivery" timestamp,
	"tracking_number" varchar(50),
	"delivery_person_id" varchar,
	"rating" integer,
	"feedback" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pharmacy_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(200) NOT NULL,
	"language" varchar(10) NOT NULL,
	"value" text NOT NULL,
	"context" varchar(100),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "translations_key_language_unique" UNIQUE("key","language")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"username" varchar(50),
	"password" text,
	"role" varchar(20) DEFAULT 'patient' NOT NULL,
	"abha_id" varchar(14),
	"phone_number" varchar(15),
	"date_of_birth" timestamp,
	"gender" varchar(10),
	"address" jsonb,
	"languages" text[] DEFAULT '{}',
	"medical_license" varchar(50),
	"specialization" varchar(100),
	"hospital_affiliation" varchar(200),
	"is_verified" boolean DEFAULT false,
	"is_online" boolean DEFAULT false,
	"last_active" timestamp DEFAULT now(),
	"fcm_token" text,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"emergency_contact" jsonb,
	"insurance_details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_abha_id_unique" UNIQUE("abha_id")
);
--> statement-breakpoint
ALTER TABLE "ai_diagnoses" ADD CONSTRAINT "ai_diagnoses_patient_id_users_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_diagnoses" ADD CONSTRAINT "ai_diagnoses_doctor_reviewed_by_users_id_fk" FOREIGN KEY ("doctor_reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_users_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_users_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ar_vr_sessions" ADD CONSTRAINT "ar_vr_sessions_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ar_vr_sessions" ADD CONSTRAINT "ar_vr_sessions_patient_id_users_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ar_vr_sessions" ADD CONSTRAINT "ar_vr_sessions_doctor_id_users_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blockchain_transactions" ADD CONSTRAINT "blockchain_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_records" ADD CONSTRAINT "health_records_patient_id_users_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_records" ADD CONSTRAINT "health_records_doctor_id_users_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_records" ADD CONSTRAINT "health_records_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_metrics" ADD CONSTRAINT "performance_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacy_inventory" ADD CONSTRAINT "pharmacy_inventory_pharmacy_id_pharmacies_id_fk" FOREIGN KEY ("pharmacy_id") REFERENCES "public"."pharmacies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacy_inventory" ADD CONSTRAINT "pharmacy_inventory_medication_id_medications_id_fk" FOREIGN KEY ("medication_id") REFERENCES "public"."medications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacy_orders" ADD CONSTRAINT "pharmacy_orders_patient_id_users_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacy_orders" ADD CONSTRAINT "pharmacy_orders_pharmacy_id_pharmacies_id_fk" FOREIGN KEY ("pharmacy_id") REFERENCES "public"."pharmacies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacy_orders" ADD CONSTRAINT "pharmacy_orders_prescription_id_health_records_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "public"."health_records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");