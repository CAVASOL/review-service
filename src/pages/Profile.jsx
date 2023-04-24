import { getAuth, updateProfile } from "firebase/auth";
import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import Spinner from "../components/Spinner";
import Review from "../components/Review";

export default function Profile() {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserReviews = async () => {
      const q = query(
        collection(db, "reviews"),
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);

      const reviews = [];
      querySnapshot.forEach((doc) => {
        return reviews.push({ id: doc.id, data: doc.data() });
      });

      setReviews(reviews);
      setLoading(false);
    };

    fetchUserReviews();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onEdit = (reviewId) => navigate(`/edit-review/${reviewId}`);
  const onDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteDoc(doc(db, "reviews", reviewId));
      const newReviews = reviews.filter((review) => review.id !== reviewId);
      setReviews(newReviews);
      toast.success("Review deleted successfully");
    }
  };

  if (loading) {
    <Spinner />;
  }

  return (
    <>
      <div className="profile">
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <button className="logOut" type="logOut" onClick={onLogout}>
            Logout
          </button>
        </header>
        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Profile Details</p>
            <p
              className="changePersonalDetails"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? "done" : "change"}
            </p>
          </div>
          <div className="profileCard">
            <form>
              <input
                type="text"
                id="name"
                value={name}
                className={!changeDetails ? "profileName" : "profileNameActive"}
                disabled={!changeDetails}
                onChange={onChange}
              />
              <input
                type="text"
                id="email"
                value={email}
                className={
                  !changeDetails ? "profileEmail" : "profileEmailActive"
                }
                disabled={!changeDetails}
                onChange={onChange}
              />
            </form>
          </div>
          <Link to="/create-review" className="createListing">
            <DriveFileRenameOutlineOutlinedIcon />
            <p>Create a Review</p>
            <KeyboardArrowRightIcon />
          </Link>
          {!loading && reviews?.length > 0 && (
            <>
              <p className="listingText">My Reviews</p>
              <ul style={{ padding: "0 20px" }}>
                {reviews.map((review) => (
                  <Review
                    key={review.id}
                    review={review.data}
                    id={review.id}
                    onEdit={() => onEdit(review.id)}
                    onDelete={() => onDelete(review.id)}
                  />
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </>
  );
}
