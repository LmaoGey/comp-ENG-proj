
USE internship_management_system;

CREATE TABLE roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (role_name) VALUES
('student'),
('company_supervisor'),
('academic_supervisor'),
('admin');

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_photo VARCHAR(255),
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE internship_opportunities (
  internship_id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  start_date DATE,
  end_date DATE,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE internship_applications (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  internship_id INT NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by INT,
  review_comment TEXT,
  FOREIGN KEY (student_id) REFERENCES users(user_id),
  FOREIGN KEY (internship_id) REFERENCES internship_opportunities(internship_id),
  FOREIGN KEY (reviewed_by) REFERENCES users(user_id)
);

CREATE TABLE student_supervisor_assignment (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  company_supervisor_id INT,
  academic_supervisor_id INT,
  assigned_by INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(user_id),
  FOREIGN KEY (company_supervisor_id) REFERENCES users(user_id),
  FOREIGN KEY (academic_supervisor_id) REFERENCES users(user_id),
  FOREIGN KEY (assigned_by) REFERENCES users(user_id)
);

CREATE TABLE logbooks (
  logbook_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  submission_date DATE NOT NULL,
  summary TEXT,
  status ENUM('pending','approved','commented') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(user_id)
);

CREATE TABLE logbook_tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  logbook_id INT NOT NULL,
  task_description TEXT NOT NULL,
  hours_spent DECIMAL(4,2),
  FOREIGN KEY (logbook_id) REFERENCES logbooks(logbook_id)
);

CREATE TABLE logbook_reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  logbook_id INT NOT NULL,
  reviewer_id INT NOT NULL,
  comment TEXT,
  approval_status ENUM('approved','commented','rejected'),
  reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (logbook_id) REFERENCES logbooks(logbook_id),
  FOREIGN KEY (reviewer_id) REFERENCES users(user_id)
);

CREATE TABLE attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present','absent') NOT NULL,
  recorded_by INT NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(user_id),
  FOREIGN KEY (recorded_by) REFERENCES users(user_id)
);

CREATE TABLE notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  type ENUM('deadline','system') NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE reports (
  report_id INT AUTO_INCREMENT PRIMARY KEY,
  report_type VARCHAR(100),
  generated_by INT NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file_path VARCHAR(255),
  FOREIGN KEY (generated_by) REFERENCES users(user_id)
);

