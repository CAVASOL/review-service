import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import Rating from "@mui/material/Rating";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export default function SingleReview() {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const getReview = async () => {
      const reviewDocRef = doc(db, "reviews", params.reviewId);
      const reviewDocSnap = await getDoc(reviewDocRef);

      if (reviewDocSnap.exists()) {
        setReview(reviewDocSnap.data());
        setLoading(false);
      }
    };

    getReview();
  }, [params.reviewId]);

  if (loading) {
    <Spinner />;
  }

  return (
    <main>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {review.imageUrls.map((url, i) => (
          <SwiperSlide key={i}>
            <div
              style={{
                background: `url(${review.imageUrls[i]}) center no-repeat`,
                backgroundSize: "cover",
                height: "80vw",
              }}
              className="swiperSlideDiv"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="SingleReviewBtns">
        <button
          className="back"
          onClick={() => navigate(`/reviews/${review.type}`)}
        >
          <KeyboardArrowLeftOutlinedIcon /> Back
        </button>
        <button
          className="shareBtn"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLink(true);
            setTimeout(() => {
              setShareLink(false);
            }, 2000);
          }}
        >
          <ShareOutlinedIcon />
          {shareLink && <p className="linkCopied">"Copied!"</p>}
        </button>
      </div>
      <div className="listingDetails">
        <Rating name="read-only" value={review.rating} readOnly />
        <p className="listingName">{review.title}</p>
        <p>{review.review}</p>
      </div>
    </main>
  );
}
