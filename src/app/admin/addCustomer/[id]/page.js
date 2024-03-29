"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation.js";
import axios from "axios";
import NavBar from "@/components/navBar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";
import { useFormik } from "formik";
import BackButton from "../../../../components/backButton.js";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

export default function AddCustomer() {
  let serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  let router = useRouter();
  let [alert, setAlert] = useState(false);
  let [alertMessage, setAlertMessage] = useState();
  let [alertSeverity, setAlertSeverity] = useState();

  let [name, setCustomerName] = useState("");
  let [id, setId] = useState();
  let [logoUrl, setLogoUrl] = useState("");
  let [descreption, setDescription] = useState("");
  let [addressL1, setAddressL1] = useState("");
  let [addressL2, setAddressL2] = useState("");
  let [city, setCity] = useState("");
  let [state, setState] = useState("");
  let [country, setCountry] = useState("");
  let [countryCode, setCountryCode] = useState("");
  let [stateCode, setStateCode] = useState("");
  let [allProducts, setAllProducts] = useState([]);
  let [productString, setProductString] = useState();
  let [products, setProducts] = useState([]);

  function errAlert(errData) {
    let message = errData.message;
    let severity = errData.severity;
    setAlert(true);
    setAlertMessage(message);
    setAlertSeverity(severity);

    setTimeout(() => {
      setAlert(false);
    }, 3000);
  }

  async function handleAddCustomer(newCustomerData) {
    try {
      let token = localStorage.getItem("access_token");
      const response = await axios
        .post(`${serverUrl}/postCustomer`, newCustomerData, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          if (response.data.message == "This Customer Data Already Exist") {
            let errData = {
              message: "This Customer Data Already Exist",
              severity: "error",
            };
            errAlert(errData);
          } else if (response.status == 200) {
            let errData = {
              message: "Customer Data Submitted",
              severity: "success",
            };
            errAlert(errData);
            router.push("/admin/customerList");
          } else {
            let errData = {
              message: "There was an error. Please Try again later",
              severity: "error",
            };
            errAlert(errData);
            router.push("/admin/customerList");
          }
        });
    } catch (error) {
      if (error.status == 403) {
        router.push("/error");
      } else {
        let errData = {
          message: error.message,
          severity: "error",
        };
        errAlert(errData);
      }
    }
  }

  const addressFromik = useFormik({
    initialValues: {
      country: "India",
      state: null,
      city: null,
    },
    onSubmit: async (values) => {
      let newCustomerData = {
        name: name,
        id: id,
        logoUrl: logoUrl,
        descreption: descreption,
        addressL1: addressL1,
        addressL2: addressL2,
        city: city,
        state: state,
        country: country,
        products: products,
      };
      if (
        name == "" ||
        id == "" ||
        addressL1 == "" ||
        city == "" ||
        state == "" ||
        country == ""
      ) {
        let errData = {
          message: "Please fill all the mandatory fields",
          severity: "error",
        };
        errAlert(errData);
      } else if (
        /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png)/g.test(logoUrl) == false
      ) {
        let errData = {
          message: "Please enter valid image url",
          severity: "error",
        };
        errAlert(errData);
      } else {
        handleAddCustomer(newCustomerData);
      }
    },
  });

  const { values, handleSubmit, setFieldValue, setValues } = addressFromik;

  async function getAllProducts() {
    let token = localStorage.getItem("access_token");
    let role = localStorage.getItem("current_user_role");

    if (token && role == "admin") {
      try {
        await axios
          .get(`${serverUrl}/getAllProducts`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            let data = response.data;

            for (let i = 0; i < data.length; i++) {
              let prod = { id: data[i].id, name: data[i].name };
              setAllProducts((existingProds) => [...existingProds, prod]);
            }
          });
      } catch (error) {
        if (error.status == 403) {
          router.push("/error");
        } else {
          let errData = {
            message: error.message,
            severity: "error",
          };
          errAlert(errData);
        }
      }
    } else {
      router.push("/error");
    }
  }

  useEffect(() => {
    let path = window.location.pathname;
    let arr = path.split("/");
    let id = arr[3];
    setId(id);
    getAllProducts();
  }, []);

  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);

  return (
    <div className="main">
      <NavBar />
      <BackButton />
      <form className="addCustomerForm" onSubmit={handleSubmit}>
        <div className="addCustomerInputDiv">
          <div>
            <p className="addCustomerInputLable">Customer ID</p>
            <TextField
              fullWidth
              id="fullWidth"
              size="small"
              value={id}
              disabled
            />
          </div>
          <h3>Please Enter Customer Details</h3>
          <div>
            <p className="addCustomerInputLable">
              Customer Name <span style={{ color: "red" }}>*</span>
            </p>
            <TextField
              fullWidth
              id="fullWidth"
              size="small"
              placeholder="Customer Name"
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div>
            <p className="addCustomerInputLable">Logo URL</p>
            <TextField
              fullWidth
              id="fullWidth"
              size="small"
              placeholder="Logo URL"
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>

          <div>
            <p className="addCustomerInputLable">Description</p>
            <TextField
              fullWidth
              id="fullWidth"
              size="small"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <p className="addCustomerInputLable">
              Address Line 1 <span style={{ color: "red" }}>*</span>
            </p>
            <TextField
              fullWidth
              id="fullWidth"
              size="small"
              placeholder="Address Line 1"
              onChange={(e) => setAddressL1(e.target.value)}
            />
          </div>

          <div>
            <p className="addCustomerInputLable">Address Line 2</p>
            <TextField
              fullWidth
              id="fullWidth"
              size="small"
              placeholder="Address Line 2"
              onChange={(e) => setAddressL2(e.target.value)}
            />
          </div>

          <div>
            <p className="addCustomerInputLable">
              Country <span style={{ color: "red" }}>*</span>
            </p>
            <CountrySelect
              onChange={(e) => {
                setCountryid(e.id);
                setCountry(e.name);
                setCountryCode(e.iso3);
              }}
              placeHolder="Select Country"
            />
            <p className="addCustomerInputLable">
              State <span style={{ color: "red" }}>*</span>
            </p>
            <StateSelect
              countryid={countryid}
              onChange={(e) => {
                setstateid(e.id);
                setState(e.name);
                setStateCode(e.state_code);
              }}
              placeHolder="Select State"
            />
            <p className="addCustomerInputLable">
              City <span style={{ color: "red" }}>*</span>
            </p>
            <CitySelect
              countryid={countryid}
              stateid={stateid}
              onChange={(e) => {
                setCity(e.name);
              }}
              placeHolder="Select City"
            />
          </div>

          <div>
            <p className="addCustomerInputLable">Products</p>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={allProducts}
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Add Products"
                />
              )}
              onChange={(event, newProd) => {
                setProducts(newProd);
              }}
            />
          </div>
          {alert ? (
            <Alert severity={alertSeverity} style={{ marginTop: "10px" }}>
              {alertMessage}
            </Alert>
          ) : (
            <></>
          )}

          <Button type="submit" variant="contained">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
