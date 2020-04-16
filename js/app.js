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
    
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
    }
    
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }; 
        },
        
        addListItem: function(obj, type){
            var html, newHTML, ele;
            
            if(type === 'inc'){
                ele = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div        class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
            } else if(type === 'exp'){
                ele = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.desc);
            newHTML = newHTML.replace('%value%', obj.val);
            
            document.querySelector(ele).insertAdjacentHTML('beforeend', newHTML);
            
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
        
    }
    
    var ctrlAddItem = () => {
        var input, newItem;
        
        input = uiCtrl.getInput();
        
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        uiCtrl.addListItem(newItem, input.type);
    };
    
    return{
        init: function(){
            setupListeners();
        }
    };
    
   

})(budgetController, UIController);

appController.init();









