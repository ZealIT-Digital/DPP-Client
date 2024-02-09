"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/navBar";
import { inputData } from "../../../../database/data";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea } from "@mui/material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Input from "@mui/joy/Input";

// MUI Tabs Functions - START
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
// MUI Tabs Functions - END

export default function CustomerDetials({ params }) {
  let customerId = params.customerId;
  let [customerDetail, setCustomerDetail] = useState([]);
  let [productDetails, setProductDetails] = useState([]);
  let [selectedProduct, setSelectedProduct] = useState({});

  // MUI Tabs Variables -START
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // MUI Tabs Variables -END

  // Function to get the selected customer detials and product details
  const getDetails = async () => {
    const customerData = await axios
      .get(`http://localhost:9000/getCustomer/${customerId}`)
      .then((res) => {
        setCustomerDetail(res.data);
      });
    const productData = await axios
      .get(`http://localhost:9000/getProducts/${customerId}`)
      .then((res) => setProductDetails(res.data));
  };
  useEffect(() => {
    getDetails();
  }, []);

  return (
    <div className="main">
      <NavBar />
      <div className="productDetials-div">
        {/* ------------------------------Left Plane section - START */}
        <section className="left-panel">
          {/* ----------------------------------- Left Plane Logo and Title - START */}
          <section className="left-panel-title">
            <img
              src={customerDetail.logoUrl}
              width={50}
              height={50}
              alt="Picture of the author"
            />
            <h3>{customerDetail.name}</h3>
          </section>
          {/* ----------------------------------- Left Plane Logo and Title - END */}

          {/* ----------------------------------- Left Plane Scroll Section - START */}
          <section className="left-panel-scroll">
            <section className="left-panel-scroll-content">
              {productDetails.map((product) => (
                <Button
                  variant="text"
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                  }}
                >
                  <Card sx={{ minWidth: 200, maxWidth: 200, maxHeight: 170 }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="80"
                        image={product.imageUrl}
                        alt="green iguana"
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {product.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Button>
              ))}
            </section>
          </section>
          {/* ----------------------------------- Left Plane Logo and Title - END */}
        </section>
        {/* ----------------------------------- Left Plane section - END */}

        {/* ------------------------------Right Plane section - START */}
        <section className="right-panel">
          {/* ------------------------------Right Plane title section - START */}
          <section className="right-panel-title">
            <h2>
              {customerDetail.name + " " + "-" + " " + selectedProduct.name}
            </h2>
          </section>
          {/* ------------------------------Right Plane title section - END */}

          {/* ------------------------------Right Plane pinned section - START */}
          <section className="right-panel-pinned-section">
            <div className="right-panel-pinned-section-content">
              <h5>Customer Description</h5>
              {customerDetail.descreption}
            </div>
            <div className="right-panel-pinned-section-content">
              <h5>Address</h5>
              {customerDetail.addressL1}, {customerDetail.addressL2}
              <br></br>
              {customerDetail.city}, {customerDetail.state}
              <br></br>
              {customerDetail.country}.
            </div>
            {/* <div className="right-panel-pinned-section-content">
              <h5>Price:</h5>
              <h2>$ {selectedProduct.price}</h2>
              <h5>Category</h5>
              {selectedProduct.category}
            </div> */}
          </section>
          {/* ------------------------------Right Plane pinned section - END */}
          {/* ------------------------------Right Plane scroll section - START */}
          <section className="right-panel-scrollable-section">
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link active"
                  id="nav-tab1-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-tab1"
                  type="button"
                  role="tab"
                  aria-controls="nav-tab1"
                  aria-selected="true"
                >
                  General Product Details
                </button>
                <button
                  className="nav-link"
                  id="nav-tab2-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-tab2"
                  type="button"
                  role="tab"
                  aria-controls="nav-tab2"
                  aria-selected="false"
                >
                  Tab 2
                </button>
                <button
                  className="nav-link"
                  id="nav-tab3-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-tab3"
                  type="button"
                  role="tab"
                  aria-controls="nav-tab3"
                  aria-selected="false"
                >
                  Tab 3
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="nav-tab1"
                role="tabpanel"
                aria-labelledby="nav-tab1-tab"
                tabindex="0"
              >
                ...
              </div>
              <div
                className="tab-pane fade"
                id="nav-tab2"
                role="tabpanel"
                aria-labelledby="nav-tab2-tab"
                tabindex="0"
              >
                <div className="right-panel-scroll">
                  <div className="right-panel-scroll-content">
                    {inputData.map((input, index) => (
                      <section
                        className="right-panel-scroll-content-input-div"
                        key={index}
                      >
                        <p>{input}</p>
                        <Input
                          placeholder="Type in here…"
                          sx={{ width: 300 }}
                        />
                      </section>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="nav-tab3"
                role="tabpanel"
                aria-labelledby="nav-tab3-tab"
                tabindex="0"
              >
                ...
              </div>
            </div>
          </section>
          {/* ------------------------------Right Plane scroll section - END */}
        </section>
        {/* ------------------------------Right Plane section - END */}
      </div>
    </div>
  );
}
