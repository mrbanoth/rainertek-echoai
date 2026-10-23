'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PhoneNumbersRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/inbound');
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-slate-400">
      Redirecting to Inbound Call Routing...
    </div>
  );
}
