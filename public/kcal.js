$(function() {
	var todayString = dateToString(new Date());
	var foods = getFoodsByDateString(todayString);
	$('#date').val(todayString);
	
	setupPrevNextDateButtonClick();
	setupDateChange();
	showFoodsData(foods);
	setupRemoveRowLinks();
	
	var quickFoods = getQuickFoods();

	var options = createFoodOptionsForSelect(quickFoods);
	$('#selFoods').html(options);
	
	setupSelectFoodChange();
	setupConsumeClick();
	setupSaveClick();
});


function setupPrevNextDateButtonClick() {
	$('#btnPrevDate').click(function() {
		var selectedDate = stringToDate($('#date').val());
		selectedDate.setDate(selectedDate.getDate() - 1);
		$('#date').val(dateToString(selectedDate));
		$('#date').trigger('change');
	});
	
	$('#btnNextDate').click(function() {
		var selectedDate = stringToDate($('#date').val());
		selectedDate.setDate(selectedDate.getDate() + 1);
		$('#date').val(dateToString(selectedDate));
		$('#date').trigger('change');
	});
}


function setupSelectFoodChange() {
	$('#selFoods').change(function() {
		var $opt = $(this.options[this.selectedIndex]);
		$('#hiddenId').val($opt.val());
		$('#txtName').val($opt.attr('data-name'));
		$('#txtCalories').val($opt.attr('data-calories'));
		$('#txtProtein').val($opt.attr('data-protein'));
		$('#txtCarbohydrate').val($opt.attr('data-carbohydrate'));
		$('#txtFat').val($opt.attr('data-fat'));
	});
}


function setupConsumeClick() {
	$('#btnConsume').click(function() {
		var sel = document.getElementById('selFoods');
		
		var opt = sel.options[sel.selectedIndex];
		var $opt = $(opt);
		var portion = parseFloat($('#txtServings').val());
		
		var food = {
			id: generateUUID(),
			name: $('#txtName').val(),
			portion: portion,
			calories: portion * $('#txtCalories').val(),
			protein: portion * $('#txtProtein').val(),
			carbohydrate: portion * $('#txtCarbohydrate').val(),
			fat: portion * $('#txtFat').val()
		};
		
		var consumeDate = $('#date').val();
		var foods = getFoodsByDateString(consumeDate);
		foods.push(food);
		localStorage[consumeDate] = JSON.stringify(foods);
		showFoodsData(foods);
		setupRemoveRowLinks();
	});
}


function setupSaveClick() {
	$('#btnSave').click(function() {
		var quickFoods = getQuickFoods();
		var id = $('#hiddenId').val();
		
		if (!id) {
			var food = {
				id: generateUUID(),
				name: $('#txtName').val(),
				calories: $('#txtCalories').val(),
				fat: $('#txtFat').val(),
				carbohydrate: $('#txtCarbohydrate').val(),
				protein: $('#txtProtein').val()
			}
			
			quickFoods.push(food);
		} else {
			for (var i = 0; i < quickFoods.length; i++) {
				if (quickFoods[i].id == id) {
					quickFoods[i].name = $('#txtName').val();
					quickFoods[i].size =  $('#txtSie').val();
					quickFoods[i].calories = $('#txtCalories').val();
					quickFoods[i].fat = $('#txtFat').val();
					quickFoods[i].carbohydrate = $('#txtCarbohydrate').val();
					quickFoods[i].protein = $('#txtProtein').val();
				}
			}
		}
		
		localStorage.quickFoods = JSON.stringify(quickFoods);
	});
}

	
	
function setupRemoveRowLinks() {
	$('a[data-remove-row]').click(function() {
		if (confirm('Confirm row removal?')) {
			var idToRemove = $(this).attr('data-remove-row');
			var foods = getFoodsByDateString($('#date').val());
			for (var i = 0; i < foods.length; i++) {
				if (foods[i].id === idToRemove) {
					foods.splice(i, 1);
					$(this).parents('tr').remove();
					break;
				}
			}
			
			localStorage[$('#date').val()] = JSON.stringify(foods);
			showFoodsData(foods);
			setupRemoveRowLinks();
		}
	});
}


