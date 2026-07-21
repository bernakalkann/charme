'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console or APM
    console.error('[GLOBAL ERROR YAKALANDI]', error);
  }, [error]);

  return (
    <html lang="tr">
      <body className="bg-[#faf8f6] font-sans antialiased text-[#2b2b2b]">
        <div className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center space-y-6 bg-white p-8 border border-[#e8e2dc] rounded-2xl shadow-sm">
            <div className="mx-auto w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="font-serif text-xl font-semibold text-[#121212] tracking-wide">
              Sistemsel Bir Hata Oluştu
            </h1>
            
            <p className="text-xs text-[#8c8279] leading-relaxed">
              Özür dileriz, işleminiz sırasında beklenmedik bir hata meydana geldi. Teknik ekibimiz durumdan haberdar edildi.
            </p>

            {error.digest && (
              <div className="bg-[#fcfbf9] border border-[#f4e8e1] rounded px-3 py-1.5 text-[9px] font-mono text-[#8c8279]">
                Hata Kodu: {error.digest}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => reset()}
                className="inline-flex justify-center items-center rounded-full bg-[#121212] px-6 py-3 text-[10px] font-semibold text-white tracking-widest uppercase hover:bg-[#c5a880] transition-colors"
              >
                Sayfayı Yeniden Yükle
              </button>
              <a
                href="/"
                className="inline-flex justify-center items-center rounded-full border border-[#e8e2dc] bg-white px-6 py-3 text-[10px] font-semibold text-[#121212] tracking-widest uppercase hover:bg-[#fcfbf9] transition-colors"
              >
                Ana Sayfa'ya Dön
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
