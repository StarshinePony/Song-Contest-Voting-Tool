import styles from '@/app/page.module.css'
import { AddCandidateBtn, ToggleCandidateTypeBtn } from '@/client/buttons';
import { useState } from 'react';

const AdminPanel = () => {
    // TODO: check that the auth cookie is valid to allow access
    const
        [type, setType] = useState("Artist"),
        [input1, setInput1] = useState(''),
        [input2, setInput2] = useState(''),
        [input3, setInput3] = useState(''),
        [ph1, setph1] = useState('name'),
        [ph2, setph2] = useState('song'),
        [ph3, setph3] = useState('country'),
        [inputType, setInputType] = useState('text')

    return (
        <main>
            <ToggleCandidateTypeBtn
            current_type={type}
            set_candidate={setType}
            set_input_type={setInputType}
            set_ph1={setph1}
            set_ph2={setph2}
            set_ph3={setph3}
        />
            <input type='text' onChange={e => setInput1(e.target.value)} placeholder={ph1}/>
            <input type={inputType} onChange={e => setInput2(e.target.value)} placeholder={ph2}/>
            <input type={inputType} onChange={e => setInput3(e.target.value)} placeholder={ph3}/>
            <AddCandidateBtn type={type} i1={input1} i2={input2} i3={input3}/>
        </main>
    );
};
  
export default AdminPanel;