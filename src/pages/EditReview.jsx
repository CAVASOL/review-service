import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { storage, db } from "../firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { v4 } from "uuid";
import Spinner from "../components/Spinner";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";

export default function EditReview() {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [revieww, setRevieww] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams();
  const isMounted = useRef(true);
  const [formData, setFormData] = useState({
    title: "",
    userName: "",
    type: "product",
    rating: 5,
    review: "",
    images: [],
  });

  const { title, userName, type, rating, review, images } = formData;

  useEffect(() => {
    if (revieww && revieww.userRef !== auth.currentUser.uid) {
      toast.error("You are not authorized to edit this review!");
      navigate("/");
    }
  }, [auth.currentUser.uid, revieww, navigate]);

  useEffect(() => {
    setLoading(true);
    const getReview = async () => {
      const reviewDocRef = doc(db, "reviews", params.reviewId);
      const reviewDocSnap = await getDoc(reviewDocRef);
      const reviewData = reviewDocSnap.data();
      if (reviewDocSnap.exists()) {
        setRevieww(reviewData);
        setFormData({
          ...reviewDocSnap.data(),
        });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("No such review exists!");
      }
    };

    getReview();
  }, [params.reviewId, navigate]);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({
            ...formData,
            userRef: user.uid,
          });
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (images.length > 6) {
      setLoading(false);
      toast.error("You can only upload 6 images.");
      return;
    }

    const updateImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `images/${v4()}`);
        uploadBytes(storageRef, image).then(
          (snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              resolve(url);
            });
          },
          (error) => {
            reject(error);
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => updateImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error(error.message);
    });

    const reviewData = {
      ...formData,
      imageUrls,
      timestamp: serverTimestamp(),
    };

    delete reviewData.images;

    const reviewDocRef = doc(db, "reviews", params.reviewId);
    await updateDoc(reviewDocRef, reviewData);
    setLoading(false);
    toast.success("Review saved successfully!");
    navigate(`/reviews/${reviewData.type}/${reviewDocRef.id}`);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]:
          boolean ??
          (e.target.type === "number"
            ? e.target.valueAsNumber
            : e.target.value),
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Edit Review</p>
      </header>
      <button className="back" onClick={() => navigate("/profile")}>
        <KeyboardArrowLeftOutlinedIcon /> Back
      </button>
      <main>
        <form className="createReviewForm" onSubmit={onSubmit}>
          <label className="formLabel">Review about</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "product" ? "formButtonActive" : "formButton"}
              id="type"
              value="product"
              onClick={onMutate}
            >
              Product
            </button>
            <button
              type="button"
              className={
                type === "customer-service" ? "formButtonActive" : "formButton"
              }
              id="type"
              value="customer-service"
              onClick={onMutate}
            >
              Customer Service
            </button>
          </div>
          <label className="formLabel">Name</label>
          <input
            className="formInput"
            type="text"
            id="userName"
            value={userName}
            onChange={onMutate}
            required
          />
          <label className="formLabel">Title</label>
          <input
            className="formInput"
            type="text"
            id="title"
            value={title}
            onChange={onMutate}
            maxLength="32"
            minLength="4"
            required
          />
          <label className="formLabel">Rating</label>
          <p className="ratingInfo">It goes from 1 to 5.</p>
          <input
            className="formInputSmall"
            type="number"
            id="rating"
            value={rating ? rating : 1}
            onChange={onMutate}
            min="1"
            max="5"
            required
          />
          <label className="formLabel">Review</label>
          <textarea
            className="formInput"
            type="text"
            id="review"
            rows="5"
            value={review}
            onChange={onMutate}
            required
          />
          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover(max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            multiple
            accept=".jpg,.png,.jpeg"
            required
          />
          <button className="primaryButton createListingButton" type="submit">
            Create Review
          </button>
        </form>
      </main>
    </div>
  );
}
