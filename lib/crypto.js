import crypto from "node:crypto";
function key(){const k=Buffer.from(process.env.TOKEN_ENCRYPTION_KEY||"","hex");if(k.length!==32)throw new Error("TOKEN_ENCRYPTION_KEY harus 32-byte hex");return k;}
export function encryptToken(v){const iv=crypto.randomBytes(12),c=crypto.createCipheriv("aes-256-gcm",key(),iv);const d=Buffer.concat([c.update(v,"utf8"),c.final()]);return `${iv.toString("hex")}:${c.getAuthTag().toString("hex")}:${d.toString("hex")}`;}
export function decryptToken(v){const [i,t,d]=v.split(":");const c=crypto.createDecipheriv("aes-256-gcm",key(),Buffer.from(i,"hex"));c.setAuthTag(Buffer.from(t,"hex"));return Buffer.concat([c.update(Buffer.from(d,"hex")),c.final()]).toString("utf8");}
