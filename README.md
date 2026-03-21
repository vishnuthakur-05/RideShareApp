# 🚗 Ride-Share Platform

A comprehensive, cutting-edge ride-sharing platform connecting Passengers, Drivers, and Administrators through a unified ecosystem. Built with a powerful **Spring Boot** backend and an aesthetic, dynamic **React** front end. 

This platform encompasses full lifecycle management for ride booking, vehicle registration document processing, dynamic revenue analytics, and email notification workflows.

---

## 🚀 Features

### **1. Passenger Hub**
* **Ride Booking System:** Seamlessly search for, filter, and request rides based on available seats and distance.
* **Review & Rating:** Ensure platform credibility by rating rides and reading driver reviews.
* **Email Workflows:** Real-time email notifications on ride acceptance, rejection, completion, and payment receipts.

### **2. Driver Portal**
* **Earnings Dashboard:** Dynamically track daily, monthly, and lifetime earnings utilizing interactive graphical charts.
* **Vehicle Management:** Register and maintain multiple vehicles, including uploading arrays of base64 vehicle photographs.
* **Official Document Generation:** Experience one-click native **PDF document downloads**, mapping vehicle metadata (Specs, Insurance, RC Numbers) alongside directly embedded vehicle photos.
* **Ride Tracking:** View active booking requests, update statuses (Upcoming, Paid, Completed), and efficiently manage passenger workflows.

### **3. Admin Dashboard**
* **Identity Management:** View, securely manage, and safely approve/reject pending identity approvals across both Driver and Passenger bases.
* **Revenue Analytics:** Time-series tracking across `Completed` and `Paid` rides natively visualized securely onto Interactive Cartesian Charts.
* **Dynamic PDF Reporting:** Take high-fidelity layout snapshots of analytics, immediately packaged and cleanly exported straight to downloadable `.csv` and `.pdf` administrative reports.

---

## 🛠️ Technology Stack

### **Frontend (`ride-share-app`)**
* **Framework:** React 19 (Hooks, Context, Router)
* **Styling & Components:** Tailwind CSS, `lucide-react` (icons)
* **Data Visualization:** Recharts (Dynamic BarChart, AreaChart generation)
* **Document Processing:** `html2canvas`, `jsPDF` for native file buffering
* **API Handlers:** Axios

### **Backend (`ride-share-backend`)**
* **Framework:** Java Spring Boot (RESTful controllers, Spring Data JPA, Hibernate)
* **Database:** SQLite natively integrated (`rideshare.db`), supporting simple offline configuration without extensive installations.
* **Mail Integration:** `JavaMailSender` over SMTP to deliver registration & booking workflows.
* **Security:** BCrypt Password Encoding alongside JWT-based custom session authorization.
* **Data Integrity:** Intelligent proxy transaction management (`@Transactional`) mapping Lazy loading JPA relations to REST output correctly.

---

## 💻 Running the Application

### Prerequisites
* **Node.js**: (Version 16+ Recommended)
* **Java Development Kit (JDK):** Version 17+
* **Maven:** Included or system-wide

### 1. Initialize the Spring Boot Backend

1. Navigate to the backend directory:
   ```bash
   cd ride-share-backend
   ```
2. Build and run the server using Maven (it will bind to `localhost:8081`):
   ```bash
   mvn clean spring-boot:run
   ```
> The local SQLite database (`rideshare.db`) natively generates inside this workspace and relies on `spring.jpa.hibernate.ddl-auto=update` to retain data persistently between shutdowns.

### 2. Initialize the React Frontend

1. Navigate into the front-end application via a secondary terminal:
   ```bash
   cd ride-share-app
   ```
2. Download node dependencies:
   ```bash
   npm install
   ```
3. Start the local development web server (it will bind to `localhost:3000`):
   ```bash
   npm start
   ```

---

## 🔒 Environment Structure & Design Methodology

This project operates on strong software engineering separation mechanisms. The React app handles pure component state, form control logic, and file manipulation. The HTTP boundary transitions into standard JSON REST, communicating securely via standard JWT (`localStorage`) headers. 

On the Spring Boot side, logic adheres heavily to strict `Controller` → `Service` → `Repository` segmentation cleanly keeping algorithms strictly typed and properly optimized.

---

*Thank you for exploring the Ride-Share application architecture!*
