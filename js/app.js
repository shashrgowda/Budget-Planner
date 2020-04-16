var budgetController = (function(){
    
    var Expense = function(id, desc, val){
        this.id = id;
        this.desc = desc;
        this.val = val;
    };
    
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
        container: '.container'
    }
    
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div        class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
            } else if(type === 'exp'){
                ele = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.desc);
            newHTML = newHTML.replace('%value%', obj.val);
            
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
          
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            
            if(obj.totalPerc > 0){
                document.querySelector(DOMstrings.expPercLabel).textContent = obj.totalPerc + '%';
            } else {
                document.querySelector(DOMstrings.expPercLabel).textContent = '----';

            }
            
            
        },
        
        getDOMstrings: function(){
            return DOMstrings;
        }
    }
    
})();



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
    };
    
    
    var updateBudget = function(){
        
        budgetCtrl.calculateBudget();
        
        var budget = budgetCtrl.getBudget();
        
        uiCtrl.displayBudget(budget);
        
        
    };
    
    
    
    
    var ctrlAddItem = () => {
        var input, newItem;
        
        input = uiCtrl.getInput();
        
            if(input.description !== "" && !isNaN(input.value) && input.value > 0){

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            uiCtrl.addListItem(newItem, input.type);

            uiCtrl.clearFields();

            updateBudget();
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
            uiCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                totalPerc: ""
            });
            setupListeners();
        }
    };
    
   

})(budgetController, UIController);

appController.init();









