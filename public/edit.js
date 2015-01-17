
$(function() {
	var quickFoods = getQuickFoods();
	var options = createFoodOptionsForSelect(quickFoods, '&lt;Create New&gt;');
	$('#selFoods').html(options);
	
	$('#selFoods').change(function() {
		var $opt = $(this.options[this.selectedIndex]);
		$('#hiddenId').val($opt.val());
		$('#txtName').val($opt.attr('data-name'));
		$('#txtCalories').val($opt.attr('data-calories'));
		$('#txtProtein').val($opt.attr('data-protein'));
		$('#txtCarbohydrate').val($opt.attr('data-carbohydrate'));
		$('#txtFat').val($opt.attr('data-fat'));
	});

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
		
		saveQuickFoods(quickFoods);
		$('#divSaveResult').text('Succesfully saved food');
	});
});