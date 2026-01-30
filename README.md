# Holidaze – Project Exam 2

This project is my submission for **Project Exam 2** at Noroff.

Holidaze is a front-end accommodation booking application built with React.
Users can browse venues, make bookings, and manage venues if they are registered
as venue managers. The application uses the official Holidaze API provided by Noroff.

---

## Project Description

The goal of this project was to plan, design, and build a modern front-end
application based on given user stories and technical requirements.

The project includes:

### User features
- View a list of venues
- Search for a specific venue
- View a venue details page
- View availability and booked dates
- Register with a `stud.noroff.no` email
- Log in and log out
- Create bookings
- View upcoming bookings
- Update user avatar

### Venue manager features
- Register as a venue manager
- Create venues
- Update venues
- Delete venues
- View bookings for venues they manage

---

## Tech Stack

- **JavaScript Framework:** React (Vite)
- **CSS Framework:** Tailwind CSS
- **API:** Noroff Holidaze API (v2)
- **Hosting:** Netlify
- **Design Tool:** Figma
- **Planning Tool:** Trello

All tools and frameworks used are approved according to the project requirements.

---

## Local Setup

To run this project locally:

1. Clone the repository:
   ```bash
   git clone <https://github.com/KineOnes/holidaze.git>

2. Install dependencies:

    npm install

3. Create a .env.local file in the root folder and add:

    VITE_API_KEY=your-api-key-here

4. Start the development server:

    npm run dev

- The application will run on http://localhost:5173.

# Accessibility

The application was tested using the WAVE Evaluation Tool.
No critical accessibility errors were found.

Semantic HTML, form labels, and readable contrast were considered.
Manual testing is still recommended.

# Obstacles Met During the Project

During the project, I had to transfer my existing Kanban board to Trello
late in the development process due to technical issues.
This took extra time, but all tasks and progress were successfully restored.

# Future Improvements

Due to time constraints, the booking overlap warning is currently shown
after a booking is submitted.

In a future version, this validation should happen when the user selects dates,
before submitting the booking, to improve the user experience and avoid confusion.

Other future improvements may include:

- Improved date validation

- Better mobile responsiveness


## Links:

# Figma Project planning Gantt chart: 
https://www.figma.com/board/pw461ix0SkJuu9tCfRCZAE/Holidaze-Gantt-Chart-%E2%80%93-Project-Exam-2?node-id=0-1&t=XoOYfb1ksfXYvEvx-1

# Trello Kanban board: 
https://trello.com/invite/b/696e17930300bfa69ab1a912/ATTI9568dd23857a02b0deabfbf415a5057fEAEF48BF/holidaze-project-exam-2

# Design Prototype & Style Guide:
https://www.figma.com/design/mtTE3jlz5tkYN0Veeduqhv/Holidaze-%E2%80%93-Design-Prototype---Style-Guide?node-id=0-1&t=mdfyOrbBKQDYiboJ-1
- “The final implementation differs slightly from the initial Figma wireframes due to iterative design decisions during development.”

# Repository
https://github.com/KineOnes/holidaze.git

# Hosted Application
https://holidaze2026.netlify.app/

# Delivery Notes

- All final changes are merged into the main branch

- The project follows the given brief and user stories

- Only approved tools and frameworks are used

- The focus has been on functionality, clarity, and usability

# Student Reflection

This project was challenging but very educational.
It helped me better understand React, API integration, state management,
and how to structure a real-world front-end application.