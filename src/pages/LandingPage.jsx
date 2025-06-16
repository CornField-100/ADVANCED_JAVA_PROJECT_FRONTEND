import { Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import { FaLaptop, FaLock, FaTruck } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="bg-light text-dark">
      {/* Hero Section */}
      <section className="vh-100 d-flex align-items-center animate__animated animate__fadeIn">
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-4">Welcome to PeakShop</h1>
          <p className="lead mb-4">
            Discover, compare, and buy the best tech curated just for you.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg px-5">
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Glowing 3D Decorative Section */}
      <section className="bg-white py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">A Store That Glows</h2>
          <p className="text-muted mb-4">
            A touch of interactivity and elegance for your digital journey.
          </p>
          <div
            className="rounded overflow-hidden shadow-sm"
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              borderRadius: "20px",
              pointerEvents: "none",
            }}
          >
            <Spline scene="https://prod.spline.design/RyLQNywPgtv3LXnu/scene.splinecode" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white animate__animated animate__fadeInUp">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <FaLaptop size={40} className="mb-3 text-primary" />
              <h5 className="fw-bold">Modern Tech</h5>
              <p className="text-muted">
                Latest gadgets and devices curated for innovators.
              </p>
            </div>
            <div className="col-md-4">
              <FaLock size={40} className="mb-3 text-primary" />
              <h5 className="fw-bold">Secure Payments</h5>
              <p className="text-muted">
                Encrypted and reliable checkout for your peace of mind.
              </p>
            </div>
            <div className="col-md-4">
              <FaTruck size={40} className="mb-3 text-primary" />
              <h5 className="fw-bold">Fast Delivery</h5>
              <p className="text-muted">
                Speedy and trackable deliveries right to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
