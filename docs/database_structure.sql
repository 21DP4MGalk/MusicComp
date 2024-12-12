CREATE TABLE `users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` char(60) NOT NULL,
  `token` char(128) DEFAULT NULL,
  `status` enum('registered','admin', 'banned') DEFAULT 'registered',
-- `last_login` int NOT NULL,
-- `last_timeout_action` int NOT NULL,
-- `incorrect_login_attempts` unsigned tinyint,
  PRIMARY KEY (`ID`)
);



CREATE TABLE `pieces` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  `file` mediumblob,
  `userID` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `userID` (`userID`),
  CONSTRAINT `pieces_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`)
);


CREATE TABLE `instruments` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `waveform` blob NOT NULL,
  `pieceID` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `pieceID` (`pieceID`),
  CONSTRAINT `instruments_ibfk_1` FOREIGN KEY (`pieceID`) REFERENCES `pieces` (`ID`)
);