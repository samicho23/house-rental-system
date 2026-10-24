/**
 * Seed script - demo data for the House and Apartment Rental System.
 * Run: bun scripts/seed.ts   (or: bun run db:seed)
 */
// Load the backend .env first (same override rule as src/config/env.ts)
import "../src/config/env";
import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import { env } from "../src/config/env";

const db = new PrismaClient({
  datasources: { db: { url: env.databaseUrl } },
});

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const D = (s: string) => new Date(s);

async function main() {
  console.log("Clearing existing data...");
  await db.notification.deleteMany();
  await db.payment.deleteMany();
  await db.maintenanceRequest.deleteMany();
  await db.lease.deleteMany();
  await db.application.deleteMany();
  await db.propertyPhoto.deleteMany();
  await db.property.deleteMany();
  await db.user.deleteMany();

  console.log("Creating users...");
  const admin = await db.user.create({
    data: {
      email: "admin@rental.et",
      password: hashPassword("Admin@123"),
      firstName: "System",
      lastName: "Administrator",
      phone: "+251911000000",
      role: "ADMIN",
      city: "Addis Ababa",
      faydaId: "ADMIN000001",
      faydaVerified: true,
      gender: "Male",
    },
  });

  const landlord1 = await db.user.create({
    data: {
      email: "hirut@rental.et",
      password: hashPassword("Landlord@123"),
      firstName: "Hirut",
      lastName: "Bekele",
      phone: "+251911234567",
      role: "LANDLORD",
      city: "Addis Ababa",
      subCity: "Bole",
      faydaId: "FAYDA10001",
      faydaVerified: true,
      gender: "Female",
    },
  });

  const landlord2 = await db.user.create({
    data: {
      email: "daniel@rental.et",
      password: hashPassword("Landlord@123"),
      firstName: "Daniel",
      lastName: "Mekonnen",
      phone: "+251912345678",
      role: "LANDLORD",
      city: "Addis Ababa",
      subCity: "Yeka",
      faydaId: "FAYDA10002",
      faydaVerified: true,
      gender: "Male",
    },
  });

  const landlord3 = await db.user.create({
    data: {
      email: "alemu@rental.et",
      password: hashPassword("Landlord@123"),
      firstName: "Alemu",
      lastName: "Tadesse",
      phone: "+251913456789",
      role: "LANDLORD",
      city: "Injibara",
      faydaId: "FAYDA10003",
      faydaVerified: true,
      gender: "Male",
    },
  });

  const tenant1 = await db.user.create({
    data: {
      email: "samuel@rental.et",
      password: hashPassword("Tenant@123"),
      firstName: "Samuel",
      lastName: "Tsegaye",
      phone: "+251914567890",
      role: "TENANT",
      city: "Addis Ababa",
      subCity: "Kirkos",
      faydaId: "FAYDA20001",
      faydaVerified: true,
      gender: "Male",
    },
  });

  const tenant2 = await db.user.create({
    data: {
      email: "weynshet@rental.et",
      password: hashPassword("Tenant@123"),
      firstName: "Weynshet",
      lastName: "Teshale",
      phone: "+251915678901",
      role: "TENANT",
      city: "Addis Ababa",
      subCity: "Bole",
      faydaId: "FAYDA20002",
      faydaVerified: true,
      gender: "Female",
    },
  });

  const tenant3 = await db.user.create({
    data: {
      email: "ashenafi@rental.et",
      password: hashPassword("Tenant@123"),
      firstName: "Ashenafi",
      lastName: "Tadele",
      phone: "+251916789012",
      role: "TENANT",
      city: "Injibara",
      faydaId: "FAYDA20003",
      faydaVerified: true,
      gender: "Male",
    },
  });

  console.log("Creating properties...");
  const P = (
    landlordId: string,
    data: {
      title: string;
      description: string;
      propertyType: string;
      city: string;
      subCity?: string;
      address?: string;
      price: number;
      bedrooms: number;
      bathrooms: number;
      areaSqm?: number;
      furnished?: boolean;
      hasParking?: boolean;
      amenities?: string[];
      photo: string;
      status?: string;
      approvalStatus?: string;
    }
  ) =>
    db.property.create({
      data: {
        landlordId,
        title: data.title,
        description: data.description,
        propertyType: data.propertyType,
        city: data.city,
        subCity: data.subCity,
        address: data.address,
        price: data.price,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        areaSqm: data.areaSqm,
        furnished: data.furnished ?? false,
        hasParking: data.hasParking ?? false,
        amenities: (data.amenities ?? []).join(","),
        status: data.status ?? "PUBLISHED",
        approvalStatus: data.approvalStatus ?? "APPROVED",
        availableFrom: D("2026-11-01"),
        photos: { create: [{ url: data.photo, isCover: true, order: 0 }] },
      },
    });

  const prop1 = await P(landlord1.id, {
    title: "Modern 2-Bedroom Apartment in Bole",
    description:
      "Bright and airy apartment minutes from Bole Airport road. Open-plan living room, fitted kitchen with granite counter tops, built-in wardrobes and a balcony overlooking the neighbourhood. Building has 24/7 security and a shared generator for power cuts.",
    propertyType: "APARTMENT",
    city: "Addis Ababa",
    subCity: "Bole",
    address: "Bole Medhanialem, near Getu Commercial Center",
    price: 28000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 96,
    furnished: true,
    hasParking: true,
    amenities: ["Balcony", "Generator", "Security", "Elevator", "Water tank"],
    photo: "/images/prop-bole-apartment.svg",
  });

  const prop2 = await P(landlord1.id, {
    title: "Spacious 3-Bedroom House with Garden, Old Airport",
    description:
      "Family house on a quiet compound in Old Airport area. Large living and dining rooms, master bedroom with en-suite bath, mature garden and covered parking for two cars. Water is supplied from both city line and a deep well.",
    propertyType: "HOUSE",
    city: "Addis Ababa",
    subCity: "Nifas Silk-Lafto",
    address: "Old Airport, behind Dreamliner Hotel",
    price: 65000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqm: 210,
    hasParking: true,
    amenities: ["Garden", "Two parking", "Deep well", "Guard house", "Store room"],
    photo: "/images/prop-oldairport-house.svg",
  });

  const prop3 = await P(landlord2.id, {
    title: "Cozy Studio Apartment in Yeka, Close to Megenagna",
    description:
      " Newly built studio ideal for a young professional. Walking distance to Megenagna terminal and shops. Includes a kitchenette, modern shower, and large windows with afternoon light. Monthly rate includes water.",
    propertyType: "STUDIO",
    city: "Addis Ababa",
    subCity: "Yeka",
    address: "Megenagna, behind Zefmesh Grand Mall",
    price: 12000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 42,
    furnished: true,
    amenities: ["Kitchenette", "Water included", "Fiber internet ready"],
    photo: "/images/prop-yeka-studio.svg",
  });

  const prop4 = await P(landlord2.id, {
    title: "4-Bedroom Villa in Ayat, Gated Community",
    description:
      "Brand new villa inside a gated community in Ayat. Compound features children's playground, shaded parking and 24-hour guard. The villa has a corner living room, family room, servant quarter and roof terrace.",
    propertyType: "HOUSE",
    city: "Addis Ababa",
    subCity: "Yeka",
    address: "Ayat, Crown Gate area",
    price: 90000,
    bedrooms: 4,
    bathrooms: 4,
    areaSqm: 320,
    hasParking: true,
    amenities: ["Gated community", "Playground", "Roof terrace", "Servant quarter", "Generator"],
    photo: "/images/prop-ayat-villa.svg",
  });

  const prop5 = await P(landlord3.id, {
    title: "Quiet 1-Bedroom Apartment near Injibara University",
    description:
      "Furnished one-bedroom apartment ten minutes' walk from Injibara University main gate. Suitable for lecturers or graduate students. Hot water, reliable water tank and a small vegetable garden shared between four units.",
    propertyType: "APARTMENT",
    city: "Injibara",
    address: "Kebele 03, near the University gate",
    price: 7000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 55,
    furnished: true,
    amenities: ["Furnished", "Water tank", "Shared garden", "Hot water"],
    photo: "/images/prop-injibara-apartment.svg",
  });

  const prop6 = await P(landlord3.id, {
    title: "Two-Storey House with Compound in Injibara Town",
    description:
      "Solid two-storey house in central Injibara with a walled compound of 400 square metres. Fruit trees, separate kitchen block and road access all year. Ideal for a family relocating to the Awi Zone capital.",
    propertyType: "HOUSE",
    city: "Injibara",
    address: "Kebele 01, near the main market",
    price: 15000,
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 180,
    hasParking: true,
    amenities: ["Compound", "Fruit trees", "Separate kitchen", "Road access"],
    photo: "/images/prop-injibara-house.svg",
  });

  const prop7 = await P(landlord2.id, {
    title: "Furnished Condo in Kality, Affordable Rate",
    description:
      "Well maintained condo unit in the Kality condominium blocks. Bus stop at the gate, markets nearby. The unit has been recently repainted and comes with a stove and refrigerator.",
    propertyType: "CONDO",
    city: "Addis Ababa",
    subCity: "Akaky Kaliti",
    address: "Kality Condominiums, Block C",
    price: 9500,
    bedrooms: 2,
    bathrooms: 1,
    areaSqm: 68,
    furnished: true,
    amenities: ["Stove", "Refrigerator", "Bus stop", "Shop nearby"],
    photo: "/images/prop-kality-condo.svg",
  });

  const prop8 = await P(landlord1.id, {
    title: "Single Room for Student in Kirkos",
    description:
      "Affordable single room with shared kitchen and bathroom in a family compound. Suitable for a university student. Utilities split equally among tenants.",
    propertyType: "SINGLE_ROOM",
    city: "Addis Ababa",
    subCity: "Kirkos",
    address: "Kazanchis, near Radisson Blu",
    price: 4500,
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 18,
    amenities: ["Shared kitchen", "Utilities included", "Family compound"],
    photo: "/images/prop-kirkos-room.svg",
    approvalStatus: "PENDING",
  });

  console.log("Creating applications...");
  const app1 = await db.application.create({
    data: {
      propertyId: prop1.id,
      tenantId: tenant1.id,
      message:
        "I work at a software company near Bole and would love to move in with my sister. We are quiet, non-smokers and can pay two months in advance.",
      moveInDate: D("2026-11-01"),
      occupants: 2,
      phone: "+251914567890",
      status: "PENDING",
    },
  });

  const app2 = await db.application.create({
    data: {
      propertyId: prop3.id,
      tenantId: tenant2.id,
      message: "I am relocating to Addis for a new job at Megenagna and need a place from December.",
      moveInDate: D("2026-12-01"),
      occupants: 1,
      phone: "+251915678901",
      status: "PENDING",
    },
  });

  const appApproved = await db.application.create({
    data: {
      propertyId: prop2.id,
      tenantId: tenant2.id,
      message: "Our family of four is looking for a house with a garden in this area.",
      moveInDate: D("2026-09-01"),
      occupants: 4,
      phone: "+251915678901",
      status: "APPROVED",
      decisionNote: "Great fit, welcome!",
      decidedAt: D("2026-08-20"),
    },
  });

  const appRejected = await db.application.create({
    data: {
      propertyId: prop5.id,
      tenantId: tenant3.id,
      message: "I am a third year student looking for a quiet place near campus.",
      moveInDate: D("2026-10-15"),
      occupants: 2,
      phone: "+251916789012",
      status: "REJECTED",
      decisionNote: "Occupants exceed the limit for this unit",
      decidedAt: D("2026-10-05"),
    },
  });

  console.log("Creating leases and payments...");
  const lease1 = await db.lease.create({
    data: {
      propertyId: prop2.id,
      tenantId: tenant2.id,
      landlordId: landlord1.id,
      applicationId: appApproved.id,
      startDate: D("2026-09-01"),
      endDate: D("2027-08-31"),
      monthlyRent: 65000,
      deposit: 130000,
      paymentDay: 5,
      status: "ACTIVE",
      notes: "Deposit held against damages; refundable at move-out inspection.",
    },
  });

  // Payments: 2 paid, 1 pending (this month), 1 overdue (previous)
  await db.payment.create({
    data: {
      leaseId: lease1.id,
      amount: 65000,
      dueDate: D("2026-09-05"),
      paidDate: D("2026-09-04"),
      method: "BANK_TRANSFER",
      status: "PAID",
      periodLabel: "2026-09",
      recordedById: landlord1.id,
      note: "September rent",
    },
  });
  await db.payment.create({
    data: {
      leaseId: lease1.id,
      amount: 65000,
      dueDate: D("2026-10-05"),
      paidDate: D("2026-10-05"),
      method: "BANK_TRANSFER",
      status: "PAID",
      periodLabel: "2026-10",
      recordedById: landlord1.id,
      note: "October rent",
    },
  });
  await db.payment.create({
    data: {
      leaseId: lease1.id,
      amount: 65000,
      dueDate: D("2026-11-05"),
      method: "BANK_TRANSFER",
      status: "PENDING",
      periodLabel: "2026-11",
      recordedById: landlord1.id,
      note: "November rent",
    },
  });
  await db.payment.create({
    data: {
      leaseId: lease1.id,
      amount: 65000,
      dueDate: D("2026-12-05"),
      method: "CASH",
      status: "PENDING",
      periodLabel: "2026-12",
      recordedById: landlord1.id,
    },
  });

  const lease2 = await db.lease.create({
    data: {
      propertyId: prop5.id,
      tenantId: tenant3.id,
      landlordId: landlord3.id,
      startDate: D("2026-10-15"),
      endDate: D("2027-10-14"),
      monthlyRent: 7000,
      deposit: 14000,
      paymentDay: 10,
      status: "ACTIVE",
    },
  });
  await db.payment.create({
    data: {
      leaseId: lease2.id,
      amount: 7000,
      dueDate: D("2026-11-10"),
      paidDate: D("2026-11-09"),
      method: "MOBILE_MONEY",
      status: "PAID",
      periodLabel: "2026-11",
      recordedById: landlord3.id,
    },
  });

  console.log("Creating maintenance requests...");
  await db.maintenanceRequest.create({
    data: {
      propertyId: prop2.id,
      leaseId: lease1.id,
      tenantId: tenant2.id,
      landlordId: landlord1.id,
      title: "Kitchen tap is leaking",
      description:
        "The cold water tap in the kitchen started dripping two days ago and the floor under the sink gets wet overnight.",
      category: "PLUMBING",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      response: "Plumber will come on Saturday morning.",
    },
  });
  await db.maintenanceRequest.create({
    data: {
      propertyId: prop2.id,
      leaseId: lease1.id,
      tenantId: tenant2.id,
      landlordId: landlord1.id,
      title: "Bedroom power socket not working",
      description: "The socket next to the master bed stopped working after the last power cut. Other sockets are fine.",
      category: "ELECTRICAL",
      priority: "HIGH",
      status: "OPEN",
    },
  });
  await db.maintenanceRequest.create({
    data: {
      propertyId: prop5.id,
      leaseId: lease2.id,
      tenantId: tenant3.id,
      landlordId: landlord3.id,
      title: "Water tank needs refill schedule",
      description: "The shared tank ran empty twice this month. Can we agree on a refill schedule?",
      category: "WATER",
      priority: "LOW",
      status: "RESOLVED",
      response: "Tank is now refilled every Monday and Thursday.",
      resolvedAt: D("2026-10-28"),
    },
  });

  console.log("Creating notifications...");
  await db.notification.create({
    data: {
      userId: tenant2.id,
      type: "LEASE",
      title: "Lease active",
      message: 'Your lease for "Spacious 3-Bedroom House with Garden, Old Airport" is active until 31 August 2027.',
      read: true,
    },
  });
  await db.notification.create({
    data: {
      userId: tenant2.id,
      type: "PAYMENT",
      title: "Rent due in 5 days",
      message: "65000 ETB rent for November is due on 5 November 2026.",
    },
  });
  await db.notification.create({
    data: {
      userId: landlord1.id,
      type: "APPLICATION",
      title: "New rental application",
      message: "Samuel Tsegaye applied for \"Modern 2-Bedroom Apartment in Bole\".",
    },
  });
  await db.notification.create({
    data: {
      userId: admin.id,
      type: "ADMIN",
      title: "Listing awaiting approval",
      message: "\"Single Room for Student in Kirkos\" is waiting for review.",
    },
  });
  await db.notification.create({
    data: {
      userId: tenant1.id,
      type: "INFO",
      title: "Welcome to the House and Apartment Rental System",
      message: "Your tenant account is ready. Search listings and apply for a home in a few clicks.",
    },
  });

  console.log("\nSeed complete!");
  console.log("Accounts:");
  console.log("  Admin    : admin@rental.et    / Admin@123");
  console.log("  Landlord : hirut@rental.et    / Landlord@123");
  console.log("  Landlord : daniel@rental.et   / Landlord@123");
  console.log("  Landlord : alemu@rental.et    / Landlord@123");
  console.log("  Tenant   : samuel@rental.et   / Tenant@123");
  console.log("  Tenant   : weynshet@rental.et / Tenant@123");
  console.log("  Tenant   : ashenafi@rental.et / Tenant@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
