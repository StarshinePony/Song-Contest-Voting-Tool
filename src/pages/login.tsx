import styles from '@/app/page.module.css'
import { LoginBtn } from '@/client/components';
import { useEffect, useState } from 'react';
import Credentials from '@/credentials';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { DB } from '@/db/database';
type Props = {
    candidates: string[],
    allowEntry: boolean
};
export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
    const candidates: string[] = await DB.instance.get_country_names();
    const { req } = context;
    const allowEntry: boolean = !!req.cookies.country_session && await Credentials.country_session_check(req.cookies.country_session);
    const userCountry: string | undefined = req.cookies.country_name;
    console.log(userCountry)
    console.log(allowEntry)

    const filteredCandidates = userCountry ? candidates.filter(country => country !== userCountry) : candidates;

    return { props: { candidates: filteredCandidates, allowEntry } };
};

export default function Login({ allowEntry }: { allowEntry: boolean }) {
    const [code, setCode] = useState('');
    const router = useRouter()

    if (allowEntry)
        return useEffect(() => { router.push('/country_voting') })

    const
        [uname, set_uname] = useState(''),
        [pass, set_pass] = useState('')

    return (
        <div className={styles.main}>
            <div className={styles.loginForm}>
                <h1>Country Login</h1>
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
                <LoginBtn api_route='login' page_route='country_voting' uname={uname} pass={pass} />
            </div>
        </div>
    );
};