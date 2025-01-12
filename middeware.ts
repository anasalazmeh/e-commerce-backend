// app/middleware.ts
import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();
  
  // إضافة رؤوس CORS
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

// تحديد المسارات التي ترغب بتطبيق الـ middleware عليها
export const config = {
  matcher: ['/api/*'], // هذا سيشمل جميع الـ API Routes
};
