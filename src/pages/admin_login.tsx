import styles from '@/app/page.module.css';
import { LoginBtn } from '@/client/components';
import { useEffect, useState } from 'react';
import Credentials from '@/credentials';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import '@/app/globals.css'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { req } = context;
    const allowEntry: boolean = !!req.cookies.Auth && Credentials.admin_auth_check(req.cookies.Auth);
    return { props: { allowEntry } };
};

export default function Login({ allowEntry }: { allowEntry: boolean }) {
    const router = useRouter();

    useEffect(() => {
        if (allowEntry) {
            router.push('/admin_panel');
        }
    }, [allowEntry, router]);

    const [uname, set_uname] = useState('');
    const [pass, set_pass] = useState('');

    return (
        <div className={styles.main}>
            <div className={styles.loginForm}>
                <h1>Admin Login</h1>
                <input
                    type='text'
                    value={uname}
                    onChange={e => set_uname(e.target.value)}
                    placeholder='Enter Username'
                    className={styles.inputField}
                />
                <input
                    type='password'
                    value={pass}
                    onChange={e => set_pass(e.target.value)}
                    placeholder='Enter Password'
                    className={styles.inputField}
                />
                <LoginBtn api_route='admin_login' page_route='admin_panel' uname={uname} pass={pass} />
            </div>
        </div>
    );
}
