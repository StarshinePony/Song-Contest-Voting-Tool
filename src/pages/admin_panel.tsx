import styles from '@/app/page.module.css'
import Credentials from '@/credentials';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const getServerSideProps = ((context: GetServerSidePropsContext) => {
    const { req } = context
    const allowEntry: boolean = !!req.cookies.Auth && Credentials.admin_auth_check(req.cookies.Auth)
    return { props: { allowEntry } }
})

export default function AdminPanel({ allowEntry }: { allowEntry: boolean }) {
    const router = useRouter()

    if (!allowEntry)
        return useEffect(() => { router.push('/admin_login') })

    const
        [musicianName, setMusicianName] = useState(''),
        [musicianSong, setMusicianSong] = useState(''),
        [musicianCountry, setMusicianCountry] = useState(''),
        [countryName, setCountryName] = useState(''),
        [countryPass, setCountryPass] = useState(''),
        [countryPass2, setCountryPass2] = useState(''),
        [currentPass, setCurrentPass] = useState(''),
        [newPass, setNewPass] = useState(''),
        [numAccounts, setNumAccounts] = useState(0);

    const handleDownload = (csv: string, file_name: string) => {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${file_name}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    Admin Panel
                </div>
                <div className={styles.formContainer}>
                    <div className={styles.formSection}>
                        <input type='text' onChange={e => setMusicianName(e.target.value)} placeholder='Name' />
                        <input type='text' onChange={e => setMusicianSong(e.target.value)} placeholder='Song' />
                        <input type='text' onChange={e => setMusicianCountry(e.target.value)} placeholder='Country' />

                        <button onClick={async () => {
                            const response = await fetch('/api/add_musician', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ musicianName, musicianSong, musicianCountry })
                            });

                            alert((await response.json()).result)
                        }}>
                            Add Musician
                        </button>
                    </div>
                    <div className={styles.formSection}>
                        <input type='password' onChange={e => setCurrentPass(e.target.value)} placeholder='Current Password' />
                        <input type='password' onChange={e => setNewPass(e.target.value)} placeholder='New Password' />

                        <button onClick={async () => {
                            if (!currentPass || !newPass)
                                return

                            if (newPass.length < 8)
                                return alert("Password must contain at least 8 characters")

                            const response = await fetch('/api/change_admin_password', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ currentPass, newPass })
                            });

                            const resp_body = await response.json()

                            alert(resp_body.result)
                        }}>
                            Change Admin Password
                        </button>
                    </div>
                    <div className={styles.formSection}>
                        <input type='text' onChange={e => setCountryName(e.target.value)} placeholder='Name' />
                        <input type='password' onChange={e => setCountryPass(e.target.value)} placeholder='Password' />
                        <input type='password' onChange={e => setCountryPass2(e.target.value)} placeholder='Re-enter Password' />

                        <button onClick={async () => {
                            if (countryPass !== countryPass2) {
                                alert("Passwords Do Not Match")
                                return
                            }

                            const response = await fetch('/api/create_country_account', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ countryName, countryPass })
                            });

                            alert((await response.json()).result)
                        }}>
                            Create Country Account
                        </button>
                    </div>
                    <div className={styles.formSection}>
                        <input type='number' onChange={e => setNumAccounts(parseInt(e.target.value))} placeholder='Number of Accounts' />

                        <button onClick={async () => {
                            const response = await fetch('/api/generate_logins', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ numAccounts })
                            });

                            const resp_body = await response.json();
                            handleDownload(resp_body.csv, 'logins');
                        }}>
                            Generate Logins
                        </button>
                    </div>
                    <button onClick={async () => {
                            const response = await fetch('/api/get_rankings_csv', { method: 'GET' })

                            const resp_body = await response.json()                            
                            handleDownload(resp_body.csv, 'rankings')
                        }}>
                            Download Rankings
                        </button>
                </div>
            </div>
        </main>
    );
};
