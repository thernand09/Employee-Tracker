\c employee_db

INSERT INTO department 
    (name) 
VALUES ('Engineering'), 
       ('Finance'), 
       ('Legal'), 
       ('Sales');

INSERT INTO role 
    (title, salary, department_id) 
VALUES ('Software Engineer', 120000, 1),
       ('Accountant', 80000, 2),
       ('Lawyer', 150000, 3),
       ('Sales Manager', 95000, 4);

INSERT INTO employee 
    (first_name, last_name, role_id, manager_id) 
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, 1),
       ('Robert', 'Brown', 3, NULL),
       ('Emily', 'Davis', 4, 1);