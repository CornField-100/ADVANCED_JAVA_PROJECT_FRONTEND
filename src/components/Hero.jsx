import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="hero-section text-white text-center py-5"
      style={{
        background: "linear-gradient(45deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div className="container my-5">
        <h1 className="display-3 fw-bold">Welcome to Lync</h1>
        <p className="lead">
          Your one-stop shop for the latest and greatest in electronics.
        </p>
        <Link to="/products" className="btn btn-primary btn-lg mt-3">
          Explore Products
        </Link>
      </div>
    </section>
  );
};

export default Hero;
