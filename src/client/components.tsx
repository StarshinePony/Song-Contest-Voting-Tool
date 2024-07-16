'use client'

import { useRouter } from 'next/navigation';
import styles from '@/app/page.module.css'


export function LoginBtn({ api_route, page_route, uname, pass }: { api_route: string, page_route: string, uname: string, pass: string }) {
  const router = useRouter()

  return (
    <button className={styles.submitButton} onClick={async () => {
      const response = await fetch(`/api/${api_route}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uname, pass }),
      });

      if ((await response.json()).result === 'success')
        router.push(`/${page_route}`)
      else
        alert("Invalid Credentials");
    }}>Login</button>
  )
}

export function NavBtn({ route, text }: { route: string, text: string }) {
  const router = useRouter()

  return (
    <button onClick={() =>
      router.push(`/${route}`)
    }>
      {text}
    </button>
  )
}