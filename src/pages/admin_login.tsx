import styles from '@/app/page.module.css'
import { LoginButton } from '@/client/buttons';
import { useState } from 'react';

const Login = () => {
    const
        [uname, set_uname] = useState(''),
        [pass, set_pass] = useState('')

    return (
        <div>
            <input type='text' onChange={e => set_uname(e.target.value)}/>
            <input type='text' onChange={e => set_pass(e.target.value)}/>
            <LoginButton uname={uname} pass={pass}/>
        </div>
    );
};
  
export default Login;