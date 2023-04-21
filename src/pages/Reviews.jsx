import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import Review from "../components/Review";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";

export default function Reviews() {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, "reviews");
        const q = query(
          reviewsRef,
          where("type", "==", params.reviewType),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        const querySnap = await getDocs(q);

        const reviews = [];

        querySnap.forEach((doc) => {
          return reviews.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setReviews(reviews);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch reviews.");
      }
    };

    fetchReviews();
  }, [params.reviewType]);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.reviewType === "product"
            ? "About Product"
            : "About Customer Service"}
        </p>
      </header>
      <button className="back" onClick={() => navigate("/")}>
        <KeyboardArrowLeftOutlinedIcon /> Back
      </button>

      {loading ? (
        <Spinner />
      ) : reviews && reviews.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {reviews.map((review) => (
                <Review key={review.id} review={review.data} id={review.id} />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p style={{ textAlign: "center", fontWeight: "600" }}>
          No Reviews yet!
        </p>
      )}
    </div>
  );
}
