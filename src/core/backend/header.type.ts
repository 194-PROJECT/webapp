export interface HttpHeader {
	// Authentication
	'WWW-Authenticate': string;
	Authorization: string; // Basic, Bearer, Digest, HOBA, Mutual, AWS4-HMAC-SHA256
	'Proxy-Authenticate': string;
	'Proxy-Authorization': string;
	// Caching
	Age: string; // seconds
	'Cache-Control': string; // max-age, max-stale, min-fresh, no-cache, no-store, no-transform, only-if-cached, must-revalidate, public, private, proxy-revalidate, s-maxage
	'Clear-Site-Data': string; // "cache", "cookies", "storage", "executionContexts"
	Expires: string; // Date
	Pragma: string;
	'No-Vary-Search': string;
	// Conditionals
	'Last-Modified': string; // Date
	ETag: string;
	'If-Match': string;
	'If-None-Match': string;
	'If-Modified-Since': string;
	'If-Unmodified-Since': string;
	Vary: string;
	// Connection Management
	Connection: string; // close, keep-alive
	'Keep-Alive': string; // timeout, max
	// Content Negotiation
	Accept: string; //  <media-type>/<MIME_subtype>, <media-type>/*, */*
	'Accept-Encoding': string; // gzip, compress, deflate, br, identity, *
	'Accept-Language': string; // <language>, <language>[-<region>], *
	'Accept-Patch': string;
	'Accept-Post': string;
	// Controls
	Expect: string;
	'Max-Forwards': string;
	// Cookies
	Cookie: string; // name=value
	'Set-Cookie': string; // name=value, expires, max-age, domain, path, secure, httponly, samesite, priority
	// CORS
	'Access-Control-Allow-Credentials': string;
	'Access-Control-Allow-Headers': string;
	'Access-Control-Allow-Methods': string;
	'Access-Control-Allow-Origin': string;
	'Access-Control-Expose-Headers': string;
	'Access-Control-Max-Age': string;
	'Access-Control-Request-Headers': string;
	'Access-Control-Request-Method': string;
	Origin: string;
	'Timing-Allow-Origin': string;
	// Downloads
	'Content-Disposition': string;
	// Integrity Digests
	'Content-Digest': string;
	'Repr-Digest': string;
	'Want-Content-Digest': string;
	'Want-Repr-Digest': string;
	// Message Body Information
	'Content-Encoding': string;
	'Content-Language': string;
	'Content-Length': string;
	'Content-Location': string;
	'Content-Type': string;
	// Proxies
	Forwarded: string;
	Via: string;
	// Range Requests
	Range: string;
	'If-Range': string;
	'Accept-Ranges': string;
	'Content-Range': string;
	// Redirects
	Location: string; // URI
	Refresh: string; // seconds
	// Request Context
	From: string; // email address
	Host: string; // domain name
	Referer: string; // URI
	'Referrer-Policy': string;
	'User-Agent': string; // product/version comment (typically browser and device)
	// Response Context
	Allow: string;
	Server: string;
	// Security
	'Cross-Origin-Embedder-Policy': string;
	'Cross-Origin-Opener-Policy': string;
	'Cross-Origin-Resource-Policy': string;
	'Content-Security-Policy': string;
	'Content-Security-Policy-Report-Only': string;
	'Expect-CT': string;
	'Permissions-Policy': string;
	'Reporting-Endpoints': string;
	'Strict-Transport-Security': string;
	'Upgrade-Insecure-Requests': string;
	'X-Content-Type-Options': string;
	'X-DNS-Prefetch-Control': string;
	'X-Download-Options': string;
	'X-Frame-Options': string;
	'X-Permitted-Cross-Domain-Policies': string;
	'X-Powered-By': string;
	'X-XSS-Protection': string;
	// Fetch Metadata Request Headers
	'Sec-Fetch-Site': string;
	'Sec-Fetch-Mode': string;
	'Sec-Fetch-User': string;
	'Sec-Fetch-Dest': string;
	'Sec-Purpose': string;
	// Server-Sent Events
	'Reporting-Enderpoints': string;
	'Report-To': string;
	// Transfer Coding
	'Transfer-Encoding': string;
	TE: string;
	Trailer: string;
	// WebSockets
	'Sec-WebSocket-Key': string;
	'Sec-WebSocket-Extensions': string;
	'Sec-WebSocket-Accept': string;
	'Sec-WebSocket-Protocol': string;
	'Sec-WebSocket-Version': string;
	// Other
	'Alt-Svc': string;
	'Alt-Used': string;
	Date: string;
	Link: string;
	'Retry-After': string;
	'Server-Timing': string;
	'Service-Worker': string;
	'Service-Worker-Allowed': string;
	SourceMap: string;
	Upgrade: string;
	Priority: string;
}
