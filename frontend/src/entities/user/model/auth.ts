import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

export function signAuthToken(payload: {
  id: string;
  email: string;
  role?: string;
}) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET) as {
      id: string;
      email: string;
      role?: string;
    };
    return decoded;
  } catch {
    return null;
  }
}
