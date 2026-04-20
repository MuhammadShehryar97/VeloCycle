# Candidate Submission Requirements

Thank you for completing the technical test! To ensure we can properly evaluate your work, please provide the following deliverables:

## 1. Application Build
- **APK File:** A compiled **Android APK** that we can install and run directly for testing. 

## 2. Source Code
- **Repository:** Provide a link to a **GitHub repository** containing your code (make sure it's public or grant access if private), OR submit a **ZIP file** containing the full source code.

## 3. Documentation (`README.md`)
Your repository must include a `README.md` at the root, detailing:
- **Setup Instructions:** How to build and run the project locally.
- **Approach & Architecture:** A summary of your technical decisions (e.g., state management, how you handled the location stream, polygon intersection logic, and map rendering).
- **Edge Cases & Limitations:** Explicitly call out any known edge cases where your implementation might fail, misbehave, or drop accuracy (e.g., GPS noise, rapidly moving through polygons).

## 4. Retrospective / Future Improvements
Inside your `README.md` (or as a separate document), please include a section detailing:
- **What you would improve with more time:** If you had an extra week to work on this, what features, optimizations, or architectural changes would you implement? How would you make this production-ready?

## 5. Video Demonstration (e.g., Loom)
Please provide a video recording demonstrating the features of your app and how it behaves under various conditions. Ensure the following scenarios are recorded:
- **Successful Flow:** Completing a full run from Start Point (SP) to End Point (EP), validating sequential hits.
- **Out of Order Hit:** An attempt to complete a Check Point (CP) when it is not the next active CP in the required sequence.
- **Starting Out of Polygon:** The user attempts to hit the "Start" button *before* physically entering the required Start Point (SP) parameter.
- **Ending Out of Polygon:** Attempting to tap the "End" button *outside* of the bounds of the End Point (EP) polygon.
