# Create Travis
CREATE USER 'travis'@'localhost' IDENTIFIED BY 'travis';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP ON *.* TO 'travis'@'localhost';