'use client'

import { useEffect } from 'react'

export default function PrelineLoader() {
  useEffect(() => {
    import('preline');
  }, []);
  
  return <></>;
}
