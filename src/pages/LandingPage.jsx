import { Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import { FaLaptop, FaLock, FaTruck } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LandingPage = () => {
  const handleToast = () => toast("🚀 Welcome to Lync!");

  return (
    <div className="text-dark">
      <ToastContainer />

      {/* HERO SECTION */}
      <section className="position-relative vh-100 w-100 overflow-hidden text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ objectFit: "cover", zIndex: 0 }}
        >
          <source src="src/assets/ink.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1 }}
        ></div>

        {/* Foreground content */}
        <div
          className="container d-flex flex-column align-items-center justify-content-center h-100 text-center position-relative"
          style={{ zIndex: 2 }}
        >
          <h1 className="display-2 fw-bold mb-3 animate__animated animate__fadeInDown">
            Welcome to Lync
          </h1>
          <p className="lead mb-4 animate__animated animate__fadeInUp">
            Discover, compare, and buy the best tech curated just for you.
          </p>
          <Link
            to="/products"
            className="btn btn-primary btn-lg px-5 animate__animated animate__fadeIn"
            onClick={handleToast}
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* SPLINE SECTION */}
      <section className="bg-white py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3 animate__animated animate__fadeInUp">
            A Store That Glows
          </h2>
          <p className="text-muted mb-4 animate__animated animate__fadeInUp animate__delay-1s">
            A touch of interactivity and elegance for your digital journey.
          </p>
          <div
            className="rounded shadow-sm animate__animated animate__fadeIn"
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              borderRadius: "20px",
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <Spline scene="https://prod.spline.design/RyLQNywPgtv3LXnu/scene.splinecode" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <FaLaptop size={40} className="mb-3 text-primary" />
              <h5 className="fw-bold">
                Modern Tech{" "}
                <span className="badge bg-success ms-2">New</span>
              </h5>
              <p className="text-muted">
                Latest gadgets and devices curated for innovators.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <FaLock size={40} className="mb-3 text-primary" />
              <h5 className="fw-bold">Secure Payments</h5>
              <p className="text-muted">
                Encrypted and reliable checkout for your peace of mind.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <FaTruck size={40} className="mb-3 text-primary" />
              <h5 className="fw-bold">
                Fast Delivery{" "}
                <span className="badge bg-info ms-2">Express</span>
              </h5>
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
