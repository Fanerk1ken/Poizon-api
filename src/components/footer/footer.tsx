import styles from "./footer.module.scss";
import {IoLogoGithub as GitIcon} from "react-icons/io";
import {FaTelegram as TgIcon} from "react-icons/fa6";
import {BsFillFileEarmarkPdfFill as PdfIcon} from "react-icons/bs";


const Footer = () => {
    return (
        <div className={styles.footer}>
            <a href="https://github.com/Fanerk1ken" target="_blank" className={styles.link}>
                <div className={styles.iconWithLink}>
                    <GitIcon className={styles.linkIcon}/>
                    github
                </div>
            </a>
            <a href="https://t.me/faner1k" target="_blank" className={styles.link}>
                <div className={styles.iconWithLink}>
                    <TgIcon className={styles.linkIcon}/>
                    telegram
                </div>
            </a>
            <a href="https://drive.google.com/file/d/15cTUGU-yFiK9uuhDlOzxNucBNQ3_VMgm/view?usp=sharing"
               target="_blank" className={styles.link}>
                <div className={styles.iconWithLink}>
                    <PdfIcon className={styles.linkIcon}/>
                    CV
                </div>
            </a>
        </div>
    );
};

export default Footer;