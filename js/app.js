//Budget Controller
var budgetController = (function(){
    
    var Expense = function(id, desc, val){
        this.id = id;
        this.desc = desc;
        this.val = val;
        this.perc = -1;
    };
    
    Expense.prototype.calcPerc = function(totalIncome){
        if(totalIncome > 0){
            this.perc = Math.round((this.val / totalIncome) * 100);
        } else {
            this.perc =1;
        }
    };
    
    Expense.prototype.getPerc = function(){
        return this.perc;
    }
    
    var Income = function(id, desc, val){
        this.id = id;
        this.desc = desc;
        this.val = val;
    };
    
    
    var calulcateTotal = function(type){
        var sum = 0;
        
        data.allItems[type].forEach(function(curr){
            sum += curr.val ;
        });
        data.totals[type] = sum;
    };
    
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    
    return {
        addItem: function(type, des, value){
            var newEntry, id;
            
            if(data.allItems[type].length > 0){
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            
            if(type === 'exp'){
                newEntry = new Expense(id, des, value);    
            } else if (type === 'inc'){
                newEntry = new Income(id, des, value);
            }
            
            data.allItems[type].push(newEntry);
            
            return newEntry;
        },
        
        
        deleteItem: function(type, id){
            
            var ids, index;
        
            ids = data.allItems[type].map(function(curr){
                return curr.id;
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1){
                
                data.allItems[type].splice(index, 1);
                
            }
            
            
        },
        
        calculateBudget: function(){
            
            calulcateTotal('exp');
            calulcateTotal('inc');
            
            data.budget = data.totals.inc - data.totals.exp;
            
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            
        
        },
        
        
        calculatePercentage: function(){
            
            data.allItems.exp.forEach(function(curr){
               
                curr.calcPerc(data.totals.inc);
                
            });
            
        },
        
        getPercentages: function(){
          
            var allPerc = data.allItems.exp.map(function(curr){
                return curr.getPerc();
            });
            return allPerc;
        },
        
        getBudget: function(){
          
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                totalPerc: data.percentage
            };
            
            
        },
        
        testing: function(){
            console.log(data);
        }
    };
   
})();


















//UI controller
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        expPercLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePerc: '.item__percentage',
        budgetMonth: '.budget__title--month'
    };
    
    var formatNumber = function(num, type){
            var numSplit, integer, decimal;
        
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            integer = numSplit[0];
            
            
            if(integer.length > 3){
                integer = integer.substr(0, integer.length - 3) + ',' + integer.substr(integer.length - 3, integer.length);
            }
            
             decimal = numSplit[1];
            
            
            
            return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + integer + '.' + decimal;
            
        
        };
    
    
     var nodeListForEach = function(list, cb){
              
                for(var i = 0; i < list.length; i++){
                    cb(list[i], i);
                }
                
            };
    
    
    
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }; 
        },
        
        addListItem: function(obj, type){
            var html, newHTML, ele;
            
            if(type === 'inc'){
                ele = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div        class="item__value"> %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
            } else if(type === 'exp'){
                ele = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.desc);
            newHTML = newHTML.replace('%value%', formatNumber(obj.val, type));
            
            document.querySelector(ele).insertAdjacentHTML('beforeend', newHTML);
            
        },
        
        deleteListItem: function(selectedId){
            
            var ele = document.getElementById(selectedId);
          
            ele.parentNode.removeChild(ele);
            
            
        },
        
        clearFields: function(){
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach((curr, i, arr) => {
                curr.value = "";
                
            });
            
            fieldsArr[0].focus();
            
        },
        
        
        displayBudget: function(obj){
            var type;
            
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
          
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            
            if(obj.totalPerc > 0){
                document.querySelector(DOMstrings.expPercLabel).textContent = obj.totalPerc + '%';
            } else {
                document.querySelector(DOMstrings.expPercLabel).textContent = '----';

            }
            
            
        },
        
        displayPercs: function(percentages){
            var fields;
          
            fields = document.querySelectorAll(DOMstrings.expensePerc);
            
            
            nodeListForEach(fields, function(curr, i){
                
                if(percentages[i] > 0){
               
                curr.textContent = percentages[i] + '%';
                } else {
                    curr.textContent = '----';
                }
                
            });
            
        },
        
        
        displayMonth: function(){
            var now, year, month, months;
          
             now = new Date();
            
            
             months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
             month = now.getMonth();
            
             year = now.getFullYear(); 
            
            document.querySelector(DOMstrings.budgetMonth).textContent = months[month] + ' ' + year;
        },
        
        changedType: function(){
            
            var fields;
            
            fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            
            nodeListForEach(fields, function(curr){
                curr.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
            
        },
        
        
        getDOMstrings: function(){
            return DOMstrings;
        }
    }
    
})();


















//Global App Controller
var appController = (function(budgetCtrl, uiCtrl) {
    
    var setupListeners = () => {
        var DOM = uiCtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', (e) => {

            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
            }

        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType)
    };
    
    
    var updateBudget = function(){
        
        budgetCtrl.calculateBudget();
        
        var budget = budgetCtrl.getBudget();
        
        uiCtrl.displayBudget(budget);
        
        
    };
    
    
    var updatePercentages = function(){
        var perc;
      
        budgetCtrl.calculatePercentage();
        
        perc = budgetCtrl.getPercentages();
        
        uiCtrl.displayPercs(perc);
    };
    
    
    
    
    var ctrlAddItem = () => {
        var input, newItem;
        
        input = uiCtrl.getInput();
        
            if(input.description !== "" && !isNaN(input.value) && input.value > 0){

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            uiCtrl.addListItem(newItem, input.type);

            uiCtrl.clearFields();

            updateBudget();
                
            updatePercentages();
        }
    };
    
    
    var ctrlDeleteItem = (e) => {
        var itemId, splitId, type, id;
      
        itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemId){
            
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);
            
            budgetCtrl.deleteItem(type, id);
            
            uiCtrl.deleteListItem(itemId);
            
            updateBudget();
            
        }
        
        
    };
    
    return{
        init: function(){
            uiCtrl.displayMonth();
            uiCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                totalPerc: -1
            });
            setupListeners();
        }
    };
    
   

})(budgetController, UIController);

appController.init();









