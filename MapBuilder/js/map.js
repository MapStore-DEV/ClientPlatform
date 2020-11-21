var blocks_count = 0;

var selected_blocks_array = [];

var ctrl_is_pressed = false;

var switch_block = 0;

var global_switch = 0;

var options_div_switch = 0;

var search_div_switch = 0;

var mouse_x_pos = 0;
var mouse_y_pos = 0;

var global_scroll_x = 0;
var global_scroll_y = 0;

var mouse_x_options_div_pos = 0;
var mouse_y_options_div_pos = 0;

var mouse_x_search_div_pos = 0;
var mouse_y_search_div_pos = 0;

var target_modify_block = -1;

var options_div_lock_switch = 0;

var ranger_switch = "null";

var global_product_location_select = 0;

var product_market_x_limit_1 = 0;
var product_market_x_limit_2 = 0;
var product_market_y_limit_1 = 0;
var product_market_y_limit_2 = 0;

var product_list = [];

var location_tag_switch = 0;

var location_tag_x = 0;
var location_tag_y = 0;

var location_tag_target_block = 0;

var store_product_switch = 0;

//console.log(screen.height+" "+screen.width);

function switch_to_block_manage()
{
	$("#add_block_main_div").css("display","block");
	$("#add_product_div").css("display","none");
}

function add_block()
{
	switch_to_block_manage();
	//alert( screen.width + " " + screen.height );
	//alert($("html").css("height"));
	var new_block_x = parseInt( document.documentElement.scrollTop + (screen.height/2) );
	var new_block_y = parseInt( document.documentElement.scrollLeft + (screen.width/2) );
	//alert(new_block_x+" "+new_block_y);
	$("#map").html( $("#map").html() + "\n<div class='map_block' id='block_nr_"+blocks_count+"' onclick='check_keys_selected("+blocks_count+");modify_block("+blocks_count+");check_product_location("+blocks_count+");' onmousedown='activate_switch_block(event);' onmouseup='deactivate_switch_block();' onmousemove='move_blocks(event);' ><p class='map_block_text' id='map_block_text_"+blocks_count+"'>New Block</p></div>" );
	$("#block_nr_"+blocks_count).css('top',new_block_x+"px");
	$("#block_nr_"+blocks_count).css('left',new_block_y+"px");
	target_modify_block = blocks_count;
	update_add_block_menu_vals("",200,200,0,5,20);
	blocks_count++;
}

function check_ctrl(e)
{
	key_code = e.keyCode;
	if(key_code == 17) ctrl_is_pressed = true;
}

function reset_keys()
{
	ctrl_is_pressed = false;
}

function check_keys_selected(id)
{
	if(ctrl_is_pressed) 
	{
		ok = 1;
		for (var i = 0; i < selected_blocks_array.length; i++) {
			if(selected_blocks_array[i] == id)
			{
				$("#block_nr_"+id).css("border","1px solid #C3C3C3");
				selected_blocks_array.splice(i,1);
				ok = 0;
				break;
			}
		}
		if(ok)
		{
			$("#block_nr_"+id).css("border","1.5px dashed white");
			selected_blocks_array.push(id);
			//css thing
		}
		console.log(selected_blocks_array);
	}
}

function activate_switch_block(event)
{
	console.log("Calling [activate_switch_block]");
	switch_block = 1;
	mouse_x_pos = event.pageX;
	mouse_y_pos = event.pageY;
}

function deactivate_switch_block()
{
	console.log("Calling [deactivate_switch_block]");
	switch_block = 0;	
}

function get_angle(input_id)
{
	var angle = 0;
	var el = document.getElementById(input_id);
	var st = window.getComputedStyle(el, null);
	var tr = st.getPropertyValue("-webkit-transform") ||
	         st.getPropertyValue("-moz-transform") ||
	         st.getPropertyValue("-ms-transform") ||
	         st.getPropertyValue("-o-transform") ||
	         st.getPropertyValue("transform") ||
	         "FAIL";

	// With rotate(30deg)...
	// matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
	console.log('Matrix: ' + tr);

	// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

	var values = tr.split('(')[1].split(')')[0].split(',');
	var a = values[0];
	var b = values[1];
	var c = values[2];
	var d = values[3];

	var scale = Math.sqrt(a*a + b*b);

	//console.log('Scale: ' + scale);

	// arc sin, convert from radians to degrees, round
	var sin = b/scale;
	// next line works for 30deg but not 130deg (returns 50);
	// var angle = Math.round(Math.asin(sin) * (180/Math.PI));
	angle = Math.round(Math.atan2(b, a) * (180/Math.PI));

	//console.log('Rotate: ' + angle + 'deg');

	return angle;

}

