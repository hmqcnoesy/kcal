
$(function() {
	var foods = getFoodsByDateString(dateToString(new Date()));
	showFoodsData(foods);
	
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
		
		var todayString = dateToString(new Date());
		var foods = getFoodsByDateString(todayString);
		foods.push(food);
		localStorage[todayString] = JSON.stringify(foods);
		showFoodsData(foods);
	});
	
	
	function showFoodsData(foods) {
		var rows = '';
		var totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
		
		for (var i = 0; i < foods.length; i++) {
			rows += getTableRow(foods[i]);
			
			totalCal += foods[i].calories;
			totalP += foods[i].protein;
			totalC += foods[i].carbohydrate;
			totalF += foods[i].fat;
		}
		
		$('#tblFoods>tbody').html(rows);
		$('#tblFoods>tfoot').html(getTableRow({name: 'Total', portion: '-', calories: totalCal, protein: totalP, carbohydrate: totalC, fat: totalF}));
	}
	
	function getTableRow(food) {
		console.dir(food);
		var row = '<tr><td>' + food.name + '</td>';
		row += '<td>' + food.portion + '</td>';
		row += '<td>' + food.calories.toFixed(1) + '</td>';
		row += '<td>' + food.protein.toFixed(1) + '</td>';
		row += '<td>' + food.carbohydrate.toFixed(1) + '</td>';
		row += '<td>' + food.fat.toFixed(1) + '</td></tr>';
		return row;
	}
});