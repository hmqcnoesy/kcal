
function getFoodsByDateString(dateString) {
	var foods = localStorage[dateString] || '[]';
	return JSON.parse(foods);
}

function dateToString(date) {
	return date.getFullYear().toString() + '-' 
	+ date.getMonth().toString() + '-' 
	+ date.getDate().toString();
}

function stringToDate(dateString) {
	return '';
}


function createFoodOptionsForSelect(foods, emptyOptionText) {

	if (!emptyOptionText) emptyOptionText = '';
		
	var options = '<option value="0">' + emptyOptionText + '</option>';
	
	for (var i = 0; i < foods.length; i++) {
		options += '<option value="' + foods[i].id + '" ';
		options += 'data-name="' + foods[i].name + '" ';
		options += 'data-calories="' + foods[i].calories + '" ';
		options += 'data-protein="' + foods[i].protein + '" ';
		options += 'data-carbohydrate="' + foods[i].carbohydrate + '"';
		options += 'data-fat="' + foods[i].fat + '" ';
		options += '>' + foods[i].name + '</option>';
	}
	console.log(options);
	return options;
}


function getQuickFoods() {
	var quickFoods = localStorage.quickFoods || '[]';
	return JSON.parse(quickFoods);
}


function saveQuickFoods(quickFoods) {
	localStorage.quickFoods = JSON.stringify(quickFoods);
}