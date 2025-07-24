import React from 'react'
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import Link from 'next/link';

function AppHeader() {
  return (
    <div className='p-3 shadow-sm flex justify-between items-center'>
       <Link href="http://localhost:3000/dashboard">
<Image src="/logo.svg" alt="logo" width={160} height={200}/>
</Link>
    <UserButton></UserButton>
    </div>
  )
}

export default AppHeader