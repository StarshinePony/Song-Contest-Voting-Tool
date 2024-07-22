import styles from '@/app/page.module.css'
import Credentials from '@/credentials';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '@/app/globals.css'

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
        [candidateName, setCandidateName] = useState(''),
        [candidateSong, setCandidateSong] = useState(''),
        [candidateCountry, setCandidateCountry] = useState(''),
        [candidatePass, setCandidatePass] = useState(''),
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
                        <input type='text' onChange={e => setCandidateName(e.target.value)} placeholder='Name' />
                        <input type='text' onChange={e => setCandidateSong(e.target.value)} placeholder='Song' />
                        <input type='text' onChange={e => setCandidateCountry(e.target.value)} placeholder='Country' />
                        <input type='password' onChange={e => setCandidatePass(e.target.value)} placeholder='Password' />

                        <button onClick={async () => {
                            const response = await fetch('/api/add_candidate', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ candidateName, candidateSong, candidateCountry, candidatePass })
                            });

                            alert((await response.json()).result)
                        }}>
                            Add Candidate
                        </button>
                    </div>
                    <div className={styles.formSection}>
                        <input type='text' onChange={e => setCandidateName(e.target.value)} placeholder='Candidate Name' />
                        <button onClick={async () => {
                            const response = await fetch('/api/remove_candidate', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ candidateName })
                            });
                            alert((await response.json()).result)
                        }}>
                            Delete Candidate
                        </button>
                    </div>
                    <div className={styles.formSection}>
                        <input type='password' onChange={e => setCurrentPass(e.target.value)} placeholder='Current Password' />
                        <input type='password' onChange={e => setNewPass(e.target.value)} placeholder='New Password' />

                        <button onClick={async () => {
                            if (!currentPass || !newPass)
                                return

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
                    <div className={styles.formSection}>
                        <button onClick={async () => {
                            const response = await fetch('/api/get_rankings_csv', { method: 'GET' })

                            const resp_body = await response.json()
                            handleDownload(resp_body.csv, 'rankings')
                        }}>
                            Download Rankings
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};