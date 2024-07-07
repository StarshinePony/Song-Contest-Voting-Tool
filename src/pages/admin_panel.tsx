import styles from '@/app/page.module.css'
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
            <button onClick={() => {
                const new_values = type === "Artist" ? {
                    candidate_type: "Country",
                    input_type: "password",
                    ph1: "name",
                    ph2: "password",
                    ph3: "re-enter password"
                } : {
                    candidate_type: "Artist",
                    input_type: "text",
                    ph1: "name",
                    ph2: "country",
                    ph3: "song"
                } 
                setType(new_values.candidate_type); setInputType(new_values.input_type);
                setph1(new_values.ph1); setph2(new_values.ph2); setph3(new_values.ph3);
                setInput1(''); setInput2(''); setInput3('');
            }}>
                Change Type
            </button>

            <input type='text' onChange={e => setInput1(e.target.value)} placeholder={ph1} value={input1}/>
            <input type={inputType} onChange={e => setInput2(e.target.value)} placeholder={ph2} value={input2}/>
            <input type={inputType} onChange={e => setInput3(e.target.value)} placeholder={ph3} value={input3}/>
            
            
            <button onClick={async () => {
                const response = await fetch('/api/add_candidate', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ type, input1, input2, input3 })
                });

                alert((await response.json()).result ? "Candidate Successfully Added" : "Candidate Already Present")
            }}>
                Add {type}
            </button>
        </main>
    );
};
  
export default AdminPanel;