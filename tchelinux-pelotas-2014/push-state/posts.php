<?php

//images from http://stormtroopersdoingshit.tumblr.com/

$lastPost = isset($_POST['lastPost']) ? $_POST['lastPost'] : 0;

$lastPost += 1;

$posts = array();

$posts[1] = array('image'=>'img/tumblr_m3pucwLJvi1qmkw05o1_500.gif', 
	'title'=>'Masks sucks',
	'url'=>'drink',
	'description'=>'Don\'t drink with it', 
	'id'=>1);
$posts[2] = array('image'=>'img/tumblr_mi6omgbsZj1r2qbwxo1_500.jpg',
	'title'=>'This is sad',
	'url'=>'sadness',
	'description'=>'Could be more depressive?',
	'id'=>2);

$posts[3] = array('image'=>'img/tumblr_n2hyodb3qs1qa12q2o1_500.jpg',
	'title'=>'StormTrooper Anatomy',
	'url'=>'anatomy',
	'description'=>'Every single aspect from a clone body',
	'id'=>3);

$posts[4] = array('image'=>'img/tumblr_n53z05Hvfz1qa12q2o1_500.jpg',
	'title'=>'Good Friends',
	'url'=>'friends',
	'description'=>'Hanging out with my bro',
	'id'=>4);

$posts[4] = array('image'=>'img/tumblr_n5chjodJHd1tse4ydo1_400.gif',
	'title'=>'Baseball',
	'url'=>'baseball',
	'description'=>'Awesome game, bad consequences',
	'id'=>4);




$response = isset($posts[$lastPost]) ? $posts[$lastPost] : array();

echo json_encode($response);