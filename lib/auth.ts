// import jwt from "jsonwebtoken";
// import { getUser } from "@/db";

// const { ACCESS_TOKEN_SECRET = "" } = process.env;

// export async function authenticateUser(authHeader?: string) {
//   if (!authHeader || !ACCESS_TOKEN_SECRET) return null;

//   const token = authHeader.split(" ")[1];
//   try {
//     const { id } = jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: string };
//     if (id) {
//       const user = await getUser(id);
//       return user ? { id, email: user.email, role: user.role } : null;
//     }
//   } catch (err) {
//     console.error("Authentication error:", err);
//     return null;
//   }
// }
