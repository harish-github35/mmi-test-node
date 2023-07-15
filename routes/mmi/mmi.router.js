const { Router } = require("express");
const router = Router();
const getnewtoken = require("../../utils/getNewToken");
const gettokenfromfile = require("../../utils/getSavedToken");

//replicate this: buyer-app.ondc.org/mmi/api/mmi_pin_info?pincode=600099
/**
 * GET
 * /mmi/api/mmi_api_pin?pincode=600005
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

  let tokenObject = await gettokenfromfile();
  // get time
  const currentTimestamp = new Date().getTime();
  // get new token if expired
  if (
    !tokenObject ||
    (currentTimestamp - tokenObject.timestamp) / 1000 >= tokenObject.expires
  ) {
    // get new token from https://outpost.mappls.com/api/security/oauth/token
    tokenObject = await getnewtoken();
  }

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

  res.status(200).json(geocodeResponse);
});

module.exports = router;
