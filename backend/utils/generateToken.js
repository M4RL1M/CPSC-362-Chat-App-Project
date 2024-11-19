import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: "15d",
});

res.cookie("jwt", token, {
    httpOnly: true,     // Prevent XSS attacks cross-site scripting attacks
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days)
    sameSite: "strict", // Prevent CSRF attacks cross-site
    secure: process.env.NODE_ENV !== "developmet"
});
};

export default generateTokenAndSetCookie;