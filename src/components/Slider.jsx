import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import Spinner from "../components/Spinner";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export default function Slider() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, "reviews");
        const q = query(reviewsRef, orderBy("timestamp", "desc"), limit(5));
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
  }, []);

  if (loading) {
    <Spinner />;
  }

  if (!reviews) {
    <></>;
  }

  return (
    reviews && (
      <>
        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {reviews.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/reviews/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                  height: "72vw",
                }}
                className="swiperSlideDiv"
              >
                <p className="swiperSlideText">{data.title}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}
