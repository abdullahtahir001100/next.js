"use client";
import Link from 'next/link';


export default function Animate_slider() {
    const messages = [
        { text: "MANUFACTURER & EXPORTER OF SWORDS, AXES, KNIVES & DAGGERS, SHIELDS & ARMOR", link: "/" },
        { text: "HIGH QUALITY HAND-FORGED DAMASCUS STEEL BLADES AND CUSTOM ORDERS", link: "/" },
        { text: "AUTHENTIC VIKING ARMORY AND MEDIEVAL REPLICAS FOR COLLECTORS", link: "/" }
    ];

    return (
        <section className="viking-ticker">
            <div className="ticker-container">
                <div className="ticker-track">
                    {/* First Set */}
                    {messages.map((m, i) => (
                        <div className="ticker-item" key={i}>
                            <h5>{m.text}</h5>
                            <Link href={m.link} className='ticker-link'>EXPLORE MORE</Link>
                        </div>
                    ))}
                    {/* Duplicate Set for Seamless Loop */}
                    {messages.map((m, i) => (
                        <div className="ticker-item" key={`dup-${i}`}>
                            <h5>{m.text}</h5>
                            <Link href={m.link} className='ticker-link'>EXPLORE MORE</Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}