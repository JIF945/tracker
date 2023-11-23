-- Schema source department 
INSERT INTO department (id, department_id)
VALUES ("Aerospace"),
        ("science"),
        ("Entertainment"),


-- Schema Source for the role 
INSERT INTO role (title, salary, department_id)
VALUES ("Suppply Chain Manager", 159874, 1),
       ('Supply Chain Specialist', 150000, 1),
       ('Biochemist designer', 147852, 2),
       ('Biochemist Manager', 189654, 2),
       ('Singer', 15000, 3),
       ('Backup Dancer', 12000, 3),
       ('Marketing Manager', 145632, 4),
       ('Marketing Associate', 12365, 4)
       ('Dog Walker', 15632, 5),
       ('Graphic designer', 89654,2)




INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Clark', 'Kent', 1, 1)
       ('Hal', 'Jordan', 2, null),
       ('Peter', 'Parker', 3, 2)
       ('Miles', 'Morales', 4, 3 ),
       ('Wade', 'Wilson', 5, null),
       ('Lex', 'Luthor', 6, null),
       ('Diana', 'Prince', 7, 4),
       ('Bruce', 'Wayne', 8, null)
       ('Arthur', 'Curry', 9, null)
       ('Barry', 'Allen', 10, null)  

