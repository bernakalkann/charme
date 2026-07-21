'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/actions/auth';
import { Sparkles, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterContent() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    const res = await registerUser(null, formData);

    if (res.success) {
      setSuccess(res.message || 'Kayıt başarıyla oluşturuldu!');
      setLoading(false);
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setError(res.error || 'Kayıt oluşturulurken bir hata oluştu.');
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
          <h2 className="text-xl font-serif font-semibold text-primary">Yeni Hesap Oluşturun</h2>
          <p className="text-xs text-muted-foreground">
            Lüks güzellik ve kişiselleştirilmiş cilt bakım dünyasına katılın.
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200/40 text-red-700 text-xs p-3 rounded-lg">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200/40 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Adınız Soyadınız
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ahmet Yılmaz"
                className="w-full text-xs bg-muted border-none rounded-md py-3.5 pl-10 pr-4 focus:ring-1 focus:ring-secondary focus:outline-none"
              />
            </div>
          </div>

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
            <label htmlFor="password" className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="w-full text-xs bg-muted border-none rounded-md py-3.5 pl-10 pr-4 focus:ring-1 focus:ring-secondary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors uppercase tracking-widest font-sans disabled:opacity-50"
          >
            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border/40 text-xs">
          <span className="text-muted-foreground">Zaten hesabınız var mı? </span>
          <Link href="/login" className="text-secondary font-semibold hover:underline">
            Giriş Yap
          </Link>
        </div>

      </div>
    </div>
  );
}
