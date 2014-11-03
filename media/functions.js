	function getTabs(orgId){
		//http://simon.ist.rit.edu:8080/Services/resources/ESD/Application/Tabs?orgId=1002
		$.ajax({
			type:'get',
			url:'media/proxy.php',
			dataType:'xml', 
			data:{path:'/Application/Tabs?orgId='+orgId},
			success: function(data){
                //making a outter box 
                var box = '<div id="dialogBox">';
                
                //if there are errors do not do anything 
                if($(data).find('error').length!=0){
                    
                    
                }else{
                   
                    //this will be that div that has that main tabs(following the pattern from jQuery UI)
                    var tabs= '<div id="tabs" class="ui-tabs"><ul class="ui-tabs-nav">';
                    
                    var innerDiv = '';
                    // get the information for that tabs 
                    $('Tab',data).each(function(){
						//build the links/tabs
						tabs+='<li><a href="#'+$(this).text()+'" onclick="window[\'get'+$(this).text()+'\']('+orgId+')">'+$(this).text()+'</a></li>';
						//build the divs by calling the tab's getInfo functions
						innerDiv+='<div id="'+$(this).text()+'"></div>';//put an image of a spinner and set the display to none then it is on when you do the click 
					});
                    
                    box +=tabs + '</ul>' + innerDiv + '</div></div>';
                    $('body').append(box);
                    $("#dialogBox").dialog({width:870,
                                            height:710,
                                            modal:true,
                                            close:function(){$(this).dialog("destroy");$('#dialogBox').remove();}} );
                    $('#tabs').tabs();
                    getGeneral(orgId);
                }//end of else 
                
			},
			error:err
		});
	}//end of getTabs

	
	function err(event){
		console.log(event);
	}
	
		
	function getGeneral(orgId){
        $('#General').activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#7ECE31', speed: 1.5});
		$.ajax({
			type:'get',
			url:'media/proxy.php',
			dataType:'xml', 
			data:{path:'/'+orgId+'/General'},
			success: function(data){
                $('#General').activity(false);
				var gen;
                //gen+='<h2>General Information</h2>';
                gen+='<tr><td>Name:</td><td>'+nullFind($(data).find('name').text())+'</td></tr>';
				gen+='<tr><td>Description</td><td>'+nullFind($(data).find('description').text())+'</td></tr>';
				gen+='<tr><td>Email:</td><td>'+nullFind($(data).find('email').text())+'</td></tr>';
				gen+='<tr><td>Website:</td><td>'+nullFind($(data).find('website').text())+'</td></tr>';
				gen+='<tr><td>Number of Members:</td><td>'+nullFind($(data).find('nummembers').text())+'</td></tr>';
				gen+='<tr><td>Number of Calls:</td><td>'+nullFind($(data).find('numcalls').text())+'</td></tr>';
				$('#General').html('<h2>General Information</h2>');
                $('#General').append(gen);
			},
			error:err
		});
	}
//------------------------------------------------------------------------------------------------------	
	
