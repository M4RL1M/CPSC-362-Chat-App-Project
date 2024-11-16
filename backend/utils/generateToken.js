import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userID, res) => {
const token = jwt.sign({userID}, process.env.JWT_SECRET, {
    expiresIn: "15d"
});

res.cookie("jwt", token, {
    httpOnly: true, // Prevent XSS attacks cross-site scripting attacks
    maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days)
})
}