function modify_block(id)
{
	if(global_product_location_select == 0 && store_product_switch == 0)
	{
		target_modify_block = id;
		update_name = "";
		update_name = $("#map_block_text_"+id).html();
		update_height = parseInt( $("#block_nr_"+id).css("height") );
		update_width = parseInt( $("#block_nr_"+id).css("width") );
		update_rotation = 0;
		update_rotation = get_angle("block_nr_"+id);
		update_border_radius = parseInt( $("#block_nr_"+id).css("border-radius") );
		update_font_size = parseInt( $("#map_block_text_"+id).css("font-size") );
		update_add_block_menu_vals(update_name,update_height,update_width,update_rotation,update_border_radius,update_font_size);
		switch_to_block_manage();
	}
}

function check_product_location(block_nr)
{
	if(global_product_location_select == 1)
	{
		var target_height = parseInt( $("#block_nr_"+block_nr).css("height") );
		var target_width = parseInt( $("#block_nr_"+block_nr).css("width") );
		var x_pos = parseInt( $("#block_nr_"+block_nr).css("left") );
		var y_pos = parseInt( $("#block_nr_"+block_nr).css("top") );
		var target_block_name = $("#map_block_text_"+block_nr).html();
		//alert(target_height+" "+target_width+" "+x_pos+" "+y_pos);

		var target_product_market_x = x_pos + parseInt(target_width/2);
		var target_product_market_y = y_pos + parseInt(target_height/2);

		location_tag_target_block = block_nr;

		product_market_x_limit_1 = x_pos;
		product_market_x_limit_2 = x_pos+target_width;
		product_market_y_limit_1 = y_pos;
		product_market_y_limit_2 = y_pos+target_height;

		$("#product_location_div").html( "Product Location: "+ target_block_name );

		//alert(target_product_market_x+" "+target_product_market_y);

		$("#location_tag").css("top",target_product_market_y+"px");
		$("#location_tag").css("left",target_product_market_x+"px");

		$("#location_tag").css("display","block");
	}

}

function move_blocks(event)
{
	// alert("TRIGGERED");
	if(switch_block)
	{
		x_offset = event.pageX - mouse_x_pos;
		y_offset = event.pageY - mouse_y_pos;

		for (var i = 0; i < selected_blocks_array.length; i++) {
			
			var target_id = selected_blocks_array[i];
			var target_pos_y = parseInt( $("#block_nr_"+target_id).css("top") );
			var target_pos_x = parseInt( $("#block_nr_"+target_id).css("left") );
			
			target_pos_y += y_offset;
			target_pos_x += x_offset;

			$("#block_nr_"+target_id).css("top",target_pos_y+"px");
			$("#block_nr_"+target_id).css("left",target_pos_x+"px");

		}

		mouse_x_pos = event.pageX;
		mouse_y_pos = event.pageY;

	}
}

function activate_ranger_switch(ranger)
{
	ranger_switch = ranger;
}

function deactivate_ranger_switch(ranger)
{
	ranger_switch = "null";
}

function activate_global_move_switch(event)
{
	global_switch = 1;
	global_scroll_x = event.pageX;
	global_scroll_y = event.pageY;
}

function deactivate_global_move_switch()
{
	global_switch = 0;
}

function update_scroll(event)
{
	if(global_switch == 1 && switch_block == 0)
	{

		x_offset = event.pageX - global_scroll_x;
		y_offset = event.pageY - global_scroll_y;

		x_offset /= 2;
		y_offset /= 2;

		x_offset *= -1;
		y_offset *= -1;

		window.scrollTo( document.documentElement.scrollLeft + x_offset, document.documentElement.scrollTop + y_offset );

		global_scroll_x = event.pageX;
		global_scroll_y = event.pageY;
	}
}

