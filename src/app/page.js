"use client";
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function Home() {

  const [selectedDate, setSelectedDate] = useState(null);
  const formOneRef = useRef(null);
  const formTwoRef = useRef(null);
  const optionsRef = useRef(null);
  const optionRef = useRef(null);
  useLayoutEffect(() => {
    gsap.set(formTwoRef.current, {
      autoAlpha: 0,
      y: -90,
      scale: 0.95,
    });

    gsap.set(formOneRef.current, {
      autoAlpha: 1,
      y: 0,
    });

    gsap.set(optionsRef.current, {
      backgroundColor: "rgba(62, 65, 148, 0.04)",
      color: "#000",
    });
  }, []);

  /* ----------------------------------
     SHOW FORM 2
  ---------------------------------- */
  const hide_bar_1 = () => {
    gsap.timeline({ overwrite: true })

    .to(optionsRef.current, {
        backgroundColor: "transparent",
        color: "#000",
         duration:0
      })
      .to(optionRef.current, {
        backgroundColor: "rgba(62, 65, 148, 0.04)",
        color: "#000",
        borderRadius:'10px 10px 0 0',
         duration:0
      })
      .to(formOneRef.current, {
        autoAlpha: 0,
        y: 100,
        scale: 0.95,
        duration: 0.6,
        ease: "power3.inOut",
      })
      
      
      .to(
        formTwoRef.current,
        {
          autoAlpha: 1,
          y: -86,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.1"
      );
  };

  /* ----------------------------------
     SHOW FORM 1
  ---------------------------------- */
  const hide_bar_2 = () => {
    gsap.timeline({ overwrite: true })
    .to(optionRef.current, {
        backgroundColor: "transparent",
        color: "#000",
        duration:0
      })
      .to(optionsRef.current, {
        backgroundColor: "rgba(62, 65, 148, 0.04)",
        color: "#000",
        borderRadius:'10px 10px 0 0',
         duration:0

      })
      .to(formTwoRef.current, {
        autoAlpha: 0,
        y: 100,
        scale: 0.95,
        duration: 0.6,
        ease: "power3.inOut",
      })
      .to(
        formOneRef.current,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.1"
      );
  };


  return (
    <>
      <section className="banner">
        <div className="contain">
          <div className="centerText">
            <h1>
              FastUK Couriers – Swift, Transparent Courier Services Across the UK
            </h1>
            <p>
              Book deliveries in minutes, track in real time, trusted riders on the road.
            </p>
          </div>

          <div className="full_bar">
            <div className="flexstart">
              <div className="options" ref={optionsRef} onClick={hide_bar_2}>
                <h5>Shipping</h5>
              </div>
              <div className="option" onClick={hide_bar_1} ref={optionRef}>
                <h5>Tracking</h5>
              </div>
            </div>
            <form action="" ref={formOneRef}>
              <div className="verti_bar flexbox">

                <div className="flexbox vertical_line">
                  <div className="headings">
                    <label htmlFor="">From:</label>
                    <input type="text" placeholder="Manchester" />
                  </div>
                  <div className="icon">
                    <div className="image">
                      <img src="images/MapPin.png" alt="" />
                    </div>
                  </div>
                </div>


                <div className="flexbox vertical_line">
                  <div className="headings">
                    <label htmlFor="">To:</label>

                    <input type="text" placeholder="Birmingham" />
                  </div>
                  <div className="icon">
                    <div className="image">
                      <img src="images/MapPin.png" alt="" />
                    </div>
                  </div>
                </div>


                <div className="flexbox vertical_line">
                  <div className="headings">
                    <label htmlFor="">Date:</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      placeholderText="Enter date"
                      dateFormat="dd MMM yyyy"
                      className="soft-rounded-input"
                      calendarClassName="soft-rounded-calendar"
                    />
                  </div>

                </div>


                <div className="search">
                  <button type="submit" className="seatch_color">

                    <div className="image">
                      <img src="/images/MagnifyingGlass (1).png" alt="" />
                    </div>

                  </button>
                </div>
              </div>
            </form>
            <form action="" ref={formTwoRef}>
              <div className="verti_bar flexbox">

                <div className="flexbox vertical_line">
                  <div className="headings">
                    <label htmlFor="">From:</label>
                    <input type="text" placeholder="Manchester" />
                  </div>
                  <div className="icon">
                    <div className="image">
                      <img src="images/MapPin.png" alt="" />
                    </div>
                  </div>
                </div>


                <div className="flexbox vertical_line">
                  <div className="headings">
                    <label htmlFor="">To:</label>

                    <input type="text" placeholder="Birmingham" />
                  </div>
                  <div className="icon">
                    <div className="image">
                      <img src="images/MapPin.png" alt="" />
                    </div>
                  </div>
                </div>


                <div className="flexbox vertical_line">
                  <div className="headings">
                    <label htmlFor="">Date:</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      placeholderText="Select date"
                      dateFormat="dd MMM yyyy"
                      className="soft-rounded-input"
                      calendarClassName="soft-rounded-calendar"
                    />
                  </div>

                </div>


                <div className="search">
                  <button type="submit" className="seatch_color">

                    <div className="image">
                      <img src="/images/MagnifyingGlass (1).png" alt="" />
                    </div>

                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="stats">
        <div className="contain">
          <div className="flexwrap">
            <div className="boxes">
              <div className="image">
                <img src="/images/image 1.png" alt="" />
              </div>
              <div className="box">
                <div className="num">
                  5,300+
                </div>
                <p>Successful parcel deliveries completed</p>
              </div>
            </div>
            <div className="boxes">
              <div className="image">
                <img src="/images/Rectangle 2.svg" alt="" />
              </div>
            </div>
            <div className="boxes">
              <div className="image">
                <img src="/images/image 2.svg" alt="" />
              </div>
              <div className="box">
                <div className="num">
                  5,300+
                </div>
                <p>Successful parcel deliveries completed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="howitworks">
        <div className="contain">
          <div className="flex">
            <div className="col_ flexbox">
              <div className="texts">
                <h2>How FastUK Supports Every Type of Sender</h2>
              </div>
              <div className="image">
                <img src="/images/Rectangle 4.svg" alt="" />
              </div>
            </div>
            <div className="col_">
              <div className="content flexbox">
                <li className="col_1">
                  <h3>Grow Your Reach</h3>
                  <p>Expand your delivery network through our nationwide rider fleet. Whether you’re an individual sending a one-time parcel or a business shipping daily, we help you deliver faster and build trust with your customers.</p>
                </li>
                <li className="col_1">
                  <h3>Configured For Your Needs</h3>
                  <p>Our platform is built for both personal and business use. From quick sign-ups to customized delivery options, you get full control over how, when, and where your parcels are collected and dropped off.</p>
                </li>
                <li className="col_1">
                  <h3>Secure & Reliable at Every Step</h3>
                  <p>Every delivery is tracked in real time, with complete data security and transparent communication between users and riders — so you always know where your parcel is.</p>
                </li>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="tracker">
        <div className="contain">
          <div className="main_heading">
            <h2>A Smarter Way to Manage Deliveries</h2>
          </div>
          <div className="flex">
            <div className="col_1">
              <strong>01</strong>
              <h4>On-Demand Booking</h4>
              <p>Book a pickup in minutes through our web platform.</p>
            </div>
            <div className="col_1">
              <strong>02</strong>
              <h4>Transparent Pricing</h4>
              <p>Know your costs upfront based on distance.</p>
            </div>
            <div className="col_1">
              <strong>03</strong>
              <h4>Real-Time Tracking</h4>
              <p>Follow your parcel every step of the way.</p>
            </div>
            <div className="col_1">
              <strong>04</strong>
              <h4>Rider Network</h4>
              <p>Trusted riders assigned instantly within your area.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="Delivery">
        <div className="contain">
          <div className="flex">
            <div className="col_">
              <div className="content">
                <h2>One Platform for All Your Delivery Needs</h2>
                <p>FastUK connects senders and riders through a seamless system. From individual parcels to regular business shipments, we handle everything from booking to delivery — with clear pricing, reliable service, and live tracking to keep you in control.</p>
              </div>
              <div className="flexwrap">
                <div className="flex">
                  <div className="image">
                    <img src="/images/image 4.svg" alt="" />
                  </div>
                  <div className="text">
                    <p>Fast Pickups — Riders available within minutes.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="image">
                    <img src="/images/image 7.svg" alt="" />
                  </div>
                  <div className="text">
                    <p>Business Tools — Special pricing and dashboards for business accounts.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="image">
                    <img src="/images/image 5.svg" alt="" />
                  </div>
                  <div className="text">
                    <p>Distance-Based Pricing — Fair, transparent charges for every parcel.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="image">
                    <img src="/images/image 6.svg" alt="" />
                  </div>
                  <div className="text">
                    <p>End-to-End Visibility — Track every delivery in real time.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col_">
              <div className="image">
                <img src="/images/image 10.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="services">
        <div className="contain">
          <div className="main_heading">
            <h1>Explore Our Core Services</h1>
            <p>Our local moving services are quick, efficient, and hassle-free. We handle everything from packing to unpacking, ensuring a stress-free transition.</p>
          </div>
          <div className="flexwrap">
            <div className="col_">
              <div className="image">
                <img src="/images/Rectangle 7.png" alt="" />
              </div>
            </div>
            <div className="col_ flex">
              <div className="icon">
                01
              </div>
              <h4>Local Parcel Delivery</h4>
              <p>Book local deliveries quickly and get your parcel picked up and dropped off the same day. Whether you’re sending important documents, urgent parcels, or bulk orders, FastUK Couriers ensures your items reach their destination on time, every time</p>
              <div className="btn">
                <a href="">Explore Now</a>
              </div>
            </div>
            <div className="col_ flex">
              <div className="icon">
                02
              </div>
              <h4>Business & Bulk Shipments</h4>
              <p>Our business delivery solution is perfect for e-commerce stores, offices, and organizations that rely on consistent, timely logistics. Through your dedicated business dashboard, you can manage multiple parcels, schedule daily or weekly pickups, and access exclusive business rates that help you save on costs.</p>
              <div className="btn">
                <a href="">Explore Now</a>
              </div>
            </div>
            <div className="col_">
              <div className="image">
                <img src="/images/Rectangle 4.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='Testimonials'>
        <div className="contain">
          <div className="flexbox">
            <div className="col_">
              <h2>We Provide Complete Assistance for Your Deliveries</h2>
              <div className="btn">
                <a href="List of Our Services">List of Our Services</a>
              </div>
            </div>
            <div className="col_">
              <div className="flexbox">
                <div className="image">
                  <img src="/images/crane 1.png" alt="" />
                </div>

                <h4>Door to Door Servcie</h4>
                <p>We pick up and deliver to any UK address.</p>

              </div>
            </div>
            <div className="col_">
              <div className="flexbox">
                <div className="image">
                  <img src="/images/earth 1.png" alt="" />
                </div>

                <h4>Live Parcel Tracking</h4>
                <p>Freight Transport – Road, air, and sea shipping for seamless global logistics.</p>

              </div>
            </div>
            <div className="col_">
              <div className="flexbox">
                <div className="image">
                  <img src="/images/earth 1 (1).png" alt="" />
                </div>

                <h4>Secure Handling</h4>
                <p>Every parcel is handled <br /> with care and <br /> accountability.</p>

              </div>
            </div>

          </div>
        </div>
      </section>
      <section className='section_1'>
        <div className="contain">
          <div className="bgcolor">
            <div className="flex">
              <div className="col_ content">
                <h2>Ready to Book Your Delivery? Let’s Do It Today!</h2>
                <p>Whether it’s a single parcel or daily business deliveries, FastUK Couriers gives you the speed, transparency, and reliability you need — all in one platform.</p>
                <div className="buttons">
                  <div className="btn"><a href="">
                    <div className="image">
                      <img src="/images/Call.svg" alt="" />
                    </div>
                    Request A Free Call
                  </a>
                  </div>
                  <div className="btn"><a href="">Let’s Contact Us</a></div>
                </div>
              </div>
              <div className="col_">
                <div className="image">
                  <img src="/images/image 11.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='last_section'>
        <div className="contain">
          <div className="flexbox">
            <div className="col_">
              <div className="image">
                <img src="/images/Rectangle 2.svg" alt="" />
              </div>
            </div>
            <div className="col_">
              <div className="content">
                <div className="flexgap">
                  <div className="main_head">
                    <h2>Customer Review</h2>
                    <p>We take pride in being your trusted home shifting partner. Relocation made stress-free with personalized assistance.</p>
                  </div>
                  <div className="blue_text">
                    <div className="flexgap">
                      <div className="image">
                        <img src="/images/Group 18581.svg" alt="" />
                      </div>
                      <div className="text">
                        <span>Fast Uk</span>
                      </div>
                    </div>
                  </div>
                  <div className="pera">
                    <p>“Our experience with the home shifting service was absolutely flawless, as the team handled every aspect of our move with precision and care. From the initial packing to the final setup at our new home, everything was done on time and without any stress.  The attention to detail they exhibited throughout the move was truly commendable and made the entire experience seamless. The staff was friendly and provided excellent customer support.”</p>
                  </div>
                  <div className="flexbox">
                    <div className="col_1">
                      <h3>Ryan Hughes</h3>
                      <h5>CEO at FastUk</h5>
                    </div>
                    <div className="col_1">
                      <div className="arrow"><button><div className="image"><img src="/images/Vector (1).svg" alt="" /></div></button></div>
                      <div className="arrow"><button><div className="image"><img src="/images/Vector (1).svg" alt="" /></div></button></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
