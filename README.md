# Task

The application is a "collaborative drawing board" for everyone (you may think about Google Jamboard as an example).

No registration or authentication, all users have immediate access to the "boards" list (the user only provides arbitrary nick-name to enter).

Each user can create board or join existing boards.

Several users can draw on the same board simultaneously. When somebody draw something, it appears to other users "immediately" (there may be a slight delay, you can either poll the server or preferably use websockets).

Everything drawn on the board is stored "forever" (if user joins this board later, he/she sees everything what was created before).

Drawing area should fill the whole window (except, probably, the tool panel) and scale/scroll adequately.

- Optional requirement (each will increase the grade):
- Ability to erase previously draw elements.
- Several tools ("text", "rectangle", "circle", etc.) with colors.
- Preview thumbnail images in the board list.
- Export to jpeg option.

## Link

[Deploy](https://drawio-site.netlify.app) of the project

## Tech Stack

**Client:** React, TailwindCSS, AntDesign, Redux Toolkit, Redux-persist

**Server:** Node, Express, MongoDB, Socket.io

## Demo

[Demo-video](https://www.dropbox.com/scl/fi/2prphe0gcdmwn6m6bpaqv/itransition-task-6.mov?rlkey=d0wshsppdc0lj6sddrmura8g2&st=9x12es5e&dl=0) of the project
