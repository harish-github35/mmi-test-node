const { Router } = require("express");
const router = Router();
const gettoken = require("../../utils/getToken");

//replicate this: buyer-app.ondc.org/mmi/api/mmi_pin_info?pincode=600099
/**
 * GET
 * /mmi/api/mmi_pin_info?pincode=600005
 * 
 * Response:
 * {
  "copResults": {
    "houseNumber": "",
    "houseName": "",
    "poi": "",
    "street": "",
    "subSubLocality": "",
    "subLocality": "",
    "locality": "",
    "village": "",
    "subDistrict": "",
    "district": "Chennai District",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600005",
    "formattedAddress": "Chennai District, Chennai, Tamil Nadu, 600005",
    "eLoc": "600005",
    "confidenceScore": 1,
    "geocodeLevel": "pincode"
  }
}
 */
router.get("/mmi_pin_info", async (req, res) => {
  const { pincode } = req.query;
  if (!pincode) {
    res.status(400).json({
      data: null,
      error: true,
      error_message: "no pincode was found in request",
    });
  }

  let tokenObject = await gettoken();

  // use token to call https://atlas.mappls.com/api/places/geocode?address=pincode

  const result = await fetch(
    `https://atlas.mappls.com/api/places/geocode?address=${pincode}`,
    {
      method: "GET",
      headers: {
        Authorization: `${tokenObject.token_type} ${tokenObject.access_token}`,
      },
    }
  );
  const geocodeResponse = await result.json();

  res
    .status(200)
    .json({ data: geocodeResponse, error: false, error_message: "" });
});

//replicate this: buyer-app.ondc.org/mmi/api/mmi_place_info?eloc=600024
/**
 * GET
 * route: /mmi/api/mmi_place_info?eloc=600005
 * cookies: delivery_address:
 * {
    "id": "",
    "name": "",
    "email": "",
    "phone": "",
    "location": {
      "address": {
        "door": "",
        "name": null,
        "building": "",
        "street": "",
        "locality": null,
        "ward": null,
        "city": "",
        "state": "",
        "country": "",
        "areaCode": "",
        "tag": "Home"
      }
    }
  }
 * 
 * Response:
 * {
  "eloc": "600024",
  "name": "xyxyxy",
  "address": "xyxyxyx",

  PREMIUM:
  "latitude": 13.053529, 
  "longitude": 80.2254610000001
  }
 */
router.get("/mmi_place_info", async (req, res) => {
  const { eloc } = req.query;
  if (!eloc) {
    res.status(400).json({
      data: null,
      error: true,
      error_message: "no pincode was found in request",
    });
  }
  const deliveryAddress = JSON.parse(decodeURI(req.cookies.delivery_address));

  const {
   
      door,
      building,
      street,
      locality,
      city,
      state,
      country,
      areaCode,
    
  } = deliveryAddress;
  const location = `${door} ${building} ${street} ${locality} ${city} ${state} ${country} ${areaCode}`;

  let tokenObject = await gettoken();

  // use token to get eloc code https://atlas.mappls.com/api/places/geocode?address=
  const elocResult = await fetch(
    `https://atlas.mappls.com/api/places/geocode?address=${location}`,
    {
      method: "GET",
      headers: {
        Authorization: `${tokenObject.token_type} ${tokenObject.access_token}`,
      },
    }
  );
  const elocResultJson = await elocResult.json();

  // use token and eloc to get lat/long https://explore.mappls.com/apis/O2O/entity/{eloc}

  const result = await fetch(
    `https://explore.mappls.com/apis/O2O/entity/${elocResultJson.copResults.eLoc}`,
    {
      method: "GET",
      headers: {
        Authorization: `${tokenObject.token_type} ${tokenObject.access_token}`,
      },
    }
  );
  const geocodeResponse = await result.json();
  res
    .status(200)
    .json({ data: geocodeResponse, error: false, error_message: "" });
});

https: module.exports = router;
