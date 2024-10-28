import React, { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';

const BASE_URL_API = "https://parseapi.back4app.com"; // URL da API da Back4App
const HEADERS = {
    'X-Parse-Application-Id': 'eQmkeVQtx6RNdl7bJGBlWpeaWVVGpdWtGbOddDWR',
    'X-Parse-REST-API-Key': 'Zj3VDG1yPOgbhe3j61HLbrc6KTnX38GeIX6VSNq8',
    'Content-Type': 'application/json'
};

const Header = ({ showLoginForm, setShowLoginForm }) => {
    const [user, setUser] = useState(null);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [error, setError] = useState('');

    const formRef = useRef(null); // Ref para o formulário

    const checkUser = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        if (sessionToken) {
            const res = await fetch(`${BASE_URL_API}/functions/validade-token`, {
                method: 'POST',
                headers: {
                    ...HEADERS,
                    'X-Parse-Session-Token': sessionToken
                }
            });
            const result = await res.json();
            if (result.result) {
                setUser(result.result);
            }
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem('sessionToken');
        setUser(null);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch(`${BASE_URL_API}/functions/login`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('sessionToken', result.result.token);
                setUser(result.result);
                setShowLoginForm(false); // Esconde o formulário após o login
            } else {
                setError(result.error || 'Falha ao realizar login');
            }
        } catch (e) {
            setError('Erro ao conectar ao servidor.');
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch(`${BASE_URL_API}/functions/signup`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({ email, password, fullname })
            });

            const result = await response.json(); // Use 'response' ao invés de 'res'

            if (response.ok) {
                localStorage.setItem('sessionToken', result.result.token);
                setUser(result.result);
                setShowRegisterForm(false); // Esconde o formulário após o registro
            } else {
                setError(result.error || 'Falha ao realizar registro');
            }
        } catch (e) {
            setError('Erro ao conectar ao servidor.');
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        // Função para fechar o formulário ao clicar fora dele
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setShowLoginForm(false);
                setShowRegisterForm(false);
            }
        };

        // Adiciona o evento de clique ao documento
        document.addEventListener('mousedown', handleClickOutside);

        // Remove o evento ao desmontar o componente
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [formRef, setShowLoginForm]);

    return (
        <header className={styles.header}>
            {user ? (
                <div className={styles.userInfo}>
                    <span className={styles.userGreeting}>Bem vindo, {user.fullname || user.email}</span>
                    <button className={styles.logoutButton} onClick={handleLogout}>Sair</button>
                </div>

            ) : (
                <>
                    {!showLoginForm && !showRegisterForm && (
                        <div className={styles.authOptions}>
                            <button
                                onClick={() => setShowLoginForm(true)}
                                className={styles.authLink}
                            >
                                Entrar
                            </button>
                            <button
                                onClick={() => setShowRegisterForm(true)}
                                className={styles.authLink}
                            >
                                Registrar
                            </button>
                        </div>
                    )}
                </>
            )}

            {showLoginForm && (
                <div className={styles.login_container}>
                    <form ref={formRef} onSubmit={handleLogin} className={styles.loginForm}>
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
                        <p className={styles.switchFormText}>
                            Ou <button type="button" className={styles.switchFormButton} onClick={() => { setShowRegisterForm(true); setShowLoginForm(false); }}>registre</button>
                        </p>
                    </form>
                </div>
            )}

            {showRegisterForm && (
                <div className={styles.login_container}>
                    <form ref={formRef} onSubmit={handleRegister} className={styles.loginForm}>
                        <div className={styles.inputGroup}>
                            <label>Nome Completo</label>
                            <input
                                type="text"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                required
                            />
                        </div>
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
                            Registrar
                        </button>
                    </form>
                </div>
            )}
        </header>
    );
};

export default Header;
