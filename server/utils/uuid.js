// Fix missing uuid dependency
import { randomUUID } from "crypto";

// Use Node.js built-in crypto for UUID generation instead of uuid package
export const v4 = randomUUID;
