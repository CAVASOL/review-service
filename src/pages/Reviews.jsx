import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function Reviews() {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);

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
          {params.reviewType === "product" ? "About Products" : "About CS"}
        </p>
      </header>

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
        <p>No Reviews for {params.reviewType}</p>
      )}
    </div>
  );
}
