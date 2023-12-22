import jwt from "jsonwebtoken";
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
    const appData = {
      fullName: "Faisal Shrideh",
      date: Date.now() + 500000,
    };

    const token = jwt.sign(appData, linkSecret);

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

    res.status(200).json({ decodeData });
  } catch (error) {
    return res.status(500).json({
      message: "error validating Token",
      error: error,
    });
  }
};