function activate_options_div_switch(event)
{
	if(options_div_lock_switch == 1)
	{
		options_div_switch = 1;
		mouse_x_options_div_pos = event.pageX;
		mouse_y_options_div_pos = event.pageY;
	}

}
function deactivate_options_div_switch()
{
	options_div_switch = 0;
}
function update_options_div_switch(event)
{
	if(options_div_switch == 1)
	{

		x_offset = event.pageX - mouse_x_options_div_pos;
		y_offset = event.pageY - mouse_y_options_div_pos;

		var target_pos_y = parseInt( $("#options_div").css("top") );
		var target_pos_x = parseInt( $("#options_div").css("left") );
		
		target_pos_y += y_offset;
		target_pos_x += x_offset;

		$("#options_div").css("top",target_pos_y+"px");
		$("#options_div").css("left",target_pos_x+"px");		

		mouse_x_options_div_pos = event.pageX;
		mouse_y_options_div_pos = event.pageY;

	}
}

function activate_search_div_switch(event)
{
	search_div_switch = 1;
	mouse_x_search_div_pos = event.pageX;
	mouse_y_search_div_pos = event.pageY;
}
function deactivate_search_div_switch()
{
	search_div_switch = 0;
}
function update_search_div_switch(event)
{
	if(search_div_switch == 1)
	{

		x_offset = event.pageX - mouse_x_search_div_pos;
		y_offset = event.pageY - mouse_y_search_div_pos;

		var target_pos_y = parseInt( $("#search_div").css("top") );
		var target_pos_x = parseInt( $("#search_div").css("left") );
		
		target_pos_y += y_offset;
		target_pos_x += x_offset;

		$("#search_div").css("top",target_pos_y+"px");
		$("#search_div").css("left",target_pos_x+"px");		

		mouse_x_search_div_pos = event.pageX;
		mouse_y_search_div_pos = event.pageY;

	}
}


function stop_click_event_propagation()
{
	event.stopPropagation();
	window.event.cancelBubble = true;
}

function update_ranger(ranger,target_input)
{
	if(ranger_switch != "null")
	{
		target_val = parseInt( $("#"+ranger).val() );
		$("#"+target_input).val(target_val);
	}
}
function update_input(input,target_ranger)
{
	target_val = parseInt( $("#"+input).val() );
	$("#"+target_ranger).val(target_val);
}

function change_block_property(property,property_input)
{
	target_val = $("#"+property_input).val();
	if(property != "block_name") target_val = parseInt(target_val);

	if(property == "block_name")
	{
		$("#map_block_text_"+target_modify_block).html(target_val);		
	}
	else if(property == "height")
	{
		$("#block_nr_"+target_modify_block).css("height",target_val);
	}
	else if(property == "width")
	{
		$("#block_nr_"+target_modify_block).css("width",target_val);	
	}
	else if(property == "rotation")
	{
		//$("#block_nr_"+target_modify_block).css("transform","rotate("+target_val+"deg);");
		$("#block_nr_"+target_modify_block).css("transform","rotate("+target_val+"deg)");
		$("#map_block_text_"+target_modify_block).css("transform","rotate(-"+target_val+"deg)");
		/* $("#block_nr_"+target_modify_block).css({
		    "-webkit-transform": "rotate("+target_val+"deg);",
		    "-moz-transform": "rotate("+target_val+"deg)",
		    "transform": "rotate("+target_val+"deg)"
		});*/
		$("#block_nr_"+target_modify_block).css("-ms-transform","rotate("+target_val+"deg)");
		$("#map_block_text_"+target_modify_block).css("-ms-transform","rotate(-"+target_val+"deg)");
	}
	else if(property == "border_radius")
	{
		$("#block_nr_"+target_modify_block).css("border-radius",target_val);
	}
	else if(property == "block_size")
	{
		$("#map_block_text_"+target_modify_block).css("font-size",target_val+"px");
	}

}

