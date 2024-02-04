export const isAdmin = (req, res, next) => {
    // Assuming you have user authentication middleware setting user information in req.user
    if (req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access forbidden. Admin access required.' });
    }
  };

  export const isUser = (req, res, next) => {
    if (req.user.role === 'user') {
      next(); 
    } else {
      res.status(403).json({ error: 'Access forbidden. Regular user access required.' });
    }
  };
  
