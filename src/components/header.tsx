import * as React from "react";
import styles from ".././shopApp.module.css";
import logo from "../images/droppe-logo.png";
import img1 from "../images/img1.png";
import img2 from "../images/img2.png";


interface props {

}

export const Header: React.FC<props> = () => (
    <>
        <div className={styles.header}>
            <div className={['container', styles.headerImageWrapper].join(' ')}>
                <img src={logo} className={styles.headerImage} alt="Droppe Logo"/>
            </div>
        </div>
        <span
            className={['container', styles.main].join(' ')}
            style={{margin: '50px inherit', display: 'flex', justifyContent: 'space-evenly'}}
        >
            <img src={img1} style={{maxHeight: "15em", display: 'block'}} alt="Packing Material"/>
            <img src={img2} style={{maxHeight: "15rem", display: 'block'}} alt="Installing Equipment"/>
           </span>
    </>
);
