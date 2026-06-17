import { PrismaClient } from "@prisma/client";

// Create a single shared instance of PrismaClient
const prisma = new PrismaClient();

export default prisma;
