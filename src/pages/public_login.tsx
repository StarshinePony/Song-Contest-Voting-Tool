import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/app/page.module.css';
import Cookies from 'js-cookie';

export default function Login() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        const response = await fetch('/api/check_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });

        const result = await response.json();

        if (result.success) {
            if (result.votes > 0) {
                Cookies.set('loginCode', code);
                Cookies.set('remainingVotes', result.votes);
                router.push('/musician_voting');
            } else {
                setMessage('This code has no remaining votes.');
            }
        } else {
            setMessage('Invalid code');
        }
    };

    return (
        <div className={styles.main}> { }
            <div className={styles.loginForm}>
                <h1>Login</h1>
                <input
                    type='text'
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder='Enter your 6-digit code'
                    className={styles.inputField}
                />
                <button onClick={handleSubmit} className={styles.submitButton}>Submit</button>
                {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    );
}
