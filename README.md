# Backend API Specifications
Create the backend for websites with recipes. The frontend will be created in three different technologies, such Angular/React/Vue. 

## Recipe
List all recipes in the database
limit number of results
pagination (next page, prev page)
filtering results
operators: greater than etc.
Get single bootcamp
Create new recipe
Authenticated users only (user or admin)
limited number of creations
Upload a photo for recipe-owner only
Update recipe-owner only
Delete recipe-owner only
Calculate the average rating from the reviews for a recipe
 
## Reviews
- List all reviews for recipe
- List all reviews (general)
- limit number of results
- pagination (next page, prev page)
- filtering results
- operators: greater than etc.
- Create new reviews
- Authenticated users only (user or admin)
- Update recipe-owner only
- Delete recipe-owner only

## User
- Authentication will be token using JWT or Cookies expire in 10 days
- User registration as a user (admin set only manually) specific name
- one email = one account
- hashed password
- User login-login with email and password
- User logout-remove cookies
- Get user 
- Password reset
- sending a email with a link to the reset password
- expire in 10 minutes
- Update user
- User CRUD (admin only)

## Security
- Encrypt passwords and reset tokens
- Prevent NoSQL injections
- Add headers for security (helmet)
- Prevent cross site scripting - XSS
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param pollution
- Use cors to make API public (for now)


