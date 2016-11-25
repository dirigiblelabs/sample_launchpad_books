/*globals controllers */
/*eslint-env browser */

controllers.controller('BooksCtrl', ['$scope', '$http',
	function($scope, $http) {
			
			var url = '../../js/books/books.js';

			$http.get(url)
				.success(function(data){
					$scope.data = data;
				});
			
			$scope.selectedEntry;
            $scope.operation = 'show';
            $scope.errorMessage = null;
			
			$scope.showInfoForEntry = function(entry) {
				if($scope.operation==='show'){
					if($scope.selectedEntry === entry){
						$scope.showEntry = false;
						$scope.selectedEntry = null;
						entry._selected_ = false;
					}else{
						for(var i = 0 ; i < $scope.data.length; i ++){
							$scope.data[i]._selected_ = false;
						}
						entry._selected_ = true;
						$scope.showEntry = true;
						$scope.selectedEntry = entry;
					}
				}
			};
					
			$scope.setOperation = function(operation) {
                      switch (operation) {
                          case 'new':
                              if ($scope.operation !== 'new') {
                            	  $scope.selectedEntry = null;
                                  $scope.operation = 'new';
                              } else {
                                  $scope.operation = 'show';
                              }
                              break;
                          case 'update':
                               if ($scope.operation !== 'update') {
                              	 if ($scope.selectedEntry) {
                                       $scope.operation = 'update';
                                   } else {
                                       alert('Please first select entry for updated');
                                       $scope.operation = 'show';
                                   }
                              } else {
                                  $scope.operation = 'show';
                              }
                              break;
                          case 'delete':
                              if ($scope.operation !== 'delete') {
                                  $scope.operation = 'delete';
                              } else {
                                  $scope.operation = 'show';
                              }
                              break;
                          default:
                              $scope.operation = 'show';
                              break;
                       }
            };
                   
            $scope.confirmAction = function() {
                switch($scope.operation){
                    case 'show':
                        break;
                    case 'new':
                        newEntry($scope.selectedEntry);
                        break;
                    case 'update':
                        updateEntry($scope.selectedEntry);
                        break;
                }
            };

            $scope.cancelAction = function() {
                refreshData();
            };

			$scope.delete = function() {
        	   	if($scope.selectedEntry) {
                 	var confirmed = confirm('Do you realy want to delete the selected entry?');
	               	if(confirmed) {
	                   	delete $scope.selectedEntry._selected_;
	                       deleteEntry($scope.selectedEntry);
	                       $scope.operation = 'show';
	               	}                    	
               	} else {
                   	alert('Please select row from the table.');
				}
			};
                    
			function newEntry(entry){
				delete $scope.selectedEntry._selected_;
				$http.post(url, entry)
				.success(function(){
					refreshData();
					$scope.selectedEntry = null;
                    $scope.operation = 'show';
                    $scope.errorMessage = null;
				})
				.error(function(response){
					$scope.errorMessage = response.err.message;
				});
			}
			
			function updateEntry(entry){
				delete $scope.selectedEntry._selected_;
				$http.put(url, entry)
					.success(function(){
						refreshData();
	                    $scope.operation = 'show';
	                    $scope.errorMessage = null;
					})
					.error(function(response){
						$scope.errorMessage = response.err.message;
					});
			}

			function deleteEntry(entry){
				var primaryKey;
				primaryKey = 'bookid';
				var deleteUrl = url + '?' + primaryKey + '=' + entry[primaryKey];
				$http.delete(deleteUrl)
				.success(function(){
					refreshData();
                    $scope.selectedEntry = null;
					$scope.errorMessage = null;
				})
				.error(function(response){
					$scope.errorMessage = response.err.message;
				});
			}
                    
			function refreshData(){
				$http.get(url)
				.success(function(data){
					$scope.data = data;
                    $scope.selectedEntry = null;
                    $scope.operation = 'show';
                    $scope.errorMessage = null;
				})
				.error(function(response){
					$scope.errorMessage = response.err.message;
				});
			}
			
			$scope.dateOptions = {
				startingDay: 1
			};
			$scope.formats = ['yyyy/MM/dd', 'dd-MMMM-yyyy', 'dd.MM.yyyy', 'shortDate'];
  			$scope.format = $scope.formats[0];

			$scope.bookpublicationdateOpen = function($event) {
				$scope.bookpublicationdateStatus.opened = true;
			};
			$scope.bookpublicationdateStatus = {
				opened: false
			};
			
			
			//pagination
			$scope.viewby = 100;
			var urlCount = url + '?count';
			$http.get(urlCount)
				.success(function(count){
					$scope.totalItems = count;
				});
				
				$scope.currentPage = 1;
				$scope.itemsPerPage = $scope.viewby;
				$scope.maxSize = 5;
			
			$scope.setPage = function (pageNo) {
			    $scope.currentPage = pageNo;
			    $scope.pageChanged();
			};
			
			$scope.pageChanged = function() {
				var urlLimit = url + '?offset=' + ($scope.viewby*($scope.currentPage-1) + '&limit=' + $scope.viewby);
				$http.get(urlLimit)
					.success(function(data){
						$scope.data = data;
					});
			};
			
			$scope.setItemsPerPage = function(num) {
			  	$scope.itemsPerPage = num;
			  	$scope.setPage(1);
			};
		}]);