function getLocations(id){
	$('#Locations').activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#7ECE31', speed: 1.5});
	$.ajax({
		type:'get',
		url:'media/proxy.php',
		dataType:'xml',
		data:{path:'/'+id+'/Locations'},
		success: function(data){
            $('#Locations').activity(false);
			var locInform;
            var map;
            parseFloat
			if(parseInt($(data).find('count').text())>0){
				locInform+='<div id="locationAccordion">';
				$('location',data).each(function(){
					locInform += '<h3>'+'Type: '+ $(this).find('type').text()+'</h3>';
					locInform += '<div><div id="map_'+nullFind($(this).find('siteId').text())+'" style="float:left;"></div><table>';
					locInform += '<tr><td>Type:</td><td>'+nullFind($(this).find('type').text())+'</td></tr>';
					locInform += '<tr><td>Addres 1:</td><td>'+nullFind($(this).find('address1').text())+'</td></tr>';
					locInform += '<tr><td>Address 2:</td><td>'+nullFind($(this).find('address2').text())+'</td></tr>';
					locInform += '<tr><td>City:</td><td>'+nullFind($(this).find('city').text())+'</td></tr>';
					locInform += '<tr><td>State:</td><td>'+nullFind($(this).find('state').text())+'</td></tr>';
					locInform += '<tr><td>Zip Code:</td><td>'+nullFind($(this).find('zip').text())+'</td></tr>';
                    locInform += '<tr><td>County:</td><td>'+nullFind($(this).find('countyName').text())+'</td></tr>';
					locInform += '<tr><td>Phone:</td><td>'+nullFind($(this).find('phone').text())+'</td></tr>';
					locInform += '<tr><td>TTY:</td><td>'+nullFind($(this).find('tty').text())+'</td></tr>';
					locInform += '<tr><td>Fax:</td><td>'+nullFind($(this).find('fax').text())+'</td></tr>';
                    locInform += '<tr><td>Latitude:</td><td>'+nullFind($(this).find('latitude').text())+'</td></tr>';
                    locInform += '<tr><td>Longitude:</td><td>'+nullFind($(this).find('longitude').text())+'</td></tr>';
					locInform += '</table></div>';
				});

                $('#Locations').html('<h2>Locations</h2>');
				$('#Locations').append(locInform);
				$('#locationAccordion').accordion();
                
                $('location',data).each(function(){
                    var lat= parseFloat($(this).find('latitude').text());
                    var long = parseFloat($(this).find('longitude').text());
                   console.log(lat);
                   console.log(long);
                    var address = $(this).find('address1').text()+', '+$(this).find('city').text()+', '+$(this).find('state').text()+' '+parseInt($(this).find('zip').text()); 
                    if(!isNaN(lat)||!isNaN(long)){
                        console.log(address);
                        $('#map_'+nullFind($(this).find('siteId').text())).show().width('300px').height('250px').css('border','1px solid #000').gmap3({
                            map:{
                                options:{
                                    center:[lat,long],
                                    zoom:12,
                                    maxZoom:20
                                }//end options
                            },//end map
                            marker:{
                                latLng: [lat,long]
                            }//end marker
                        });//end $(#map)
                    }//end if
                    else{
                        console.log(address);
                        $('#map_'+nullFind($(this).find('siteId').text())).show().width('300px').height('250px').css('border','1px solid #000').gmap3({
                          marker:{
                          	address:address
                          },//end marker
                          map:{
                              options:{
                                    zoom:12,
                                    maxZoom:20
                              }//end options
                          },//end map
                        });//end #map
                    }//end else
                                                                                                                                                      
                                                                                                                                 
                    });
                
            }
			else{
				var locInform='There is no loaction information for this organization.';
				$('#Locations').html(locInform);
			}//end else
        },
        error:err
	});//end of ajax
}
    
    

//----------------------------------------------------------------------------------------------    
    function getTreatment(id){
        $('#Treatment').activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#7ECE31', speed: 1.5});
       $.ajax({
			type:'get',
			url:'media/proxy.php',
			dataType:'xml', 
			data:{path:'/'+id+'/Treatments'},
            success:function(data){
                $('#Treatment').activity(false);
				//checking for data
				if($(data).find('count').text() != 0){
					//making the table 
					var treat = '<table id="treatmentInfo"><thead><tr><th>Type</th><th>Abbreviation</th></tr></thead><tbody>';
					//getting the information from the xml and putting it into the table 
					$('treatment',data).each(function(){
						treat+='<tr><td>'+nullFind($(this).find('type').text())+'</td><td>'+nullFind($(this).find('abbreviation').text())+'</td></tr>';
					});
					treat+='</tbody></table>';
				}
				//if there arent treatments, display a message
				else{
					var treat = 'There is no treatment infomation for this organization.';
				}
				
				//add the header and the table/msg to the page
				$('#Treatment').html('<h2>Treatment</h2>');
				$('#Treatment').append(treat);
                $('#treatmentInfo').DataTable();
                
			},
			error:err
		});
    }
