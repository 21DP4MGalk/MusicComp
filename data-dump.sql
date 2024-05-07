CREATE TABLE `users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `type` enum('temp','registered','admin') DEFAULT NULL,
  PRIMARY KEY (`ID`)
)


CREATE TABLE `pieces` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `title` varchar(20) DEFAULT NULL,
  `file` mediumblob,
  `userID` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `userID` (`userID`),
  CONSTRAINT `pieces_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`)
)


CREATE TABLE `instruments` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `description` varchar(128) DEFAULT NULL,
  `waveform` blob NOT NULL,
  `pieceID` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `pieceID` (`pieceID`),
  CONSTRAINT `instruments_ibfk_1` FOREIGN KEY (`pieceID`) REFERENCES `pieces` (`ID`)
) 


