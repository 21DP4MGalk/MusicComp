CREATE TABLE `users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(40) NOT NULL,
  `verified` bool DEFAULT false,
  `username` varchar(20) NOT NULL,
  `password` char(60) NOT NULL,
  `token` char(128) DEFAULT NULL,
  `status` enum('registered','admin', 'banned') DEFAULT 'registered',
--`lastTimeoutAction` int NOT NULL,
--`failedLoginAttempts` tinyint DEFAULT NULL,  
  PRIMARY KEY (`ID`)
);



CREATE TABLE `pieces` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  `file` mediumblob,
  `isPublic` bool DEFAULT false,
  `link` varchar(20) DEFAULT NULL,
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