//-------------------------------------------------------------------------------------------------------------    
    function getTraining(id){
        $('#Training').activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#7ECE31', speed: 1.5});
        $.ajax({
            type:'get',
            url:'media/proxy.php',
            dataType:'xml',
            data:{path:'/'+id+'/Training'},
            success:function(data){
                $('#Training').activity(false);
                if($(data).find('count').text() != 0){
                    var train = '<table id="trainingInfo"><thead><tr><th>Type</th><th>Abbreviation</th></tr></thead><tbody>';
                    $('training',data).each(function(){
                        train+='<tr><td>'+nullFind($(this).find('type').text())+'</td><td>'+nullFind($(this).find('abbreviation').text())+'</td></tr>';
                    });
                    train+='</tbody></table>';
                }
                else{
                    var train = 'There is no training information for this organization.';
                }
                $('#Training').html('<h2>Training</h2>');
                $('#Training').append(train);
                $('#trainingInfo').DataTable();
                
            },
            error:err  
        
        });
        
    }
//-------------------------------------------------------------------------------------------------------------	
	function getFacilities(id){
        $('#Facilities').activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#7ECE31', speed: 1.5});
        $.ajax({
            type:'get',
            url:'media/proxy.php',
            dataType:'xml',
            data:{path:'/'+id+'/Facilities'},
            success:function(data){
                $('#Facilities').activity(false);
                if($(data).find('count').text() !=0){
                    var asset = '<table id="assestTable"><thead><tr><th>Name</th><th>Quantity</th><th>Description</th></tr></thead><tbody>';
                    $('facility',data).each(function(){
                        asset +='<tr><td>'+nullFind($(this).find('type').text())+'</td><td>'+nullFind($(this).find('quantity').text())+'</td><td>'+nullFind($(this).find('description').text())+'</td></tr>';
                    });
                    asset+='</tbody></table>';
                }//end if
                else{
                    var asset = 'There is no facilities information for this organization.';
                }//end else
                $('#Facilities').html('<h2>Facilities Information</h2>');
                $('#Facilities').append(asset);
                $('#assestTable').DataTable();
                
            },//end of success
            error:err
        });//en of ajax
	}//end getFacilities
