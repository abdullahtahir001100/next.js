import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    const logo_url = "https://vikingarmoryblades.com/cdn/shop/files/Viking_Armory_Blades_Logo.webp?v=1755453192&width=300";
    const search_icon_url = '/search.png'; 
    const icon_1_url = '/like.png';
    const icon_2_url = '/profile (1).png';
    const icon_3_url = '/shopping-cart.png';
    const burger_icon = '/menu.png'; // Make sure to add a burger icon in your public folder

    return (
        <header role="banner" className='main_header'>
            <div className="contain">
                <div className="flexbox">
                    
                    {/* MOBILE TRIGGERS (Hidden on Desktop) */}
                    <div className="mobile_triggers">
                        <button className="burger_btn" aria-label="Open Menu">
                            <Image src={burger_icon} alt="menu" width={25} height={25} />
                        </button>
                        <button className="mobile_search_btn" aria-label="Search">
                            <Image src={search_icon_url} alt="search" width={22} height={22} />
                        </button>
                    </div>

                    {/* Logo Section (Hidden on Mobile) */}
                    <div className="logo desktop_only">
                        <Link href="/" aria-label="Viking Armory Blades Home">
                            <div className="image">
                                <Image src={logo_url} alt="Logo" width={300} height={80} priority />
                            </div>
                        </Link>
                    </div>

                    {/* Search Section (Hidden on Mobile) */}
                    <div className="field desktop_only">
                        <form className="fill_field" role="search">
                            <div className="flex">
                                <input type="text" placeholder='Search the store' name="q" />
                                <button type="submit">
                                    <Image src={search_icon_url} alt="search" width={20} height={20} />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Navigation Section (Always visible icons) */}
                    <nav className="links">
                        <div className="icons">
                            <div className="flex">
                                <Link href="/wishlist">
                                    <div className="con">
                                       <div className="image">
                                         <Image src={icon_1_url} alt="wishlist" width={24} height={24} />
                                       </div>
                                        <span className="icon_text">Wish List</span>
                                    </div>
                                </Link>
                                <Link href="/account">
                                    <div className="con">
                                      <div className="image">
                                          <Image src={icon_2_url} alt="account" width={24} height={24} />
                                      </div>
                                        <span className="icon_text">Sign In</span>
                                    </div>
                                </Link>
                                <Link href="/cart">
                                    <div className="con top">
                                        <samp className='num_order'>3</samp>
                                       <div className="image">
                                         <Image src={icon_3_url} alt="cart" width={24} height={24} />
                                       </div>
                                        <span className="icon_text">Cart</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </nav>

                </div>
            </div>
        </header>
    );
}