'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as z from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır.'),
  email: z.string().email('Geçersiz e-posta adresi.'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır.'),
});

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validated = registerSchema.safeParse({ name, email, password });
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0].message,
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'Bu e-posta adresi zaten kullanımda.',
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        cart: {
          create: {}, // Automatically initialize an empty cart
        },
      },
    });

    return {
      success: true,
      message: 'Kayıt başarıyla tamamlandı. Giriş yapabilirsiniz.',
    };
  } catch (error: any) {
    console.error('Kayıt hatası:', error);
    return {
      success: false,
      error: 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.',
    };
  }
}

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ? {
    id: (session.user as any).id,
    name: session.user.name,
    email: session.user.email,
    role: (session.user as any).role,
  } : null;
}
