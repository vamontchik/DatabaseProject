DROP DATABASE IF EXISTS course_db;

CREATE DATABASE course_db;

USE course_db;


CREATE TABLE GenEd (
	`subject` VARCHAR(20) NOT NULL,
	`number` INT(10) UNSIGNED NOT NULL,
	`ACP` VARCHAR(255),
	`CS` VARCHAR(255),
	`HUM` VARCHAR(255),
  `NAT` VARCHAR(255),
  `QR` VARCHAR(255),
	`SBS` VARCHAR(255),
	CONSTRAINT `pk_Gen_Ed` PRIMARY KEY(`subject`, `number`)
);

CREATE TABLE Instructor (
	`instructorName` VARCHAR(255) NOT NULL,
  `rating` FLOAT NOT NULL,
	CONSTRAINT `pk_Instructor` PRIMARY KEY(`instructorName`)
);

CREATE TABLE GradeDistribution (
	`aPlus` INT(10) UNSIGNED NOT NULL,
	`a` INT(10) UNSIGNED NOT NULL,
	`aMinus` INT(10) UNSIGNED NOT NULL,
	`bPlus` INT(10) UNSIGNED NOT NULL,
	`b` INT(10) UNSIGNED NOT NULL,
	`bMinus` INT(10) UNSIGNED NOT NULL,
	`cPlus` INT(10) UNSIGNED NOT NULL,
	`c` INT(10) UNSIGNED NOT NULL,
	`cMinus` INT(10) UNSIGNED NOT NULL,
	`dPlus` INT(10) UNSIGNED NOT NULL,
	`d` INT(10) UNSIGNED NOT NULL,
	`dMinus` INT(10) UNSIGNED NOT NULL,
	`f` INT(10) UNSIGNED NOT NULL,
	`w` INT(10) UNSIGNED NOT NULL,
  `instructorName` VARCHAR(255) NOT NULL,
	`subject` VARCHAR(20) NOT NULL,
  `number` INT(10) UNSIGNED NOT NULL,
	CONSTRAINT `pk_Grade_Distribution` PRIMARY KEY(`instructorName`, `subject`, `number`)
);

CREATE TABLE CourseSection (
	`year` INT(10) UNSIGNED NOT NULL,
	`title` VARCHAR(255) NOT NULL,
	`term` VARCHAR(20) NOT NULL,
	`numStudents` INT(10) NOT NULL,
	`avgGPA` FLOAT NOT NULL,
	`number` INT(10) UNSIGNED NOT NULL,
	`subject` VARCHAR(20) NOT NULL,
  `instructorName` VARCHAR(255) NOT NULL,
	`description` VARCHAR(2000) NOT NULL,
	`creditHours` VARCHAR(500) NOT NULL,
	`likes` INT(10) UNSIGNED NOT NULL,
	CONSTRAINT `pk_Course_Section` PRIMARY KEY(`instructorName`, `subject`, `number`)
);
