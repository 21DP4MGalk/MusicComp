<!dOCtYPE hTMl>
<html>
	<head>
		<title> Musical experiments </title>
		<script src="./js/music.js"></script>
		<link rel="stylesheet" href="./css/global.css">
		<link rel="stylesheet" href="./css/navbar.css">
		<link rel="stylesheet" href="./css/footer.css">
		<link rel="stylesheet" href="./css/music.css">
		<meta charset="utf-8">
	</head>
	<body onload="init()">
		<center>
			<button onclick="audioCtx.resume()">Turn on audio</button>
			<button onclick="mainStaff.playPiece()">Play your work</button>
			<!--
			<select id="noteSelect">
				<option value="E0A2">whole &#xE0A2; </option>
				<option value="E1D3">half</option>
				<option value="E1D5">quarter</option>
				<option value="E1D7">eighth</option>
				<option value="E1D9">sixteenth</option>
				<option value="E1DB">thirty-second</option>

				
				<option value="E4E3">whole rest</option>
				<option value="E4E4">half r</option>
				<option value="E4E5">quarter r</option>
				<option value="E4E6">eighth r</option>
				<option value="E4E7">sixteenth r</option>
				<option value="E4E8">thirty-second r</option>
			</select> -->
			<div id="noteSelect" onclick="selectNote();">
				<button class="noteButton">&#xE0A2;</button>
				<button class="noteButton">&#xE1D3;</button>
				<button class="noteButton">&#xE1D5;</button>
				<button class="noteButton">&#xE1D7;</button>
				<button class="noteButton">&#xE1D9;</button>
				<button class="noteButton">&#xE1DB;</button>
			</div>
			<input id="bpmtext" placeholder="BPM: 120"/>
			<button onclick="mainStaff.updateBPM()">Update BPM</button>
			<canvas id="notation" onclick="interpretClick()" width="1800px" height="1080px"> </canvas>

		</center>
	</body>
</html>
