import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { Rating, Typography, Grid, Divider } from "@mui/material";
import { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function Review({ review, id, onDelete }) {
  const auth = getAuth();
  const [value, setValue] = useState(5);

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
          <div className="categoryListingDetails" style={{ height: "128px" }}>
            <Rating
              name="simple-controlled"
              value={review.rating}
              size="small"
              onChange={(e) => {
                setValue(value);
              }}
            />

            <Typography fontWeight={600} fontSize={16} m={0}>
              {review.title.length > 24
                ? `${review.title.slice(0, 24)}...`
                : `${review.title}`}
            </Typography>
            {onDelete && (
              <DeleteOutlineOutlinedIcon
                color="red"
                onClick={() => onDelete(review.id, review.title)}
              />
            )}

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
              {review.review.length > 88
                ? `"${review.review.slice(0, 88)}..."`
                : `"${review.review}"`}
            </Typography>

            <Grid
              display="flex"
              justifyContent="flex-start"
              gap={2}
              textAlign="left"
            >
              <Grid item>
                <Typography fontSize="14px" fontWeight={600}>
                  {(review.userRef === auth.currentUser.uid &&
                    auth.currentUser.displayName) ||
                    review.userName ||
                    "User"}
                </Typography>
              </Grid>
              <Grid item>
                {review.userRef || review.verifiedUser === true ? (
                  <Typography fontSize="14px">Verified Customer</Typography>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </div>
        </Link>
      </li>
      <Divider variant="middle" />
    </>
  );
}
