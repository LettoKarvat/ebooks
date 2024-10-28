import styles from "./listProducts.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL_API, PARSE_HEADERS } from '../../Api';


export const ListProducts = () => {
    const [data, setData] = useState([]);

    const listDataProducts = async () => {
        const res = await fetch(`${BASE_URL_API}/functions/getAllEbooks`, {
            method: "POST",
            headers: PARSE_HEADERS,
        });
        const response = await res.json();
        // Filtrar apenas os ebooks que possuem `site: 2`
        const filteredData = response.result.filter(item => item.site === 1);
        setData(filteredData);
    }
    useEffect(() => {
        listDataProducts();
    }, []);

    return (
        <div className={styles.container}>

            <div className={styles.list_products}>
                {data.map((item, index) => (
                    <div key={index} className={styles.list_items}>
                        <Link to={`/productsId/${item.id}`} className={styles.link}>
                            <img src={item.coverImageUrl} alt={item.title} width={200} />
                            <h2>{item.title}</h2>
                            <br />

                        </Link>
                        <Link to={`/productsId/${item.id}`} className={styles.link}>
                            <button className={styles.btn_info}>Mais informações</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};
