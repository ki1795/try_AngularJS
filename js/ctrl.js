var app = angular.module('tele_plan', []);

app.controller('searchCtrl', function ($scope, $http) {
	var c, i, n, t;
	$scope.query = function () {
		c = companies();
		i = identities();
		n = nets();
		t = teles();
		$http({
			method: "post",
			url: "query.php",
			data: {
				companies : c,
				identities : i,
				nets : n,
				teles : t,
				comments : false
			},
			headers: { 'Content-Type': 'application/json' }
		})
		.success(function (data) {
			if(data){
				$scope.res = data;
                nullToZero();
				$scope.res_y = true;
				$scope.res_s = true;
				//if(sw) $scope.turn();
				
				$scope.res_nd = false;
				$scope.res_f = false;
				
				q_comment();
			} 
			else{
				$scope.res_y = false;
				$scope.res_nd = true;
				$scope.res_f = false;
			}
		})
		.error(function(){
			$scope.res_y = false;
			$scope.res_nd = false;
			$scope.res_f = true;
		});
	};
	function q_comment () {
		$http({
			method: "post",
			url: "query.php",
			data: {
				companies : c,
				identities : i,
				nets : n,
				teles : t,
				comments : true
			},
			headers: { 'Content-Type': 'application/json' }
		})
		.success(function (data) {
			if(data){
				$scope.co_res = data;
			} 
		})
		.error(function(){
		});
	};
	
	$scope.comments = [];
	$scope.viewComm =function (id){
		var j, flag=0;		
		for( j = 0; j < $scope.comments.length; j++ ){
			if( id == $scope.comments[j].pid ){
				flag = 1;
				//delete $scope.comments[j];
				//$scope.comments[j].view = false;
			}
		}
		if( flag==0 ) $scope.comments.push( { 'pid' : id, 'view' : true, 'coName' : 'anonymous', 'coComment' : '', 'coStar' : 'null' } );
		flag = 0;
	};
	$scope.comment = function (id){
		var i, pid, name, comment, star;
		for( i = 0; i < $scope.comments.length; i++){
			if( id == $scope.comments[i].pid ){
				pid = $scope.comments[i].pid;
				name = $scope.comments[i].coName;
				comment = $scope.comments[i].coComment;
                star = $scope.comments[i].coStar;
			}
		}
		$http({
			method: "post",
			url: "comm.php",
			data: {
				pid : pid,
				name : name,
                star : star,
				comment : comment
			},
			headers: { 'Content-Type': 'application/json' }
		})
		.success(function () {
			$scope.comments.length = 0;
			//q_comment();
            $scope.query();
		})
		.error(function(){
		});
		
	};
	
    $scope.viewColumn = [
        { 'viewTitle' : true , 'attr' : '電信公司' }, //0
        { 'viewTitle' : true , 'attr' : '方案名稱' }, 
        { 'viewTitle' : true , 'attr' : '頻段' },
        { 'viewTitle' : true , 'attr' : '月租費' },
        { 'viewTitle' : true , 'attr' : '申辦身份' }, //4
        { 'viewTitle' : true , 'attr' : '網路流量' }, 
        { 'viewTitle' : true , 'attr' : '網內通話量' },
        { 'viewTitle' : false , 'attr' : '通話價格' },
        { 'viewTitle' : false , 'attr' : '簡訊' }, 
        { 'viewTitle' : true , 'attr' : '評分' }, //9
        { 'viewTitle' : true , 'attr' : '備註' }, 
        { 'viewTitle' : true , 'attr' : '評論' }
        
    ];
    $scope.orderCase = [
        { 'name' : '電信公司' , 'choosed' : true , item : 'PID' , primer : 'parseInt' },
        { 'name' : '方案名稱' , 'choosed' : false , item : 'Pname' , primer : 'String' },
        { 'name' : '月租費' , 'choosed' : false , item : 'fare' , primer : 'parseInt' },
        { 'name' : '網路流量' , 'choosed' : false , item : 'netCredits' , primer : 'parseFloat' },
        { 'name' : '網內通話量' , 'choosed' : false , item : 'inCredits' , primer : 'parseInt' },
        { 'name' : '網內通話價格' , 'choosed' : false , item : 'inRate' , primer : 'parseInt' },
        { 'name' : '簡訊量' , 'choosed' : false , item : 'inMsgCredits' , primer : 'parseInt' },
        { 'name' : '評分' , 'choosed' : false , item : 'Star' , primer : 'parseFloat' }
    ];
	
	$scope.selectedList = [];
	$scope.selected = function(id){
		var i, j, flag=0;
		for( i = 0; i < $scope.res.length ; i++){
			if( id == $scope.res[i].PID ){
				for( j = 0; j < $scope.selectedList.length; j++ ){
					if( id == $scope.selectedList[j].PID ) flag = 1;
				}
				if( flag==0 ) $scope.selectedList.push( $scope.res[i] );
				flag = 0;
			}
		}
		
/*		var i, j;
		for( i = 0; i < $scope.res.length ; i++){
			if( id == $scope.res[i].PID ){
				for( j = 0; j < $scope.selectedList.length; j++ ){
					if( id == $scope.selectedList[j].PID ){
						$scope.selectedList.remove( $scope.res[i] ) ;
						alert("delete");
					}
					else{
						$scope.selectedList.push( $scope.res[i] );
						alert("new");
					}
				}
			}
		}*/
		
	};
	$scope.turn = function(){
		$scope.res_s = !$scope.res_s ;
	};
    
    $scope.orderItem = 'PID';
    $scope.ordering = function(it, pri){
        var j;
        if( pri == 'String' ){
            if( it == $scope.orderItem ){
                $scope.orderItem = '-'+it ;
                $scope.res.sort(sortBy(it, true, String));
                $scope.selectedList.sort(sortBy(it, true, String));
            }
            else{
                $scope.orderItem = it ;
                for( j = 0; j < $scope.orderCase.length; j++){
                    if( it == $scope.orderCase[j].item ) $scope.orderCase[j].choosed = true;
                    else $scope.orderCase[j].choosed = false;
                }
                $scope.res.sort(sortBy(it, false, String));
                $scope.selectedList.sort(sortBy(it, false, String));
            }
        }
        else{
            if( it == $scope.orderItem ){
                $scope.orderItem = '-'+it ;
                $scope.res.sort(sortBy(it, true, parseFloat));
                $scope.selectedList.sort(sortBy(it, true, parseFloat));
            }
            else{
                $scope.orderItem = it ;
                for( j = 0; j < $scope.orderCase.length; j++){
                    if( it == $scope.orderCase[j].item ) $scope.orderCase[j].choosed = true;
                    else $scope.orderCase[j].choosed = false;
                }
                $scope.res.sort(sortBy(it, false, parseFloat));
                $scope.selectedList.sort(sortBy(it, false, parseFloat));
            }
        }
    };
	
	function companies(){
		var c1 = document.getElementById('c1').checked;
		var c2 = document.getElementById('c2').checked;
		var c3 = document.getElementById('c3').checked;
		var c4 = document.getElementById('c4').checked;
		var c5 = document.getElementById('c5').checked;
		var cChecked = c1 || c2 || c3 || c4 || c5 ;
		var cStr = " (";
		if( cChecked ){
			if( c1 ) cStr = cStr + " Cname = 'CHT' OR ";
			if( c2 ) cStr = cStr + " Cname = 'FET' OR ";
			if( c3 ) cStr = cStr + " Cname = 'TWM' OR ";
			if( c4 ) cStr = cStr + " Cname = 'Gt' OR ";
			if( c5 ) cStr = cStr + " Cname = 'TS' OR ";
			cStr = cStr + " null ) ";
		}
		else cStr = false ;
		
		return cStr ;
	};
	function identities(){
		var i1 = document.getElementById('i1').checked;
		var i2 = document.getElementById('i2').checked;
		var i3 = document.getElementById('i3').checked;
		var i4 = document.getElementById('i4').checked;
		var iChecked = i1 || i2 || i3 || i4 ;
		var iStr = " (";
		if( iChecked ){
			if( i1 ) iStr = iStr + " identity = '一般' OR ";
			if( i2 ) iStr = iStr + " identity = '學生' OR ";
			if( i3 ) iStr = iStr + " identity = '續約' OR ";
			if( i4 ) iStr = iStr + " identity = '攜碼' OR ";
			iStr = iStr + " null ) ";
		}
		else iStr = false ;
		
		return iStr ;
	};
	function nets(){
		var n1 = document.getElementById('n1').checked;
		var nChecked = n1 ;
		var nStr = " (";
		if( nChecked ){
			if( n1 ) nStr = nStr + " netNoLimit = '1' OR ";
			nStr = nStr + " null ) ";
		}
		else nStr = false ;
		
		return nStr ;
	};
	function teles(){
		var te1 = document.getElementById('te1').checked;
		var teChecked = te1 ;
		var teStr = " (";
		if( teChecked ){
			if( te1 ) teStr = teStr + " inNoLimit = '1' OR ";
			teStr = teStr + " null ) ";
		}
		else teStr = false ;
		
		return teStr ;
	};
    
    var sortBy = function (filed, rev, primer) {
        rev = (rev) ? -1 : 1;
        return function (a, b) {
            a = a[filed];
            b = b[filed];
            if (typeof (primer) != 'undefined') {
                a = primer(a);
                b = primer(b);
            }
            if (a < b) { return rev * -1; }
            if (a > b) { return rev * 1; }
            return 1;
        }
    };
    var nullToZero = function () {
        var i;
        for( i = 0; i < $scope.res.length; i++ ){
            if( $scope.res[i].Star == null ) $scope.res[i].Star = 0;
        }
    };
});



