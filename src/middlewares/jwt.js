const { verifyJwt, getTokenFromHeaders } = require('../helpers/jwt');

const checkJwt = (request, response, next) => {
  const { url: path } = request; // alias

  // company creation and auth routes don't need to check auth
  const excludedPaths = [
    '/create-company',
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/refresh',
  ];

  const isExcluded = !!excludedPaths.find((p) => p.startsWith(path));
  // ignore token verification in excluded paths
  if (isExcluded) return next();

  const token = getTokenFromHeaders(request.headers);

  if (!token) {
    return response.jsonUnauthorized(null, 'Invalid token');
  }

  try {
    const decoded = verifyJwt(token);
    request.idUser = decoded.id;
    // eslint-disable-next-line no-console
    console.log('Decoded token', decoded);
    // console.log('Decoded token expiration date', new Date(decoded.exp * 1000));
    return next();
  } catch (err) {
    return response.jsonUnauthorized(null, 'Invalid token');
  }
};

module.exports = checkJwt;
