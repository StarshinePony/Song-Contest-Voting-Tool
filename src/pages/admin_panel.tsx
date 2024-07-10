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
        return useEffect(() => {router.push('/admin_login')})

    const
        [musicianName, setMusicianName] = useState(''),
        [musicianSong, setMusicianSong] = useState(''),
        [musicianCountry, setMusicianCountry] = useState(''),
        [countryName,setCountryName] = useState(''),
        [countryPass,setCountryPass] = useState(''),
        [countryPass2,setCountryPass2] = useState(''),
        [currentPass, setCurrentPass] = useState(''),
        [newPass, setNewPass] = useState('')

    return (
        <main>
            <div>
                <input type='text' onChange={e => setMusicianName(e.target.value)} placeholder='name'/>
                <input type='text' onChange={e => setMusicianSong(e.target.value)} placeholder='song'/>
                <input type='text' onChange={e => setMusicianCountry(e.target.value)} placeholder='country'/>
                
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
            <div>
                <input type='password' onChange={e => setCurrentPass(e.target.value)} placeholder='current password'/>
                <input type='password' onChange={e => setNewPass(e.target.value)} placeholder='new password'/>
                
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
            <div>
                <input type='text' onChange={e => setCountryName(e.target.value)} placeholder='name'/>
                <input type='password' onChange={e => setCountryPass(e.target.value)} placeholder='password'/>
                <input type='password' onChange={e => setCountryPass2(e.target.value)} placeholder='re-enter password'/>
                
                <button onClick={async () => {
                    // TODO: change this to display above the creation button in red text
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
        </main>
    );
};