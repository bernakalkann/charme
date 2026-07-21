'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Sparkles, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || 'Hatalı e-posta veya şifre.');
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('Giriş yapılırken beklenmedik bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8 bg-card border border-border/40 p-8 rounded-2xl shadow-sm">
        
        {/* Brand/Welcome Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-secondary" />
            <span className="font-serif text-2xl font-semibold tracking-wider text-primary">CHARME</span>
          </Link>
          <h2 className="text-xl font-serif font-semibold text-primary">Hesabınıza Giriş Yapın</h2>
          <p className="text-xs text-muted-foreground">
            Lüks kozmetik deneyiminize kaldığınız yerden devam edin.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-red-50 border border-red-200/40 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              E-Posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@charme.com"
                className="w-full text-xs bg-muted border-none rounded-md py-3.5 pl-10 pr-4 focus:ring-1 focus:ring-secondary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-xs font-semibold text-muted-foreground uppercase">
                Şifre
              </label>
              <a href="#" className="text-[10px] text-secondary font-semibold hover:underline">
                Şifremi Unuttum
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="w-full text-xs bg-muted border-none rounded-md py-3.5 pl-10 pr-10 focus:ring-1 focus:ring-secondary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors uppercase tracking-widest font-sans disabled:opacity-50"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border/40 text-xs">
          <span className="text-muted-foreground">Henüz hesabınız yok mu? </span>
          <Link href="/register" className="text-secondary font-semibold hover:underline">
            Yeni Hesap Oluştur
          </Link>
        </div>

      </div>
    </div>
  );
}
