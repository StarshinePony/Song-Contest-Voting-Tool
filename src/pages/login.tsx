import styles from '@/app/page.module.css'
import { LoginBtn } from '@/client/components';
import { useEffect, useState } from 'react';
import Credentials from '@/credentials';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

export const getServerSideProps = (async (context: GetServerSidePropsContext) => {
    const { req } = context
    const allowEntry: boolean = !!req.cookies.country_session && await Credentials.country_session_check(req.cookies.country_session)
    return { props: { allowEntry } }
})

export default function Login({ allowEntry }: { allowEntry: boolean }) {
    const router = useRouter()

    if (allowEntry)
        return useEffect(() => { router.push('/country_voting') })

    const
        [uname, set_uname] = useState(''),
        [pass, set_pass] = useState('')

    return (
        <div>
            <input type='text' onChange={e => set_uname(e.target.value)} placeholder='username' />
            <input type='password' onChange={e => set_pass(e.target.value)} placeholder='password' />
            <LoginBtn api_route='login' page_route='country_voting' uname={uname} pass={pass} />
        </div>
    );
};