//--------------------------------------------------------------------------------------------------------------        
    function getPhysicians(id){
        $('#Physicians').activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#7ECE31', speed: 1.5});
        $.ajax({
            type:'get',
            url:'media/proxy.php',
            dataType:'xml',
            data:{path:'/'+id+'/Physicians'},
            success:function(data){
                $('#Physicians').activity(false);
                if($(data).find('count').text() !=0){
                    var doc = '<table id="physicianTable"><thead><tr><th>Name</th><th>License</th><th>Contact</th></tr></thead><tbody>';
                    $('physician',data).each(function(){
                        doc +='<tr><td>'+nullFind($(this).find('fName').text())+' '+nullFind($(this).find('mName').text())+' '+nullFind($(this).find('lName').text())+'</td><td>'+nullFind($(this).find('license').text())+'</td><td>'+nullFind($(this).find('phone').text())+'</td></tr>';
                    });
                    doc+='</tbody></table>';
                }else{
                    var doc = 'There is no physcian information for this organization.';
                }
                $('#Physicians').html('<h2>Physician Information</h2>');
                $('#Physicians').append(doc);
                $('#physicianTable').DataTable();
                
                
            },
            error:err
        });//en of ajax
    }//end of getPhysicians 
    
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	function getPeople(id){
        $('#People').activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#7ECE31', speed: 1.5});
		$.ajax({
			type:'get',
            url:'media/proxy.php',
            dataType:'xml',
			data:{path:'/'+id+'/People'},
			success:function(data){
                $('#People').activity(false);
				//if there are sites, build the select option
				if($(data).find('siteCount').text() != 0){
					var area='<select id="peopleArea" onchange="window[\'getThePeople\']($(this).val(),'+id+');">';
					$('site',data).each(function(){
						area+='<option value="'+$(this).attr('siteId')+'">'+$(this).attr('address')+'</option>';
					});
					$('#People').html('<h2>People</h2>');
					$('#People').append(area +'</select>');
					//send off info to grab the people
					getThePeople($('#peopleArea').val(), id);
				}else{
					var area = 'There is no information for this area. Please make another selection.';
					$('#People').html('<h2>People</h2>');
					$('#People').append(area +'</select>');
				}
			},
            error:err
		});
	}
	
	
	function getThePeople(site, id){
		$.ajax({
			type:'get',
			url:'media/proxy.php',
			data:{path:'/'+id+'/People'},
			success:function(data){
				//remove the child table and add it back
				$('#peopleData').remove();                                    
				$('#People').append('<div id="peopleData"></div>');
                
				var pep;
				
				//for each site
				$('site',data).each(function(){
					//check to see it it is the correct siteId
					if($(this).attr('siteId') == site){
						//if the count is greater than 0 build the table
						if($(this).find('personCount').text()!=0){
							pep = '<table id="personTable"><thead><tr><th>Name</th><th>Role</th></tr></thead><tbody>';
							$('person', this).each(function(){
								pep += '<tr><td>'+nullFind($(this).find('honorific').text())+' '+nullFind($(this).find('fName').text())+' '+nullFind($(this).find('mName').text())+' '+nullFind($(this).find('lName').text())+'</td><td>'+nullFind($(this).find('role').text())+'</td></tr>';	
							});
							//end table
							pep+='</tbody></table>';
						}
						//if there are no people, display a message
						else{
							pep = 'There is currently no information about people related to this site in this organization.';
						}
					}
				});
				//add the message/table
                $('#peopleData').html('<h3>'+$('#peopleArea option:selected').text()+'</h3>')
				$('#peopleData').append(pep);
				$('#personTable').DataTable();
                				
			},
            error:err
		});
	}    
//-------------------------------------------------------------------------------------------------------------    
    function getEquipment(id){
        $('#Equipment').activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#7ECE31', speed: 1.5});
         $.ajax({
            type:'get',
            url:'media/proxy.php',
            dataType:'xml',
            data:{path:'/'+id+'/Equipment'},
            success:function(data){
                $('#Equipment').activity(false);
                if($(data).find('count').text() !=0){
                    var equip = '<table id="equipmentTable"><thead><tr><th>Name</th><th>Quantity</th><th>Description</th></tr></thead><tbody>';
                    $('equipment',data).each(function(){
                        equip +='<tr><td>'+$(this).find('type').text()+'</td><td>'+$(this).find('quantity').text()+'</td><td>'+$(this).find('description').text()+'</td></tr>';
                    });
                    equip+='</tbody></table>';
                }//end if
                else{
                    var equip = 'There is no equipment information for this organization.';
                }//end else
                $('#Equipment').html('<h2>Equipment Information</h2>');
                $('#Equipment').append(equip);
                $('#equipmentTable').DataTable();
                
            },//end of success
            error:err
        });//en of ajax
        //alert('get equip'+id);
    }//end getEquipment
    
    


///-------------------------------------------------

//onload go get the orgTypes and the cities...
$(document).ready(function(){
	getCities( $('#state').val() );
	getOrgTypes();
});


function getOrgTypes(){
	//hit the server to populate the organizational types.
	$.ajax({
		type:'get',
		async:true,
		cache:false,
		url:'media/proxy.php',
		data:{path:'/OrgTypes'},
		dataType:'xml',
		success:function(data,status){
			var x='<option value="">--Pick an organization type--</option>';
			$('type',data).each(
				function(){
					x+='<option value="'+$(this).text()+'">'+$(this).text()+'</option>';
				}
			);
			//put it on the select
			$('#orgType').html(x);
		},
		error:err
	});
}
	
