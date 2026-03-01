## Packages
framer-motion | Smooth animations and page transitions
react-markdown | Rendering markdown in chat responses
remark-gfm | GitHub flavored markdown support for tables/lists
date-fns | Date and time formatting for chat timestamps

## Notes
Tailwind config assumptions: The base project includes @tailwindcss/typography. 
If not, the markdown styling uses standard classes as fallbacks.
The app relies on Replit Auth endpoints (`/api/login`, `/api/logout`, `/api/auth/user`).
SSE Streaming assumes the backend sends `data: {"content": "..."}` and `data: {"done": true}`.
