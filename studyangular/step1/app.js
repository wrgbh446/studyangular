function now() {
	var d = new Date();
	return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + '';
}

var Memo = function(config) {
	Memo.prototype.initialize.call(this, config);
};

Memo.prototype = {
	initialize: function(config) {
		angular.extend(this, config, { date: now(), memo: '', tags: '' });
	},

	tags_toarray: function() {
		if(!this.tags)
			return [];

		var split = this.tags.trim();
		if(split === '')
			return [];
		split = split.split(',');
		
		var tags = [];
		angular.forEach(split, function(elem) {
			tags.push(elem.trim());
		});
		
		return tags;
	}
};

var SearchCondition = function() {
	
};

SearchCondition.prototype = {
	keyword: '',
	tags: [],
	
	mergeTags: function(tag_array) {
		var self = this, keepgoing = true;
		angular.forEach(tag_array, function(newtag) {
			keepgoing = true;
			
			angular.forEach(self.tags, function(tag) {
				if(keepgoing && tag.tag === newtag)
					keepgoing = false;
			});
			
			if(keepgoing)
				self.tags.push({ tag: newtag, selected: false});
		});
	},
	
	filter: function(memos) {
		var self = this, filtered = memos.slice(0);
		
		if(this.keyword) {
			angular.forEach(memos, function(memo) {
				if(memo.memo.indexOf(self.keyword) === -1)
					delete filtered[filtered.indexOf(memo)];
			});
		}
		
		var tags = [], keepgoing = true;
		angular.forEach(self.tags, function(tag) {
			if(tag.selected)
				tags.push(tag.tag);
		});
		if(tags.length > 0) {
			angular.forEach(filtered, function(memo) {
				if(memo) {
					keepgoing = true;
					
					angular.forEach(memo.tags_toarray(), function(tag_of_memo) {
						if(keepgoing && tags.indexOf(tag_of_memo) > -1)
							keepgoing = false;
					});
					
					if(keepgoing)
						delete filtered[filtered.indexOf(memo)];
				}
			});
		}

		var result = [];
		angular.forEach(filtered, function(memo) {
			if(memo)
				result.push(memo);
		});
		
		return result;
	}
};

function MemosController($scope) {

  $scope.memos_all = [];
  $scope.memos_display = [];
  $scope.condition = new SearchCondition();
  $scope.newmemo = new Memo();

  $scope.addNew = function() {
	  $scope.memos_all.push($scope.newmemo);
	  
	  $scope.condition.mergeTags($scope.newmemo.tags_toarray());
	  $scope.memos_display = $scope.condition.filter($scope.memos_all);
	  
	  $scope.newmemo = new Memo();
  }

  $scope.changeCondition = function() {
	  $scope.memos_display = $scope.condition.filter($scope.memos_all);
  }
}

