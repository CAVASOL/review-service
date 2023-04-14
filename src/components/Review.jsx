import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { Rating, Typography, Grid } from "@mui/material";
import { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function Review({ review, id, user, onDelete }) {
  const auth = getAuth();
  const [value, setValue] = useState(5);

  return (
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
            size="small"
            onChange={(e) => {
              setValue(value);
            }}
          />

          <Typography fontWeight={600} fontSize={20} m={0}>
            {review.title}
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
            {review.review}
          </Typography>

          <Grid
            display="flex"
            justifyContent="flex-start"
            gap={2}
            textAlign="left"
          >
            <Grid item>
              <Typography fontSize="14px" fontWeight={600}>
                {review.userRef === auth.currentUser.uid
                  ? auth.currentUser.displayName
                  : "User name"}
              </Typography>
            </Grid>
            <Grid item>
              {review.userRef && review.verifiedUser === true ? (
                <Typography fontSize="14px">Verified Customer</Typography>
              ) : (
                ""
              )}
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
  );
}
