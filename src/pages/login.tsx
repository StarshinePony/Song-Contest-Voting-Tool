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
    let user

    if (!req.cookies.country_session || !(user = await DB.instance.get_candidate_by_session(req.cookies.country_session)))
        return { props: { candidates: [], allowEntry: false } }

    const filteredCandidates = candidates.filter(country => country !== user.country);

    return { props: { candidates: filteredCandidates, allowEntry: true } };
};

export default function Login({ allowEntry }: { allowEntry: boolean }) {
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