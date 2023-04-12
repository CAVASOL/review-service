import { useState } from "react";

export default function CreateReview() {
  const [formData, setFormData] = useState({
    title: "",
    review: "",
    rating: 5,
    type: "product",
    verifiedUser: true,
    images: {},
  });

  return <div>CreateReview.......ha</div>;
}
