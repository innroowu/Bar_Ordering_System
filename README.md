# Crossing the Equator : Bar Ordering System
This repository is a project of the User Interface Programming course.

It is more convenient to use the Live Server extension of Visual Studio Code to start the Bar Ordering System.

## Collaborators/Group members
- Yin-Ju Wu
- Yuxuan Niu
- Rahul Reddy Tikkavarapu
- Bernardo José Willis Lozano
- Lan Xiao

## How to Run the Program

### Backend (JSON Server)
1. **Install JSON Server:**  
   Open your terminal and install JSON Server globally if you haven't already:
   ```bash
   npm install -g json-server
   ```
2. **Run the Backend:**  
   Navigate to the `data` directory and start the JSON Server:
   ```bash
   cd data
   json-server --watch db.json --port 3000
   ```
   This will launch the backend at `http://localhost:3000`.

### Frontend (Live Server)
1. **Install Live Server Extension:**  
   In Visual Studio Code, install the Live Server extension.
2. **Run the Frontend:**  
   Open the project folder in VSCode, then right-click on `index.html` and select "Open with Live Server" to start the frontend.

3. **Prevent Unwanted Refreshes:**  
   Because Live Server automatically refreshes the webpage every time there is a change in the files, and we don't want the page to reload when the backend JSON (e.g., `db.json`) is updated during customer interactions, add the following configuration to your VSCode settings:
   - Open the settings.json file (you can access it via **VScode Settings, Extensions, Live Server Config, Edit in settings.json**).
   - Add the following under the Live Server configuration:
     ```json
     "liveServer.settings.ignoreFiles": [
         "**/data/db.json"
     ]
     ```
   This setting tells Live Server to ignore changes in `db.json`, preventing unnecessary page reloads when the backend data updates.

## File Organization
```
Bar_Ordering_System
    ├─ PirateLogo.png
    ├─ customer.html: customer ordering interface
    ├─ index.html: Initial page
    ├─ owner.html: owner interface
    ├─ waiter.html: waiter interface
    ├─ css/
    |   ├─ customer.css
    |   ├─ index.css
    |   ├─ owner.css
    |   └─ waiter.css
    ├─ data/
    |   ├─ db.json
    |   ├─ beers.json
    |   ├─ cocktails.json
    |   ├─ foods.json
    |   ├─ special.json
    |   ├─ users.json
    |   └─ wins.json
    └─ js/
       ├─ models/
       |    ├─ billSplit.js
       |    ├─ inventoryManager.js
       |    ├─ product.js
       |    └─ user.js
       ├─ views/
       |    ├─ customerView.js
       |    ├─ indexView.js
       |    ├─ ownerView.js
       |    └─ waiterView.js
       ├─ controllers/
       |    ├─ customerController.js
       |    ├─ indexController.js
       |    ├─ ownerController.js
       |    └─ waiterController.js
       └─ i18n.js
```

## Time reporting for each member
**Yin-Ju Wu**$\downarrow$
```
Feb 26: Using separate folders to split the initial program structure into the MVC pattern
Mar 2 - Mar 5: Adding the drag-and-drop function in the customer interface
Mar 8 - Mar 9: Developing the owner interface + initial structure for waiter pages
Mar 10: Implementing the inventory alert feature in the owner interface + adding the responsive design
Mar 16: Adding the redo function in the customer interface
Mar 17: Adding the translation function
Use of AI: During the development process, I occasionally used AI to help organize and simplify parts of the code, making the overall program clearer and easier to present.
```

**Yuxuan Niu**$\downarrow$
```
Feb 22 - Feb 24: Creating initial framework and structure for web application (including basic functions).
Feb 25: Establishing core component relationships.
Mar 4 - Mar 6: Coding on VIP login function and displaying VIP balance.
Mar 14 - Mar 16 : Designing and coding on index page and customer page interface.
Mar 17- Mar 18: Preparing for presentation.
Use of AI: Use AI (ChatGPT and Deepseek) as a debugging assistant, analyze the code logic, help with errors when it’s hard to debug, and clean up the code format.
```

**Lan Xiao**$\downarrow$
```
Feb 26 - Mar 4 Working on Niu’s original version, including VIP and normal customer functions and pages, before it gets replaced by the final version.
Mar 5 - Mar 9 Adding VIP special drinks menu to Wu’s version.
Mar 10 - Mar 12 Adding balance - related functions to Wu’s version.
Mar 15 Adding an undo function to the VIP page.
Mar 15 Attempted to integrate the backend with VIP functions.
Mar 16 - Mar 17 Working with the team to ensure all functions perform well in our project.
Mar 19 Attending the presentation via zoom.
Use of AI: I use ChatGPT to combine the required features with those my group members have written on the same page and fix errors in the code.
```

**Bernardo José Willis Lozano**$\downarrow$
```
Feb 26: Investigate about JSON server to understand it.
Mar 4: Restructured the JSON data files into one single db.json file and integrated JSON Server into the project.
Mar 5 - Mar 10: Worked on the waiter/bartender site and connected the JSON Server to all three interfaces (customer, owner, and waiter/bartender).
Mar 16: Connected the actions of the owner, customer, and waiter so that changes in one interface automatically reflect in the others. (for example, the owner changing a product price and the customer seeing it on the menu).
Mar 17: Implemented responsive design techniques, ensuring the application works well in different screen sizes.
Mar 18: Prepare for the presentation.
Use of AI: I utilized AI assistance to help me integrate JSON Server into the project and to investigate a little bit about responsive design, which helped me a lot with the development process and improved the clarity of our code.
```

## Additional Notes
- **MVC Pattern:**  
  The project follows the Model-View-Controller (MVC) architecture by separating data handling (models), UI rendering (views), and event logic (controllers).
- **Features Demonstrated:**  
  - Undo/Redo functionality for the shopping cart  
  - Drag and Drop to add items to orders  
  - Multiple language support (internationalization)  
  - Responsive design to adapt to different screen sizes  
- **Backend Simulation:**  
  Although the backend is simulated with JSON Server, the focus of this demo is on fulfilling the UI requirements as per the project specification.