function update_add_block_menu_vals(name,height,width,rotation,border_radius,font_size)
{
	$("#name_block_input").val(name);

	$("#height_block_input").val(height);
	$("#height_slider").val(height);

	$("#width_block_input").val(width);
	$("#width_slider").val(width);

	$("#rotation_block_input").val(rotation);
	$("#rotation_slider").val(rotation);

	$("#border_radius_block_input").val(border_radius);
	$("#border_radius_slider").val(border_radius);

	$("#block_name_size_input").val(font_size);
	$("#block_name_size_slider").val(font_size);

}

function change_block_color(color)
{
	$("#block_nr_"+target_modify_block).css("background-color",color);
	if(color == 'transparent')
	{
		$("#block_nr_"+target_modify_block).css("box-shadow","none");
		$("#block_nr_"+target_modify_block).css("border","none");
	}
}

function change_block_font_color(color)
{
	$("#map_block_text_"+target_modify_block).css("color",color);
}

function show_block_color_palette(sw)
{
	if(sw == 0)
	{
		$("#block_color").css("display","block");
		$("#block_color_img").attr("onclick","show_block_color_palette(1)");
	}
	else if(sw == 1)
	{
		$("#block_color").css("display","none");
		$("#block_color_img").attr("onclick","show_block_color_palette(0)");
	}
}

function show_font_color_palette(sw)
{
	if(sw == 0)
	{
		$("#block_font_color").css("display","block");
		$("#block_font_color_img").attr("onclick","show_font_color_palette(1)");
	}
	else if(sw == 1)
	{
		$("#block_font_color").css("display","none");
		$("#block_font_color_img").attr("onclick","show_font_color_palette(0)");
	}
}

function update_block(name,name_size,name_color,height,width,rotation,border_radius,color)
{
	$("#map_block_text_"+target_modify_block).html(name);
	$("#map_block_text_"+target_modify_block).css("font-size",name_size+"px");
	$("#map_block_text_"+target_modify_block).css("color",name_color);
	$("#block_nr_"+target_modify_block).css("height",height);
	$("#block_nr_"+target_modify_block).css("width",width);

	$("#block_nr_"+target_modify_block).css("transform","rotate("+rotation+"deg)");
	$("#map_block_text_"+target_modify_block).css("transform","rotate(-"+rotation+"deg)");
	$("#block_nr_"+target_modify_block).css("-ms-transform","rotate("+rotation+"deg)");
	$("#map_block_text_"+target_modify_block).css("-ms-transform","rotate(-"+rotation+"deg)");

	$("#block_nr_"+target_modify_block).css("border-radius",border_radius+"px");
	$("#block_nr_"+target_modify_block).css("background-color",color);

}

function clone_selected()
{
	clone_block_name = $("#name_block_input").val();
	clone_block_name_size = parseInt( $("#block_name_size_input").val() );
	clone_block_name_color = $("#map_block_text_"+target_modify_block).css("color");
	clone_block_height = parseInt( $("#height_block_input").val() );
	clone_block_width = parseInt( $("#width_block_input").val() );
	clone_block_rotation = parseInt( $("#rotation_block_input").val() );
	clone_block_border_radius = parseInt( $("#border_radius_block_input").val() );
	clone_block_color = $("#block_nr_"+target_modify_block).css("background-color");
	add_block();
	update_add_block_menu_vals(clone_block_name,clone_block_height,clone_block_width,clone_block_rotation,clone_block_border_radius,clone_block_name_size);
	update_block(clone_block_name,clone_block_name_size,clone_block_name_color,clone_block_height,clone_block_width,clone_block_rotation,clone_block_border_radius,clone_block_color);
}

function delete_blocks()
{
	for (var i = 0; i < selected_blocks_array.length; i++) {
		$("#block_nr_"+selected_blocks_array[i]).css("display","none");
	}
	$("#add_block_main_div").css("display","none");
}

function zoom_in()
{
	zoom_1 = parseFloat( $("#map").css("zoom") );
	zoom_1 += 0.1*zoom_1;
	$("#map").css("zoom",zoom_1);
}
function zoom_out()
{
	zoom_1 = parseFloat( $("#map").css("zoom") );
	zoom_1 -= 0.1*zoom_1;
	$("#map").css("zoom",zoom_1);	
}

