INSERT INTO department (id, department_name)
VALUES 
  (1, 'Aerospace'),
  (2, 'Science'),
  (3, 'Entertainment'),
  (4, 'Superhero'),
  (5, 'Transportation');

INSERT INTO role (id, title, salary, department_id)
VALUES
  (1, 'Supply Chain Manager', 159874, 1),
  (2, 'Biochemist designer', 147852, 2),
  (3, 'Supply Chain Specialist', 150000, 3),
  (4, 'Driver', 175000, 4),
  (5, 'Lottery Winner', 900000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
  (1, 'Clark', 'Kent', 1, 1),
  (2, 'Hal', 'Jordan', 2, 2),
  (3, 'Peter', 'Parker', 3, 3),
  (4, 'Miles', 'Morales', 4, 4),
  (5, 'Luke', 'Cage', 5, 5);