function setupDateChange() {
	$('#date').change(function() {
		var foods = getFoodsByDateString($('#date').val());
		showFoodsData(foods);
		setupRemoveRowLinks();
	});
}
	
	
function showFoodsData(foods) {
	var rows = '';
	var totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
	
	for (var i = 0; i < foods.length; i++) {
		rows += getTableRow(foods[i], true);
		
		totalCal += foods[i].calories;
		totalP += foods[i].protein;
		totalC += foods[i].carbohydrate;
		totalF += foods[i].fat;
	}
	
	$('#tblFoods>tbody').html(rows);
	$('#tblFoods>tfoot').html(getTableRow({name: 'Total', portion: ' ', calories: totalCal, protein: totalP, carbohydrate: totalC, fat: totalF}, false));
	
	var goals = localStorage.goals || {calories: 1800, protein: 170, carbohydrate: 220, fat: 50 };
	if (goals.calories) {
		$('#progressCalories').attr('max', goals.calories).val(totalCal);
		$('#divCalories').text(totalCal.toFixed(0));
	}
	if (goals.protein) {
		$('#progressProtein').attr('max', goals.protein).val(totalP);
		$('#divProtein').text(totalP.toFixed(0));
	}
	if (goals.carbohydrate) {
		$('#progressCarbohydrate').attr('max', goals.carbohydrate).val(totalC);
		$('#divCarbohydrate').text(totalC.toFixed(0));
	}
	if (goals.fat) {
		$('#progressFat').attr('max', goals.fat).val(totalF);
		$('#divFat').text(totalF.toFixed(0));
	}
}

	
function getTableRow(food, allowRemoval) {
	var row = '<tr><td>' + food.portion + ' ' + food.name + '</td>';
	row += '<td>' + food.calories.toFixed(1) + '</td>';
	row += '<td>' + food.protein.toFixed(1) + '</td>';
	row += '<td>' + food.carbohydrate.toFixed(1) + '</td>';
	row += '<td>' + food.fat.toFixed(1) + '</td>';
	if (allowRemoval) 
	{
		row += '<td><a data-remove-row="' + food.id + '">x</a></td>';
	} else {
		row += '<td></td>';
	}
	row += '</tr>';
	return row;
}


function getFoodsByDateString(dateString) {
	var foods = localStorage[dateString] || '[]';
	return JSON.parse(foods);
}


function dateToString(date) {
	var year = date.getFullYear().toString();
	var month = ("0" + (date.getMonth() + 1)).slice(-2);
	var day = ("0" + date.getDate()).slice(-2);

	return year + "-" + month + "-" + day;
}


function stringToDate(dateString) {
	var parts = dateString.split('-');
	return new Date(parts[0], parts[1]-1, parts[2]);
}


function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


function createFoodOptionsForSelect(foods, emptyOptionText) {

	if (!emptyOptionText) emptyOptionText = '';
		
	var options = '<option value="">' + emptyOptionText + '</option>';
	
	for (var i = 0; i < foods.length; i++) {
		options += '<option value="' + foods[i].id + '" ';
		options += 'data-name="' + foods[i].name + '" ';
		options += 'data-calories="' + foods[i].calories + '" ';
		options += 'data-protein="' + foods[i].protein + '" ';
		options += 'data-carbohydrate="' + foods[i].carbohydrate + '"';
		options += 'data-fat="' + foods[i].fat + '" ';
		options += '>' + foods[i].name + '</option>';
	}
	return options;
}


function getQuickFoods() {
	var quickFoods = localStorage.quickFoods || '[]';
	quickFoods = JSON.parse(quickFoods);
	return quickFoods.sort(function(a, b) {
		return a.name.localeCompare(b.name);
	});
}