import jwt, { JwtPayload } from "jsonwebtoken";

export function authenticateToken(authHeader: string | null) {

  try {
    if (!authHeader) return null
    const token = authHeader.split(" ")[1];
    if (!token) return null
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = decoded as JwtPayload;
    if(user.role === "Admin")
      return user.role
    else if(user.role ==="Employee"){
      return user.role
    }
    else if(user.role ==="User"){
      return user.role
    }
  } catch  {
    return null
  }
}
export function getUserId(authHeader: string | null) {

  try {
    if (!authHeader) return null
    const token = authHeader.split(" ")[1];
    if (!token) return null
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = decoded as JwtPayload;
    if(user.userId)
      return user.userId
    else 
    return null
  } catch  {
    return null
  }
}
