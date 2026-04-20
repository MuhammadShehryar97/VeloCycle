# React Native Cyclist Tracking - Technical Test

## Overview

Your task is to build a React Native tracking application for cyclists. The app will track the user's location and allow them to complete a series of defined checkpoints in a required sequence.

There are three key types of entities in a run:
- **Start Point (SP)**
- **Check Points (CP)**
- **End Point (EP)**

Each of these entities contains the following properties:
- **Location:** The geographic coordinates.
- **Polygon Parameter:** A geofence boundary defining the area the user must enter to trigger the point.
- **Number of Hits:** The total number of times the user must visit this specific location.
- **Order:** The order in which the point should be visited.


## Core Workflow & Logic

1. **Starting the Run:** 
   - The cyclist must travel to the Start Point (SP).
   - Once the user is physically inside the SP's polygon parameter, they can tap the "Start" button to begin the run.
   - If the user taps "Start" while *outside* the SP's polygon parameter, the app must display an error toast indicating they are not in the start zone, and prevent the run from starting.

2. **Completing Checkpoints:**
   - After starting the run, the user must navigate to the required Check Points (CPs).
   - The CP sequence is determined by a numeric order key. Users must complete the CPs in this strict sequential order.
   - A CP will **auto-complete** as soon as the user enters its polygon parameter.
   - **Consecutive Hits Rule:** The user *cannot* hit the same CP consecutively. To register a second hit on a CP, the user must visit a different CP in between.

3. **Hits & Required Visits:**
   - The "hits" value represents how many times a user must visit a specific CP throughout the run.
   - The Start Point (SP) and End Point (EP) are only required to be visited once (1 hit).

4. **Ending the Run:**
   - Once all the required CP hits are successfully completed in the correct order, the user is instructed to proceed to the End Point (EP).
   - Upon arriving in the EP polygon, an "End" button should become available to successfully finish the run.

---

## UI Requirements

1. **Initial State (Before Starting):**
   - The map should clearly display the Start location and the polygon parameter the user needs to be inside.
   - A "Start" button is present on the screen.

2. **Active Run State (During the Route):**
   - The map must visually display the path of the route based on the required order.
   - ***Note on Pathing:*** The route path might be circular or repetitive (for example: `SP → CP1 → CP2 → CP1 → CP2 → EP`). You have full creative freedom to design a UI that makes this meaningful and easy for the cyclist to understand.
   - When a user enters a CP polygon, it should auto-complete and the UI/path should update dynamically to point the user to the next destination. Come up with a great UX for this progression!

3. **Completion State:**
   - When all required CP hits are fulfilled, the UI must prompt the user to head to the End Point (EP) to end the run.

---

## Evaluation Criteria
- **Clarity & UX:** How well the circular/overlapping paths and next-steps are conveyed to the user.
- **Efficiency:** Proper handling of location updates, polygon intersection logic, and map re-rendering.
- **Code Quality:** Clean architecture, readable code, and logical component separation.