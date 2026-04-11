import { useState, useEffect } from "react";
import "./Home.css";

import farm1 from "../images/farm1.jpg";
import farm2 from "../images/farm2.jpg";
import farm3 from "../images/farm3.jpg";
import farm4 from "../images/farm4.jpg";
import About from "../components/about/About";

const slides = [
  {
    image: farm1,
    title: "Fresh From Farm To Your Table",
    text: "AgroFresh connects farmers directly with customers, eliminating middlemen and ensuring fair prices.",
  },
  {
    image: farm2,
    title: "100% Fresh & Organic Products",
    text: "Buy vegetables, fruits and grains directly from farmers near you.",
  },
  {
    image: farm3,
    title: "Empowering Farmers",
    text: "Helping farmers earn better profits and grow with modern technology.",
  },
  {
    image: farm4,
    title: "Smart Farming Support",
    text: "Get farming tips, government schemes and agricultural resources.",
  },
];

const Home = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(slider);
  }, []);

  return (
    <>
    <section className="hero">

      {slides.map((slide, index) => (
        <div
          className={index === current ? "slide active" : "slide"}
          style={{ backgroundImage: `url(${slide.image})` }}
          key={index}
        >
          <div className="overlay"></div>

          <div className="hero-content">
            <h1>{slide.title}</h1>
            <p>{slide.text}</p>

            <button className="hero-btn">
              Explore Marketplace
            </button>
          </div>
        </div>
      ))}

      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={index === current ? "dot active" : "dot"}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>

    </section>
     <section id="about">
        <About />
      </section>
      </>
  );
};

export default Home;