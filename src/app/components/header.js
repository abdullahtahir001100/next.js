<<<<<<< HEAD
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

 


 
 

 

 

 

 

 

 
=======
export default function Header() {
    return (
        <header>
            <div className="contain">
                <div className="flex">
                    <div className="logo">
                        <div className="image">
                             <img src="./images/logo.png" alt="" />
                        </div>
                    </div>
                    <nav>
                        <ul>
                            <div className="flex">
                                <li>
                                    <a href="">How It Works</a>
                                </li>
                                <li>
                                    <a href="">Services</a>
                                </li>
                                <li>
                                    <a href="">Business</a>
                                </li>
                                <li>
                                    <a href="">Rider</a>
                                </li>
                                <li>
                                    <a href="">Contact Us</a>
                                </li>
                            </div>
                        </ul>
                    </nav>
                    <div className="buttons">
                        <div className="flex">
                            <div className="btn">
                                <a href="">Sign Up</a>
                            </div>
                            <div className="btn">
                                <a href="">Track Parcel</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
>>>>>>> 9f7322267dc4f0f5eeff189603527f07cbc0ff55
