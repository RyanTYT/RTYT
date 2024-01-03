import styles from "@/components/Home/welcome.module.css";

export default function Welcome() {
    return (
        <div className={styles.welcome}>
            <div className={styles.background}>
                <img
                    src="./PersonalPhotoBackground.jpeg"
                    alt="Perosnal Photo Background"
                />
            </div>
            <img
                className={styles.image}
                src="./PersonalPhoto.jpeg"
                alt="RTYT!"
            />
            <div className={styles.message}>
                <div className={styles.header}>Hi! I&quot;m</div>
                <div className={styles.header_name}>
                    <div className={styles.header_name_row}>
                        <span className={styles.header_name_i}>R</span>
                        <span className={styles.header_name_i_after}>yan</span>
                        <span className={styles.header_name_i_small_space}>
                            T
                        </span>
                        <span className={styles.header_name_i_after}>an</span>
                    </div>
                    <div className={styles.header_name_row}>
                        <span className={styles.header_name_i_small_space}>
                            Y
                        </span>
                        <span className={styles.header_name_i_after}>an</span>
                        <span className={styles.header_name_i_small_space}>
                            T
                        </span>
                        <span className={styles.header_name_i_after}>ong</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
