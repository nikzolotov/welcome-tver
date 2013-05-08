ymaps.ready(function(){
	// Все шаблоны оформления
	var zoomLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b-zoom">' +
				'<b id="zoom-in" class="b-icon2 b-icon2-zoom-in"><b></b></b>' +
				'<b id="zoom-out" class="b-icon2 b-icon2-zoom-out"><b></b></b>' +
			'</div>', {
			
			build: function(){
				zoomLayout.superclass.build.call(this);
				
				this.onZoomIn = ymaps.util.bind(this.onZoomIn, this);
				this.onZoomOut = ymaps.util.bind(this.onZoomOut, this);
				
				$('#zoom-in').bind('click', this.onZoomIn);
				$('#zoom-out').bind('click', this.onZoomOut);
			},
			
			clear: function(){
				$('#zoom-in').unbind('click', this.onZoomIn);
				$('#zoom-out').unbind('click', this.onZoomOut);
				
				zoomLayout.superclass.clear.call(this);
			},
			
			onZoomIn: function(){
				var map = this.getData().control.getMap();
				
				this.events.fire('zoomchange', {
					oldZoom: map.getZoom(),
					newZoom: map.getZoom() + 1
				});
			},
			
			onZoomOut: function(){
				var map = this.getData().control.getMap();
				
				this.events.fire('zoomchange', {
					oldZoom: map.getZoom(),
					newZoom: map.getZoom() - 1
				});
			}
		}),
		cityLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b-city">' +
				'<h3 class="title">$[properties.title]</h3>' +
				'<div class="desc">$[properties.population]</div>' +
				'<div class="weather"><b class="b-icon2 b-icon2-weather"><b></b></b> $[properties.weather]</div>' +
				'[if properties.routeMarker]<div class="b-route-marker">$[properties.routeMarker]</div>[endif]' +
			'</div>'
		),
		outsideCityLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b-outside-city">' +
				'<h3 class="title $[properties.key]">$[properties.title]</h3>' +
				'[if properties.routeMarker]<div class="b-route-marker">$[properties.routeMarker]</div>[endif]' +
			'</div>'
		),
		pointLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b-point[if properties.searchResult] b-point-search[endif]">' +
				'<b class="b-icon2 b-icon2-$[properties.type]"><b></b></b>' +
				'[if properties.routeMarker]<div class="b-route-marker">$[properties.routeMarker]</div>[endif]' +
			'</div>'
		),
		
		clusterLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b-point b-point-cluster">' +
				'<b class="b-icon2 b-icon2-$[options.type]"><b></b></b>' +
				'<span class="count">$[properties.geoObjects.length]</span>' +
			'</div>'
		),
		balloonCloseLayout = ymaps.templateLayoutFactory.createClass(
			'<b id="close-balloon" class="b-icon2 b-icon2-close" data-action="cancel"><b></b></b>', {
			
			build: function(){
				balloonCloseLayout.superclass.build.call(this);
				
				this.onClose = ymaps.util.bind(this.onClose, this);
				$('#close-balloon').bind('click', this.onClose);
			},
			
			clear: function(){
				$('#close-balloon').unbind('click', this.onClose);
				
				balloonCloseLayout.superclass.clear.call(this);
			},
			
			onClose: function(){
				// По хорошему, карту надо выбрать так:
				// var map = this.getData().geoObject.getMap();
				// Но непонятно, как это сделать для балунов статей
				
				map.balloon.close();
			}
		}),
		addToRouteLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b-button">' +
				'<input id="addToRoute" class="b-submit-overlay" rel="[if properties.population]city[else]point[endif]-$[properties.id]" type="button" value="Добавить в маршрут"/>' +
				'<i class="corner"></i>' +
			'</div>', {
			
			build: function(){
				addToRouteLayout.superclass.build.call(this);
				$('#addToRoute').bind('click', this.addToRoute);
			},
			
			clear: function(){
				$('#addToRoute').unbind('click', this.addToRoute);
				addToRouteLayout.superclass.clear.call(this);
			},
			
			addToRoute: function(event){
				addPointToRoute( $(this).attr('rel') )
				event.preventDefault();
			}
		}),
		deleteFromRouteLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b-button">' +
				'<input id="deleteFromRoute" class="b-submit-overlay" rel="[if properties.population]city[else]point[endif]-$[properties.id]" type="button" value="Удалить из маршрута"/>' +
				'<i class="corner"></i>' +
			'</div>', {
			
			build: function(){
				deleteFromRouteLayout.superclass.build.call(this);
				$('#deleteFromRoute').bind('click', this.deleteFromRoute);
			},
			
			clear: function(){
				$('#deleteFromRoute').unbind('click', this.deleteFromRoute);
				deleteFromRouteLayout.superclass.clear.call(this);
			},
			
			deleteFromRoute: function(event){
				deletePointFromRoute( $(this).attr('rel') );
				event.preventDefault();
			}
		}),
		balloonLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b-balloon">' +
				'<div class="b-point-desc">' +
					'<h3 class="title">' +
						'<a class="link" href="/[if properties.population]city[else]point[endif].html?id=$[properties.id]">' +
							'<img class="image" src="$[properties.imageSrc]" alt=""/>' +
							'<span class="text">$[properties.title]</span>' +
							'[if properties.rating]' +
								'<div class="b-rating">' +
									'<span class="inner"><b class="b-icon2 b-icon2-rating"><b></b></b>$[properties.rating]</span>' +
								'</div>' +
							'[endif]' +
						'</a>' +
					'</h3>' +
					'<p class="desc">$[properties.desc]</p>' +
					'[if properties.routeMarker]$[[tver#deleteFromRoute]][else]$[[tver#addToRoute]][endif]' +
				'</div>' +
				'[if properties.routeMarker]<div class="b-route-marker">$[properties.routeMarker]</div>[endif]' +
				'$[[tver#balloonClose]]' +
				'<i class="pointer"></i><i class="point"></i>' +
			'</div>'
		);
	
	ymaps.layout.storage.add('tver#balloonClose', balloonCloseLayout);
	ymaps.layout.storage.add('tver#addToRoute', addToRouteLayout);
	ymaps.layout.storage.add('tver#deleteFromRoute', deleteFromRouteLayout);
	
	// Карта области
	var map = new ymaps.Map('map', {
		center: [57.0315, 34.1708],
		zoom: 8,
		behaviors: ['default', 'scrollZoom']
	});

	// Зум
	var zoomControl = new ymaps.control.SmallZoomControl({layout: zoomLayout});
	map.controls.add(zoomControl, {left: 200, top: 92});
	
	// Большие точки городов
	var cities = [],
		citiesCollection = new ymaps.GeoObjectCollection();

	if( typeof CITIES === 'object' ){
		for( var i = 0; i < CITIES.length; i++ ){
			cities[i] = new ymaps.Placemark(CITIES[i].coords, {
				id: CITIES[i].id,
				title: CITIES[i].title,
				population: CITIES[i].population,
				weather: CITIES[i].weather,
				desc: CITIES[i].desc,
				imageSrc: CITIES[i].imageSrc,
				rating: CITIES[i].rating,
				routeMarker: '',
				searchResult: false
			}, {
				iconLayout: cityLayout,
				iconOffset: [-56, -141],
				zIndex: 1,
				zIndexHover: 1,
				balloonLayout: balloonLayout,
				balloonShadow: false
			});
			
			if( CITIES[i].outside ){
				cities[i].properties.set({
					key: CITIES[i].key
				});
				cities[i].options.set({
					iconLayout: outsideCityLayout,	
					iconOffset: [-52, -36],
				});
			}
			
			citiesCollection.add(cities[i]);
		}

		map.geoObjects.add(citiesCollection);
	}
	
	// Точки с кластеризацией и маршрутами
	var points = [],
		pointsClusters = [],
		fromClusterPoints = new ymaps.GeoObjectCollection(),
		route,
		routePointsArray = new ymaps.GeoObjectArray(),
		alphabet = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ы', 'Э', 'Ю', 'Я'],
		routeTabLink = $('#route-tab-link'),
		destinations = $('#destinations'),
		pointsListing = $('#points-listing'),
		pointTemplate =
			'<li class="item" rel="{type}">' +
				'<h3 class="title">' +
					'<a class="link" rel="point-{id}" href="?">' +
						'<img class="image" alt="{title}" src="/img/points/{id}/point.jpg" width="74" height="74"/> ' +
						'<span class="text">{title}</span>' +
					'</a>' +
				'</h3>' +
			'</li>',
		pointsString = '';
	
	if( typeof POI === 'object' ){
		for( var i = 0; i < POI.length; i++ ){
			points[i] = [];
			
			for( var j = 0; j < POI[i].points.length; j++ ){
				points[i][j] = new ymaps.Placemark(POI[i].points[j].coords, {
					id: POI[i].points[j].id,
					type: POI[i].type,
					title: POI[i].points[j].title,
					desc: POI[i].points[j].desc,
					imageSrc: POI[i].points[j].imageSrc,
					rating: POI[i].points[j].rating,
					routeMarker: '',
					searchResult: false
				}, {
					iconLayout: pointLayout,
					iconOffset: [-22, -51],
					zIndex: 650,
					balloonLayout: balloonLayout,
					balloonShadow: false
				});
				
				pointsString += pointTemplate.supplant({
					id: POI[i].points[j].id,
					type: i,
					title: POI[i].points[j].title
				});
			}
			
			pointsClusters[i] = new ymaps.Clusterer({
				gridSize: 64,
				clusterIconLayout: clusterLayout,
				zIndex: 650,
				type: POI[i].type
			});
			
			pointsClusters[i].add(points[i]);
			
			map.geoObjects.add(pointsClusters[i]);
			map.geoObjects.add(routePointsArray);
			//map.geoObjects.add(fromClusterPoints);
		}
		
		pointsListing.html(pointsString);
	}
	
	// Фильтр точек и городов
	var typeLinks = $('#filter .js-type-link'),
		citiesLink = $('#filter .js-city-link'),
		selectedClass = 'selected',
		clearAllButton = $('#clear-all');
	
	typeLinks
		.addClass('selected')
		.click(function(event){
			var thisLink = $(this),
				thisLinkPosition = typeLinks.index(thisLink);
			
			if( thisLink.hasClass(selectedClass) ){
				map.geoObjects.remove(pointsClusters[thisLinkPosition]);
				hidePointsInListing(thisLinkPosition);
				thisLink.removeClass(selectedClass);
			}
			else{
				map.geoObjects.add(pointsClusters[thisLinkPosition]);
				showPointsInListing(thisLinkPosition);
				thisLink.addClass(selectedClass);
			}
			
			event.preventDefault();
		});
	
	citiesLink
		.addClass(selectedClass)
		.click(function(event){
			var thisLink = $(this);
			
			if( thisLink.hasClass(selectedClass) ){
				map.geoObjects.remove(citiesCollection);
				thisLink.removeClass(selectedClass);
			}
			else{
				map.geoObjects.add(citiesCollection);
				thisLink.addClass(selectedClass);
			}
			
			event.preventDefault();
		});
	
	clearAllButton.click(function(){
		citiesLink.filter('.selected').click();
		typeLinks.filter('.selected').click();
	});
	
	$('#filter-scroll').jScrollPane({
		mouseWheelSpeed: 50,
		verticalGutter: -4
	});
	
	// Выбор редакции
	var pointsScroll = $('#points-scroll'),
		pointsScrollObject;
	
	function showPointsInListing( _rel ){
		$('.item[rel=' + _rel + ']', pointsListing).show();
		$('#point-links-panel').show();
		
		pointsScrollObject.reinitialise();
	}
	
	function hidePointsInListing( _rel ){
		$('.item[rel=' + _rel + ']', pointsListing).hide();
		
		if( $('.item:visible', pointsListing).length == 0 ){
			$('#point-links-panel').hide();
		}
		
		pointsScrollObject.reinitialise();
	}
	
	$('.link', pointsListing).live('click', function(event){
		var thisPointId = $(this).attr('rel').substr(6),
			thisIndexes = getPointsIndexes(thisPointId),
			thisPoint = points[thisIndexes.i][thisIndexes.j],
			thisPointDesc = POI[thisIndexes.i].points[thisIndexes.j];
		
		var pointState = pointsClusters[thisIndexes.i].getObjectState(thisPoint);
		
		if( thisPoint.getParent() === routePointsArray ){
			thisPoint.balloon.open();
		}
		else{
			// Оставил пока: нужны копии точек?
			// Сейчас без кластеров — ок,
			// с кластерами — лишняя точка,
			// выключаешь фильтр — исчезает
			
			/*fromClusterPoints.add(thisPoint);
			thisPoint.balloon.open();*/
			
			if( pointState.isShown ){
				if( !pointState.isClustered ){
					thisPoint.balloon.open();
				}
			}
			else{
				if( !pointState.isClustered ){
					map.panTo(thisPoint.geometry.getCoordinates(), {
						delay: 0,
						callback: function(){
							// Кластеры работают асинхронно — пока не знаю как отловить показ точки
							setTimeout(function(){
								thisPoint.balloon.open();
							}, 100);
						}
					})
				}
			}
		}
		
		event.preventDefault();
	});
	
	map.events.add('wheel', function (e) {
		map.balloon.close();
	});
	
	$('#point-links-panel').tabs({
		linkSelector: '.b-tab-icons .link',
		tabSelector: '.tab',
		animation: {
			type: 'tabSize',
			time: 200
		}
	});
	
	pointsScroll.jScrollPane({
		mouseWheelSpeed: 50,
		verticalGutter: -4
	});
	
	pointsScrollObject = pointsScroll.data('jsp');
	
	// Маршруты
	function addPointToRoute( _rel ){
		if( _rel.substr(0, 5) == 'point' ){
			var thisPointId = _rel.substr(6),
				thisIndexes = getPointsIndexes(thisPointId),
				thisPoint = points[thisIndexes.i][thisIndexes.j];
			
			routePointsArray.add(thisPoint);
			pointsClusters[thisIndexes.i].remove(thisPoint);
			thisPoint.properties.set({
				routeMarker: getAphabetLetter(routePointsArray.getLength() - 1),
				searchResult: false
			});
		}
		else if( _rel.substr(0, 4) == 'city' ){
			var thisCityId = _rel.substr(5),
				thisIndex = getCityIndex(thisCityId),
				thisCity = cities[thisIndex];
			
			routePointsArray.add(thisCity);
			citiesCollection.remove(thisCity);
			thisCity.properties.set( 'routeMarker', getAphabetLetter(routePointsArray.getLength() - 1) );
		}
		
		buildRoute();
		
		routeTabLink.click();
		updateDestinations();
		updateScrollMark();
		toggleScrollVisibility();
	}
	
	function deletePointFromRoute( _rel ){
		if( _rel.substr(0, 5) == 'point' ){
			var thisPointId = _rel.substr(6),
				thisIndexes = getPointsIndexes(thisPointId),
				thisPoint = points[thisIndexes.i][thisIndexes.j];
			
			routePointsArray.remove(thisPoint);
			pointsClusters[thisIndexes.i].add(points[thisIndexes.i][thisIndexes.j]);
			thisPoint.properties.set( 'routeMarker', '' );
		}
		else if( _rel.substr(0, 4) == 'city' ){
			var thisCityId = _rel.substr(5),
				thisIndex = getCityIndex(thisCityId),
				thisCity = cities[thisIndex];
			
			routePointsArray.remove(thisCity);
			citiesCollection.add(thisCity);
			thisCity.properties.set( 'routeMarker', '' );
		}
		
		buildRoute();
		updateRouteMarkers();
		
		routeTabLink.click();
		updateDestinations();
		updateScrollMark();
		toggleScrollVisibility();
		
		if( routePointsArray.getLength() == 0 ){
			addDestination.click();
		}
	}
	
	function getAphabetLetter(_index){
		if( _index < 0 ){
			_index = 0;
		}
		else if( _index > alphabet.length - 1 ){
			_index = alphabet.length - 1;
		}
		return alphabet[_index];
	}
	
	// Построение маршрута
	var routeLabel = $('#route-label'),
		routeLabelDefaultText = $('#route-label').text();
	
	function buildRoute(){
		if( route ){
			map.geoObjects.remove(route);
		}
		
		if( routePointsArray.getLength() > 1 ){
			var tmpArray = [];
			
			routePointsArray.each(function(geoObject){
				tmpArray.push(geoObject.geometry.getCoordinates());
			});
			
			ymaps.route(tmpArray).then(
				function(responseRoute){
					route = responseRoute;
					
					var points = route.getWayPoints();
					
					route.getPaths().options.set( 'strokeColor', 'FF3F55' );
					points.options.set( 'visible', false );
					
					map.geoObjects.add(route);
					
					routeLabel.html('Общее расстояние ' + route.getHumanLength() + ', примерное время в пути ' + route.getHumanTime());
				},
				function (error) {
					modal.show('#route-error');
				}
			);
		}
		else{
			routeLabel.html(routeLabelDefaultText);
		}
	};
	
	function updateRouteMarkers(){
		routePointsArray.each(function(geoObject, i){
			geoObject.properties.set( 'routeMarker', getAphabetLetter(i) );
		});
	}
	
	function updateDestinations(){
		var itemTemplate =
				'<li class="item">' +
					'<div class="b-route-marker">{routeMarker}</div>{title}' +
					'<a class="close" href="?" rel="{rel}"><b class="b-icon2 b-icon2-small-close"><b>Закрыть</b></b></a><i class="corner"></i>' +
				'</li>',
			itemsString = '';
		
		routePointsArray.each(function(geoObject, i){
			var thisRel = geoObject.properties.get('population') ? 'city-' : 'point-';
			
			thisRel += geoObject.properties.get('id');
			
			itemsString += itemTemplate.supplant({
				routeMarker: getAphabetLetter(i),
				title: geoObject.properties.get('title'),
				rel: thisRel
			});
		});
		
		$('.b-search-destination-form', destinations).unbind();
		
		destinations.html(itemsString);
	}
	
	// Добавление точки вручную
	var destinationForm = $('.b-search-destination-form', destinations),
		destinationFormHTML = destinationForm.html(),
		addDestination = $('#add-destination');
	
	destinationForm.submit(searchDestionation);
	
	function searchDestionation(event){
		var thisForm = $(this),
			thisQuery = thisForm[0].query.value;
		
		clearSearchResults();
		
		if( thisQuery != '' ){
			$.getJSON('/search.html?' + thisForm.serialize(), function(response){
				if( typeof response === 'object' ){
					performSearch(response);
				}
			});
		}
		
		event.preventDefault();
	}
	
	addDestination.click(function(event){
		var newDestination = $('<li class="item"></li>'),
			newForm = $('<form class="b-search-destination-form" action="?" method="get"></form>'),
			existedForms = $('.b-search-destination-form', destinations);
		
		newForm.html(destinationFormHTML).submit(searchDestionation);
		
		newDestination
			.append(newForm)
			.append('<div class="b-route-marker">' + getAphabetLetter(routePointsArray.getLength() + existedForms.length) + '</div><i class="corner"></i>')
			.appendTo(destinations);
		
		$('input[type="text"]', newDestination).focus();
		
		updateScrollMark();
		toggleScrollVisibility();
		
		event.preventDefault();
	});
	
	// Удаление точки вручную
	$('.close', destinations).live('click', function(event){
		deletePointFromRoute( $(this).attr('rel') );
		event.preventDefault();
	});
	
	// Сортировка точек
	destinations.sortable({
		axis: 'x',
		handle: '.b-route-marker',
		update: function(event, ui){
			var items = destinations.children(),
				rel, indexes, point;
			
			routePointsArray.removeAll();
			
			for( var i = 0; i < items.length; i++ ){
				rel = items.eq(i).children('.close').attr('rel');
				
				if( typeof rel !== 'undefined' ){
					if( rel.substr(0, 5) == 'point' ){
						indexes = getPointsIndexes(rel.substr(6));
						point = points[indexes.i][indexes.j];
					}
					else if( rel.substr(0, 4) == 'city' ){
						indexes = getCityIndex(rel.substr(5));
						point = cities[indexes];
					}
					
					routePointsArray.add(point);
					point.properties.set( 'routeMarker', getAphabetLetter(i) );
				}
				
				rel = '';
				indexes = [];
				point = null;
			}
			
			buildRoute();
			updateDestinations();
			updateScrollMark();
			toggleScrollVisibility();
		}
	});
	
	// Слайдер маршрута
	var scrollPane = $('#scrollPane'),
		scrollArea = $('.area', scrollPane),
		scrollBar = $('.scrollbar', scrollPane),
		scrollBarInner = $('.inner', scrollBar),
		scrollMark = $('.last-mark', scrollPane)
	
	scrollBarInner.slider({
		slide: sliderCallback
	});
	
	function sliderCallback(){
		var scrollAreaWidth = scrollArea.width() + parseInt(scrollArea.css('padding-left')) + parseInt(scrollArea.css('padding-right'));
			
		if( scrollAreaWidth > scrollPane.width() ){
			scrollArea.css('margin-left', Math.round( scrollBarInner.slider('value') / 100 * (scrollPane.width() - scrollAreaWidth) ) + 'px');
		}
		else{
			scrollArea.css('margin-left', 0);
		}
	}
	
	scrollPane.css('overflow', 'hidden');
	
	function toggleScrollVisibility(){
		var scrollAreaWidth = scrollArea.width() + parseInt(scrollArea.css('padding-left')) + parseInt(scrollArea.css('padding-right'));
		
		if( scrollAreaWidth > scrollPane.width() ){
			scrollBar.show();
			
			scrollBarInner.slider('value', 100);
			sliderCallback();
		}
		else{
			scrollBar.hide();
			
			scrollBarInner.slider('value', 0);
			sliderCallback();
		}
	}
	
	function updateScrollMark(){
		scrollMark.text( getAphabetLetter(destinations.children().length - 1) );
	}
	
	// Поиск
	var searchForm = $('#search-form'),
		searchInput = $('#f-query'),
		searchCollection = new ymaps.GeoObjectCollection();
	
	$('.b-hint-label').hints();
	
	$('#search-sample').click(function(event){
		searchInput.focus().val( $(this).text() );
		
		event.preventDefault();
	});
	
	searchForm.submit(function(event){
		var thisQuery = searchForm[0].query.value;
		
		clearSearchResults();
		
		if( thisQuery != '' && thisQuery != 'Найти на карте' ){
			$.getJSON('/search.html?' + searchForm.serialize(), function(response){
				if( typeof response === 'object' ){
					performSearch(response);
				}
			});
		}
		
		event.preventDefault();
	});
	
	function performSearch(_searchResults){
		if( _searchResults.length == 0 ){
			modal.show('#empty-search-results');
		}
		else{
			var searchPointIndexes,
				searchPoint;
				//searchBounds;
			
			for( var i = 0; i < _searchResults.length; i++ ){
				searchPointIndexes = getPointsIndexes(_searchResults[i]);
				searchPoint = points[searchPointIndexes.i][searchPointIndexes.j];
				
				searchPoint.properties.set('searchResult', true);
				searchCollection.add(searchPoint);
				
				pointsClusters[searchPointIndexes.i].remove(searchPoint);
			}
			
			map.geoObjects.add(searchCollection);
			
			/*
			С масштабированием нужно работать —
			при таком количестве объектов оно ни к чему
			
			searchBounds = searchCollection.getBounds();
			
			if( (searchBounds[0][0] - searchBounds[1][0]) > 1 ){
				searchBounds[0][0] -= 0.5;
				searchBounds[1][0] += 0.5;
			}
			
			if( (searchBounds[1][1] - searchBounds[0][1]) > 1 ){
				searchBounds[0][1] += 0.5;
				searchBounds[1][1] -= 0.5;
			}
			
			map.setBounds(searchBounds, {
				duration: 500
			});
			*/
			
			if( _searchResults.length == 1 ){
				searchPoint.balloon.open();
			}
		}
	}
	
	function clearSearchResults(){
		if( searchCollection.getLength() > 0 ){
			searchCollection.each(function(geoObject){
				var thisIndexes = getPointsIndexes(geoObject.properties.get('id'));
				
				geoObject.properties.set('searchResult', false);
				searchCollection.remove(geoObject);
				
				pointsClusters[thisIndexes.i].add(geoObject);
			});
			
		}
	}
	
	// Категории, переданные в url
	//typeLinks.click();
	
	if( typeof CATEGORIES_IDS !== 'undefined' ){
		typeLinks.filter(function(){
			return CATEGORIES_IDS.indexOf(parseInt($(this).attr('rel').substr(9), 10)) != -1;
		}).click();
	}
	
	// Точка, переданная в url
	if( typeof POI_ID !== 'undefined' ){
		var pointFromIdIndexes = getPointsIndexes(POI_ID),
			pointFromId = points[pointFromIdIndexes.i][pointFromIdIndexes.j];
		
		// Плохо: нужно делать по общей схеме показа точек извне.
		// Таймаут так вообще треш — потому что кластер асинхронно работает.
		setTimeout(function(){
			pointFromId.balloon.open();
		}, 500);
	}
});

function getPointsIndexes(_id){
	var indexes = {
		i: 0,
		j: 0
	};
	
	if( typeof POI === 'object' ){
		for( var i = 0; i < POI.length; i++ ){
			for( var j = 0; j < POI[i].points.length; j++ ){
				if( POI[i].points[j].id == _id ){
					indexes.i = i;
					indexes.j = j;
					
					break;
				}
			}
		}
	}
	
	return indexes;
}

function getCityIndex(_id){
	var index = 0;
	
	if( typeof CITIES === 'object' ){
		for( var i = 0; i < CITIES.length; i++ ){
			if( CITIES[i].id == _id ){
				index = i;
				break;
			}
		}
	}
	
	return index;
}

String.prototype.supplant = function(o){
	return this.replace(/{([^{}]*)}/g,
		function (a, b) {
			var r = o[b];
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		}
	);
};
