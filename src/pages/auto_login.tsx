import { useEffect } from 'react';
import { useRouter } from 'next/router';
import sytles from '../app/page.module.css'
const AutoLogin = () => {
    const router = useRouter();
    const { code } = router.query;

    useEffect(() => {
        if (code) {
            const login = async () => {
                const response = await fetch('/api/check_login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code })
                });

                const result = await response.json();

                if (result.success) {
                    if (!result.voted) {
                        router.push('/musician_voting');
                    } else {
                        router.push('/public_login');
                    }
                } else {
                    router.push('/public_login');
                }
            };

            login();
        }
    }, [code]);

    return (
        <main className={sytles.main}>
            <div className={sytles.header}>Logging in</div>
        </main>
    );
};

export default AutoLogin;
