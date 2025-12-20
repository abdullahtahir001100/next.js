import Link from "next/link";
import Image from "next/image";

const IMG = {
  loc: "public/visa.png",
  tel: "https://www.javehandmade.store/telephone.png",
  mail: "https://www.javehandmade.store/mail.png",
  adress: "https://www.javehandmade.store/3.png",
  visa: "/visa.png",
  mc: "https://www.javehandmade.store/3.png",
  ae: "https://www.javehandmade.store/3.png",
  ap: "https://www.javehandmade.store/mail.png",
};

export default function Footer() {
  return (
    <>
      <footer className="viking-footer">
        <div className="viking-container">

          {/* Newsletter Section */}
          <div className="viking-newsletter">
            <div className="viking-newsletter__text">
              <h3>NEWSLETTER SIGN UP</h3>
              <p>Receive our latest updates about our products and promotions.</p>
            </div>
            <form className="viking-newsletter__form">
              <input type="email" placeholder="enter your email address" />
              <button type="submit">SUBMIT</button>
            </form>
          </div>

          {/* Content Section */}
          <div className="viking-main">

            <div className="viking-col">
              <h4>INFORMATION</h4>
              <ul>
                <li><Link href="/">Home Page</Link></li>
                <li><Link href="/">About Us</Link></li>
                <li><Link href="/">Contact Us</Link></li>
                <li><Link href="/">Collections</Link></li>
                <li><Link href="/">Wishlist</Link></li>
              </ul>
            </div>

            <div className="viking-col">
              <h4>OUR CATEGORIES</h4>
              <ul>
                <li><Link href="/">Swords</Link></li>
                <li><Link href="/">Axes</Link></li>
                <li><Link href="/">Knives & Daggers</Link></li>
                <li><Link href="/">Chef Set</Link></li>
                <li><Link href="/">Spears & Polearms</Link></li>
                <li><Link href="/">Swords</Link></li>
                <li><Link href="/">Axes</Link></li>
                <li><Link href="/">Knives & Daggers</Link></li>
                <li><Link href="/">Chef Set</Link></li>
                <li><Link href="/">Spears & Polearms</Link></li>
              </ul>
            </div>

            <div className="viking-col">
              <h4>CUSTOMER SERVICE</h4>
              <ul>
                <li><Link href="/">General Conditions Of Sale And Use</Link></li>
                <li><Link href="/">Returns & Refunds</Link></li>
                <li><Link href="/">Shipping & Delivery Policy</Link></li>
                <li><Link href="/">Orders</Link></li>
              </ul>
            </div>

            <div className="viking-col">
              <h4>CONTACT US</h4>

              <div className="viking-contact">
                <div className="image">
                  <Image src={IMG.adress} alt="" width={18} height={18} />
                </div>
                <Link href="/">
                  <span>160 Madison Ave Freeport 11520 New York</span>
                </Link>
              </div>

              <div className="viking-contact">
                <div className="image">
                  <Image src={IMG.tel} alt="" width={18} height={18} />
                </div>
                <Link href="/">
                  <span>+1 (516) 574-1871</span>
                </Link>
              </div>

              <div className="viking-contact">
                <div className="image">
                  <Image src={IMG.mail} alt="" width={18} height={18} />
                </div>
                <Link href="/">
                  <span>vikingarmoryblades@gmail.com</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="viking-bottom">
        <p>
          Copyright © <b>Vikingarmoryblades</b> All Rights Reserved.
        </p>

        <div className="viking-payments">
          <div className="image">
            <Image src={IMG.visa} alt="Visa" width={40} height={25} />
          </div>
          <div className="image">
            <Image src={IMG.visa} alt="Visa" width={40} height={25} />
          </div>
          <div className="image">
            <Image src={IMG.visa} alt="Visa" width={40} height={25} />
          </div>
          <div className="image">
            <Image src={IMG.visa} alt="Visa" width={40} height={25} />
          </div>
          <div className="image">
            <Image src={IMG.visa} alt="Visa" width={40} height={25} />
          </div>
        </div>
      </div>
    </>
  );
}
