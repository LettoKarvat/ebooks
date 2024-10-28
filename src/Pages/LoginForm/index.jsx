import React, { useState, forwardRef } from 'react';
import styles from './LoginForm.module.css';

export const LoginForm = forwardRef(({ onLogin, error }, ref) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onLogin(email, password);
    };

    return (
        <div ref={ref} className={styles.login_container}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <button className={styles.submitButton}>
                    Entrar
                </button>
            </form>
        </div>
    );
});
