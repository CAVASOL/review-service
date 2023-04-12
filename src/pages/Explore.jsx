import { Link } from "react-router-dom";
import cs from "../assets/cs.jpg";
import products from "../assets/products.jpg";

export default function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>

      <main>
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to="/reviews/product">
            <img src={products} alt="product" className="exploreCategoryImg" />
            <p className="exploreCategoryName">Products</p>
          </Link>
          <Link to="/reviews/cs">
            <img src={cs} alt="cs" className="exploreCategoryImg" />
            <p className="exploreCategoryName">Customer Service</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
