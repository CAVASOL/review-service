import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { FormControl, TextField, Typography, Rating } from "@mui/material";
import Spinner from "../components/Spinner";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";

export default function CreateReview() {
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    review: "",
    rating: Number(value),
    type: "product",
    images: [],
  });

  const { title, review, rating, type, images } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
          setLoading(false);
        } else {
          navigate("/sign-in");
        }
      });
      return () => {
        isMounted.current = false;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    } else {
      boolean = false;
    }

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]:
          boolean ??
          (e.target.type === "number"
            ? e.target.valueAsNumber
            : e.target.value),
      }));
    }

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const storeImage = async (image) => {
      console.log(image);

      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      console.log(error);
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    console.log(imageUrls);

    setLoading(false);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header className="pageHeader">Create a Review</header>

      <main>
        <form className="createReviewForm" onSubmit={onSubmit}>
          <Typography
            variant="subtitle1"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <ArrowRightOutlinedIcon />
            What type of review would you like to create?
          </Typography>
          <div className="formButtons">
            <button
              id="type"
              value="product"
              type="button"
              onClick={onMutate}
              className={type === "product" ? "formButtonActive" : "formButton"}
            >
              Products
            </button>
            <button
              id="type"
              value="cs"
              type="button"
              onClick={onMutate}
              className={type === "cs" ? "formButtonActive" : "formButton"}
            >
              Customer Services
            </button>
          </div>

          <Typography
            variant="subtitle1"
            mt={2}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <ArrowRightOutlinedIcon /> How's your experience with our{" "}
            {type === "product" ? "product" : "CS"}?
          </Typography>

          <Rating
            id="rating"
            size="large"
            type="number"
            value={rating}
            name="simple-controlled"
            onChange={(e, newValue) => {
              setValue(newValue);
              setFormData({ ...formData, rating: newValue });
            }}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              m: 1,
            }}
          />
          <FormControl sx={{ m: 1 }}>
            <TextField
              required
              id="title"
              value={title}
              type="title"
              label="Title"
              onChange={onMutate}
            />
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <TextField
              id="review"
              value={review}
              type="review"
              label="Description"
              multiline
              rows={8}
              onChange={onMutate}
            />
          </FormControl>

          <Typography
            variant="subtitle1"
            mt={2}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <ArrowRightOutlinedIcon />
            Images (Images will be cover max 6.)
          </Typography>

          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Create Review
          </button>
        </form>
      </main>
    </div>
  );
}
