import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
const linkSecret = "secret";

/**
 * GET
 * get user link
 * it wil help us to generate a link and to make an offer
 * ||
 * \/
 */
export const getUserLink = async (req, res) => {
  try {
    // console.log(req.app.get("professionalAppointments"));

    // const uuid = uuidv4();
    // const apptData = {
    //   fullName: "Faisal Shrideh",
    //   apptDate: Date.now() + 500000,
    //   uuid,
    //   clientName: "Person with no name",
    // };

    const apptData = req.app.get("professionalAppointments")[0];

    req.app.get("professionalAppointments").push(apptData);

    const token = jwt.sign(apptData, linkSecret);
    res.status(200).json({
      url: `http://localhost:5173/video-room?token=${token}`,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error getting user link",
      error: error,
    });
  }
};

// just for testing it will be removed
export const validateToken = async (req, res) => {
  try {
    // console.log("token => ", req)
    const token = req.body.token;

    const decodeData = jwt.verify(token, linkSecret);

    // console.log(req.app.get("professionalAppointment"));

    res.status(200).json({ decodeData });
  } catch (error) {
    return res.status(500).json({
      message: "error validating Token",
      error: error,
    });
  }
};

export const getProLink = async (req, res) => {
  try {
    const userData = {
      fullName: "Faisal Shrideh",
      proId: 1234,
    };

    const token = jwt.sign(userData, linkSecret);
    res.status(200).json(`http://localhost:5173/dashboard?token=${token}`);
  } catch (error) {
    return res.status(500).json({
      message: "error getting user link",
      error: error,
    });
  }
};
