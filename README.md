### Overview:
Fluolinguo is a language learning platform with two main features: a multi-choice quiz and an image guessing game. Users can register, log in, and access their dashboard to play these games. The application provides an interactive and engaging platform for users to improve their language skills through fun and educational games.

### Demo 

![image](https://github.com/FilipKotanski/Fluolingo/assets/19599271/5d5b0326-0e95-412b-afe4-ce669a065ffd)

![image](https://github.com/FilipKotanski/Fluolingo/assets/19599271/d531ddbc-de1f-49a1-adb9-e327f92648a1)

![image](https://github.com/FilipKotanski/Fluolingo/assets/19599271/2057db9c-3477-434d-8ee6-49d4a8afd4eb)


Live demo can be found [here](https://fluolingo.netlify.app/).

#### Features:

1. **User Authentication:**
   - Users can register with their email and password.
   - They can log in using their credentials.
   - Authentication is implemented using Passport.js, with passwords hashed using bcrypt.

2. **Multi-choice Quiz:**
   - Users can play a multi-choice quiz to test their language skills.
   - Questions are fetched from a database and displayed to the user.
   - Users select an answer from the options provided, and feedback is given on correctness.
   - The quiz has different difficulty levels (Beginner, Learner, Expert) with varying score targets.

3. **Image Guessing Game:**
   - Users can play a game where they guess the word based on an image.
   - Images are fetched from the GIPHY API based on a randomly selected word.
   - Users have a limited time to guess the word, and their score is based on correct guesses.

4. **Dark Mode Toggle:**
   - The application has a toggle to switch between light and dark modes for better user experience.

5. **Responsive Design:**
   - The frontend is built using React.js with Bootstrap and Tailwind CSS for responsive design.

6. **User Dashboard:**
   - Once logged in, users have access to their dashboard where they can navigate to different game modes and log out.

7. **API Integration:**
   - The application integrates with external APIs such as the GIPHY / PIXABAY API for fetching images and text-to-speech APIs for pronunciation feedback.

#### Technologies Used:
- **Backend:**
  - Node.js
  - Express.js
  - Passport.js (for authentication)
  - PostgreSQL (database)

- **Frontend:**
  - React.js
  - Bootstrap
  - Tailwind CSS

- **Other:**
  - bcrypt (for password hashing)
  - External APIs (GIPHY, text-to-speech)
