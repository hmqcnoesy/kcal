
$(function() {
	var todayString = dateToString(new Date());
	var foods = getFoodsByDateString(todayString);
	$('#date').val(todayString);
	setupDateChange();
	showFoodsData(foods);
	setupRemoveRowLinks();
	
	var quickFoods = getQuickFoods();

	var options = createFoodOptionsForSelect(quickFoods);
	$('#selQuickFoods').html(options);
	
	$('#btnConsume').click(function() {
		var sel = document.getElementById('selQuickFoods');
		var opt = sel.options[sel.selectedIndex];
		var $opt = $(opt);
		var portion = (Number)($('#txtPortion').val());
		
		var food = {
			name: $opt.attr('data-name'),
			portion: portion,
			calories: portion * $opt.attr('data-calories'),
			protein: portion * $opt.attr('data-protein'),
			carbohydrate: portion * $opt.attr('data-carbohydrate'),
			fat: portion * $opt.attr('data-fat')
		};
		
		var consumeDate = $('#date').val();
		var foods = getFoodsByDateString(consumeDate);
		foods.push(food);
		localStorage[consumeDate] = JSON.stringify(foods);
		showFoodsData(foods);
		setupRemoveRowLinks();
	});
	
	
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
	}
	
	function getTableRow(food, allowRemoval) {
		var row = '<tr><td>' + food.portion + ' ' + food.name + '</td>';
		row += '<td>' + food.calories.toFixed(1) + '</td>';
		row += '<td>' + food.protein.toFixed(1) + '</td>';
		row += '<td>' + food.carbohydrate.toFixed(1) + '</td>';
		row += '<td>' + food.fat.toFixed(1) + '</td>';
		if (allowRemoval) 
		{
			row += '<td><a data-remove-row>x</a></td>';
		} else {
			row += '<td></td>';
		}
		row += '</tr>';
		return row;
	}
	
	
	function setupRemoveRowLinks() {
		$('a[data-remove-row]').click(function() {
			if (confirm('Confirm row removal?')) {
				var foods = getFoodsByDateString(new Date());
				//remove the food,
				//save back into localStorage
				//call showFoodsData();
				//call setupRemoveRowLinks();
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
});