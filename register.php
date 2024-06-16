<html>
	<head>
		<title>Register to our bad site</title>
		<script src="./src/js/register.js"></script>
		<link rel="stylesheet" href="./src/css/main.css">
	</head>
	<body>
		<iframe name="idiotframe" id="idiotframe" style="display: none"></iframe>
		<h1> Join our ranks </h1>
		<form action="api/addUser.php" method="POST" target="idiotframe">
			<input name="username" type="text" id="username" placeholder="Username"></input>
			<input name="password" type="password" id="password" placeholder="Password"></input>
			<input type="submit" value="Submit">
		</form>
	</body>
</html>
