// Every route is content: no user, no session, nothing that varies per request.
// Prerendering turns the whole site into static files that Vercel serves from
// its edge, and it also acts as a build-time check that no page accidentally
// grows a server dependency without that being a deliberate change here.
export const prerender = true;
