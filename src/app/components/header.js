import Link from 'next/link';

export default function Header() {
    return (
        <header className='header'>
            <div className="contain">
                <nav>
                    {/* Added a main-nav class for easier targeting */}
                    <ul className="main-nav"> 
                        <div className="flexwrap">
                            <li>
                                <Link href="/">Home</Link>
                            </li>

                            {/* DROPDOWN 1: SWORDS */}
                            <li className="dropdown-parent">
                                <Link href="#">Swords</Link>
                                <ul className="dropdown-menu">
                                    <li><Link href="#">Fantasy Sword</Link></li>
                                    {/* Add more sword types here if needed */}
                                </ul>
                            </li>

                            <li>
                                <Link href="#">Axes</Link>
                            </li>
                            <li>
                                <Link href="#">Knives & Daggers</Link>
                            </li>

                            {/* DROPDOWN 2: SPEARS & POLEARMS */}
                            <li className="dropdown-parent">
                                <Link href="#">Spears & Polearms</Link>
                                <ul className="dropdown-menu">
                                    <li><Link href="#">Pocket Knives</Link></li>
                                    <li><Link href="#">Dagger Knives</Link></li>
                                    <li><Link href="#">Hunting Knives</Link></li>
                                </ul>
                            </li>

                            <li>
                                <Link href="#">Chef Set</Link>
                            </li>
                            <li>
                                <Link href="#">Hammers & Maces</Link>
                            </li>
                            <li>
                                <Link href="#">Shields & Armor</Link>
                            </li>
                            <li>
                                <Link href="#">Display & Accessories</Link>
                            </li>
                            <li>
                                <Link href="/pages/about">About Us</Link>
                            </li>
                            <li>
                                <Link href="/ContactUs">Contact</Link>
                            </li>
                        </div>
                    </ul>
                </nav>
            </div>
        </header>
    );
}