    import React from "react";
    import { DotLottieReact } from "@lottiefiles/dotlottie-react";
    import styles from "./HeroBanner.module.css";

    export default function HeroBanner({ userName, setTab, onBookAppointments, onViewReports }) {
    return (
        <section className={styles.banner}>
        <div className={styles.content}>
            <h2>
            <span className={styles.title}>Welcome to <span>SHAPTS</span> Health Portal</span>
            </h2>
            <p className={styles.sub}>Your health, our priority — book appointments with trusted doctors anytime.</p>

            <div className={styles.actions}>
            <button
                className={styles.primary}
                onClick={() => {
                if (onBookAppointments) onBookAppointments(setTab);
                else if (setTab) setTab("appointments");
                }}
            >
                🩺 Book Appointment
            </button>

            <button
                className={styles.secondary}
                onClick={() => {
                if (onViewReports) onViewReports(setTab);
                else if (setTab) setTab("reports");
                }}
            >
                📋 View Reports
            </button>
            </div>
        </div>

        {/* Right side illustration */}
        <div className={styles.illustration}>
            <DotLottieReact
            src="/Doctor.lottie"
            autoplay
            loop
            style={{ width: "280px", height: "280px" }}
            />
        </div>
        </section>
    );
    }
