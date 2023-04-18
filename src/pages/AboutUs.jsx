import { useState, useEffect } from "react";
import { db } from "../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function AboutUs() {
  const [offices, setOffices] = useState([]);
  const officesCollectionRef = collection(db, "offices");

  useEffect(() => {
    const getOffices = async () => {
      const officesSnapshot = await getDocs(officesCollectionRef);
      setOffices(
        officesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    getOffices();
  }, [officesCollectionRef]);

  return (
    <>
      <div>
        <header>
          <p className="pageHeader">About Us</p>
        </header>
      </div>
      <div
        className="office-card"
        style={{ display: "grid", justifyContent: "center" }}
      >
        {offices.map((office) => (
          <Card
            sx={{
              width: "248px",
              m: 1.5,
            }}
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Office
              </Typography>
              <Typography variant="h5" component="div">
                {office.headline}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {office.open ? "Open" : "Closed"}
              </Typography>
              <Typography variant="body2">{office.location}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </>
  );
}
