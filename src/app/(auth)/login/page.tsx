import React, { Suspense } from 'react';
import LoginContent from './LoginContent';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-xs text-muted-foreground">Yükleniyor...</div>}>
      <LoginContent />
    </Suspense>
  );
}
