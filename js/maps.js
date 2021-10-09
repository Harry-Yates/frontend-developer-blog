function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    mapId: "6135d1f7273a2341",
    center: { lat: 59.30140572792185, lng: 18.090818027597603 },
    zoom: 15,
    mapTypeControl: false,
    fullScreenControl: false,
    streetViewControl: false,
  });

  const markers = [
    ["Hyper Island 😎", 59.3013033026762, 18.09080557520526, "../assets/logo/hyper black logo.jpeg", 30, 30],
    ["Allé Kök & Bar", 59.30368272422412, 18.099840957055665, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["Babajan Bar", 59.30883065652491, 18.089670020199364, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["Socialen Bar", 59.30278449450088, 18.081816511993864, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["The Picts Bar", 59.304033246462375, 18.099197226874885, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["Sickla Kaj Festlokal", 59.30484528581164, 18.10291733756397, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["Ölstugan", 59.29868863226114, 18.079503950422712, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["ThaiBoat", 59.30493537486437, 18.081857054658965, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["Whippet Lab & Social Justice Club", 59.30811836978346, 18.07879801936724, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["Bleck", 59.30886903271519, 18.08956347124809, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["BrewDog Södermalm", 59.30988990771211, 18.083210089810212, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["Snow-white bar and restaurant", 59.30952960238904, 18.082092365297992, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["Stay Bar", 59.30784812707183, 18.07691553597824, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["Ugglan", 59.31244196113002, 18.0821511929039, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["The Central Bar", 59.3117514244006, 18.074150638500644, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["N3rds Bar", 59.31246910583895, 18.07391558118925, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["Malmgrenska Krogen", 59.296529565717, 18.101089927740084, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["Tbilisis Hörna - Georgisk Restaurang", 59.29924418799222, 18.088349675919492, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
    ["Ekota Indisk Restaurang", 59.29540267776123, 18.102293731061714, "../assets/images/NicePng_beer-emoji-png_1349206.png", 30, 30],
  ];

  for (let i = 0; i < markers.length; i++) {
    const currMarker = markers[i];
    const marker = new google.maps.Marker({
      position: { lat: currMarker[1], lng: currMarker[2] },
      map,
      title: currMarker[0],
      icon: {
        url: currMarker[3],
        scaledSize: new google.maps.Size(currMarker[4], currMarker[5]),
      },
      animation: google.maps.Animation.DROP,
    });

    const infowindow = new google.maps.InfoWindow({
      content: currMarker[0],
    });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
  }
}
