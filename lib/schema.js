import { sql } from "drizzle-orm";
import { integer, text, real, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
  phone: text("phone"),
  status: text("status").default("trial"),
  expiryDate: text("expiry_date"),
  reminderSent: integer("reminder_sent").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const preActivations = sqliteTable("pre_activations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const pharmacySettings = sqliteTable("pharmacy_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pharmacyName: text("pharmacy_name").default("My Pharmacy"),
  ownerName: text("owner_name"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  gstin: text("gstin"),
  dlNo: text("dl_no"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  logoUrl: text("logo_url"),
  tagline: text("tagline"),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const medicines = sqliteTable("medicines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  generic: text("generic"),
  company: text("company"),
  batch: text("batch"),
  expiry: text("expiry"),
  mrp: real("mrp").notNull(),
  purchasePrice: real("purchase_price"),
  stock: integer("stock").default(0),
  unit: text("unit").default("strip"),
  rack: text("rack"),
  hsn: text("hsn"),
  gst: real("gst").default(12),
  reorderLevel: integer("reorder_level").default(10),
  barcode: text("barcode"),
  scheduleType: text("schedule_type").default("general"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const patients = sqliteTable("patients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  age: integer("age"),
  gender: text("gender"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const suppliers = sqliteTable("suppliers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  state: text("state"),
  gstNo: text("gst_no"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const sales = sqliteTable("sales", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  billNo: text("bill_no").notNull(),
  patientId: integer("patient_id"),
  patientName: text("patient_name"),
  patientPhone: text("patient_phone"),
  subtotal: real("subtotal").notNull(),
  discount: real("discount").default(0),
  gstAmount: real("gst_amount").default(0),
  netAmount: real("net_amount").notNull(),
  paymentType: text("payment_type").default("cash"),
  paidAmount: real("paid_amount").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const saleItems = sqliteTable("sale_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  saleId: integer("sale_id").notNull(),
  medicineId: integer("medicine_id"),
  medicineName: text("medicine_name").notNull(),
  batch: text("batch"),
  expiry: text("expiry"),
  qty: integer("qty").notNull(),
  mrp: real("mrp").notNull(),
  discount: real("discount").default(0),
  gst: real("gst").default(0),
  amount: real("amount").notNull(),
});

export const purchases = sqliteTable("purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  supplierId: integer("supplier_id"),
  supplierName: text("supplier_name"),
  invoiceNo: text("invoice_no"),
  totalAmount: real("total_amount").notNull(),
  paidAmount: real("paid_amount").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const purchaseItems = sqliteTable("purchase_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  purchaseId: integer("purchase_id").notNull(),
  medicineId: integer("medicine_id"),
  medicineName: text("medicine_name").notNull(),
  batch: text("batch"),
  expiry: text("expiry"),
  qty: integer("qty").notNull(),
  purchasePrice: real("purchase_price").notNull(),
  mrp: real("mrp").notNull(),
  gst: real("gst").default(12),
  amount: real("amount").notNull(),
});

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  saleId: integer("sale_id").notNull(),
  patientName: text("patient_name"),
  amount: real("amount").notNull(),
  mode: text("mode").default("cash"),
  note: text("note"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const narcoticLog = sqliteTable("narcotic_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  medicineId: integer("medicine_id").notNull(),
  medicineName: text("medicine_name").notNull(),
  scheduleType: text("schedule_type").notNull(),
  transactionType: text("transaction_type").notNull(),
  qty: integer("qty").notNull(),
  saleId: integer("sale_id"),
  purchaseId: integer("purchase_id"),
  patientName: text("patient_name"),
  patientPhone: text("patient_phone"),
  doctorName: text("doctor_name"),
  prescriptionNo: text("prescription_no"),
  remarks: text("remarks"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const bankTransactions = sqliteTable("bank_transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  type: text("type").notNull(),
  category: text("category"),
  referenceNo: text("reference_no"),
  bankName: text("bank_name"),
  reconciled: integer("reconciled").default(0),
  saleId: integer("sale_id"),
  purchaseId: integer("purchase_id"),
  remarks: text("remarks"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const stores = sqliteTable("stores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  gstin: text("gstin"),
  dlNo: text("dl_no"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  isActive: integer("is_active").default(1),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const promiseOrders = sqliteTable("promise_orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientName: text("patient_name").notNull(),
  patientPhone: text("patient_phone"),
  medicineName: text("medicine_name").notNull(),
  qty: integer("qty").notNull(),
  status: text("status").default("pending"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});