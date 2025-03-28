# Crossing the Equator : Bar Ordering System
This repository is a project of the User Interface Programming course.

It is more convenient to use the Live Server extension of Visual Studio Code to start the Bar Ordering System.


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


