import Link from 'next/link';

export default function Header() {
    return (
        <header className='header'>
            <div className="contain">
                <nav>
                    <ul className="main-nav"> 
                        <div className="flexwrap">
                            <li>
                                <Link href="/">Home</Link>
                            </li>

                            {/* DROPDOWN 1: SWORDS */}
                            <li className="dropdown-parent">
                                <Link href="/Products/Swords">Swords</Link>
                                <ul className="dropdown-menu">
                                    <li><Link href="/Products/Swords">Fantasy Sword</Link></li>
                                    <li><Link href="/Products/Swords">Viking Swords</Link></li>
                                </ul>
                            </li>

                            <li>
                                <Link href="/Products/Axes">Axes</Link>
                            </li>
                            
                            <li>
                                <Link href="/Products/Knives%20%26%20Daggers">Knives & Daggers</Link>
                            </li>

                            {/* DROPDOWN 2: SPEARS & POLEARMS */}
                            <li className="dropdown-parent">
                                <Link href="/Products/Spears%20%26%20Polearms">Spears & Polearms</Link>
                                <ul className="dropdown-menu">
                                    <li><Link href="/Products/Spears%20%26%20Polearms">Pocket Knives</Link></li>
                                    <li><Link href="/Products/Spears%20%26%20Polearms">Dagger Knives</Link></li>
                                    <li><Link href="/Products/Spears%20%26%20Polearms">Hunting Knives</Link></li>
                                </ul>
                            </li>

                            <li>
                                <Link href="/Products/Chef%20Set">Chef Set</Link>
                            </li>
                            
                            <li>
                                <Link href="/Products/Hammers%20%26%20Maces">Hammers & Maces</Link>
                            </li>
                            
                            <li>
                                <Link href="/Products/Shields%20%26%20Armor">Shields & Armor</Link>
                            </li>
                            
                            <li>
                                <Link href="/Products/Display%20%26%20Accessories">Display & Accessories</Link>
                            </li>

                            <li>
                                <Link href="/pages/about">About Us</Link>
                            </li>
                            
                            <li>
                                <Link href="/pages/contact">Contact</Link>
                            </li>
                        </div>
                    </ul>
                </nav>
            </div>
        </header>
    );
}