function random_scroll()
{
	window.scrollTo(2000,0);
}

function print_doc_height()
{
	console.log($("html").css("height"));
}

function options_menu_switch(sw)
{
	if(sw == 0)
	{
		options_div_lock_switch = 1;
		$("#options_div_lock_btn").html("Lock Options Menu");
		$("#options_div_lock_btn").attr("onclick","options_menu_switch(1);");
	}
	else if(sw == 1)
	{
		options_div_lock_switch = 0;
		$("#options_div_lock_btn").html("Unlock Options Menu");
		$("#options_div_lock_btn").attr("onclick","options_menu_switch(0);");
	}
}

function load_store_map_btns()
{
	$('#blocks_manager').css("display", "block");
	$("#options_div_buttons").html('');
	$('#options_div_buttons').html('<div class="col-lg-4 col-md-6 col-sm-12 btn-option"><button type="button" class="options_div_btn btn btn-primary" style="width:95%" onclick="add_block();" >Add Block</button></div><div class="col-lg-4 col-md-6 col-sm-12 btn-option"><button type="button" class="options_div_btn btn btn-primary" style="width:95%">Search Block</button></div><div class="col-lg-4 col-md-6 col-sm-12 btn-option"><button type="button" id="options_div_lock_btn" class="options_div_btn btn btn-primary" style="width:95%" onclick="options_menu_switch(0);" >Unlock Options Menu</button></div>');
	$("#add_product_div").css("display","none");
	store_product_switch = 0;
}

function load_store_products_btns()
{
	$('#blocks_manager').css("display", "block");
	$("#options_div_buttons").html('');
	$('#options_div_buttons').html('<div class="col-lg-12 col-md-12 col-sm-12 btn-option"><button type="button" class="options_div_btn btn btn-primary" style="width:95%" onclick="switch_to_add_product_menu();" >Add product</button></div>');
	$("#add_block_main_div").css("display","none");
	store_product_switch = 1;
}

function export_map()
{
	$('#blocks_manager').css("display", "none");
	$("#options_div_buttons").html('');
	$('#options_div_buttons').html('<div class="col-lg-12 col-md-12 col-sm-12 btn-option"><button type="button" class="options_div_btn btn btn-primary" style="width:95%" onclick="generate_json();" >Generate JSON</button></div>');
	var store_map = $('#map');
	generate_json(store_map.html().split('\n'));

	// console.log(store_map.html().split('\n'));
}

function generate_json(items)
{
	console.log("[*] Generating Map Json");
	var store_map = new Object();
	store_map.blocks = [];
	for(var i = 3; i < items.length; i++){
		var block_item = new Object();
		console.log(items[i]);
		console.log($.parseHTML(items[i]));
		var element = $.parseHTML(items[i]);

		console.log("Name="+element[0].innerText);
		block_item.name = element[0].innerText;
		
		console.log("ID=",element[0].id.substring(9,element[0].id.length));
		block_item.id = element[0].id.substring(9,element[0].id.length);

		console.log("Top="+element[0].style.top);
		block_item.y = element[0].top;

		console.log("Left="+element[0].style.left);
		block_item.x = element[0].left

		if (element[0].style.height == ""){
			console.log("Height=200px"); // default value
			block_item.heiht = "200px";
		}else{
			console.log("Height="+element[0].style.height);
			block_item.height = element[0].style.height;
		}

		if (element[0].style.width == ""){
			console.log("Width=200px"); // default value
			block_item.width = "200px";
		}else{
			console.log("Width="+element[0].style.width);
			block_item.width = element[0].style.width;
		}

		if (element[0].style.borderRadius == ""){
			console.log("Radius=5px"); // default value
			block_item.borderRadius = "5px";
		}else{
			console.log("Radius="+element[0].style.borderRadius);
			block_item.borderRadius = element[0].style.borderRadius;
		}
		
		if (element[0].style.backgroundColor == ""){
			console.log("Background Color=red"); // default value
			block_item.backgroundColor = "red";
		}else{
			console.log("Background Color="+element[0].style.backgroundColor);
			block_item.backgroundColor = element[0].style.backgroundColor;
		}

		if (element[0].style.transform == ""){
			console.log("Rotation=rotate(0deg)"); // default value
			block_item.transform = "rotate(0deg)";
		}else{
			console.log("Rotation="+element[0].style.transform);
			block_item.transform = element[0].style.transform;
		}

		if (element[0].firstChild.style.fontSize == ""){
			console.log("Font-size=20px"); // default value
			block_item.fontSize = "20px";
		}else{
			console.log("Font-size="+element[0].firstChild.style.fontSize);
			block_item.fontSize = element[0].firstChild.style.fontSize;
		}

		if (element[0].firstChild.style.color == ""){
			console.log("Font-size=black"); // default value
			block_item.fontColor = "black";
		}else{
			console.log("Font-size="+element[0].firstChild.style.color);
			block_item.fontColor = element[0].firstChild.style.color;
		}

		var block_products = [];
		for(var j = 0; j < product_list.length; j++){
			if(product_list[j].block == block_item.id){
				block_products.push(product_list[j]);
			}
		}
		block_item.products = block_products;
		store_map.blocks.push(block_item);
		// console.log("BLOCK: "+JSON.stringify(block_item));
	}
	console.log("MAP:"+JSON.stringify(store_map));
}

