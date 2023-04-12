import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { Rating, Typography, Grid } from "@mui/material";
import { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function Review({ review, id, onDelete }) {
  const auth = getAuth();
  const [value, setValue] = useState(5);
  const [user, setUser] = useState({
    name: auth.currentUser.displayName,
  });

  return (
    <>
      <li className="categoryListing">
        <Link
          to={`/reviews/${review.type}/${id}`}
          className="categoryListingLink"
        >
          <img
            src={review.imageUrls[0]}
            alt={review.title}
            className="categoryListingImg"
          />
          <div className="categoryListingDetails" style={{ height: "140px" }}>
            <Rating
              name="simple-controlled"
              value={review.rating}
              sx={{ fontSize: "16px" }}
              onChange={(e, newValue) => {
                setValue(newValue);
              }}
            />
            <div>
              <p className="categoryListingName">{review.title}</p>
              {onDelete && (
                <DeleteOutlineOutlinedIcon
                  color="#000000"
                  onClick={() => onDelete(review.id, review.title)}
                />
              )}
            </div>
            <div className="categoryListingInfoDiv">
              <Typography
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                  width: "220px",
                  fontSize: "14px",
                }}
              >
                {review.review}
              </Typography>
            </div>

            <Grid
              display="flex"
              justifyContent="flex-start"
              gap={2}
              textAlign="left"
            >
              <Grid item mt="4px">
                <Typography fontSize="14px" fontWeight={600}>
                  {auth.currentUser.displayName}
                </Typography>
              </Grid>
              <Grid item mt="4px">
                <Typography fontSize="14px">
                  {user && review.userRef === auth.currentUser.uid
                    ? "Verified Customer"
                    : null}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Link>

        {onDelete && (
          <DeleteOutlineOutlinedIcon
            color="red"
            onClick={() => onDelete(review.id, review.title)}
          />
        )}
      </li>
      <div style={{ display: "flex" }}>Hi Yeon</div>
    </>
  );
}
