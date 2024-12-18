import * as bcrypt from "bcrypt";
import crypto from "crypto";

export function generateOTP(): number {
  return Number(Math.floor(100000 + Math.random() * 900000));
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}

export function convertBytesToMb(bytes): number {
  return bytes / 1000000;
}

export function convertMbToGb(mb): number {
  return mb / 1000;
}

export function generateCurrencySymbol(currency: string): string {
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).formatToParts();
  const symbol = format.find((part) => part.type === "currency").value;
  return symbol;
}

const deriveKey = (secret: string, salt: Buffer) => {
  return crypto.pbkdf2Sync(secret, salt, 100000, 32, "sha256");
};

const generateIV = () => {
  return crypto.randomBytes(16);
};

const encryptDataUsingSecret = (data: string, secret: string) => {
  try {
    const salt = crypto.randomBytes(16);
    const key = deriveKey(secret, salt);
    const iv = generateIV();
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Error in encrypting data:", error);
    return "";
  }
};

const decryptDataUsingSecret = (encryptedData: string, secret: string) => {
  try {
    const [saltHex, ivHex, encryptedHex] = encryptedData.split(":");
    const salt = Buffer.from(saltHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const key = deriveKey(secret, salt);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Error in decrypting data:", error);
    return "";
  }
};

export const encryptApiKey = (apiKey: string, secret: string) => {
  return encryptDataUsingSecret(apiKey, secret);
};

export const decryptApiKey = (encryptedApiKey: string, secret: string) => {
  return decryptDataUsingSecret(encryptedApiKey, secret);
};

export const generateApiKey = (secret: string) => {
  const key = crypto.randomBytes(16).toString("hex");
  return {
    key,
    encryptedKey: encryptApiKey(key, secret),
  };
};

export const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

export function sha1Hash(string) {
  return crypto.createHash("sha1").update(string).digest("hex");
}

export function md5Hash(string) {
  return crypto.createHash("md5").update(string).digest("hex");
}

export function convertToUTC(dateString) {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  const date = new Date(Date.UTC(year, month - 1, day));

  return date.toISOString();
}
