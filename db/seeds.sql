INSERT INTO departments (department_name)
VALUES ("Human Resources"),
       ("Research & Development"),
       ("Marketing"),
       ("Engineering"),
       ("Finance"),
       ("Environmental Health and Safety"),
       ("Board of Directors");

INSERT INTO roles (title, salary, department_id)
VALUES ("CEO", 200000.00, 2),
       ("Marketing Manager", 150000.00, 3),
       ("Senior Staff Engineer", 150000.00, 4),
       ("Environmentalist", 80.00, 6),
       ("Barista", 300000.00, 7),
       ("Organizational Development Specialist", 120000.00, 1),
       ("Party Planner", 400000.00, 2),
       ("Loan Shark", 175000.00, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Lopez", 2, 2),
       ("Marco", "Renzo", 5, 4),
       ("Paola", "Diaz", 8, 4),
       ("Belle", "Fulton", 4,3),
       ("Archie", "Schwartz", 4,3),
       ("Gil", "Ozeri", 2, 4 ),
       ("Georgie", "Lucas", 2,4),
       ("Lily", "Sullivan", 2, 2);