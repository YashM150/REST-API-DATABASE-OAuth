import React from 'react';

function App() {
    
    const handleLogin = () => {
        window.open('http://localhost:3000/auth/google', '_self');
    };


    return (
        <div>
            <div className='Outer1'>
                <div className='Outer'>
                    <h1>Login Through OAuth</h1>
                    <button onClick={handleLogin} className='butn'>Login with Google</button>
                    <button onClick={handleLogin} className='butn'>Login with Google</button>
                    <button onClick={handleLogin} className='butn'>Login with Google</button>
                </div>
            </div>
           
        </div>
    );
}

export default App;
