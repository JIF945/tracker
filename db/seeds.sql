INSERT INTO department (id, department_name)
VALUES (1, 'Aerospace'),
       (2, 'Science'),
       (3, 'Entertainment');

INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Supply Chain Manager', 159874, 1),
       (2, 'Biochemist designer', 147852, 2),
       (3, 'Supply Chain Specialist', 150000, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Clark', 'Kent', 1, 1),
       (2, 'Hal', 'Jordan', 2, 2),
       (3, 'Peter', 'Parker', 3, 3);