import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL_API, PARSE_HEADERS } from '../../Api';
import styles from './productsId.module.css';

export const ProductsId = ({ setShowLoginForm }) => {
    const [loaded, setLoaded] = useState(false);
    const [item, setItem] = useState({});
    const [userEbooks, setUserEbooks] = useState([]);
    const [orderResponse, setOrderResponse] = useState(null);
    const [isCopied, setIsCopied] = useState(false); // Estado para gerenciar o estado de cópia
    const { id } = useParams();
    const navigate = useNavigate();

    const getItemById = async () => {
        setLoaded(true);
        const res = await fetch(`${BASE_URL_API}/functions/getEbookById`, {
            method: "POST",
            headers: PARSE_HEADERS,
            body: JSON.stringify({ ebookId: id })
        });
        const response = await res.json();
        setLoaded(false);
        setItem(response.result);
    };

    const checkUserEbooks = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        if (sessionToken) {
            const res = await fetch(`${BASE_URL_API}/functions/validade-token`, {
                method: "POST",
                headers: {
                    ...PARSE_HEADERS,
                    'X-Parse-Session-Token': sessionToken
                }
            });
            const result = await res.json();
            if (result.result) {
                setUserEbooks(result.result.ebooks || []);
            }
        }
    };

    useEffect(() => {
        getItemById();
        checkUserEbooks();
    }, [id]);

    const handleBuyClick = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
            setShowLoginForm(true);
        } else {
            try {
                const res = await fetch(`${BASE_URL_API}/functions/createOrder`, {
                    method: "POST",
                    headers: {
                        ...PARSE_HEADERS,
                        'X-Parse-Session-Token': sessionToken
                    },
                    body: JSON.stringify({ ebookId: id })
                });
                const result = await res.json();
                setOrderResponse(result.result);
                setIsCopied(false); // Resetar o estado de cópia ao exibir um novo pedido
            } catch (error) {
                console.error("Erro ao criar o pedido:", error);
                setOrderResponse({ error: "Erro ao criar o pedido. Tente novamente mais tarde." });
            }
        }
    };

    const handleReadInNewTabClick = async () => {
        const newWindow = window.open('', '_blank');
        if (!newWindow) {
            alert('Por favor, permita pop-ups para continuar.');
            return;
        }
        newWindow.document.write('<h3>Carregando conteúdo...</h3>');
        const res = await fetch(item.ebookFileUrl);
        const htmlContent = await res.text();
        newWindow.document.open();
        newWindow.document.write(htmlContent);
        const style = newWindow.document.createElement('style');
        style.textContent = `
            body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                max-width: 100%; 
                margin: 0 auto;
                line-height: 1.6;
            }
            img {
                max-width: 100%;
                height: auto;
            }
        `;
        newWindow.document.head.appendChild(style);
        newWindow.document.close();
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(orderResponse.copiaecola);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reseta o estado após 2 segundos
        } catch (error) {
            console.error("Erro ao copiar o código PIX:", error);
            alert("Erro ao copiar o código PIX.");
        }
    };

    const handleCloseOverlay = (event) => {
        if (event.target.classList.contains(styles['floating-overlay'])) {
            setOrderResponse(null);
        }
    };

    const userOwnsEbook = userEbooks.includes(id);

    return (
        <>
            {loaded && <h3>Aguarde...</h3>}
            <button onClick={handleBackClick} className={styles['back-button']}>
                &larr;
            </button>
            <div className={styles.container}>
                <div className={styles['product-card']}>
                    <img src={item.coverImageUrl} alt={item.title} className={styles['product-image']} />
                    <div className={styles['product-info']}>
                        <h2 className={styles['product-title']}>{item.title}</h2>
                        <strong className={styles['product-price']}>R$: {item.price}</strong>
                        <br />
                        <p className={styles['product-description']}>{item.description}</p>
                    </div>
                    <div className={styles['product-actions']}>
                        {userOwnsEbook ? (
                            <button onClick={handleReadInNewTabClick} className={styles['product-button']}>
                                Ler
                            </button>
                        ) : (
                            <button onClick={handleBuyClick} className={styles['product-button']}>
                                Comprar
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {orderResponse && (
                <div className={styles['floating-overlay']} onClick={handleCloseOverlay}>
                    <div className={styles['floating-window']}>
                        <h3>Detalhes do Pedido</h3>
                        <br />
                        <p><strong>Valor da Transação:</strong> R$ {orderResponse.total.toFixed(2)}</p>
                        <img src={orderResponse.qrCodeImage} alt="QR Code" className={styles['qr-code-image']} />
                        <div className={styles['transaction-info']}>

                            <button onClick={handleCopyCode} className={styles['copy-button']}>
                                {isCopied ? "Copiado" : "Copiar código PIX"}
                            </button>
                        </div>


                        <button onClick={() => setOrderResponse(null)} className={styles['close-button']}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
