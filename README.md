# TOC-Mini-Project
🧾 Regex-Based Online Examination Form Validator

A web-based application that validates an online examination form using Regular Expressions (Regex). This project demonstrates how theoretical concepts from Automata Theory / Theory of Computation can be applied to real-world input validation.

🚀 Live Concept

This project simulates a real exam form where every input field is strictly validated using regex patterns to ensure correctness, consistency, and security before submission.

✨ Key Features
Real-time input validation using JavaScript
Strict pattern enforcement using Regular Expressions
Instant error feedback for incorrect inputs
File upload validation for specific formats
Clean, structured UI with multiple pages
Separate modules for theory and testing


🧠 Core Concepts Applied
Regular Languages & Pattern Matching
Regex Design and Optimization
Client-side Form Validation




regex_exam_form/
│
├── index.html          # Main user form
├── theory.html         # Concept explanation
├── tests.html          # Validation test cases
│
├── css/
│   └── style.css       # UI styling
│
├── js/
│   └── script.js       # Validation logic (Regex)
│
├── docs/
│   ├── report.txt
│   ├── theory.txt
│   └── test-cases.txt


🔍 Validation Highlights
| Field           | Validation Logic                    |
| --------------- | ----------------------------------- |
| Date of Birth   | Proper date format check            |
| Hall Ticket No. | Structured alphanumeric pattern     |
| Exam Code       | Fixed format validation             |
| Subject Code    | Predefined regex pattern            |
| File Upload     | Only `.pdf`, `.jpg`, `.png` allowed |

📎 Example Regex
.+\.(pdf|jpg|png)
✔ Ensures valid file extensions
✔ Prevents unsupported file uploads
✔ Works case-insensitively

🧪 Testing & Documentation
UI Testing: tests.html
Written Cases: docs/test-cases.txt
Theory Notes: theory.html, docs/theory.txt
💡 Why This Project Matters

This project bridges the gap between theory and implementation by showing how regex (a concept from automata) is actually used in:

Web development
Data validation systems
Form processing engines


🛠️ Future Improvements
Backend integration (Node.js / MongoDB)
Database storage of form submissions
Enhanced UI/UX
Advanced validation (API-based checks)
