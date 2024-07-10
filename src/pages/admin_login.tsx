import styles from '@/app/page.module.css'
import { LoginBtn } from '@/client/components';
import { useEffect, useState } from 'react';
import Credentials from '@/credentials';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

export const getServerSideProps = ((context: GetServerSidePropsContext) => {
    const { req } = context
    const allowEntry: boolean = !!req.cookies.Auth && Credentials.admin_auth_check(req.cookies.Auth)
    return { props: { allowEntry } }
})

export default function Login({ allowEntry }: { allowEntry: boolean}) {
    const router = useRouter()

    if (allowEntry)
        return useEffect(() => {router.push('/admin_panel')})

    const
        [uname, set_uname] = useState(''),
        [pass, set_pass] = useState('')

    return (
        <div>
            <input type='text' onChange={e => set_uname(e.target.value)} placeholder='username'/>
            <input type='password' onChange={e => set_pass(e.target.value)} placeholder='password'/>
            <LoginBtn api_route='admin_login' page_route='admin_panel' uname={uname} pass={pass}/>
        </div>
    );
};