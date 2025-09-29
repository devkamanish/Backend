const url = require("url");

function parseUrl(fullUrl) {
  const parsed = new URL(fullUrl);

  // Convert query params into an object
  const queryParams = {};
  for (const [key, value] of parsed.searchParams.entries()) {
    queryParams[key] = value;
  }

  return {
    hostname: parsed.hostname,
    pathname: parsed.pathname,
    query: queryParams,
  };
}

module.exports = parseUrl;
