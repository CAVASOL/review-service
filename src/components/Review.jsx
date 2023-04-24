import { Link } from "react-router-dom";
import { Rating, Typography, Grid, Divider } from "@mui/material";
import { useState } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Review({ review, id, onEdit, onDelete }) {
  const [value, setValue] = useState(5);

  return (
    <>
      <li className="categoryListing">
        <div className="editDelete">
          {onEdit && (
            <EditNoteIcon
              sx={{ color: "#2953CD", cursor: "pointer" }}
              onClick={() => onEdit(id)}
            />
          )}
          {onDelete && (
            <DeleteIcon
              sx={{ color: "#ff0000", cursor: "pointer" }}
              onClick={() => onDelete(review.id, review.title)}
            />
          )}
        </div>
        <div className="reviewDetails">
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
              <div className="listingTitleDelete">
                <Typography fontWeight={600} fontSize={16} m={0}>
                  {review.title.length > 24
                    ? `${review.title.slice(0, 24)}...`
                    : `${review.title}`}
                </Typography>
              </div>
              <Typography
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
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
                    {review.userName || "User"}
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
        </div>
      </li>
      <Divider variant="middle" />
    </>
  );
}
