import { createCipheriv, createDecipheriv, randomBytes, scryptSync, createHash } from 'crypto';

const algorithm = 'aes-256-cbc'; // Algorithm used for encryption
const ivLength = 16; // Initialization vector length

const modifyPassword = (password: string) => {
    let newPassword = password.split('').reverse().join('');
    newPassword += 'x';
    return newPassword;
};

const getKey = (password: string) => {
    return scryptSync(modifyPassword(password), 'salt', 32); // Key derived from password
};

const encrypt = (data: object, password: string): string => {
    const iv = randomBytes(ivLength);
    const key = getKey(password);
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64'); // Change to base64
    encrypted += cipher.final('base64'); // Change to base64
    // Return iv and encrypted data as a base64 string
    return Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64'); // Combine and encode in base64
};

const decrypt = (encryptedData: string, password: string): object => {
    const dataBuffer = Buffer.from(encryptedData, 'base64');
    const iv = dataBuffer.slice(0, ivLength);
    const encryptedText = dataBuffer.slice(ivLength).toString('base64'); // Get the rest as base64
    const key = getKey(password);
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8'); // Change to base64
    decrypted += decipher.final('utf8'); // Change to utf8
    return JSON.parse(decrypted);
};

const hashJson = (json: object): string => {
    const jsonString = JSON.stringify(json, Object.keys(json).sort()); // Convert JSON to a sorted string
    const hash = createHash('sha256'); // Create a SHA-256 hash instance
    hash.update(jsonString); // Update the hash with the JSON string
    return hash.digest('hex'); // Return the hash in hexadecimal format
};
export const cryptoService = {
    encrypt,
    decrypt,
    hashJson
};