function getCities(state){
	$.ajax({
		type:'get',
		async:true,
		cache:false,
		url:'media/proxy.php',
		data:{path:'/Cities?state='+state},
		dataType:'xml',
		success:function(data,status){
			//what if there are no cities?
			if($(data).find('row').length==0){
				var x='<span style="color:red">there are no cities here</span>';
			}else{
				var x='<select name="town"><option value="">--Select a city--</option>';
				$('row',data).each(function(){
					x+='<option value="'+$(this).text()+'">'+$(this).text()+'</option>';
				});
				x+='</select>';
			}	
			$('#orgCitySearch').html(x);
		},
		error:err
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function removeBox(){
    $('#tableOutput').html('');
}
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function nullFind(data){
    if(data=='null'){
        data='';
    }    
    return data;
}
   
    
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////    
function checkSearch(){
	//go get the data!
	//console.log($('form:first').serialize());
    $('#tableOutput').activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#7ECE31', speed: 1.5});
	$.ajax({	
		type:'get',
		async:true,
		cache:false,
		url:'media/proxy.php',
		data:{path:'/Organizations?'+$('form:first').serialize()},
		dataType:'xml',
		success:function(data,status){
            $('#tableOutput').activity(false);
			//when we get this back, we will get 2 different data sets
			//	one for physician (your problem) not anymore
            if($('#orgType').val()=='Physician'){
                var x = '<table id="resultTable"><thead><tr><th>Physician</th><th>Type</th><th>Organization Name</th><th>City</th><th>Zip</th><th>County</th><th>Phone</th></tr></thead><tbody>';
                $('row',data).each(function(){
                   x+= '<tr>';
                   x+= '<td>'+$(this).find('fName').text()+' '+$(this).find('mName').text()+' '+$(this).find('lName').text()+'</td>';
                   x+= '<td>'+$(this).find('type').text()+'</td>';
                   x+= '<td><span id="click" style="color:blue;cursor:pointer;" onclick="getTabs(' +$(this).find('OrganizationID').text()+ ')">'+$(this).find('Name').text()+'</span></td>';
                   x+= '<td>'+$(this).find('city').text()+'</td>';
                   x+= '<td>'+$(this).find('zip').text()+'</td>';
                   x+= '<td>'+$(this).find('CountyName').text()+'</td>';
                   x+= '<td>'+$(this).find('phone').text()+'</td>';
                   x+= '</tr>';
                });
                    
            }
            // for everything that is not physician 
            else{
                var x ='<table id="resultTable"><thead><tr><th>Type</th><th>Name</th><th>Email</th><th>City</th><th>State</th><th>Zip</th><th>County</th></tr></thead><tbody>';
				$('row',data).each(function(){
					x+='<tr>';
					x+='<td>'+$(this).find('type').text()+'</td>';
					x+='<td><span id="click" style="color:blue;cursor:pointer;" onclick="getTabs(' +$(this).find('OrganizationID').text()+ ')">'+$(this).find('Name').text()+'</span></td>';
					x+='<td>'+$(this).find('Email').text()+'</td>';
					x+='<td>'+$(this).find('city').text()+'</td>';
					x+='<td>'+$(this).find('State').text()+'</td>';
					x+='<td>'+$(this).find('CountyName').text()+'</td>';
					x+='<td>'+$(this).find('zip').text()+'</td></tr>';
				});
                                                  
            }//end else
            x+='</tbody></table>';
			// make sure there is data 
			if($(data).find('row').length==0){
				//give feedback that there are no orgs for that!
                var noData= '<p>There was no data found for this. Please make another selection</p>';
                $('#tableOutput').html('<h1>Search Results</h1>');
                $('#tableOutput').append(noData);
                
			}else{
                $('#tableOutput').html('<h1>Search Results</h1>');
				$('#tableOutput').append(x);
                $('#resultTable').DataTable();
			}
		},
		error:err
	});
}
