const CardComponent = () => {
    return (
        <article className="col">
            <div class="card shadow-sm">
                <img
                    src="https://placehold.co/300x200"
                    className="card-img-top"
                    alt="..."
                />
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">
                        Example text
                    </p>
                    <div class="d-flex justify-content-end align-items-center">
                        <div class="">
                            <button type="button" class="btn btn-sm btn-outline-secondary">
                                View
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default CardComponent