import Link from 'next/link';
export default function Header() {
    return (
        <header className='header'>
            <div className="contain">
                <nav>
                <ul>
                    <div className="flexwrap">
                        <li>
                           <Link href="/">Home</Link>
                        </li>
                         <li>
                           <Link href="#">Swords</Link>
                        </li>
                         <li>
                           <Link href="#">Axes</Link>
                        </li>
                         <li>
                           <Link href="#">Knives & Daggers</Link>
                        </li>
                         <li>
                           <Link href="#">Spears & Polearms</Link>
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
                           <Link href="#">About Us</Link>
                        </li>
                         <li>
                           <Link href="#">Contact</Link>
                        </li>
                    </div>
                </ul>
            </nav>
            </div>
            
        </header>
    );
}

 


 
 

 

 

 

 

 

 
