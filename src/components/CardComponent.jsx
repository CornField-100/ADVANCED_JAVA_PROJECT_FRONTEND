import productImgPlaceholder from "../assets/image.png"

const CardComponent = ({ title, brand, stock, price, imageUrl }) => {
    return (
        <article className="col">
            <div className="card shadow-sm">
                <img
                    src={imageUrl || productImgPlaceholder}
                    className="card-img-top"
                    alt={`${title} image`}
                    style={{ minHeight: "380px", objectFit: "contain"}}
                />
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">
                        <strong>Brand:</strong> {brand}<br />
                        <strong>Stock:</strong> {stock}<br />
                        <strong>Price:</strong> ${price}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <button type="button" className="btn btn-sm btn-outline-primary">
                            View
                        </button>
                        <button type="button" className="btn btn-sm btn-primary">
                            Buy
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default CardComponent;
