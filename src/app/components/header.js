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
