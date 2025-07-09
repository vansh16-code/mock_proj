import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookie

  if (!token) {
    return res.status(401).json({ message: 'Not logged in. Please login to continue.' });
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.user = decoded; // Store user info in req
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default auth;