function switch_to_add_product_menu()
{
	$("#add_block_main_div").css("display","none");
	$("#add_product_div").css("display","block");
}

function select_product_location(sw)
{
	if(sw == 0)
	{
		$("#select_location_btn").html("Cancel Select Location");
		$("#select_location_btn").attr("onclick","select_product_location(1);");
		$("#location_tag").css("display","block");
		global_product_location_select = 1;
	}
	else if(sw == 1)
	{
		$("#select_location_btn").html("Select Location");
		$("#select_location_btn").attr("onclick","select_product_location(0);");
		$("#location_tag").css("display","none");
		global_product_location_select = 0;
	}
}

function switch_on_location_tag(event)
{
	location_tag_switch = 1;
	location_tag_x = event.pageX;
	location_tag_y = event.pageY;
}

function switch_off_location_tag()
{
	location_tag_switch = 0;
}

function move_location_tag(event)
{
	if(location_tag_switch == 1 && (location_tag_x > product_market_x_limit_1 && location_tag_x < product_market_x_limit_2) && (location_tag_y > product_market_y_limit_1 && location_tag_y < product_market_y_limit_2) ) 
	{
		x_offset = event.pageX - location_tag_x;
		y_offset = event.pageY - location_tag_y;

			var target_pos_y = parseInt( $("#location_tag").css("top") );
			var target_pos_x = parseInt( $("#location_tag").css("left") );
			
			target_pos_y += y_offset;
			target_pos_x += x_offset;

			$("#location_tag").css("top",target_pos_y+"px");
			$("#location_tag").css("left",target_pos_x+"px");

		location_tag_x = event.pageX;
		location_tag_y = event.pageY;

	}
}

function add_product()
{

	target_block_height = parseInt($("#block_nr_"+location_tag_target_block).css("height"));
	target_block_width = parseInt($("#block_nr_"+location_tag_target_block).css("width"));
	target_block_x_pos = parseInt($("#block_nr_"+location_tag_target_block).css("left"));
	target_block_y_pos = parseInt($("#block_nr_"+location_tag_target_block).css("top"));

	location_tag_x = parseInt($("#location_tag").css("left"));
	location_tag_y = parseInt($("#location_tag").css("top"));
	
	location_tag_x = ( (location_tag_x - target_block_x_pos) / target_block_width );
	location_tag_y = ( (location_tag_y - target_block_y_pos) / target_block_height );

	var product_name = $('#product_name_input').val();
	var product_picture = $('#product_file_input').val();

	// alert(location_tag_x+" "+location_tag_y);

	var product_obj = {block:location_tag_target_block, x:location_tag_x, y:location_tag_y, name:product_name, image:product_picture};
	product_list.push(product_obj);

}

$(document).ready(function(){
	//update_add_block_menu_vals("test",0,0,0,0);
});

function toggle_options_div()
{
	$('#options_div').slideToggle( "slow" );
}